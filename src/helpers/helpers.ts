import { ServerResponse } from 'http';

import { User, UserInput } from '../models/User.model';
import { ApiResponse } from '../models/Response.model';

export const validateUserData = (data: UserInput): Partial<User> | null => {
    if (
        data.username && typeof data.username !== 'string'
        || data.age && typeof data.age !== 'number'
        || data.hobbies && !Array.isArray(data.hobbies)
    ) {
        return null;
    }

    return data as Partial<User>
};

export const responseHandler = (res: ServerResponse, apiResponse: ApiResponse): void => {
    const { statusCode, message, data } = apiResponse;

    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message, data }));
};
