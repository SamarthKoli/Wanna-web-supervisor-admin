const express = require('express');
const cors = require('cors');
const mongoose = require('./configuration/dbConfig'); 

// Import Routes
const signupRoute = require('./routes/signup');       // Handles /register
const loginRoute = require('./routes/login');         // Handles /status
const userRoute = require('./routes/user');           // Handles /pending and /approve
const sosRoute = require('./routes/sos');
const eventsRoute = require('./routes/events');

// Import Admin Script
const createAdminAccount = require('./scripts/admin');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use('/user', signupRoute);            // Accessible as: POST http://localhost:3000/user/register
app.use('/auth', loginRoute);             // Accessible as: GET http://localhost:3000/auth/status/:uid
app.use('/user-management', userRoute);   // Accessible as: GET http://localhost:3000/user-management/pending
app.use('/sos', sosRoute);
app.use('/events', eventsRoute);

// Error Handling Middleware (Catches 404s)
app.use((req, res) => {
    console.log(`404 - Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ message: "Route not found on server" });
});

// CRITICAL FIX: Ensure DB is connected before starting server or running scripts
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    console.log("Database connection is open and ready.");
    
    // Automatically creates/verifies the hardcoded Admin
    createAdminAccount();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

// Handle connection errors globally
mongoose.connection.on('error', (err) => {
    console.error("MongoDB connection error:", err);
});