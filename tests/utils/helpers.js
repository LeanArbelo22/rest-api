const supertest = require('supertest');
const { app } = require('../../index');
const User = require('../../models/User');
const api = supertest(app);

const initialProducts = [
    {
        name: 'EjA1',
        price: 199,
        off: false,
        date: new Date(),
        user: '62a6235240a98c6b299b20cc'

    },
    {
        name: 'Ej10',
        price: 9,
        off: true,
        date: new Date(),
        user: '62a6235240a98c6b299b20cc'
    }
];

const getContentOfProducts = async () => {
    const response = await api.get('/api/products');
    return {
        response,
        name: response.body.map(product => product.name),
        price: response.body.map(product => product.price)
    };
};

const postProductTest = async (product, status) => {
    return await api
        .post('/api/products')
        .send(product)
        .expect(status)
        .expect('Content-Type', /application\/json/);
};

const getUsers = async () => {
    const usersDB = await User.find({}); // not returned as json as expected
    return usersDB.map(user => user.toJSON());
};

module.exports = {
    api,
    initialProducts,
    getContentOfProducts,
    postProductTest,
    getUsers
};