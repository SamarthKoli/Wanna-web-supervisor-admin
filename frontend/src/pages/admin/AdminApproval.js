import React, { useEffect, useState } from 'react';
import './AdminApproval.css';

const AdminApproval = () => {
    const [pendingUsers, setPendingUsers] = useState([]); // Initialized as an array
    const [message, setMessage] = useState('');

    // 1. Fetch pending requests on load
    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            // Updated URL to match your backend app.use('/user-management', ...)
            const response = await fetch('http://localhost:3000/user-management/pending');
            const data = await response.json();

            // SAFETY CHECK: Ensure data is an array before setting state
            if (Array.isArray(data)) {
                setPendingUsers(data);
            } else {
                console.error("Expected array but received:", data);
                setPendingUsers([]); // Fallback to empty array to prevent .map() crash
            }
        } catch (err) {
            console.error("Failed to fetch pending users:", err);
            setPendingUsers([]);
        }
    };

    // 2. Handle Approval
    const handleApprove = async (userId) => {
        try {
            // Updated URL to match your backend mount point
            const response = await fetch(`http://localhost:3000/user-management/approve/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                setMessage("Supervisor approved successfully!");
                fetchPending(); // Refresh the list
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
                    {/* Only attempts to map if pendingUsers is a valid array */}
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