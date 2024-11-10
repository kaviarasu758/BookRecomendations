import React, { useState } from 'react';
import axios from 'axios';

function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        comment: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the form data to the backend
            const response = await axios.post('http://localhost:3000/api/contact', formData);

            // Check if the request was successful
            if (response.status === 201) {
                setStatus('Form submitted successfully!');
                setFormData({
                    name: '',
                    email: '',
                    comment: ''
                });
            } else {
                setStatus('Failed to submit form. Please try again later.');
            }
        } catch (error) {
            setStatus('Error while submitting the form. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="comment">Comment</label>
                    <textarea
                        id="comment"
                        name="comment"
                        className="form-control"
                        rows="4"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send</button>
            </form>
            {status && <p className="mt-3">{status}</p>}
        </div>
    );
}

export default ContactUs;
