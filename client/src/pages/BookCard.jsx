// BookCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';

function BookCard({ book, onDelete }) {
    return (
        <Card style={{ width: '325px', backgroundColor: '#dcf8e8' }} className='p-4'>
            {book.image && <Card.Img variant='top' src={book.image} style={{ height: 320 }} />}
            <Card.Body>
                {book.title && <Card.Title style={{ color: '#306' }}>{book.title}</Card.Title>}
                {book.authors && (
                    <Card.Text className='font-italic text-muted'>{`By: ${book.authors.join(', ')}`}</Card.Text>
                )}
                {book.description && <Card.Text>{book.description.substr(0, 100)}...</Card.Text>}
                {book.infoLink && (
                    <Card.Text>
                        <a href={book.infoLink} target='_blank' rel='noreferrer'>View Details</a>
                    </Card.Text>
                )}
                <Button variant='warning' onClick={() => onDelete(book)}>Remove</Button>
            </Card.Body>
        </Card>
    );
}

export default BookCard;
