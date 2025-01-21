import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import BestSellerBookCard from './BestSellerBookCard'; // Import the new BestSellerBookCard

function BestSeller() {
    const [topRatedBooks, setTopRatedBooks] = useState([]);

    useEffect(() => {
        async function fetchTopRatedBooks() {
            try {
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=10&key=AIzaSyBrUERf8QOfwiiXD7ppYKKIm7_5Mcgdj4Y`);
                if (!response.ok) throw new Error('Failed to fetch top-rated books');
                const data = await response.json();
                setTopRatedBooks(data.items || []);
            } catch (error) {
                console.error(' Error fetching top-rated books:', error);
                toast.error('Error fetching top-rated books', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }
        fetchTopRatedBooks();
    }, []);

    const handleSaveBook = async (book) => {
        try {
            // Assuming you have a backend API to save books
            const response = await fetch('http://localhost:3000/api/save-book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book),
            });

            if (!response.ok) throw new Error('Failed to save the book');
            toast.success('Book saved!', { position: toast.POSITION.TOP_CENTER });
        } catch (error) {
            console.error('Error saving book:', error);
            toast.error('Error saving book', { position: toast.POSITION.TOP_CENTER });
        }
    };

    return (
        <Container className="my-5">
            <h3 className="text-center my-4" style={{ color: '#ffd700' }}>Top Rated Books</h3>
            <Row>
                {topRatedBooks.length > 0 ? (
                    topRatedBooks.map((book) => (
                        <Col key={book.id} sm={6} md={4} lg={3} className="my-3">
                            <BestSellerBookCard
                                book={{
                                    id: book.id,
                                    title: book.volumeInfo.title,
                                    authors: book.volumeInfo.authors,
                                    description: book.volumeInfo.description,
                                    image: book.volumeInfo.imageLinks?.thumbnail,
                                    infoLink: book.volumeInfo.infoLink,
                                }}
                                onSave={handleSaveBook}
                            />
                        </Col>
                    ))
                ) : (
                    <Col className="text-center">
                        <h5>No top-rated books available.</h5>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default BestSeller;
