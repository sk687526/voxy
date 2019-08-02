const bcrypt = require('bcrypt');
const {User} = require('../Models/User');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
router.post('/', async (req, res) => {
	
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send("invalid email or password");
  
  console.log(req.body.password);
  console.log(user);
  const validUser= await bcrypt.compare(req.body.password, user.password);
  if(!validUser) return res.status(400).send("invalid email or password");
  console.log(validUser);
  res.send(user);
});

function validate(user){
   const schema = {
    email: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(3).max(250).required()
  };

  return Joi.validate(user, schema);
}

module.exports = router;