// // db.js
const mongoose = require('mongoose');

async function db() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks');
        console.log('Successfully connected to DB');
    } catch (error) {
        console.error('Error connecting to DB:', error);
        process.exit(1);
    }
}

module.exports = db;
