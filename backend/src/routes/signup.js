const express = require('express');
const router = express.Router();
const Joi = require('joi');
const userService = require('../services/signup'); 

router.post('/register', async (req, res) => {
    // Role validation strictly limited to web roles
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        firebaseUid: Joi.string().required(), 
        role: Joi.string().valid("admin", "supervisor").default("supervisor"),
        isApproved: Joi.boolean().default(false) 
    });

    try {
        const { error, value } = schema.validate(req.body);
        if (error) {
            console.log("Validation Error:", error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        const user = await userService.createdUser(value);
        res.status(201).json({ 
            message: 'User mirrored to MongoDB successfully!', 
            user 
        });
        
    } catch (err) {
        console.error("Signup Route Error:", err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;