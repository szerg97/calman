const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    consumeable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'consumeable'
    },
    day: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'day'
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Meal = mongoose.model('meal', MealSchema);