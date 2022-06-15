const bcrypt = require('bcrypt');
const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const result = await User.find({}).populate('products', {
            name: 1,
            price: 1,
            date: 1,
            _id: 0
        });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
};

const createUser = async (req, res) => {
    try {
        const body = req.body;
        const { username, name, email, admin, password, address, frogcard } = body;
        
        if(!username || !name || !email || !password || !address){
            return res.status(400).json({message: 'Faltan datos para completar la peticion'});
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username, 
            name, 
            email, 
            admin: admin || false, 
            passwordHash, 
            address, 
            frogcard
        });

        const savedUser = await user.save();
        res.status(201).json({ body: savedUser, message: 'Usuario creado correctamente' });
    } catch (error) {
        console.error(error.message);
        res.status(400).json(error);
    }

    // no usar next si no hay un middleware siguiente, problema con los tests
};

module.exports = {
    getUsers,
    createUser
};