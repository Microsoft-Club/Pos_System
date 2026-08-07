import bcrypt from "bcrypt"
import crypto from "crypto"
import pool from "../database.js"
import { generateToken } from "../utils/token.js"

const COOKIE_OPTIONS = {
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60* 60* 1000 // 7 days in ms
};

// signup
export const signup = async (req , res) => {
    const {name, email, password} = req.body; 

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide a name, email, and a password."
        });
    }


    try {
        const existing  = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (existing.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "An accoutn with that email already exists. "
            });
        }
    

    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, company_role, company_id;',
        [name, email, passwordHash]
    );

    const user  = result.rows[0];
    const token = generateToken({id: user.id});

    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({
        success: true,
        message: "Account Created Successfully!",
        data: user
    });
} 

    catch(err) {
        console.error("signup error:", err);
        res.status(500).json({
            success:false,
            message:"Something went wrong while creating your account."
        });
    }

};


// Login
export const login = async(req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Plz provide email and password."
        });
    }

    try {
        const result = await pool.query("SELECT * FROM USERS WHERE email  = $1", [email]);
        const user = result.rows[0];

        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email and password."
            });
        }

        const token = generateToken({ id: user.id});
        res.cookie("token", token, COOKIE_OPTIONS);

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
        console.error("login error:", err);
        res.status(500).json({
            success:false,
            message:"Something went wrong while logging in."
        });
    }
};



// me
export const getMe = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, name, email, company_role, company_id FROM users WHERE id = $1",
            [req.user.id]
        );

        if (result.rowCount <= 0) {
            return res.status(404).json({
                success:false,
                message:"User not Found"
            });
        }

        res.status(200).json({
            success:true,
            data: result.rows[0]
        })

    } catch(err) {
            console.error("getMe error:", err);
            res.status(500).json({
                success:false,
                message:"Something went wrong while fetching your profile."
            });
        }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Please provide thy email."
        });
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
        console.error("forgotPassword error:", err);
        res.status(500).json({
            success:false,
            message: "Something went wrong. Please try again."
        });
    }
};

// REset Password
export const resetPassword = async(req, res) => {
    const {token, password} = req.body;

    if (!token || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide the reset toekn and a new password."
        });
    }

    try {
        const result  =await pool.query(
            "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()",
            [token]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({
                success:false, 
                message: "The reset link is invalid or has been expired."
            });
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
        console.error("resetPassword error:", err);
        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again."
        });
    }
};


