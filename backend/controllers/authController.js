import bcrypt from "bcrypt"
import crypto from "crypto"
import pool from "../database.js"
import { AppError } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const COOKIE_OPTIONS = {
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60* 60* 1000 // 7 days in ms
};

// signup
export const signup = async (req , res, next) => {
    const {name, email, password, confirm_password} = req.body; 

    if (!name || !email || !password || !confirm_password)
        throw new AppError("Please provide complete details for signup.", 400);

    if(password !== confirm_password)
        throw new AppError("Password and password confirm are not the same.", 400);

    try {

        const passwordHash = await bcrypt.hash(password, 12);
        
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, company_role, company_id;',
            [name, email, passwordHash]
        );

        const user = result.rows[0];
        const token = generateToken({id: user.id});

        req.user = user;

        res.cookie("pos-login-token", token, COOKIE_OPTIONS);
        res.status(201).json({
            success: true,
            message: "Account Created Successfully!",
            data: user
        });
    } 

    catch(err) {
        next(err);
    }

};


// Login
export const login = async(req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password)
        throw new AppError("Please provide email and password.", 400);

    try {
        const result = await pool.query("SELECT * FROM USERS WHERE email = $1", [email]);
        const user = result.rows[0];

        if(!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError("Invalid email and password.", 401);
        }

        req.user = user;

        const token = generateToken({ id: user.id});
        res.cookie("pos-login-token", token, COOKIE_OPTIONS);

        res.status(200).json({
            success:true,
            message: "Loggd in successfully!",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                company_role: user.company_role,
                company_id : user.company_id
            }
        });
    } catch(err) {
        next(err);
    }
};



// me
export const getMe = (req, res) => {
    res.status(200).send({
        status: 'success',
        data: {
            user: req.user
        }
    });
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        throw new AppError("Please provide thy email.", 400);
    }

    try {
        const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

        // same repsosne - no need to leak registered mails
        if(result.rowCount === 0) {
            return res.status(200).json({
                success: true ,
                message: "If that email is registered then a reset link has been sent."
            });
        }

        const userId = result.rows[0].id;
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now


        await pool.query(
            "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
            [resetToken, expiry, userId]
        );

        // TODO: email to be sent with the reset token
        console.log(`Password reset token for ${email}: ${resetToken}`);

        res.status(200).json({
            success: true,
            message: "If that email is registered,  a reset link has been sent."
        });

    
    }  catch(err) {
        next(err);
    }
};

// REset Password
export const resetPassword = async(req, res, next) => {
    const {token, password} = req.body;

    if (!token || !password) {
        throw new AppError("Please provide the reset toekn and a new password.", 400);
    }

    try {
        const result  =await pool.query(
            "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()",
            [token]
        );

        if (result.rowCount === 0) {
            throw new AppError("The reset link is invalid or has been expired.", 400);
        }

        const userId = result.rows[0].id;
        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(
            "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
            [passwordHash, userId]
        );

        res.status(200).json({
            success: true,
            message: "Password reset successfully! You can now log in."
        });
    } catch (err) {
        next(err);
    }
};

export const protect = async (req, res, next) => {
    const token = req.cookies?.["pos-login-token"];

    if (!token) {
        return next(new AppError("You must be logged in to access this resource.", 401));
    }

    try {
        const payload = verifyToken(token);

        const user = (await pool.query("SELECT id, name, email, company_role, company_id FROM users WHERE id = $1;", [payload.id])).rows[0];

        if(!user)
            return next(new AppError("User does not exist.", 404));

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

export const logout = (req, res, next) => {
    res.clearCookie("pos-login-token", COOKIE_OPTIONS);
    res.status(200).send({status: 'success'});
}

/**
 * Role-based authorization middleware.
 * Usage: authorize(["MASTER_ADMIN", "OWNER"])
 */
export const authorize = (roles = []) => {
    return (req, res, next) => {
        const userRole = req.user?.company_role;

        if (!userRole || !roles.includes(userRole)) {
            return next(
                new AppError("You do not have permission to perform this action.", 403)
            );
        }

        next();
    };
};