import { IncomingMessage, ServerResponse } from 'http';

import {
    createUserHandler,
    deleteUserHandler,
    getAllUsers,
    getUser,
    updateUserHandler
} from '../controllers/users.controller';
import { responseHandler } from '../helpers/helpers';
import { responseMessages } from '../controllers/response-messages.config';

interface RouteHandler {
    (req: IncomingMessage, res: ServerResponse): void;
}

const routes: { [key: string]: RouteHandler } = {
    'GET /api/users': getAllUsers,
    'GET /api/users/([a-z0-9-]+)': getUser,
    'POST /api/users': createUserHandler,
    'PUT /api/users/([a-z0-9-]+)': updateUserHandler,
    'DELETE /api/users/([a-z0-9-]+)': deleteUserHandler
};

const matchRoute = (req: IncomingMessage, route: string): boolean => {
    const { url = '', method = '' } = req;
    const [routeMethod, routePattern] = route.split(' ');
    const regex = new RegExp(`^${routePattern}$`);

    return method.toUpperCase() === routeMethod && url.match(regex) !== null;
};

export const routeHandler = (req: IncomingMessage, res: ServerResponse): void => {
    const matchedRoute = Object.keys(routes).find(route => matchRoute(req, route));

    matchedRoute
        ? routes[matchedRoute](req, res)
        : responseHandler(res, { statusCode: 404, message: responseMessages.pageNotFound });
};
