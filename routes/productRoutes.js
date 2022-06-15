const productRoutes = require('express').Router();
const { 
    getProducts, 
    getOneProduct, 
    deleteOneProduct, 
    createProduct, 
    modifyProduct
} = require('../controllers/productController');

productRoutes.get('/', getProducts);

productRoutes.get('/:id', getOneProduct);

productRoutes.put('/:id', modifyProduct);

productRoutes.delete('/:id', deleteOneProduct);

productRoutes.post('/', createProduct);


module.exports = productRoutes;