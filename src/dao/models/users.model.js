import mongoose from "mongoose";

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, unique: true, required: true },
    age: { type: Number },
    password: { type: String },
    carts: {
        type: [{
            cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts',
                required: true
            }
        }],
        default: []
    },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

cartsSchema.pre('findOne', function () {
    this.populate('carts.cart');
})

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;