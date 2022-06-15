const mongoose = require('mongoose');
const { Schema, model } = mongoose; // const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const ProductSchema = new Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    off: Boolean,
    date: Date,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

ProductSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

ProductSchema.plugin(uniqueValidator);

const Product = model('Product', ProductSchema);

module.exports = Product;