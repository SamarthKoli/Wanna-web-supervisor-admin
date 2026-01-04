import React, { useEffect, useState } from 'react';
import './AdminApproval.css';

const AdminApproval = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            // 1. Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3000/user-management/pending', {
                method: 'GET',
                headers: {
                    // 2. Add the Authorization Header
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (Array.isArray(data)) {
                setPendingUsers(data);
            } else {
                console.error("Expected array but received:", data);
                setPendingUsers([]);
            }
        } catch (err) {
            console.error("Failed to fetch pending users:", err);
            setPendingUsers([]);
        }
    };

    const handleApprove = async (userId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:3000/user-management/approve/${userId}`, {
                method: 'PATCH',
                headers: { 
                    // 3. Add the Authorization Header here as well
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            });

            if (response.ok) {
                setMessage("Supervisor approved successfully!");
                fetchPending(); 
            } else {
                const errorData = await response.json();
                console.error("Approval failed:", errorData.message);
            }
        } catch (err) {
            console.error("Approval request failed:", err);
        }
    };

    return (
        <div className="admin-approval-container">
            <h2>Pending Supervisor Requests</h2>
            {message && <p className="success-msg">{message}</p>}
            
            <table className="approval-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingUsers.length > 0 ? (
                        pendingUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => handleApprove(user._id)} className="approve-btn">
                                        Approve Access
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                No pending requests found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminApproval;