const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

/**
 * GET ALL ENEMIES
 */
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("enemies").select("*");
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, data });
});

/**
 * GET ONE ENEMY BY ID
 */
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("enemies")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (!data) return res.status(404).json({ success: false, error: "Enemy not found" });

  res.json({ success: true, data });
});

/**
 * CREATE ENEMY
 */
router.post("/", async (req, res) => {
  const { error } = await supabase.from("enemies").insert(req.body);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

/**
 * UPDATE ENEMY
 */
router.put("/:id", async (req, res) => {
  const { error } = await supabase
    .from("enemies")
    .update(req.body)
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

/**
 * DELETE ENEMY
 */
router.delete("/:id", async (req, res) => {
  const { error } = await supabase
    .from("enemies")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

module.exports = router;
