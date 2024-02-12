import http, { IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';

import { routeHandler } from './routes/routes';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 4000;

export const server = http.createServer((req: IncomingMessage, res: ServerResponse) => routeHandler(req, res));

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
