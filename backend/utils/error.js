import { DatabaseError } from "pg";

export class AppError extends Error{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
    }
}

const sendErrorDev = (err, res) => {
    console.log(err);
    res.status(err.statusCode ?? 500).send({
        status: 'error',
        message: err?.message ?? 'Internal Server Error. Try again later.',
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    res.status(err.statusCode ?? 500).send({
        status: 'error',
        message: err?.message ?? 'Internal Server Error. Try again later.'
    });
}

export const globalErrorMiddleware = (err, req, res, next) => {
    if(process.env.NODE_ENV === 'production'){
        
        if(err instanceof DatabaseError && err.code === '23505')
            err = new AppError("An account with this email already exists. Please login.", 409);

        sendErrorProd(err, res);
    }
    else sendErrorDev(err, res);
}