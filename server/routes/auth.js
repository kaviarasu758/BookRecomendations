// // auth.js
// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Adjust the path based on your project structure
// const router = express.Router();

// // User registration route
// router.post('/signup', async (req, res) => {
//     const { email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//         return res.status(400).json({ success: false, message: 'User already exists' });
//     }

//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const newUser = await User.create({
//             email,
//             password: hashedPassword,
//         });

//         // Generate a token (optional)
//         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.status(201).json({ success: true, data: newUser, token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error creating user' });
//     }
// });



// // User login route
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Find the user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ success: false, message: 'Invalid email or password' });
//         }

//         // Compare the password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ success: false, message: 'Invalid email or password' });
//         }

//         // Generate a token (optional)
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.status(200).json({ success: true, data: user, token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'An error occurred during login' });
//     }
// });


// router.delete('/books/:id', async (req, res) => {
//     try {
//         const bookId = req.params.id;
//         await Book.findByIdAndDelete(bookId);
//         res.status(200).json({ success: true, message: 'Book deleted' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error deleting book' });
//     }
// });


// module.exports = router;


const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path based on your project structure
const router = express.Router();

// User registration route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received signup request for:', email);  // Debug log

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);  // Debug log
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');  // Debug log

        // Create a new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
        });
        console.log('User created successfully:', newUser);  // Debug log

        // Generate a token (using a default value if JWT_SECRET is not set)
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET || 'defaultSecretForTesting', // Use a hardcoded secret for testing if not in environment
            { expiresIn: '1h' }
        );

        res.status(201).json({ success: true, data: newUser, token });
    } catch (error) {
        console.error('Error during user signup:', error);  // Debug log
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received login request for:', email);  // Debug log

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid email or password');  // Debug log
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid email or password');  // Debug log
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate a token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'defaultSecretForTesting',
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, data: user, token });
    } catch (error) {
        console.error('Error during login:', error);  // Debug log
        res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
});

module.exports = router;
