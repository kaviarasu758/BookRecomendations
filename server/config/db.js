// db.js
const mongoose = require('mongoose');

async function db() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Successfully connected to DB');
    } catch (error) {
        console.error('Error connecting to DB:', error);
    }
}

module.exports = db;
