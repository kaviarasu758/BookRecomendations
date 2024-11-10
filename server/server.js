require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');  // Import the contact routes
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const Sio = require('socket.io');
const io = Sio(http);

// Import your Book model
const Book = require('./models/Book');

// DB connection
require('./config/db')();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes);  // Add the contact routes here
app.use(routes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

// Email sending function
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

// Socket.io connection
io.on('connection', socket => {
    console.log('A user connected, socket.id is:', socket.id);
    socket.emit("your id", socket.id);
    socket.on('save book', title => {
        io.emit('saved book title', title);
    });
});

app.post('/api/send-email', async (req, res) => {
    const { userEmail, books } = req.body; // Extract from request body
    try {
        await sendEmail(userEmail, books);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email' });
    }
});


// Recommendations endpoint
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

// Start server
http.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}. http://localhost:${PORT}`);
});
