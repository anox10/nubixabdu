const express = require("express");
const router = express.Router();
const supabase = require("../db/supabase");
const { authenticateToken, requireRole } = require("../middleware/auth");

// GET /api/specializations - Public listing
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("specializations")
      .select("*")
      .order("name");
    if (error) return res.status(500).json({ error: "Failed to retrieve specializations." });
    res.json({ specializations: data || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve specializations." });
  }
});

// POST /api/specializations - Admin creates department
router.post("/", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Specialization name is required." });
    }

    const { data, error } = await supabase
      .from("specializations")
      .insert({ name: name.trim(), description: (description || "Medical clinical department").trim() })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(400).json({ error: "Specialization with this name already exists." });
      }
      return res.status(500).json({ error: "Failed to add specialization." });
    }

    res.status(201).json({ message: "Specialization added successfully.", specialization: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to add specialization." });
  }
});

// DELETE /api/specializations/:id - Admin deletes department
router.delete("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { data: existing } = await supabase
      .from("specializations")
      .select("name")
      .eq("id", req.params.id)
      .single();

    if (!existing) return res.status(404).json({ error: "Specialization not found." });

    const { error } = await supabase.from("specializations").delete().eq("id", req.params.id);
    if (error) return res.status(500).json({ error: "Failed to delete specialization." });

    res.json({ message: `Specialization '${existing.name}' deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete specialization." });
  }
});

module.exports = router;
