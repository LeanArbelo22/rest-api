const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema, model } = mongoose; // const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    admin: { type: Boolean },
    passwordHash: { type: String, required: true },
    address: { type: String, required: true },
    frogcard: { type: Number, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;

        delete returnedObject.passwordHash;
    }
});

UserSchema.plugin(uniqueValidator);

const User = model('User', UserSchema);

module.exports = User;
