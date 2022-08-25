const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    meals: [
        {
            type: {
                type: String,
                required: true
            },
            consumed: [
                {
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
                }
            ],
            calorieTotal: {
                type: Number,
                default: 0
            },
            carbohydrateTotal: {
                type: Number,
                default: 0
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Day = mongoose.model('day', DaySchema);