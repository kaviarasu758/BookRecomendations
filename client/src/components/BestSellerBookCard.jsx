import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './BestSellerBookCard.css'; // External CSS for the flip effect

function BestSellerBookCard({ book }) {
    // Handle double-click on card to open the book details
    const handleCardDoubleClick = () => {
        if (book.infoLink) {
            window.open(book.infoLink, '_blank');
        }
    };

    return (
        <div className="card-container" onDoubleClick={handleCardDoubleClick}>
            <Card 
                className="card-flip"
                style={{
                    width: '325px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '10px', 
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                    overflow: 'hidden',
                    height: '500px'  // Fixed height to ensure enough space for card
                }} 
            >
                {/* Card Front (Book Information) */}
                <div className="card-front">
                    {/* Book Image */}
                    {book.image && (
                        <Card.Img 
                            variant='top' 
                            src={book.image} 
                            style={{
                                height: '320px', 
                                objectFit: 'cover', 
                                borderRadius: '8px', 
                                marginBottom: '15px'
                            }} 
                        />
                    )}

                    <Card.Body style={{ paddingBottom: '20px' }}>
                        {/* Book Title */}
                        {book.title && (
                            <Card.Title 
                                style={{ 
                                    color: '#2c3e50', 
                                    fontWeight: 'bold', 
                                    fontSize: '1.1rem', 
                                    marginBottom: '10px'
                                }}>
                                {book.title}
                            </Card.Title>
                        )}

                        {/* Book Author */}
                        {book.authors && (
                            <Card.Text className='font-italic text-muted' style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                                By: {book.authors.join(', ')}
                            </Card.Text>
                        )}

                        {/* Book Description */}
                        {book.description && (
                            <Card.Text 
                                style={{
                                    color: '#34495e', 
                                    fontSize: '0.85rem', 
                                    height: '80px', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    marginBottom: '15px'
                                }}>
                                {book.description}
                            </Card.Text>
                        )}
                    </Card.Body>
                </div>

                {/* Card Back (Could contain extra info or Save button) */}
                <div className="card-back">
                    <Card.Body>
                        <Button 
                            variant="outline-success" 
                            style={{
                                width: '100%', 
                                borderRadius: '20px', 
                                fontSize: '1rem', 
                                fontWeight: 'bold',
                                padding: '10px'
                            }}
                        >
                            Save Book
                        </Button>
                    </Card.Body>
                </div>
            </Card>
        </div>
    );
}

export default BestSellerBookCard;
