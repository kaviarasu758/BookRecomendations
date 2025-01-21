// routes/contact.js
const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();
router.post('/contact', async (req, res) => {
    const { name, email, comment } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            comment
        });

        await newContact.save(); 
        res.status(201).json({ message: 'Contact form submitted successfully!' });
    } catch (error) {
        console.error('Error saving contact form:', error);
        res.status(500).json({ message: 'Error saving contact form data.' });
    }
});

module.exports = router;
