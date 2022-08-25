const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator');
const Food = require('../models/Food');

// @route   GET api/food
// @desc    Get all foods
// @access  public
router.get('/', async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        console.error(err.messcarbohydrate);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/food/:name
// @desc    Get one food by name
// @access  public
router.get('/:name', async (req, res) => {
    try {
        const food = await Food.findOne({name: req.params.name});
        res.json(food);
    } catch (err) {
        console.error(err.messcarbohydrate);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/food
// @desc    Create or update food
// @access  Private
router.post('/', [auth, [
    check('name', 'Name is required').not().isEmpty(),
    check('calorie', 'Calorie is required').not().isEmpty(),
    check('carbohydrate', 'Carbohydrate is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        name,
        calorie,
        carbohydrate
    } = req.body;

    const foodFields = {};
    if(name) foodFields.name = name;
    if(calorie) foodFields.calorie = calorie;
    if(carbohydrate) foodFields.carbohydrate = carbohydrate;

    try {
        let food = await Food.findOne({name: req.name});

        if(food){
            //Update
            food = await Food.findOneAndUpdate(
                {name: req.name}, 
                {$set: foodFields}, 
                {new: true}
            );

            return res.json(food);
        }

        //Create
        food = new Food(foodFields);

        await food.save();
        res.json(food);
        
    } catch (err) {
        console.error(err.messcarbohydrate);
        res.status(500).send('Server Error');
    }

});

// @route   DELETE api/food
// @desc    Delete food
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        //Remove food
        await Food.findOneAndRemove({name: req.name});
        res.json({msg: 'Food deleted'}); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;