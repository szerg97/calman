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
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/days/:name
// @desc    Get one day
// @access  Private
router.get('/:name', auth, async (req, res) => {
    try {
        const day = await Day.findOne({name: req.params.name});
        res.json(day);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/days/:name
// @desc    Delete one day
// @access  Private
router.delete('/:name', auth, async (req, res) => {
    try {
        await Day.findOneAndRemove({name: req.params.name});
        res.json({msg: 'Day deleted'});
    } catch (err) {
        console.error(err.message);
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
        calorie: (quantity / 100 * foode.calorie),
        carbohydrate: (quantity / 100 * foode.carbohydrate)
    };

    try {
        const day = await Day.findOne({
            user: req.user.id,
            name: new Date().toISOString().split('T')[0]
        });
        const meal = day.meals.find(x => x.type === type);
        meal.consumed.unshift(newCons);
        const vals = updateValues(meal.consumed);
        meal.calorieTotal = vals[0];
        meal.carbohydrateTotal = vals[1];
        await day.save();
        res.json(day);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/days/meals/:type/consumed/:id
// @desc    Delete consumed from meal
// @access  Private
router.put('/meals/:type/consumed/:id', [auth, [
    check('type', 'Type is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const type = req.params.type;
    const id = req.params.id;

    try {
        
        const day = await Day.findOne({
            user: req.user.id,
            name: new Date().toISOString().split('T')[0]
        });
        const meal = day.meals.find(x => x.type === type);

        meal.consumed.shift({id: id});
        const vals = updateValues(meal.consumed);
        meal.calorieTotal = vals[0];
        meal.carbohydrateTotal = vals[1];
        await day.save();
        res.json(day);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const updateValues = (consumed) => {
    let calorieSum = 0;
    consumed.forEach(x => {calorieSum += x.calorie});
    let carboSum = 0;
    consumed.forEach(x => {carboSum += x.carbohydrate});
    return [calorieSum, carboSum];
}

module.exports = router;