//auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received signup request for:', email); 

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email); 
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully'); 

        const newUser = await User.create({
            email,
            password: hashedPassword,
        });
        console.log('User created successfully:', newUser); 

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET || 'defaultSecretForTesting', 
            { expiresIn: '1h' }
        );

        res.status(201).json({ success: true, data: newUser, token });
    } catch (error) {
        console.error('Error during user signup:', error); 
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received login request for:', email); 

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid email or password'); 
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid email or password');
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'defaultSecretForTesting',
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, data: user, token });
    } catch (error) {
        console.error('Error during login:', error);  
        res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
});

module.exports = router;
