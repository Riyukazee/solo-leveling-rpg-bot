const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

/**
 * GET ALL SPELLS
 */
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("spells").select("*");
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, data });
});

/**
 * GET ONE SPELL BY ID
 */
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("spells")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (!data) return res.status(404).json({ success: false, error: "Spell not found" });
  res.json({ success: true, data });
});

/**
 * CREATE SPELL
 */
router.post("/", async (req, res) => {
  const { error } = await supabase.from("spells").insert(req.body);
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

/**
 * UPDATE SPELL
 */
router.put("/:id", async (req, res) => {
  const { error } = await supabase
    .from("spells")
    .update(req.body)
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

/**
 * DELETE SPELL
 */
router.delete("/:id", async (req, res) => {
  const { error } = await supabase.from("spells").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

module.exports = router;
