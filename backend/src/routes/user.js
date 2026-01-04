const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

/**
 * 1. GET all supervisors awaiting approval
 * Endpoint: GET /user-management/pending
 */
router.get('/pending', async (req, res) => {
    try {
        // Query only supervisors who are not yet approved
        const pendingUsers = await User.find({ 
            role: 'supervisor', 
            isApproved: false 
        }).select('-password'); // Security: Never send password hashes
        
        // Always return an array (even if empty) to prevent frontend .map() errors
        res.status(200).json(pendingUsers || []);
    } catch (error) {
        console.error("Fetch Pending Error:", error.message);
        res.status(500).json({ error: "Failed to fetch pending supervisors." });
    }
});

/**
 * 2. PATCH: Approve a supervisor by ID
 * Endpoint: PATCH /user-management/approve/:id
 */
router.patch('/approve/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validation: Ensure the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid User ID format." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { isApproved: true }, 
            { new: true } // Return the updated document
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ 
            message: "Supervisor approved successfully!", 
            user: updatedUser 
        });
    } catch (error) {
        console.error("Approval Error:", error.message);
        res.status(500).json({ error: "An error occurred during approval." });
    }
});

module.exports = router;