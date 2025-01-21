const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true, 
    },
    title: {
        type: String,
        required: true,
    },
    authors: {
        type: [String],
        default: [], 
    },
    description: {
        type: String,
        default: '', 
    },
    image: {
        type: String,
        default: '', 
    },
    infoLink: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
