import {
    createUserHandler,
    deleteUserHandler,
    getAllUsers,
    getUser,
    updateUserHandler
} from '../controllers/usersController';
import { IncomingMessage, ServerResponse } from 'node:http';

export const routes = (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === '/api/users' && req.method === 'GET') {
        getAllUsers(req, res);
    } else if (req.url?.match(/\/api\/users\/([a-z0-9-]+)/) && req.method === 'GET') {
        const userId = req.url.split('/')[3];
        getUser(req, res, userId);
    } else if (req.url === '/api/users' && req.method === 'POST') {
        createUserHandler(req, res);
    } else if (req.url?.match(/\/api\/users\/([a-z0-9-]+)/) && req.method === 'PUT') {
        const userId = req.url.split('/')[3];
        updateUserHandler(req, res, userId);
    } else if (req.url?.match(/\/api\/users\/([a-z0-9-]+)/) && req.method === 'DELETE') {
        const userId = req.url.split('/')[3];
        deleteUserHandler(req, res, userId);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
}
