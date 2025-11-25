const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

/**
 * GET GLOBAL CONFIG
 */
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("config").select("*").single();

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, data });
});

/**
 * UPDATE CONFIG
 */
router.put("/", async (req, res) => {
  const updates = req.body;

  const { error } = await supabase
    .from("config")
    .update(updates)
    .eq("id", 1); // La config globale a souvent id = 1

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

module.exports = router;
