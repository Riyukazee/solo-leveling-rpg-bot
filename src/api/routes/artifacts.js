const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

/**
 * GET ALL ARTIFACTS
 */
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("artifacts").select("*");
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, data });
});

/**
 * GET ONE ARTIFACT BY ID
 */
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("artifacts")
    .select("*")
    .eq("id", req.params.id)
    .maybeSingle();

  if (!data) return res.status(404).json({ success: false, error: "Artifact not found" });
  res.json({ success: true, data });
});

/**
 * CREATE ARTIFACT
 */
router.post("/", async (req, res) => {
  const { error } = await supabase.from("artifacts").insert(req.body);
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

/**
 * UPDATE ARTIFACT
 */
router.put("/:id", async (req, res) => {
  const { error } = await supabase
    .from("artifacts")
    .update(req.body)
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

/**
 * DELETE ARTIFACT
 */
router.delete("/:id", async (req, res) => {
  const { error } = await supabase.from("artifacts").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

module.exports = router;
