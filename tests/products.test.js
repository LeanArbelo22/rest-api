const mongoose = require('mongoose');
const { server } = require('../index');
const Product = require('../models/Product');
const { api, initialProducts, getContentOfProducts, postProductTest } = require('./utils/helpers');

jest.setTimeout(50000);

beforeEach(async () => {
    server.close();
    await Product.deleteMany({});

    // Sequential, save one by one in order...
    for (const product of initialProducts) {
        const newProduct = new Product(product);
        await newProduct.save();
    }
});

describe('GET\'s of products:', () => {
    test('are returned as json and status 200', async () => {
        await api
            .get('/api/products')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('there are 2', async () => {
        const { response } = await getContentOfProducts();
        expect(response.body).toHaveLength(initialProducts.length);
    });

    test('the first price is 199', async () => {
        const { response } = await getContentOfProducts();
        expect(response.body[0].price).toBe(199);
    });

    test('at least one cost 9', async () => {
        const { price } = await getContentOfProducts();
        expect(price).toContain(9);
    });
});

describe('POST a product:', () => {
    test('only valids can be added', async () => {
        const validProduct = {
            name: 'Ejemplo3',
            price: 500,
            off: true,
            date: new Date(),
            user: '62a6235240a98c6b299b20cc'
        };

        await postProductTest(validProduct, 201);

        const { response, name } = await getContentOfProducts();
        expect(name).toContain(validProduct.name);
        expect(response.body).toHaveLength(initialProducts.length + 1);
    });

    test('without name can\'t be added', async () => {
        const productWithoutName = {
            price: 500,
            off: true,
            date: new Date(),
            user: '62a6235240a98c6b299b20cc'
        };

        await postProductTest(productWithoutName, 400);

        const { response } = await getContentOfProducts();
        expect(response.body).toHaveLength(initialProducts.length);
    });

    test('without price can\'t be added', async () => {
        const productWithoutPrice = {
            name: 'Ejemplo 6',
            off: true,
            date: new Date(),
            user: '62a6235240a98c6b299b20cc'
        };

        await postProductTest(productWithoutPrice, 400);

        const { response } = await getContentOfProducts();
        expect(response.body).toHaveLength(initialProducts.length);
    });

    test('without date can be added', async () => {
        const productWithoutDate = {
            name: 'Ejemplo 4',
            price: 700,
            off: true,
            user: '62a6235240a98c6b299b20cc'
        };

        await postProductTest(productWithoutDate, 201);

        const { response } = await getContentOfProducts();
        expect(response.body).toHaveLength(initialProducts.length + 1);
    });

    test('without off can be added', async () => {
        const productWithoutOff = {
            name: 'Ejemplo',
            price: 700,
            user: '62a6235240a98c6b299b20cc'
        };

        await postProductTest(productWithoutOff, 201);

        const { response } = await getContentOfProducts();
        expect(response.body).toHaveLength(initialProducts.length + 1);
    });

    test('if has the same name can\'t be added', async () => {
        const initialProducts = await Product.find({});

        const sameNameProduct = {
            name: 'EjA1',
            price: 125,
            off: true,
            date: new Date(),
            user: '62a6235240a98c6b299b20cc'
        };

        const newProduct = await postProductTest(sameNameProduct, 400);

        expect(newProduct.body.errors.name.message).toContain('to be unique');

        const finalProducts = await Product.find({});

        expect(finalProducts).toHaveLength(initialProducts.length);
    });
});

describe('DELETE a product:', () => {
    test('if exists can be deleted', async () => {
        const { response: firstResponse } = await getContentOfProducts();
        const { body: products } = firstResponse;
        const productToDelete = products[0];

        await api
            .delete(`/api/products/${productToDelete._id}`) // initialNotes tiene solo _id
            .expect(204);

        const { response: secondResponse, name } = await getContentOfProducts();
        expect(secondResponse.body).toHaveLength(initialProducts.length - 1);
        expect(name).not.toContain(productToDelete.name);
    });

    test('if doesn\'t exist can\'t be deleted', async () => {
        await api
            .delete('/api/products/123405')
            .expect(400);

        const { response } = await getContentOfProducts();
        expect(response.body).toHaveLength(initialProducts.length);
    });
});

afterAll(async () => {
    server.close();
    await mongoose.connection.close();
});

