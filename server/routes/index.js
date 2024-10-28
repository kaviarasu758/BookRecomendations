const router = require('express').Router();
const books = require('./book.routes');

// Attach book routes
router.use('/api/books', books);

module.exports = router;
