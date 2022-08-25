const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator');
const Day = require('../models/Day');
const User = require('../models/User');
const Food = require('../models/Food');

// @route   POST api/days
// @desc    Create or update user's day
// @access  Private
router.post('/', auth, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const name = req.body.name;

    const dayFields = {};
    dayFields.user = req.user.id;
    if(name){dayFields.name = name;}
    else{dayFields.name = new Date().toISOString().split('T')[0];}

    try {
        let day = null;

        if(name) {
            day = await Day.findOne({name: name, user: req.user.id});
        }

        if(day){
            //Update
            day = await Day.findOneAndUpdate(
                {user: req.user.id}, 
                {$set: dayFields}, 
                {new: true}
            );

            return res.json(day);
        }

        //Create
        day = new Day(dayFields);

        await day.save();
        res.json(day);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route   GET api/days
// @desc    Get all days
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const days = await Day.find();
        res.json(days);
    } catch (err) {
        console.error(err.messcarbohydrate);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/days/meals
// @desc    Add day meal
// @access  Private
router.put('/meals', [auth, [
    check('type', 'Type is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        type
    } = req.body;

    const newMeal = {
        type,
    };

    try {
        const day = await Day.findOne({
            user: req.user.id,
            name: new Date().toISOString().split('T')[0]
        });
        day.meals.unshift(newMeal);
        await day.save();
        res.json(day);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/days/meals/:type/consumed
// @desc    Add consumed to meal
// @access  Private
router.put('/meals/:type/consumed', [auth, [
    check('type', 'Type is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const type = req.params.type;

    const {
        food,
        quantity
    } = req.body;

    const foode = await Food.findById(food);

    const newCons = {
        food: foode,
        quantity,
        calorie: (100 / quantity * foode.calorie),
        carbohydrate: (100 / quantity * foode.carbohydrate)
    };

    try {
        const day = await Day.findOne({
            user: req.user.id,
            name: new Date().toISOString().split('T')[0]
        });
        const meal = day.meals.find(x => x.type === type);
        meal.consumed.unshift(newCons);
        meal.calorieTotal = meal.calorieTotal + newCons.calorie;
        meal.carbohydrateTotal = meal.carbohydrateTotal + newCons.carbohydrate;
        await day.save();
        res.json(day);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;