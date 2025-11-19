const { supabase } = require('../config/supabase');

async function addXP(discordId, username, messageContent) {
  const { data: xpConfig } = await supabase
    .from('config')
    .select('value')
    .eq('key', 'xp_rate')
    .maybeSingle();

  const config = xpConfig?.value || { base: 10, message_cooldown_seconds: 10, min_message_length: 5 };

  if (messageContent.length < config.min_message_length) {
    return null;
  }

  let { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('discord_id', discordId)
    .maybeSingle();

  if (!player) {
    const { data: newPlayer } = await supabase
      .from('players')
      .insert({
        discord_id: discordId,
        username: username,
        last_message_xp: new Date().toISOString(),
      })
      .select()
      .single();

    return { levelUp: false, level: 1, xpGained: config.base };
  }

  const now = new Date();
  const lastMessageTime = player.last_message_xp ? new Date(player.last_message_xp) : new Date(0);
  const timeDiff = (now - lastMessageTime) / 1000;

  if (timeDiff < config.message_cooldown_seconds) {
    return null;
  }

  const xpGained = config.base;
  const newXP = player.xp + xpGained;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > player.level;

  const updates = {
    xp: newXP,
    level: newLevel,
    last_message_xp: now.toISOString(),
    updated_at: now.toISOString(),
  };

  if (leveledUp) {
    const statsGained = newLevel - player.level;
    updates.stat_points = player.stat_points + (statsGained * 5);
    updates.max_hp = calculateMaxHP(player.vitality, newLevel, player.class_id);
    updates.max_mana = calculateMaxMana(player.intelligence, newLevel, player.class_id);
    updates.hp = updates.max_hp;
    updates.mana = updates.max_mana;
  }

  await supabase
    .from('players')
    .update(updates)
    .eq('discord_id', discordId);

  return {
    levelUp: leveledUp,
    level: newLevel,
    xpGained,
    statsGained: leveledUp ? (newLevel - player.level) * 5 : 0,
  };
}

function calculateLevel(xp) {
  let level = 1;
  let xpNeeded = 100;
  let totalXP = 0;

  while (totalXP + xpNeeded <= xp) {
    totalXP += xpNeeded;
    level++;
    xpNeeded = Math.floor(100 * Math.pow(1.5, level - 1));
  }

  return level;
}

function calculateXPForLevel(level) {
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += Math.floor(100 * Math.pow(1.5, i - 1));
  }
  return totalXP;
}

function calculateXPToNextLevel(currentXP, currentLevel) {
  const currentLevelXP = calculateXPForLevel(currentLevel);
  const nextLevelXP = calculateXPForLevel(currentLevel + 1);
  return nextLevelXP - currentXP;
}

function calculateMaxHP(vitality, level, classId) {
  const baseHP = 100 + (vitality * 10) + (level * 5);
  return baseHP;
}

function calculateMaxMana(intelligence, level, classId) {
  const baseMana = 50 + (intelligence * 5) + (level * 3);
  return baseMana;
}

module.exports = {
  addXP,
  calculateLevel,
  calculateXPForLevel,
  calculateXPToNextLevel,
  calculateMaxHP,
  calculateMaxMana,
};
