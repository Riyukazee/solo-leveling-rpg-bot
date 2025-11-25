
const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

// GET all casino config
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("casino_config").select("*");
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, data });
});

// GET one entry
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("casino_config")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (!data) return res.status(404).json({ success: false, error: "Not found" });

  res.json({ success: true, data });
});

// UPDATE casino config
router.put("/:id", async (req, res) => {
  const { error } = await supabase
    .from("casino_config")
    .update(req.body)
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

module.exports = router;
