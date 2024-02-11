import { IncomingMessage as Req, ServerResponse as Res } from 'http';

import { getUsers, getUserById, addUser, updateUser, deleteUser } from '../services/users.service';
import { User, UserInput } from '../models/User.model';
import { validateUserData, responseHandler, validateUuid } from '../helpers/helpers';
import { responseMessages } from './response-messages.config';

export const getAllUsers = (_req: Req, res: Res): void => {
    try {
        const users: User[] = getUsers();

        responseHandler(res, { statusCode: 200, data: users });
    } catch {
        responseHandler(res, { statusCode: 500, message: responseMessages.internal });
    }
};

export const getUser = (req: Req, res: Res): void => {
    try {
        const userId: string = req.url!.split('api/users/')[1];
        if (!validateUuid(userId)) {
            responseHandler(res, { statusCode: 400, message: responseMessages.userIdInvalid });

            return;
        }

        const user: User | undefined = getUserById(userId);
        if (!user) {
            responseHandler(res, { statusCode: 404, message: responseMessages.userNotFound });

            return;
        }

        responseHandler(res, { statusCode: 200, data: user });
    } catch {
        responseHandler(res, { statusCode: 500, message: responseMessages.internal });
    }
};

export const createUserHandler = (req: Req, res: Res): void => {
    try {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const userData: UserInput = JSON.parse(body);
                const validationResult: Partial<User> | null = validateUserData(userData);
                if (!validationResult || !userData.username || !userData.age || !userData.hobbies) {
                    responseHandler(res, { statusCode: 400, message: responseMessages.invalidInput });

                    return;
                }

                const newUser: User = addUser(validationResult);

                responseHandler(res, { statusCode: 201, message: responseMessages.created, data: newUser });
            } catch {
                responseHandler(res, { statusCode: 400, message: responseMessages.invalidJSON });
            }
        });
    } catch {
        responseHandler(res, { statusCode: 500, message: responseMessages.internal });
    }
};

export const updateUserHandler = (req: Req, res: Res): void => {
    try {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const userId: string = req.url!.split('api/users/')[1];
                if (!validateUuid(userId)) {
                    responseHandler(res, { statusCode: 400, message: responseMessages.userIdInvalid });

                    return;
                }

                const userData: UserInput = JSON.parse(body);
                const validationResult: Partial<User> | null = validateUserData(userData);
                if (!validationResult) {
                    responseHandler(res, { statusCode: 400, message: responseMessages.invalidInput });

                    return;
                }

                const isUser: User | undefined = getUserById(userId);
                if (!isUser) {
                    responseHandler(res, { statusCode: 404, message: responseMessages.userNotFound });

                    return;
                }

                const updatedUser: User = updateUser(userId, validationResult);

                responseHandler(res, { statusCode: 200, message: responseMessages.updated, data: updatedUser });
            } catch {
                responseHandler(res, { statusCode: 400, message: responseMessages.invalidJSON });
            }
        });
    } catch {
        responseHandler(res, { statusCode: 500, message: responseMessages.internal });
    }
};

export const deleteUserHandler = (req: Req, res: Res): void => {
    try {
        const userId: string = req.url!.split('api/users/')[1];
        if (!validateUuid(userId)) {
            responseHandler(res, { statusCode: 400, message: responseMessages.userIdInvalid });

            return;
        }

        const deleted: boolean = deleteUser(userId);
        if (!deleted) {
            responseHandler(res, {statusCode: 404, message: responseMessages.userNotFound });

            return;
        }

        responseHandler(res, { statusCode: 204 });
    } catch {
        responseHandler(res, { statusCode: 500, message: responseMessages.internal });
    }
};
