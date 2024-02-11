import http from 'http';
import dotenv from 'dotenv';
import { routes } from './routes/routes';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => routes(req, res));

server.listen(PORT, () => {
    console.log(`Server PORT ${PORT} is running!`);
});
