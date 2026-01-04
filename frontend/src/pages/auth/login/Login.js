import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../../firebase/firebaseConfig';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail 
} from 'firebase/auth'; 
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setError('Please enter your email address first to reset your password.');
            return;
        }
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, formData.email);
            setMessage('Password reset email sent! Check your inbox.');
            setError('');
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // 1. Authenticate with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Fetch Approval and Role Status from MongoDB
            // We fetch this FIRST so we know if the user is an Admin
            const response = await fetch(`http://localhost:3000/auth/status/${user.uid}`);
            
            if (!response.ok) {
                throw new Error("Could not verify account status with server.");
            }

            const data = await response.json();

            // 3. Logic Check: Allow Admin to skip verification
            // Supervisors MUST be verified; Admins can skip it.
            const isVerified = user.emailVerified || data.role === 'admin';

            if (!isVerified) {
                setError('Please verify your email before logging in.');
                await signOut(auth);
                setLoading(false);
                return;
            }

            // 4. Validate Role and Approval
            if (data.isApproved) {
                const token = await user.getIdToken();
                localStorage.setItem('token', token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('isApproved', 'true');

                // Redirect based on role
                if (data.role === 'admin') {
                    navigate('/admin/approval'); // Matches your updated routing
                } else {
                    navigate('/supervisor/dashboard'); // Matches your updated routing
                }
            } else {
                // Not approved yet: Force logout and show message
                await signOut(auth);
                setError('Your account is awaiting Admin approval.');
            }

        } catch (err) {
            setError('Login failed: ' + err.message);
            console.error('Login Error:', err.message);
            await signOut(auth); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="image-section">
                <img 
                    src={require("../../../assets/Login.png")} 
                    alt="Background" 
                    className="full-background-image"
                />
            </div>
            <div className="form-section">
                <div className="form-wrapper">
                    <h2 className="heading">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="label">Email</label>
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
                                placeholder="Enter your password"
                                className="input"
                                required
                            />
                        </div>

                        {error && <p className="error-text" style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
                        {message && <p className="success-text" style={{ color: 'green', fontSize: '14px', marginBottom: '10px' }}>{message}</p>}

                        <button type="submit" className="button" disabled={loading}>
                            {loading ? 'Verifying...' : 'Login'}
                        </button>
                    </form>

                    <div className="login-footer" style={{ marginTop: '15px', textAlign: 'center' }}>
                        <button 
                            type="button" 
                            className="link-button" 
                            onClick={handleForgotPassword}
                            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Forgot Password?
                        </button>
                        <p style={{ marginTop: '10px' }}>
                            Don't have an account? <Link to="/register">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;