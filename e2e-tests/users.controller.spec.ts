import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

import { server } from '../src';
import { User } from '../src/models/User.model';
import { validateUuid } from '../src/helpers/helpers';
import { getUserById } from '../src/services/users.service';
import { responseMessages } from '../src/controllers/response-messages.config';

const user1: Partial<User> = {
    username: 'JohnDoe',
    age: 30,
    hobbies: ['Sport', 'Programming']
};
const user2: Partial<User> = {
    username: 'SarahSmith',
    age: 25,
    hobbies: []
};
const invalidUser1: any = {
    username: 30,
    age: 30,
    hobbies: ['Sport', 'Programming']
};
const invalidUser2: any = {
    username: 'JohnDoe',
    age: '30',
    hobbies: ['Sport', 'Programming']
};
const invalidUser3: any = {
    username: 'JohnDoe',
    age: 30,
    hobbies: 'Sport'
};
const notFullUser1: any = {
    age: 30,
    hobbies: ['Sport', 'Programming']
};
const notFullUser2: any = {
    username: 'JohnDoe',
    hobbies: ['Sport', 'Programming']
};
const notFullUser3: any = {
    username: 'JohnDoe',
    age: 30
};

describe('test scenarios', () => {
    afterEach((done) => {
        server.close(() => {});
        done();
    });

    describe('test scenario 1', () => {
        let userId: string;

        it('should return an empty array if there are no user records in DB', async () => {
            const response = await request(server).get('/api/users');

            expect(response.status).toBe(200);
            expect(response.body).toEqual( { 'data': [] }
            );
        });

        it('should create a new user and return the created record', async () => {
            const response = await request(server).post('/api/users').send(user1);

            expect(response.status).toBe(201);

            const user = response.body.data as User;
            userId = user.id;
            expect(validateUuid(user.id)).toBe(true);
            expect(user.username).toBe(user1.username);
            expect(user.age).toBe(user1.age);
            expect(user.hobbies).toEqual(user1.hobbies);
        });

        it('should retrieve the created user by its ID', async () => {
            const response = await request(server).get(`/api/users/${userId}`);

            expect(response.status).toBe(200);

            const user = getUserById(userId);
            expect(user?.username).toBe(user1.username);
            expect(user?.age).toBe(user1.age);
            expect(user?.hobbies).toEqual(user1.hobbies);
        });

        it('should update the user by its ID', async () => {
            const updatedUser1 = {
                username: 'UpdatedJohnDoe',
                age: 35,
                hobbies: ['Sport', 'Programming', 'Sleeping']
            }
            const response = await request(server).put(`/api/users/${userId}`).send(updatedUser1);

            expect(response.status).toBe(200);

            const user = response.body.data as User;
            expect(user.username).toBe(updatedUser1.username);
            expect(user.age).toBe(updatedUser1.age);
            expect(user.hobbies).toEqual(updatedUser1.hobbies);
        });

        it('should delete the user by its ID', async () => {
            const response = await request(server).delete(`/api/users/${userId}`);

            expect(response.status).toBe(204);
        });

        it('should return 404 when trying to get a deleted user', async () => {
            const response = await request(server).get(`/api/users/${userId}`);
            const errorResponse = {
                message: responseMessages.userNotFound
            };

            expect(response.status).toBe(404);
            expect(response.body).toStrictEqual(errorResponse);
        });
    });

    describe('test scenario 2', () => {
        it('should return 400 when creating a user with invalid input', async () => {
            const errorResponse = {
                message: responseMessages.invalidInput
            };
            const response1 = await request(server).post('/api/users').send(invalidUser1);
            const response2 = await request(server).post('/api/users').send(invalidUser2);
            const response3 = await request(server).post('/api/users').send(invalidUser3);

            expect(response1.status).toBe(400);
            expect(response2.status).toBe(400);
            expect(response3.status).toBe(400);
            expect(response1.body).toStrictEqual(errorResponse);
            expect(response2.body).toStrictEqual(errorResponse);
            expect(response3.body).toStrictEqual(errorResponse);
        });

        it('should return 400 when creating a user with missing required fields', async () => {
            const errorResponse = {
                message: responseMessages.invalidInput
            };

            const response1 = await request(server).post('/api/users').send(notFullUser1);
            const response2 = await request(server).post('/api/users').send(notFullUser2);
            const response3 = await request(server).post('/api/users').send(notFullUser3);

            expect(response1.status).toBe(400);
            expect(response2.status).toBe(400);
            expect(response3.status).toBe(400);
            expect(response1.body).toStrictEqual(errorResponse);
            expect(response2.body).toStrictEqual(errorResponse);
            expect(response3.body).toStrictEqual(errorResponse);
        });

        it('should return 400 when JSON invalid', async () => {
            const invalidUser: any = `{
                username: 'JohnDoe',
                age: 30
                hobbies: ['Sport' 'Programming']
            }`;
            const errorResponse = {
                message: responseMessages.invalidJSON
            };

            const response = await request(server).post('/api/users').send(invalidUser);

            expect(response.status).toBe(400);
            expect(response.body).toStrictEqual(errorResponse);
        });
    });

    describe('test scenario 3', () => {
        let userId: string;

        it('should return 400 when updating a user with invalid data', async () => {
            const errorResponse = {
                message: responseMessages.invalidInput
            };
            const createResponse = await request(server).post('/api/users').send(user1);
            const user = createResponse.body.data as User;
            userId = user.id;

            const response1 = await request(server).put(`/api/users/${userId}`).send(invalidUser1);
            const response2 = await request(server).put(`/api/users/${userId}`).send(invalidUser2);
            const response3 = await request(server).put(`/api/users/${userId}`).send(invalidUser3);

            expect(response1.status).toBe(400);
            expect(response2.status).toBe(400);
            expect(response3.status).toBe(400);
            expect(response1.body).toStrictEqual(errorResponse);
            expect(response2.body).toStrictEqual(errorResponse);
            expect(response3.body).toStrictEqual(errorResponse);

            await request(server).delete(`/api/users/${userId}`);
        });

        it('should return 404 when updating a user by invalid id', async () => {
            const errorResponse = {
                message: responseMessages.userIdInvalid
            };
            const invalidUserId = 'some0invalid0id';
            const response = await request(server).put(`/api/users/${invalidUserId}`).send(user1);

            expect(response.status).toBe(400);
            expect(response.body).toStrictEqual(errorResponse);
        });

        it('should return 404 when updating a non-existent user', async () => {
            const errorResponse = {
                message: responseMessages.userNotFound
            };
            const nonExistentUserId = uuidv4();
            const response = await request(server).put(`/api/users/${nonExistentUserId}`).send(user1);

            expect(response.status).toBe(404);
            expect(response.body).toStrictEqual(errorResponse);
        });

        it('should return 400 when JSON invalid', async () => {
            const invalidUpdatedUser: any = `{
                username: 'JohnDoe',
                age: 30
                hobbies: ['Sport' 'Programming']
            }`;
            const errorResponse = {
                message: responseMessages.invalidJSON
            };

            const response = await request(server).put(`/api/users/${userId}`).send(invalidUpdatedUser);

            expect(response.status).toBe(400);
            expect(response.body).toStrictEqual(errorResponse);
        });
    });

    describe('test scenario 4', () => {
        it('should return an array of user records in DB', async () => {
            await request(server).post('/api/users').send(user1);
            await request(server).post('/api/users').send(user2);

            const response = await request(server).get('/api/users');
            expect(response.body.data.length).toBe(2);
        });

        it('should return 400 when trying to get a user by invalid id', async () => {
            const errorResponse = {
                message: responseMessages.userIdInvalid
            };
            const invalidUserId = 'some0invalid0id';
            const response = await request(server).get(`/api/users/${invalidUserId}`);

            expect(response.status).toBe(400);
            expect(response.body).toStrictEqual(errorResponse);
        });

        it('should return 400 when trying to delete a user by invalid id', async () => {
            const errorResponse = {
                message: responseMessages.userIdInvalid
            };
            const invalidUserId = 'some0invalid0id';
            const response = await request(server).delete(`/api/users/${invalidUserId}`);

            expect(response.status).toBe(400);
            expect(response.body).toStrictEqual(errorResponse);
        });
    });
});
