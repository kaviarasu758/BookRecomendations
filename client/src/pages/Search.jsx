//Search.jsx
import React, { useRef, useState } from 'react';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Results from '../components/Results';
import { useGlobalContext } from '../utils/GlobalContext';
import { Button, Container, Jumbotron } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './Search.css';

function Search() {
    const [, dispatch] = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const queryRef = useRef();
    const handleFetchBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false); 

    try {
        const query = queryRef.current.value.trim();
        console.log('Searching for:', query); 

        if (!query) {
            toast.error('Please enter a search term.', {
                position: toast.POSITION.TOP_CENTER
            });
            setLoading(false);
            return;
        }

        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.REACT_APP_BOOK_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('API Response:', result);

        if (!result.items || result.items.length === 0) {
            toast.info('No books found for this search.', {
                position: toast.POSITION.TOP_CENTER
            });
        } else {
            dispatch({ type: 'searchResult', payload: result.items });
        }
    } catch (err) {
        setError(true);
        console.error(err);
        toast.error('Error fetching books: ' + err.message, {
            position: toast.POSITION.TOP_CENTER
        });
    } finally {
        setLoading(false);
        queryRef.current.value = '';
        queryRef.current.focus();
    }
};

    

    if (loading) {
        return (
            <main>
                <Loading />
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <Error />
            </main>
        );
    }

    return (
        <>
            <Jumbotron fluid className='jumbotron'>
                <Container className='d-flex flex-column justify-content-center align-items-center'>
                    <h1 className='Search-title bg-light p-1 mt-5'>Discover the Book of Your Interests</h1>
                    <form onSubmit={handleFetchBook}>
                        <label htmlFor='query' />
                        <input
                            className='Search-input'
                            required
                            id='query'
                            name='query'
                            ref={queryRef}
                            placeholder='Enter a Book or Author name ... '
                            type='text'
                        />
                        <Button size='sm' type='submit'>
                            Search
                        </Button>
                    </form>
                </Container>
            </Jumbotron>

            <Results />
        </>
    );
}

export default Search;
