import { ServerResponse } from 'http';

import { User, UserInput } from '../models/User.model';
import { ApiResponse } from '../models/Response.model';

export const validateUserData = (data: UserInput): Partial<User> | null => {
    return (typeof data.username !== 'string' || typeof data.age !== 'number' || !Array.isArray(data.hobbies))
        ? null
        : data as Partial<User>;
};

export const validateUuid = (id: string): boolean => {
    const uuidRegex: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    return !!id.match(uuidRegex);
};

export const responseHandler = (res: ServerResponse, apiResponse: ApiResponse): void => {
    const { statusCode, message, data } = apiResponse;

    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message, data }));
};
