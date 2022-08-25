const mongoose = require('mongoose');

const ConsumeableSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food'
    },
    quantity: {
        type: Number,
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

module.exports = Consumeable = mongoose.model('consumeable', ConsumeableSchema);