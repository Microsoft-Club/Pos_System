import pool from "../database.js";

export const gracefulShutdown = (server) => {
    return async () => {
        try{
            server.close(async () => {
                console.log("Shutting down server...");

                await pool.end();
                process.exit(0);
            });
        } catch(err){
            process.exit(1);
        }
    }
}