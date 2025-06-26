const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const requireLoginUser = require("../middleWares/requireLoginUser");

const DIRECTOR = mongoose.model("DIRECTOR");
const LOCALEVENT= mongoose.model("LOCALEVENT");
const ARTCLUB = mongoose.model("ARTCLUB");
const SCHOOL = mongoose.model("SCHOOL");
const USER = mongoose.model("USER");


// GET /get-school?district=Varanasi&club=artclub
router.get("/get-school", async (req, res) => {
  const { district, club } = req.query;

  if (!district || !club) {
    return res.status(400).json({ error: "Both 'district' and 'club' parameters are required" });
  }

  try {
    // Find schools by district and club, populate ambassador & captain details
    const schools = await SCHOOL.find({ district, club })
      .populate('ambassador', 'name email phone')
      .populate('captain', 'name email phone');

    if (!schools.length) {
      return res.status(404).json({ error: "No schools found for the given district and club" });
    }

    res.status(200).json({ schools });

  } catch (error) {
    console.error("Error fetching school info:", error);
    res.status(500).json({ error: "Failed to fetch school information" });
  }
});

// GET /get-students?club=artclub&district=Kanpur&school=St. Xavier's
router.get("/get-students", async (req, res) => {
  const { district } = req.query;

  // Validate required parameters
  if (!district) {
    return res.status(400).json({ error: "club, district, and school parameters are required" });
  }

  try {
    // Find students with matching club, district, and school
    const students = await USER.find({
      club,
      district,
      school
    }).select('name email phone school district club');

    if (!students.length) {
      return res.status(404).json({ message: "No students found for the given criteria" });
    }

    res.status(200).json({ students });

  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});


module.exports = router;