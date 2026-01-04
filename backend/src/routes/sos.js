const express = require("express");
const router = express.Router();
const SOS = require("../models/SOS"); // Replace with your actual SOS model

// POST /sos - Save SOS data to the database
router.post("/", async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  try {
    // Create a new SOS document
    const sosEntry = new SOS({ userId, latitude, longitude });

    // Save to the database
    const savedEntry = await sosEntry.save();

    // Respond with success
    res.status(201).json({ message: "SOS saved successfully", data: savedEntry });
  } catch (error) {
    console.error("Error saving SOS:", error.message);
    res.status(500).json({ error: "Failed to save SOS" });
  }
});
// GET /sos - Fetch all SOS records from the database
router.get("/", async (req, res) => {
    try {
      const sosRecords = await SOS.find(); // Fetch all SOS records from the database
      res.status(200).json(sosRecords); // Respond with the records
    } catch (error) {
      console.error("Error fetching SOS records:", error.message);
      res.status(500).json({ error: "Failed to fetch SOS records", details: error.message });
    }
  });
module.exports = router;
