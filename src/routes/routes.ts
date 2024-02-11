import { IncomingMessage, ServerResponse } from 'http';

import {
    createUserHandler,
    deleteUserHandler,
    getAllUsers,
    getUser,
    updateUserHandler
} from '../controllers/users.controller';
import { responseHandler } from '../helpers/helpers';
import { responseMessages } from '../controllers/response-messages';

export const routes = (req: IncomingMessage, res: ServerResponse): void => {
    if (req.url === '/api/users' && req.method === 'GET') {
        getAllUsers(req, res);
    } else if (req.url?.match(/\/api\/users\/([a-z0-9-]+)/) && req.method === 'GET') {
        getUser(req, res);
    } else if (req.url === '/api/users' && req.method === 'POST') {
        createUserHandler(req, res);
    } else if (req.url?.match(/\/api\/users\/([a-z0-9-]+)/) && req.method === 'PUT') {
        updateUserHandler(req, res);
    } else if (req.url?.match(/\/api\/users\/([a-z0-9-]+)/) && req.method === 'DELETE') {
        deleteUserHandler(req, res);
    } else {
        responseHandler(res, { statusCode: 404, message: responseMessages.pageNotFound });
    }
};
