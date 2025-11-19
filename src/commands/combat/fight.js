const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getPlayerStats, updatePlayerStats } = require('../../utils/player');
const { supabase } = require('../../config/supabase');
const { calculateDamage, calculateEnemyDamage, getRandomEnemy, processLootTable } = require('../../utils/combat');

const activeCombats = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fight')
    .setDescription('Combattre un monstre'),

  async execute(interaction) {
    if (activeCombats.has(interaction.user.id)) {
      return interaction.reply({
        content: '⚔️ Vous êtes déjà en combat !',
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const playerData = await getPlayerStats(interaction.user.id);

    if (!playerData) {
      return interaction.editReply('❌ Créez d\'abord votre profil en envoyant un message.');
    }

    const { player, stats } = playerData;

    if (player.hp <= 0) {
      await updatePlayerStats(player.discord_id, { hp: player.max_hp, mana: player.max_mana });
      return interaction.editReply('💊 Vos HP ont été restaurés. Réessayez !');
    }

    const enemy = await getRandomEnemy(player.level);

    if (!enemy) {
      return interaction.editReply('❌ Aucun ennemi trouvé. Demandez à un admin de créer des ennemis.');
    }

    const { data: playerSpells } = await supabase
      .from('player_spells')
      .select('*, spell:spells(*)')
      .eq('player_id', player.discord_id)
      .not('slot', 'is', null)
      .order('slot');

    const spells = playerSpells || [];

    const combatState = {
      playerId: player.discord_id,
      playerHP: player.hp,
      playerMaxHP: player.max_hp + stats.hp_bonus,
      playerMana: player.mana,
      playerMaxMana: player.max_mana + stats.mana_bonus,
      enemyHP: enemy.hp,
      enemyMaxHP: enemy.hp,
      enemy,
      stats,
      player,
      spells,
      turn: 1,
    };

    activeCombats.set(interaction.user.id, combatState);

    const embed = createCombatEmbed(combatState);
    const buttons = createCombatButtons(combatState);

    const message = await interaction.editReply({
      embeds: [embed],
      components: [buttons],
    });

    const collector = message.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 300000,
    });

    collector.on('collect', async i => {
      await handleCombatAction(i, combatState, interaction.user.id);
    });

    collector.on('end', () => {
      activeCombats.delete(interaction.user.id);
    });
  },
};

function createCombatEmbed(state) {
  const hpBar = createHealthBar(state.playerHP, state.playerMaxHP);
  const enemyHPBar = createHealthBar(state.enemyHP, state.enemyMaxHP);
  const manaBar = createManaBar(state.playerMana, state.playerMaxMana);

  const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(`⚔️ Combat - Tour ${state.turn}`)
    .setDescription(`**${state.enemy.name}** (Niv. ${state.enemy.level})`)
    .addFields(
      { name: '❤️ Vos HP', value: `${hpBar}\n${state.playerHP}/${state.playerMaxHP}`, inline: false },
      { name: '💙 Votre Mana', value: `${manaBar}\n${state.playerMana}/${state.playerMaxMana}`, inline: false },
      { name: '👹 HP Ennemi', value: `${enemyHPBar}\n${state.enemyHP}/${state.enemyMaxHP}`, inline: false }
    );

  if (state.enemy.image_url) {
    embed.setThumbnail(state.enemy.image_url);
  }

  return embed;
}

function createCombatButtons(state) {
  const row = new ActionRowBuilder();

  row.addComponents(
    new ButtonBuilder()
      .setCustomId('combat_basic')
      .setLabel('⚔️ Attaque (0 mana)')
      .setStyle(ButtonStyle.Primary)
  );

  if (state.spells.length >= 1 && state.spells[0]) {
    const spell = state.spells[0].spell;
    row.addComponents(
      new ButtonBuilder()
        .setCustomId('combat_spell1')
        .setLabel(`${spell.name} (${spell.mana_cost})`)
        .setStyle(ButtonStyle.Success)
        .setDisabled(state.playerMana < spell.mana_cost)
    );
  }

  if (state.spells.length >= 2 && state.spells[1]) {
    const spell = state.spells[1].spell;
    row.addComponents(
      new ButtonBuilder()
        .setCustomId('combat_spell2')
        .setLabel(`${spell.name} (${spell.mana_cost})`)
        .setStyle(ButtonStyle.Success)
        .setDisabled(state.playerMana < spell.mana_cost)
    );
  }

  if (state.spells.length >= 3 && state.spells[2]) {
    const spell = state.spells[2].spell;
    row.addComponents(
      new ButtonBuilder()
        .setCustomId('combat_spell3')
        .setLabel(`${spell.name} (${spell.mana_cost})`)
        .setStyle(ButtonStyle.Danger)
        .setDisabled(state.playerMana < spell.mana_cost)
    );
  }

  return row;
}

async function handleCombatAction(interaction, state, userId) {
  await interaction.deferUpdate();

  const action = interaction.customId;

  let playerDamage = 0;
  let manaCost = 0;
  let attackName = 'Attaque basique';
  let isCrit = false;

  if (action === 'combat_basic') {
    const result = calculateDamage(state.stats, state.enemy, 'physical', 10, 'strength');
    playerDamage = result.damage;
    isCrit = result.isCrit;
  } else if (action.startsWith('combat_spell')) {
    const spellIndex = parseInt(action.replace('combat_spell', '')) - 1;
    const spell = state.spells[spellIndex]?.spell;

    if (!spell || state.playerMana < spell.mana_cost) {
      return;
    }

    manaCost = spell.mana_cost;
    attackName = spell.name;

    const result = calculateDamage(state.stats, state.enemy, spell.damage_type, spell.base_damage, spell.scaling_stat);
    playerDamage = result.damage;
    isCrit = result.isCrit;
  }

  state.playerMana -= manaCost;
  state.enemyHP -= playerDamage;

  let combatLog = `${attackName}: **${playerDamage}** dégâts${isCrit ? ' **CRITIQUE!**' : ''}`;

  if (state.enemyHP <= 0) {
    await endCombat(interaction, state, true, combatLog);
    return;
  }

  const enemyAttack = calculateEnemyDamage(state.enemy, state.stats);
  state.playerHP -= enemyAttack.damage;

  if (enemyAttack.isDodged) {
    combatLog += `\n🌪️ Vous avez esquivé l'attaque ennemie!`;
  } else {
    combatLog += `\n👹 L'ennemi inflige **${enemyAttack.damage}** dégâts`;
  }

  if (state.playerHP <= 0) {
    await endCombat(interaction, state, false, combatLog);
    return;
  }

  state.turn++;

  const embed = createCombatEmbed(state);
  embed.setFooter({ text: combatLog });

  const buttons = createCombatButtons(state);

  await interaction.editReply({
    embeds: [embed],
    components: [buttons],
  });
}

async function endCombat(interaction, state, victory, lastAction) {
  activeCombats.delete(state.playerId);

  if (victory) {
    const baseCoins = state.enemy.coin_reward;
    const baseXP = state.enemy.xp_reward;

    const coinsEarned = Math.floor(baseCoins * (1 + (state.stats.coin_bonus || 0)));
    const xpEarned = Math.floor(baseXP * (1 + (state.stats.xp_bonus || 0)));

    const rewards = processLootTable(state.enemy.loot_table);
    rewards.coins += coinsEarned;
    rewards.xp += xpEarned;

    await updatePlayerStats(state.playerId, {
      hp: state.playerHP,
      mana: state.playerMana,
      coins: state.player.coins + rewards.coins,
      xp: state.player.xp + rewards.xp,
    });

    for (const item of rewards.items) {
      if (item.type === 'artifact') {
        await supabase.from('player_artifacts').insert({
          player_id: state.playerId,
          artifact_id: item.id,
          equipped: false,
          durability: 100,
        });
      } else if (item.type === 'potion') {
        await supabase.from('player_inventory').insert({
          player_id: state.playerId,
          item_type: 'potion',
          item_id: item.id,
          quantity: item.quantity,
        });
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('🎉 VICTOIRE !')
      .setDescription(`${lastAction}\n\n**${state.enemy.name}** a été vaincu!`)
      .addFields(
        { name: '💰 Coins', value: `+${rewards.coins}`, inline: true },
        { name: '✨ XP', value: `+${rewards.xp}`, inline: true }
      );

    if (rewards.items.length > 0) {
      embed.addFields({
        name: '🎁 Loot',
        value: rewards.items.map(i => `${i.type === 'artifact' ? '⚔️' : '💊'} ${i.type}`).join('\n'),
      });
    }

    await interaction.editReply({
      embeds: [embed],
      components: [],
    });
  } else {
    const coinsLost = Math.floor(state.player.coins * 0.05);

    await updatePlayerStats(state.playerId, {
      hp: state.playerMaxHP,
      mana: state.playerMaxMana,
      coins: Math.max(0, state.player.coins - coinsLost),
    });

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('💀 DÉFAITE')
      .setDescription(`${lastAction}\n\nVous avez été vaincu par **${state.enemy.name}**!\n\nVos HP et Mana ont été restaurés.`)
      .addFields({ name: '💸 Pénalité', value: `-${coinsLost} coins`, inline: true });

    await interaction.editReply({
      embeds: [embed],
      components: [],
    });
  }
}

function createHealthBar(current, max) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const filled = Math.floor(percentage / 10);
  const empty = 10 - filled;

  return '█'.repeat(filled) + '░'.repeat(empty);
}

function createManaBar(current, max) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const filled = Math.floor(percentage / 10);
  const empty = 10 - filled;

  return '▓'.repeat(filled) + '░'.repeat(empty);
}
