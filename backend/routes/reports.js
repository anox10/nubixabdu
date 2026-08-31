const express = require("express");
const router = express.Router();
const supabase = require("../db/supabase");
const { authenticateToken } = require("../middleware/auth");

// POST /api/reports - Submit feedback or bug report
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ error: "Report description is required." });
    }

    const { data: newReport, error } = await supabase
      .from("reports")
      .insert({
        reporter_id: req.user.id,
        reporter_name: req.user.name,
        reporter_role: req.user.role,
        description: description.trim(),
        status: "open"
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating report:", error);
      return res.status(500).json({ error: "Failed to submit report." });
    }

    res.status(201).json({
      message: "Thank you for your feedback. Your report has been submitted to CLINORA administration.",
      report: newReport
    });
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ error: "Failed to submit report." });
  }
});

module.exports = router;
