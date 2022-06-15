const Product = require('../models/Product');
const User = require('../models/User');

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}).populate('user', {
            name: 1,
            email: 1,
            admin: 1,
            _id: 0
        }).lean(); 
    
        if(products.length > 0) {
            res.status(200).json(products).end();
        } else {
            res.status(404).send({ error: 'No se han encontrado recursos en la ruta solicitada' });
        }
    } catch (error) {
        console.error(error.message);
        next(error);
    }
};

const getOneProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findById(id);

        if(product) {
            res.status(200).json(product);
        } else {
            res.status(404).end('No se ha encontrado el recurso solicitado');
        }
    } catch(error) {
        console.error(error.message);
        next(error);
    }
};

const modifyProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;

        const newProductInfo = {
            name: body.name,
            price: body.price,
            off: body.off,
            date: new Date().toISOString()
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, newProductInfo, { new: true });

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error.message);
        next(error);
    }
};

const deleteOneProduct = (req, res, next) => {
    const { id } = req.params;
    
    Product.findByIdAndDelete(id)
        .then(() => { 
            res.status(204).end(`El producto con id: ${id} ha sido eliminado`); 
        })
        .catch((error) => { 
            console.error(error.message);
            next(error);
        });
};

const createProduct = async (req, res, next) => {
    const body = req.body;

    if(!body || !body.name || !body.price){
        return res.status(400).json({message: 'Faltan datos para completar la peticion'});
    }

    const user = await User.findById(body.user);

    const newProduct = new Product({
        name: body.name,
        price: body.price,
        off : body.off ? body.off : false,
        date: new Date().toISOString(),
        user: user._id // user.toJSON().id
    });

    try {
        const savedProduct = await newProduct.save();
        user.products = user.products.concat(savedProduct._id);
        await user.save();
        res.status(201).json({ body: savedProduct, message: 'Producto creado correctamente' });
    } catch (error) {
        console.error(`No se pudo crear el documento: ${error.message}`);
        res.status(400).json(error);
        next(error);
    }
};

module.exports = {
    getProducts,
    getOneProduct,
    modifyProduct,
    deleteOneProduct,
    createProduct
};