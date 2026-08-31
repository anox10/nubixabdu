const express = require("express");
const router = express.Router();
const supabase = require("../db/supabase");
const { authenticateToken, requireRole } = require("../middleware/auth");

// POST /api/cases - Patient submits a new clinical intake case
router.post("/", authenticateToken, requireRole("patient"), async (req, res) => {
  try {
    const {
      chief_complaint,
      duration_of_symptoms,
      joint_assessment,
      past_history,
      drug_allergy_history,
      family_history,
      attachment_urls
    } = req.body;

    if (!chief_complaint || !chief_complaint.trim()) {
      return res.status(400).json({ error: "Chief complaint is required." });
    }

    const attachments = Array.isArray(attachment_urls) ? attachment_urls : [];

    const { data: newCase, error } = await supabase
      .from("cases")
      .insert({
        patient_id: req.user.id,
        patient_name: req.user.name,
        chief_complaint: chief_complaint.trim(),
        duration_of_symptoms: (duration_of_symptoms || "").trim(),
        joint_assessment: (joint_assessment || "").trim(),
        past_history: (past_history || "None reported").trim(),
        drug_allergy_history: (drug_allergy_history || "No known drug allergies (NKDA)").trim(),
        family_history: (family_history || "Non-contributory").trim(),
        attachment_urls: attachments
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting case:", error);
      return res.status(500).json({ error: "Failed to submit case record." });
    }

    res.status(201).json({
      message: "Clinical case intake form submitted successfully.",
      case: newCase
    });
  } catch (err) {
    console.error("Error submitting case:", err);
    res.status(500).json({ error: "Failed to submit case record." });
  }
});

// GET /api/cases/my - Patient views their own cases
router.get("/my", authenticateToken, requireRole("patient"), async (req, res) => {
  try {
    const { data: cases, error } = await supabase
      .from("cases")
      .select("*")
      .eq("patient_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: "Failed to retrieve cases." });

    res.json({ cases: cases || [] });
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({ error: "Failed to retrieve cases." });
  }
});

// GET /api/cases/:id - View specific case
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { data: caseRecord, error } = await supabase
      .from("cases")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !caseRecord) {
      return res.status(404).json({ error: "Case record not found." });
    }

    if (req.user.role === "patient" && caseRecord.patient_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied to this clinical case." });
    }

    res.json({ case: caseRecord });
  } catch (err) {
    console.error("Error fetching case by ID:", err);
    res.status(500).json({ error: "Failed to retrieve case details." });
  }
});

module.exports = router;
