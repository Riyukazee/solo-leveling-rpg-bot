const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

/**
 * GET ALL PLAYERS
 */
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("players").select("*");

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
});

/**
 * GET ONE PLAYER BY DISCORD ID
 */
router.get("/:discord_id", async (req, res) => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("discord_id", req.params.discord_id)
    .maybeSingle();

  if (!data) return res.status(404).json({ success: false, error: "Player not found" });

  res.json({ success: true, data });
});

/**
 * CREATE PLAYER
 */
router.post("/", async (req, res) => {
  const { error } = await supabase.from("players").insert(req.body);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

/**
 * UPDATE PLAYER DATA
 */
router.put("/:discord_id", async (req, res) => {
  const updates = req.body;

  const { error } = await supabase
    .from("players")
    .update(updates)
    .eq("discord_id", req.params.discord_id);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

/**
 * DELETE PLAYER
 */
router.delete("/:discord_id", async (req, res) => {
  const { error } = await supabase
    .from("players")
    .delete()
    .eq("discord_id", req.params.discord_id);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true });
});

module.exports = router;
