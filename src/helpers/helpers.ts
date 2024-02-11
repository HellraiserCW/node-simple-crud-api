import { User, UserInput } from '../models/User';

export const validateUserData = (data: UserInput): { data: Partial<User> | null; errors: string[] | null } => {
    const errors: string[] = [];

    if (data.username && typeof data.username !== 'string') {
        errors.push('Username must be a string');
    }

    if (data.age && typeof data.age !== 'number') {
        errors.push('Age must be a number');
    }

    if (data.hobbies && !Array.isArray(data.hobbies)) {
        errors.push('Hobbies must be an array');
    }

    return errors.length === 0
        ? ({
            data: data as Partial<User>,
            errors: null
        })
        : ({
            data: null,
            errors
        });
};
