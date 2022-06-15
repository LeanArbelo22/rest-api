const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { server } = require('../index');
const User = require('../models/User');
const { api, getUsers } = require('./utils/helpers');

jest.setTimeout(50000);

beforeEach(() => {
    server.close();
});

describe('POST a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('123456', 10);

        const user = new User({
            username: '@leaarbelo', 
            name: 'Leandro Arbelo', 
            email: 'leandro.ejemplo@gmail.com', 
            admin: true, 
            passwordHash, 
            address: 'Direccion 123, Mvd, Uy', 
            frogcard: 6376930000123457
        });

        await user.save();
    });
    
    test('works as expected when it\'s valid', async () => {
        const initialUsers = await getUsers();

        const newUser = {
            username: '@migue', 
            name: 'Miguel Valera', 
            email: 'migue.ejemplo@gmail.com', 
            admin: true, 
            password: '123456', 
            address: 'Direccion 123, Mvd, Uy', 
            frogcard: 6376930000123458
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const finalUsers = await getUsers();
        expect(finalUsers).toHaveLength(initialUsers.length + 1);

        const usernames = finalUsers.map(user => user.username);
        expect(usernames).toContain(newUser.username);
    });

    test('creation fails with proper status and message if username is already taken', async () => {
        const initialUsers = await User.find({});

        const newUser = {
            username: '@leaarbelo', 
            name: 'Cesar Angarita', 
            email: 'cesar.ejemplo@gmail.com', 
            admin: true, 
            password: '123456', 
            address: 'Direccion 123, Mvd, Uy', 
            frogcard: 6376930000123459
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        console.log(result.body.errors);

        expect(result.body.errors.username.message).toContain('to be unique');

        const finalUsers = await User.find({});

        expect(finalUsers).toHaveLength(initialUsers.length);
    });
});

afterAll(async () => {
    server.close();
    await mongoose.connection.close();
});