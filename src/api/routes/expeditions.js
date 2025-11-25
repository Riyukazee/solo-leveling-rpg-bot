const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

/**
 * GET ALL EXPEDITIONS
 */
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("expeditions").select("*");
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, data });
});

/**
 * GET ONE EXPEDITION
 */
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("expeditions")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (!data) return res.status(404).json({ success: false, error: "Expedition not found" });
  res.json({ success: true, data });
});

/**
 * CREATE EXPEDITION
 */
router.post("/", async (req, res) => {
  const { error } = await supabase.from("expeditions").insert(req.body);
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

/**
 * UPDATE EXPEDITION
 */
router.put("/:id", async (req, res) => {
  const { error } = await supabase
    .from("expeditions")
    .update(req.body)
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

/**
 * DELETE EXPEDITION
 */
router.delete("/:id", async (req, res) => {
  const { error } = await supabase.from("expeditions").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

module.exports = router;
