// // db.js
// const mongoose = require('mongoose');

// async function db() {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useFindAndModify: false,
//             useCreateIndex: true
//         });
//         console.log('Successfully connected to DB');
//     } catch (error) {
//         console.error('Error connecting to DB:', error);
//     }
// }

// module.exports = db;



const mongoose = require('mongoose');

async function db() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks');
        console.log('Successfully connected to DB');
    } catch (error) {
        console.error('Error connecting to DB:', error);
        process.exit(1); // Exit the application if the connection fails
    }
}

module.exports = db;
