const {User} = require('../Models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  if(req.body.password !== req.body.confirmPassword)
    return res.status(400).send("password do not matches");

  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send("user already exists");

  user = new User({
  	firstName: req.body.firstName,
  	lastName: req.body.lastName||null,
    email: req.body.email,
  	password: req.body.password
  });

   const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.send(user);
});

function validate(user){
   const schema = {
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50),
    email: Joi.string().max(50).required(),
    password: Joi.string().min(8).max(250).required(),
    confirmPassword: Joi.string().required()
  };

  return Joi.validate(user, schema);
}


module.exports = router;