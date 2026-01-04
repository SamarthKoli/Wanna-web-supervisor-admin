const express = require("express");
const cors = require("cors");
const User = require("../models/user"); // Import your User model

const router = express.Router();

// 1. Updated CORS: Allow your specific local frontend ports
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001"], 
    methods: ["POST", "GET"], // Must allow GET for the status check
    allowedHeaders: ["Content-Type", "Authorization"],
};

router.use(cors(corsOptions));

/**
 * GET Account Status
 * Used by Login.js to check role and approval after Firebase auth
 */
router.get("/status/:uid", async (req, res) => {
    try {
        const { uid } = req.params;

        // Find user in MongoDB by Firebase UID
        const user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            console.log(`Status Check Failed: User ${uid} not found in MongoDB.`);
            return res.status(404).json({ message: "User record not found in database." });
        }

        // Return critical auth data
        return res.status(200).json({
            isApproved: user.isApproved,
            role: user.role
        });

    } catch (err) {
        console.error("Status Route Error:", err.message);
        res.status(500).json({ message: "Internal server error during status check." });
    }
});

/**
 * Existing Login Logic (Optional if you are handling auth purely via Firebase on frontend)
 */
router.post("/login", async (req, res) => {
    // If you have a custom controller, call it here
    // Otherwise, Firebase handles the primary login on the frontend
    res.status(200).json({ message: "Firebase handles primary auth; use /status/:uid for roles." });
});

module.exports = router;