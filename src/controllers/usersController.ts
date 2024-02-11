import { IncomingMessage as Request, ServerResponse as Response } from 'http';
import { getUsers, getUserById, addUser, updateUser, deleteUser } from '../services/usersService';
import { UserInput } from '../models/User';
import { validateUserData } from '../helpers/helpers';

export const getAllUsers = (req: Request, res: Response): void => {
    const users = getUsers();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
};

export const getUser = (req: Request, res: Response, userId: string): void => {
    const user = getUserById(userId);

    if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
    }
};

export const createUserHandler = (req: Request, res: Response): void => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const userData: UserInput = JSON.parse(body);
            const validationResult = validateUserData(userData);

            if (!validationResult.data) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Validation errors', errors: validationResult.errors }));
                return;
            }

            const newUser = addUser(validationResult.data);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON format' }));
        }
    });
};

export const updateUserHandler = (req: Request, res: Response, userId: string): void => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const userData: UserInput = JSON.parse(body);
            const validationResult = validateUserData(userData);

            if (!validationResult.data) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Validation errors', errors: validationResult.errors }));
                return;
            }

            const updatedUser = updateUser(userId, validationResult.data);
            if (updatedUser) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedUser));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
            }
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON format' }));
        }
    });
};

export const deleteUserHandler = (req: Request, res: Response, userId: string): void => {
    deleteUser(userId);

    res.writeHead(204);
    res.end();
};
