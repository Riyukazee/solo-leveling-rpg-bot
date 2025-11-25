const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

/**
 * GET ALL ITEMS OF ALL PLAYERS
 */
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("inventory").select("*");

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true, data });
});

/**
 * GET INVENTORY OF ONE PLAYER BY DISCORD ID
 */
router.get("/:discord_id", async (req, res) => {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("discord_id", req.params.discord_id);

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, data });
});

/**
 * ADD ITEM TO INVENTORY
 */
router.post("/", async (req, res) => {
  const { error } = await supabase.from("inventory").insert(req.body);

  if (error) return res.status(500).json({ success: false, error: error.message });
  res.json({ success: true });
});

/**
 * UPDATE INVENTORY ENTRY
 */
router.put("/:id", async (req, res) => {
  const { error } = await supabase
    .from("inventory")
