const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    calorie: {
        type: Number,
        required: true
    },
    carbohydrate: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Food = mongoose.model('food', FoodSchema);