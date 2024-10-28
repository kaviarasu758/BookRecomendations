const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true, // Ensure that each book has a unique ID
    },
    title: {
        type: String,
        required: true,
    },
    authors: {
        type: [String], // Specify the type as an array of strings
        default: [], // Default to an empty array if no authors are provided
    },
    description: {
        type: String,
        default: '', // Default to an empty string if no description is provided
    },
    image: {
        type: String,
        default: '', // Default to an empty string if no image is provided
    },
    infoLink: {
        type: String,
        default: '', // Default to an empty string if no infoLink is provided
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Create the Book model
const Book = mongoose.model('Book', bookSchema);

// Export the model
module.exports = Book;
