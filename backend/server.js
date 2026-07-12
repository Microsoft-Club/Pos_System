import pool from './database.js';
import app from './app.js';
import { gracefulShutdown } from './utils/helper.js';

const server = app.listen(process.env.SERVER_PORT || 5000, () => {
    console.clear();
    console.log('Server has started on port 5000.');
});

process.on("SIGTERM", gracefulShutdown(server));
process.on("SIGINT", gracefulShutdown(server));