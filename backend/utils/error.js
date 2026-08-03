export class AppError extends Error{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
    }
}

export const globalErrorMiddleware = (err, req, res, next) => {
   
}