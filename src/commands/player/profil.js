const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getPlayerStats } = require('../../utils/player');
const { calculateXPToNextLevel } = require('../../utils/experience');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profil')
    .setDescription('Affiche votre profil de chasseur'),

  async execute(interaction) {
    await interaction.deferReply();

    const playerData = await getPlayerStats(interaction.user.id);

    if (!playerData) {
      return interaction.editReply('❌ Profil non trouvé. Envoyez un message pour créer votre profil.');
    }

    const { player, stats } = playerData;

    const maxHPWithBonus = player.max_hp + stats.hp_bonus;
    const maxManaWithBonus = player.max_mana + stats.mana_bonus;

    const xpToNext = calculateXPToNextLevel(player.xp, player.level);

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle(`⚔️ ${player.username}`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: '📊 Niveau', value: `${player.level}`, inline: true },
        { name: '✨ XP', value: `${player.xp} (${xpToNext} jusqu'au prochain niveau)`, inline: true },
        { name: '💰 Coins', value: `${player.coins}`, inline: true },
        { name: '❤️ HP', value: `${player.hp}/${maxHPWithBonus}`, inline: true },
        { name: '💙 Mana', value: `${player.mana}/${maxManaWithBonus}`, inline: true },
        { name: '🎯 Points de stats', value: `${player.stat_points}`, inline: true },
        { name: '💪 FOR', value: `${stats.strength}`, inline: true },
        { name: '🧠 INT', value: `${stats.intelligence}`, inline: true },
        { name: '⚡ AGI', value: `${stats.agility}`, inline: true },
        { name: '🛡️ VIT', value: `${stats.vitality}`, inline: true },
        { name: '✨ CHA', value: `${stats.charisma}`, inline: true },
        { name: '🎭 Classe', value: player.class ? `${player.class.name} (${player.class.rarity})` : 'Novice', inline: true }
      )
      .setTimestamp();

    if (stats.damage_bonus > 0 || stats.crit_bonus > 0) {
      const bonuses = [];
      if (stats.damage_bonus > 0) bonuses.push(`+${(stats.damage_bonus * 100).toFixed(0)}% Dégâts`);
      if (stats.crit_bonus > 0) bonuses.push(`+${(stats.crit_bonus * 100).toFixed(0)}% Crit`);
      if (stats.xp_bonus > 0) bonuses.push(`+${(stats.xp_bonus * 100).toFixed(0)}% XP`);
      if (stats.coin_bonus > 0) bonuses.push(`+${(stats.coin_bonus * 100).toFixed(0)}% Coins`);

      embed.addFields({ name: '🌟 Bonus', value: bonuses.join('\n'), inline: false });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
