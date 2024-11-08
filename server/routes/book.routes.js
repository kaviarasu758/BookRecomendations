
const router = require('express').Router();
const { Book } = require('../models');

// Route to get all books
router
    .route('/')
    .get(async (req, res) => {
        try {
            const data = await Book.find({});
            res.json({ success: true, data });
        } catch (e) {
            console.error(e);
            res.status(500).json({ success: false, message: 'Error fetching books' });
        }
    })
    .post(async (req, res) => {
        console.log('Request Body:', req.body); // Log incoming request body for debugging
        try {
            const existingBook = await Book.findOne({ id: req.body.id });
            if (existingBook) {
                return res.status(400).json({ message: 'This book is already saved' });
            }
            const newBook = await Book.create(req.body);
            res.status(201).json({ success: true, data: newBook });
        } catch (e) {
            console.error(e);
            res.status(500).json({ success: false, message: 'Error saving book' });
        }
    });

// Route to delete a book by ID
router.route('/:id').delete(async (req, res) => {
    try {
        const deletedBook = await Book.findOneAndDelete({ id: req.params.id });
        if (deletedBook) {
            return res.json({ success: true, data: deletedBook });
        }
        res.status(404).json({ success: false, message: 'Book not found' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error deleting book' });
    }
});

// Route for searching books by title (case-insensitive)
router.get('/search', async (req, res) => {
    const searchQuery = req.query.q; // Get search term from query params
    try {
        const data = await Book.find({ title: { $regex: searchQuery, $options: 'i' } }); // Case-insensitive search
        res.json({ success: true, data });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: 'Error searching for books' });
    }
});

// Route to get the count of saved books
router.get('/count', async (req, res) => {
    try {
        const count = await Book.countDocuments();
        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error('Error fetching saved books count:', error);
        res.status(500).json({ success: false, message: 'Error fetching saved books count' });
    }
});

module.exports = router;
