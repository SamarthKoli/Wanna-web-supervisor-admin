const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET user status by Firebase UID
router.get('/status/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.uid });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send back approval status and role
        res.status(200).json({ 
            isApproved: user.isApproved, 
            role: user.role 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;