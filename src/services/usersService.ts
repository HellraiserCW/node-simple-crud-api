import { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const users: User[] = [];

const createUser = ({ username, age, hobbies }: Partial<User>): User => <User>({
    id: uuidv4(),
    username,
    age,
    hobbies,
});

export const getUsers = (): User[] => users;

export const getUserById = (userId: string): User | undefined => users.find(user => user.id === userId);

export const addUser = (userData: Partial<User>): User => {
    const newUser = createUser(userData);
    users.push(newUser);

    return newUser;
};

export const updateUser = (userId: string, userData: Partial<User>): User | undefined => {
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...userData };

        return users[index];
    }

    return undefined;
};

export const deleteUser = (userId: string): void => {
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        users.splice(index, 1);
    }
};
