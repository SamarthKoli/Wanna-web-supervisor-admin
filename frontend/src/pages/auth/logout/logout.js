import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { auth } from '../../../firebase/firebaseConfig'; // Import Firebase auth configuration
import { signOut } from 'firebase/auth'; // Import Firebase signOut method
import './logout.css'; // Import the CSS file

const LogoutPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogout = async () => {
        setLoading(true);
        setError('');

        try {
            // Firebase logout
            await signOut(auth);

            // Remove the token from localStorage after logout
            localStorage.removeItem("token"); 

            // Redirect to the login page after successful logout
            navigate('/login'); 
        } catch (error) {
            setError('Logout failed. Please try again.');
            console.error('Logout Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="logout-container">
            <div className="logout-wrapper">
                <h2 className="heading">Logout</h2>
                <p className="message">Are you sure you want to log out?</p>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="logout-actions">
                    {/* Logout Button */}
                    <button
                        className="button logout-btn"
                        onClick={handleLogout}
                        disabled={loading}
                    >
                        {loading ? 'Logging out...' : 'Logout'}
                    </button>
                    
                    {/* Cancel Button */}
                    <button
                        className="button cancel-btn"
                        onClick={() => navigate('/dashboard')} // Redirect back to the dashboard if user cancels
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutPage;
