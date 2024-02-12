import http, { IncomingMessage as Req, ServerResponse as Res } from 'http';

import { User, UserInput } from '../models/User.model';
import { ApiResponse } from '../models/Response.model';
import cluster from 'cluster';

export const validateUserData = (data: UserInput): Partial<User> | null => {
    return (typeof data.username !== 'string' || typeof data.age !== 'number' || !Array.isArray(data.hobbies))
        ? null
        : data as Partial<User>;
};

export const validateUuid = (id: string): boolean => {
    const uuidRegex: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    return !!id.match(uuidRegex);
};

export const responseHandler = (res: Res, apiResponse: ApiResponse): void => {
    const { statusCode, message, data } = apiResponse;

    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message, data }));
};

export const handleRequest = (port: number, req: Req, res: Res) => {
    const options = {
        hostname: 'localhost',
        port: port,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };
    const callback = (proxyRequest: Req) => {
        res.writeHead(proxyRequest.statusCode!, proxyRequest.headers);
        proxyRequest.pipe(res, { end: true });
    }
    const proxy = http.request(options, callback);

    req.pipe(proxy, { end: true });
};

export const shareUpdates = (users: User[]) => {
    if (cluster.isWorker) {
        process.send!({ type: 'updateUsers', data: users });
    }
};
