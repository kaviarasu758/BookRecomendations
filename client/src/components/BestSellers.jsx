import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import BookCard from '../pages/BookCard';

function TopRatedBooks() {
    const [topRatedBooks, setTopRatedBooks] = useState([]);

    useEffect(() => {
        async function fetchTopRatedBooks() {
            try {
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=10&key=AIzaSyBrUERf8QOfwiiXD7ppYKKIm7_5Mcgdj4Y`);
                if (!response.ok) throw new Error('Failed to fetch top-rated books');
                const data = await response.json();
                setTopRatedBooks(data.items || []);
            } catch (error) {
                console.error('Error fetching top-rated books:', error);
                toast.error('Error fetching top-rated books', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }
        fetchTopRatedBooks();
    }, []);

    const handleSaveBook = (book) => {
        console.log('Saving book:', book);
        toast.success('Book saved!', { position: toast.POSITION.TOP_CENTER });
    };

    return (
        <Container className="my-5">
            <h3 className="text-center my-4" style={{ color: '#ffd700' }}>Top Rated Books</h3>
            <Row>
                {topRatedBooks.length > 0 ? (
                    topRatedBooks.map((book) => (
                        <Col key={book.id} sm={6} md={4} lg={3} className="my-3">
                            <BookCard
                                book={{
                                    id: book.id,
                                    title: book.volumeInfo.title,
                                    authors: book.volumeInfo.authors,
                                    description: book.volumeInfo.description,
                                    image: book.volumeInfo.imageLinks?.thumbnail,
                                    infoLink: book.volumeInfo.infoLink,
                                }}
                                onSave={() => handleSaveBook(book.volumeInfo)}
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

export default TopRatedBooks;
