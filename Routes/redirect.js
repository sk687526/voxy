const express = require('express');
var jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/successLogin', (req, res) => {
	var payload = {
            firstName: req.user.firstName,
        lastName: req.user.lastName
        };
        var secret = req.user.email;
     const token = jwt.sign(payload, secret, { expiresIn: '1h' });
     req.user.token = token;
	  console.log("success");
 res.send(req.user);
});

router.get('/failureLogin', (req, res) => {
	console.log("failure");
 res.send("failure");
});

router.get('/successRegister', (req, res) => {
	var payload = {
            firstName: req.user.firstName,
        lastName: req.user.lastName
        };
        var secret = req.user.email;
     const token = jwt.sign(payload, secret, { expiresIn: '1h' });
	
	res.send({
		id: req.user._id,
		firstName: req.user.firstName,
		lastName: req.user.lastName,
		email: req.user.email,
		password: req.user.password,
		accessToken: token
	});
});

router.get('/failureRegister', (req, res) => {
	console.log("failure");
	res.send("failure");
});

module.exports = router;