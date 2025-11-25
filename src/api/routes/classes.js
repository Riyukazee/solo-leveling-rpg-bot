const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

/**
 * GET ALL CLASSES
 */
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("classes").select("*");
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, data });
});

/**
 * GET ONE CLASS BY ID
 */
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (!data) return res.status(404).json({ success: false, error: "Class not found" });
  res.json({ success: true, data });
});

/**
 * CREATE NEW CLASS
 */
router.post("/", async (req, res) => {
  const { error } = await supabase.from("classes").insert(req.body);
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

/**
 * UPDATE CLASS
 */
router.put("/:id", async (req, res) => {
  const { error } = await supabase
    .from("classes")
    .update(req.body)
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

/**
 * DELETE CLASS
 */
router.delete("/:id", async (req, res) => {
  const { error } = await supabase.from("classes").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

module.exports = router;

