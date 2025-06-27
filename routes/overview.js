const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const LOCALEVENT = require("../model/localEvent");

// GET /overview/event/:id - Fetch a single local event by ID
router.get("/event/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }
    const event = await LOCALEVENT.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event", details: error.message });
  }
});

module.exports = router;