import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import PasswordStrengthBar from 'react-password-strength-bar';
import './Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { email, password, name } = formData;

            // 1. Create the user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Send verification email
            await sendEmailVerification(user);

            // 3. Sync the data to MongoDB - URL updated to match backend mount
            const response = await fetch("http://localhost:3000/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    firebaseUid: user.uid // Backend defaults to 'supervisor' & 'isApproved: false'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to sync with database");
            }

            alert('Signup successful! Please check your email for a verification link. An Admin must approve your account before you can log in.');
            navigate('/login');  

        } catch (err) {
            if (err.code === 'auth/weak-password') {
                setError('The password is too weak.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered.');
            } else {
                setError(err.message);
            }
            console.error("Signup Error:", err.message);
        } finally {
            setLoading(false);
            setFormData({ name: '', email: '', password: '' });
        }
    };

    return (
        <div className="signup-container">
            <div className="image-section">
                <img src={require("../../../assets/Signup.png")} 
                    alt="Background" 
                    className="Signup-image" />
            </div>
            <div className="form-section">
                <h2 className="heading">Supervisor Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="label">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="label">Work Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className="input"
                            required
                        />
                        <PasswordStrengthBar password={formData.password} style={{ marginTop: '10px' }} />
                    </div>
                    {error && <div className="error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                    <button type="submit" className="button" disabled={loading}>
                        {loading ? 'Processing...' : 'Register as Supervisor'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;