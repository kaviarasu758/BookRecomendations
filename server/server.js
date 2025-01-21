// //server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const http = require('http');
const Sio = require('socket.io');

const routes = require('./routes');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');  
const Book = require('./models/Book');
require('./config/db')();

const app = express();
const server = http.createServer(app);
const io = Sio(server);

const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route setup
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes); 
app.use(routes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

// Function to send email with saved books
async function sendEmail(recipient, books) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, 
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipient,
            subject: 'Your Saved Books',
            text: `Here are your saved books:\n\n${books.map(book => `${book.title} by ${book.authors.join(', ')}`).join('\n')}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Socket.io connection setup
io.on('connection', socket => {
    console.log('A user connected, socket.id:', socket.id);
    socket.emit("your id", socket.id);
    
    // Listen for "save book" event and broadcast "saved book title" event
    socket.on('save book', title => {
        io.emit('saved book title', title);
    });
});

// Endpoint to send email with saved books
app.post('/api/send-email', async (req, res) => {
    const { userEmail, books } = req.body; 
    try {
        await sendEmail(userEmail, books);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email' });
    }
});

// Endpoint to fetch book recommendations
app.get('/api/recommendations', async (req, res) => {
    const { searchTerm } = req.query;
    try {
        const savedBooks = await Book.find();
        const authors = savedBooks.flatMap(book => book.authors);

        if (savedBooks.length === 0) {
            return res.json([]);
        }

        const recommendedBooks = await Book.find({
            $or: [
                { authors: { $in: authors } },
                { title: { $regex: new RegExp(searchTerm, 'i') } }
            ],
            _id: { $nin: savedBooks.map(book => book._id) }
        }).limit(5);

        res.json(recommendedBooks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}. http://localhost:${PORT}`);
});

