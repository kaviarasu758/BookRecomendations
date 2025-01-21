
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { AiFillHome } from 'react-icons/ai';
import { BsBookmarks } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { MdContactMail } from 'react-icons/md';
import { FaStar } from 'react-icons/fa'; 

function Footer({ userEmail }) {
    const history = useHistory();

    const handleLogout = () => {
        alert('Logout successful');
        history.push('/');
    };

    return (
        <footer>
            <Navbar bg='dark' fixed='bottom' className='Footer justify-content-around'>
                <div>
                    <Link to='/bestsellers' className='pl-2'>
                        <AiFillHome size={22} style={{ fill: '#1c0' }} />
                    </Link>
                    <Link to='/save' className='px-2'>
                        <BsBookmarks size={20} style={{ fill: '#fb2' }} />
                    </Link>
                    <Link to='/bestsellers' className='px-2'>
                        <FaStar size={22} style={{ fill: '#ffd700' }} /> {/* Best Sellers Icon */}
                    </Link>
                    <span className='px-2' onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        <FiLogOut size={22} style={{ fill: '#f44' }} />
                    </span>
                    <Link to='/contact' className='px-2'>
                        <MdContactMail size={22} style={{ fill: '#0af' }} />
                    </Link>
                </div>

                {userEmail && (
                    <div className='text-white'>
                        <FaUserCircle size={20} style={{ marginRight: 5 }} />
                        {userEmail}
                    </div>
                )}
            </Navbar>
        </footer>
    );
}

export default Footer;
