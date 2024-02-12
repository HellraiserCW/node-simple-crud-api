import { v4 as uuidv4 } from 'uuid';

import { User } from '../models/User.model';

const users: User[] = [];

const createUser = ({ username, age, hobbies }: Partial<User>): User => <User> ({
    id: uuidv4(),
    username,
    age,
    hobbies,
});

export const getUsers = (): User[] => users;

export const getUserById = (userId: string): User | undefined => users.find(user => user.id === userId);

export const addUser = (userData: Partial<User>): User => {
    const newUser: User = createUser(userData);
    users.push(newUser);

    return newUser;
};

export const updateUser = (userId: string, userData: Partial<User>): User => {
    const index: number = users.findIndex(user => user.id === userId);
    const updatedUser = { ...users[index], ...userData };
    users[index] = updatedUser;

    return updatedUser;
};

export const deleteUser = (userId: string): boolean => {
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        users.splice(index, 1);
    }

    return index !== -1;
};

export const shareUpdateUsers = (newUsers: User[]): void => {
    users.splice(0, users.length, ...newUsers);
};
