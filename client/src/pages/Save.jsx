// Save.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import BookCard from './BookCard';

function Save() {
    const [savedBooks, setSavedBooks] = useState([]);
    const [savedBooksCount, setSavedBooksCount] = useState(0); // State for saved books count

    useEffect(() => {
        async function getSavedBooks() {
            try {
                const response = await fetch('http://localhost:3000/api/books');
                if (!response.ok) {
                    throw new Error('Failed to fetch saved books');
                }
                const json = await response.json();
                setSavedBooks(json.data);
                setSavedBooksCount(json.data.length); // Update count based on fetched data
            } catch (err) {
                console.error(err);
                toast.error('Error getting saved books', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }
        getSavedBooks();
    }, []);

    const handleDeleteBook = async (book) => {
        try {
            const response = await fetch(`http://localhost:3000/api/books/${book.id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'DELETE',
            });
            
            const json = await response.json();
            console.log(json);
            console.log("Deleting book with _id:", book._id);

            if (json.success) {
                setSavedBooks(savedBooks.filter(b => b._id !== book._id));
                setSavedBooksCount(savedBooksCount - 1); // Update count after deletion
                toast.success('The book has been removed successfully!', {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                toast.error('Error removing book', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error('Error removing book', {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    const sendEmail = async () => {
        try {
            const userEmail = "kesavaprabhal.22cse@kongu.edu"; // Replace with the actual logged-in user's email
            const response = await fetch('http://localhost:3000/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail, books: savedBooks }),
            });

            if (!response.ok) throw new Error('Failed to send email');

            toast.success('Email sent successfully!', { position: toast.POSITION.TOP_CENTER });
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Error sending email', { position: toast.POSITION.TOP_CENTER });
        }
    };

    const handleShare = (book) => {
        const subject = `Sharing Book Details: ${book.title}`;
        const body = `Check out this book:\n\nTitle: ${book.title}\nAuthor: ${book.author}\nDescription: ${book.description}\n\n---`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open the Gmail compose link in a new tab
        window.open(gmailUrl, '_blank');
    };

    return (
        <Container fluid className='my-5 p-3 ml-5'>
            <Row className='mx-auto'>
                <h3 className='px-3 mx-5 font-weight-bold' style={{ color: '#fb2' }}>
                    Saved Books
                </h3>
                <button onClick={sendEmail} className="ml-3 btn btn-primary">Send Saved Books to Email</button>
            </Row>
            
            {/* Display the count of saved books */}
            <Row className='mx-auto'>
                <p className="px-3 mx-5">
                    You have Saved : <strong>{savedBooksCount} books</strong>
                </p>
            </Row>

            <Row className='ml-5'>
                {savedBooks.length > 0 ? (
                    savedBooks.map((book) => (
                        <Col key={book.id} className='my-3'>
                            <BookCard book={book} onDelete={handleDeleteBook} />
                            <button
                                onClick={() => handleShare(book)}
                                className="ml-3 btn btn-primary"
                            >
                                Share via Email
                            </button>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <h5>No saved books found.</h5>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default Save;
