const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// ********* require USER model in order to use it *********
const User = require("../models/User.model");

// ********* require isAuthenticated in order to use it and protect routes *********
const { isAuthenticated } = require("../middleware/jwt.middleware")

const saltRounds = 10;

// POST SIGNUP PAGE /auth/signup
router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body;

    if (username === '' || password === '' || email === '') {
        res.status(400).json({ message: "Please provide username, password and email address" });
        return;
    }
    
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 8 characters and contain at least one number, one lowercase and one uppercase letter' });
        return;
    }

    User.findOne({ email })
        .then((foundUser) => {
            if (foundUser) {
            res.status(400).json({ message: "Unable to create an account with this email address. Please provide a different email address." });
            return;
            }
        });
   
    User.findOne({ username })
        .then((foundUser) => {
            if (foundUser) {
            res.status(400).json({ message: "User already exists. Please provide a different username" });
            return;
            }
   
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
    
        return User.create({ username, password: hashedPassword, email });
        })
        .then((createdUser) => {
            const { username, email, _id } = createdUser;
      
            const newUser = { username, email, _id };

            res.status(201).json({ user: newUser });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" })
        });
  });

//POST LOGIN PAGE /auth/login
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.status(400).json({ message: "Provide an email address and password" });
        return;
    }

    User.findOne({ email })
        .then((foundUser) => {
      
            if (!foundUser) {
            res.status(401).json({ message: "User not found" })
            return;
            }
   
            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
   
            if (passwordCorrect) {
                const { username, email, _id } = foundUser;
          
                const payload = { username, email, _id };

            const authToken = jwt.sign( 
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: "6h" }
            );

            res.status(200).json({ authToken: authToken });
            }
            else {
                res.status(401).json({ message: "Unable to authenticate user" });
            }
   
        })
        .catch(err => res.status(500).json({ message: "Internal Server Error" }));
  });

// GET VERIFY PAGE /auth/verify
router.get('/verify', isAuthenticated, (req, res, next) => {
    res.status(200).json(req.payload);
  });

  module.exports = router;