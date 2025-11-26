async function getOrCreatePlayer(discordId, username) {
  console.log("Tentative de récupération du joueur...", discordId, username);

  let { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('discord_id', discordId)
    .maybeSingle();

  if (error) {
    console.error('Erreur SELECT joueur:', error);
  }

  if (!player) {
    console.log('⚠️ Profil non trouvé. Création...');

    const { data: newPlayer, error: insertError } = await supabase
      .from('players')
      .insert({
        discord_id: discordId,
        username: username,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erreur INSERT joueur :', insertError);
    } else {
      console.log('✅ Nouveau profil créé :', newPlayer);
    }

    player = newPlayer;
  } else {
    console.log('✅ Profil trouvé:', player);
  }

  return player;
}


async function updatePlayerStats(discordId, updates) {
  const { data, error } = await supabase
    .from('players')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('discord_id', discordId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getPlayerStats(discordId) {
  const { data: player } = await supabase
    .from('players')
    .select(`
      *,
      class:classes(*)
    `)
    .eq('discord_id', discordId)
    .maybeSingle();

  if (!player) return null;

  const { data: equippedArtifacts } = await supabase
    .from('player_artifacts')
    .select('*, artifact:artifacts(*)')
    .eq('player_id', discordId)
    .eq('equipped', true);

  let totalStats = {
    strength: player.strength,
    intelligence: player.intelligence,
    agility: player.agility,
    vitality: player.vitality,
    charisma: player.charisma,
    hp_bonus: 0,
    mana_bonus: 0,
    crit_bonus: 0,
    damage_bonus: 0,
    xp_bonus: 0,
    coin_bonus: 0,
  };

  if (player.class) {
    totalStats.strength += player.class.strength_modifier;
    totalStats.intelligence += player.class.intelligence_modifier;
    totalStats.agility += player.class.agility_modifier;
    totalStats.vitality += player.class.vitality_modifier;
    totalStats.charisma += player.class.charisma_modifier;
  }

  if (equippedArtifacts) {
    for (const item of equippedArtifacts) {
      const art = item.artifact;
      totalStats.strength += art.strength_bonus;
      totalStats.intelligence += art.intelligence_bonus;
      totalStats.agility += art.agility_bonus;
      totalStats.vitality += art.vitality_bonus;
      totalStats.charisma += art.charisma_bonus;
      totalStats.hp_bonus += art.hp_bonus;
      totalStats.mana_bonus += art.mana_bonus;
      totalStats.crit_bonus += art.crit_bonus;
      totalStats.damage_bonus += art.damage_bonus;
      totalStats.xp_bonus += art.xp_bonus;
      totalStats.coin_bonus += art.coin_bonus;
    }
  }

  return {
    player,
    stats: totalStats,
    artifacts: equippedArtifacts || [],
  };
}

module.exports = {
  getOrCreatePlayer,
  updatePlayerStats,
  getPlayerStats,
};
