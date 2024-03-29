const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');


const {signout,signup, signin, isSignedIn, isAuthenticated} = require('../controllers/auth');

router.post('/signup',[
    check('name','name should be at least 3 char').isLength({min:3}),
    check('email','Email is required').isEmail(),
    check('password','password should be least 3 char').isLength({min:3}),
], signup);

router.post('/signin',[
    check('email','Email is required').isEmail(),
    check('password','password is required').isLength({min:1}),
], signin);

router.get('/signout', signout);

router.get('/testroute', isSignedIn, (req,res) => {
    res.json(req.auth);
})


module.exports = router;