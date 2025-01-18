const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware")

const saltRounds = 10;

// POST SIGNUP PAGE /auth/signup
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide username, password, and email address."});
    }

    // Validate password strength
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must have at least 8 characters and contain at least one number, one lowercase and one uppercase letter."});
    }

    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Unable to create an account with this email address. Please provide a different email address."})
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "Unable to create an account with this username. Please provide a different username."})
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const createdUser = await User.create({ username, email, password: hashedPassword });

        const { username: createdUsername, email: createdEmail, _id } = createdUser;
        const newUser = { username: createdUsername, email: createdEmail, _id };

        res.status(201).json({ user: newUser });
    }  catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error."});
    }
  });

//POST LOGIN PAGE /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.status(400).json({ message: "Provide an email address and password." });
        return;
    }

    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(401).json({ message: "User not found" })
        }

        const passwordCorrect = await bcrypt.compare(password, foundUser.password);
        if (!passwordCorrect) {
            return res.status(401).json({ message: "Unable to authenticate user" });
        }

        const { username, email: foundUserEmail, _id } = foundUser;
        const payload = { username, email: foundUserEmail, _id };
        
        const authToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: "6h" }
        );

        res.status(200).json({ authToken });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error." })
    }
  });

// GET VERIFY PAGE /auth/verify
router.get('/verify', isAuthenticated, (req, res) => {
    res.status(200).json(req.payload);
  });

  module.exports = router;