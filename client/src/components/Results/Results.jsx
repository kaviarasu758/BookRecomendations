// import React, { useEffect , useState} from 'react';
// import { useGlobalContext } from '../../utils/GlobalContext';
// import { Button, Container, Col, Row, Card } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import io from 'socket.io-client';

// let socket;

// function Results() {
//     const [{ books }] = useGlobalContext(); // Destructure to get books

//     // Set up socket instance and connection
//     useEffect(() => {
//         socket = io('http://localhost:3000'); // Ensure this URL matches your server setup

//         socket.on('connect', () => {
//             console.log('Connected to the socket server');
//         });

//         socket.on('saved book title', title => {
//             toast.success(`Saved a book titled ${title}`, {
//                 position: toast.POSITION.TOP_CENTER,
//             });
//         });

//         socket.on('connect_error', err => {
//             console.error('Socket connection error:', err);
//         });

//         return () => {
//             socket.disconnect(); // Clean up on unmount
//         };
//     }, []);

//     const handleSaveBook = async (book) => {
//         try {
//             const response = await fetch('http://localhost:3000/api/books', {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 method: 'POST',
//                 body: JSON.stringify({
//                     id: book.id,
//                     title: book.volumeInfo.title,
//                     authors: book.volumeInfo.authors,
//                     description: book.volumeInfo.description,
//                     infoLink: book.volumeInfo.infoLink,
//                     image: book.volumeInfo.imageLinks?.thumbnail,
//                 }),
//             });

//             if (!response.ok) {
//                 const errorJson = await response.json();
//                 throw new Error(errorJson.message || 'Error saving the book');
//             }

//             const json = await response.json();

//             if (json.success) {
//                 socket.emit('save book', json.data.title);
//             } else {
//                 toast.warning('This book is already saved!', {
//                     position: toast.POSITION.TOP_CENTER,
//                 });
//             }
//         } catch (error) {
//             console.error('Error saving book:', error);
//             toast.error('Error saving book: ' + error.message, {
//                 position: toast.POSITION.TOP_CENTER,
//             });
//         }
//     };

//     return (
//         <Container className='my-5 p-3'>
//             <Row className='mx-5'>
//                 {books && books.map((book, index) => (
//                     <Col key={index} className='mb-4'>
//                         <Card style={{ width: '300px', height: '700px', backgroundColor: '#deeaf7' }} className='p-4'>
//                             {book.volumeInfo.imageLinks && (
//                                 <Card.Img
//                                     variant='top'
//                                     src={book.volumeInfo.imageLinks.thumbnail}
//                                     style={{ height: 320 }}
//                                 />
//                             )}
//                             <Card.Body>
//                                 <Card.Title>{book.volumeInfo.title}</Card.Title>
//                                 {book.volumeInfo.authors && (
//                                     <Card.Title className='font-italic text-muted' style={{ fontSize: '1.1rem' }}>
//                                         By: {book.volumeInfo.authors.join(', ')}
//                                     </Card.Title>
//                                 )}
//                                 {book.volumeInfo.description && (
//                                     <Card.Text>{book.volumeInfo.description.substr(0, 100)}</Card.Text>
//                                 )}
//                                 {book.volumeInfo.infoLink && (
//                                     <Card.Text>
//                                         <a href={book.volumeInfo.infoLink} target='_blank' rel='noreferrer'>
//                                             View Details
//                                         </a>
//                                     </Card.Text>
//                                 )}
//                                 <div className='mt-4'>
//                                     <Button size='sm' variant='warning' onClick={() => handleSaveBook(book)}>
//                                         Save Book
//                                     </Button>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 ))}
//             </Row>
//         </Container>
//     );
// }

// export default Results;



import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../utils/GlobalContext';
import { Button, Container, Col, Row, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

let socket;

function Results() {
    const [{ books }] = useGlobalContext(); // Destructure to get books
    const [recommendedBooks, setRecommendedBooks] = useState([]); // State for recommendations

    // Set up socket instance and connection
    useEffect(() => {
        socket = io('http://localhost:3000'); // Ensure this URL matches your server setup

        socket.on('connect', () => {
            console.log('Connected to the socket server');
        });

        socket.on('saved book title', title => {
            toast.success(`Saved a book titled ${title}`, {
                position: toast.POSITION.TOP_CENTER,
            });
        });

        socket.on('connect_error', err => {
            console.error('Socket connection error:', err);
        });

        return () => {
            socket.disconnect(); // Clean up on unmount
        };
    }, []);

    // Function to fetch recommendations
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // const searchTerm = "F. Scott Fitzgerald"; // Use a relevant term
                const response = await fetch('http://localhost:3000/api/recommendations');
                if (response.ok) {
                    const data = await response.json();
                    setRecommendedBooks(data);
                } else {
                    console.warn('Failed to fetch recommendations:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };
    
        fetchRecommendations();
    }, []); // The empty array ensures this runs only once on mount
    

    const handleSaveBook = async (book) => {
        try {
            const response = await fetch('http://localhost:3000/api/books', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    id: book.id,
                    title: book.volumeInfo.title,
                    authors: book.volumeInfo.authors,
                    description: book.volumeInfo.description,
                    infoLink: book.volumeInfo.infoLink,
                    image: book.volumeInfo.imageLinks?.thumbnail,
                }),
            });

            if (!response.ok) {
                const errorJson = await response.json();
                throw new Error(errorJson.message || 'Error saving the book');
            }

            const json = await response.json();

            if (json.success) {
                socket.emit('save book', json.data.title);
            } else {
                toast.warning('This book is already saved!', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        } catch (error) {
            console.error('Error saving book:', error);
            toast.error('Error saving book: ' + error.message, {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };
    return (
        <Container className='my-5 p-3'>
            <Row className='mx-5'>
                {books && books.map((book, index) => (
                    <Col key={index} className='mb-4'>
                        <Card style={{ width: '300px', height: '700px', backgroundColor: '#deeaf7' }} className='p-4'>
                            {book.volumeInfo.imageLinks && (
                                <Card.Img
                                    variant='top'
                                    src={book.volumeInfo.imageLinks.thumbnail}
                                    style={{ height: 320 }}
                                />
                            )}
                            <Card.Body>
                                <Card.Title>{book.volumeInfo.title}</Card.Title>
                                {book.volumeInfo.authors && (
                                    <Card.Title className='font-italic text-muted' style={{ fontSize: '1.1rem' }}>
                                        By: {book.volumeInfo.authors.join(', ')}
                                    </Card.Title>
                                )}
                                {book.volumeInfo.description && (
                                    <Card.Text>{book.volumeInfo.description.substr(0, 100)}</Card.Text>
                                )}
                                {book.volumeInfo.infoLink && (
                                    <Card.Text>
                                        <a href={book.volumeInfo.infoLink} target='_blank' rel='noreferrer'>
                                            View Details
                                        </a>
                                    </Card.Text>
                                )}
                                <div className='mt-4'>
                                    <Button size='sm' variant='warning' onClick={() => handleSaveBook(book)}>
                                        Save Book
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
    
            {/* Recommendations Section */}
            <h3 className='my-5'>You May Also Like</h3>
            <Row className='mx-5'>
                {recommendedBooks.length > 0 ? (
                    recommendedBooks.map((book, index) => (
                        <Col key={index} className='mb-4'>
                            <Card style={{ width: '300px', height: '700px', backgroundColor: '#deeaf7' }} className='p-4'>
                                {book.image ? (
                                    <Card.Img variant='top' src={book.image} style={{ height: 320 }} />
                                ) : (
                                    <Card.Img variant='top' src='default-thumbnail.jpg' style={{ height: 320 }} />
                                )}
                                <Card.Body>
                                    <Card.Title>{book.title || 'Untitled'}</Card.Title>
                                    {book.authors && (
                                        <Card.Text className='font-italic text-muted'>
                                            By: {book.authors.join(', ')}
                                        </Card.Text>
                                    )}
                                    {book.infoLink && (
                                        <Card.Text>
                                            <a href={book.infoLink} target='_blank' rel='noreferrer'>
                                                View Details
                                            </a>
                                        </Card.Text>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No recommendations available.</p>
                )}
            </Row>
        </Container>
    );
    

}
export default Results;
