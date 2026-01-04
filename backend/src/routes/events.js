const express = require("express");
const router = express.Router();
const Event = require("../models/event"); // Ensure the model name matches your file

router.post("/sync", async (req, res) => {
  try {
    const eventData = req.body;
    
    // Check if the data has a unique ID from Firestore
    if (!eventData.id) {
        return res.status(400).json({ error: "Missing event ID" });
    }

    // Upsert: update if exists, insert if it doesn't
    const savedEvent = await Event.findOneAndUpdate(
      { firestoreId: eventData.id }, 
      { ...eventData, firestoreId: eventData.id },
      { upsert: true, new: true, runValidators: true }
    );

    console.log(`Event synced: ${savedEvent.firestoreId}`);
    res.status(201).json({ message: "Event synced successfully", data: savedEvent });
  } catch (error) {
    console.error("MongoDB Sync Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;