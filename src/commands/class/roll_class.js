const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { supabase } = require('../../config/supabase');
const { getOrCreatePlayer, updatePlayerStats } = require('../../utils/player');

const ROLL_COST = 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll_class')
    .setDescription('Obtenir une nouvelle classe (coût: 1000 coins)'),

  async execute(interaction) {
    await interaction.deferReply();

    const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

    if (player.coins < ROLL_COST) {
      return interaction.editReply(`❌ Vous avez besoin de ${ROLL_COST} coins. (Vous: ${player.coins})`);
    }

    const { data: classes } = await supabase
      .from('classes')
      .select('*');

    if (!classes || classes.length === 0) {
      return interaction.editReply('❌ Aucune classe disponible. Demandez à un admin d\'en créer.');
    }

    const rolledClass = rollRandomClass(classes);

    await updatePlayerStats(player.discord_id, {
      class_id: rolledClass.id,
      coins: player.coins - ROLL_COST,
    });

    const rarityEmoji = {
      Common: '⚪',
      Rare: '🔵',
      Epic: '🟣',
      Legendary: '🟠',
    };

    const embed = new EmbedBuilder()
      .setColor(getRarityColor(rolledClass.rarity))
      .setTitle('🎲 Nouvelle Classe Obtenue!')
      .setDescription(`${rarityEmoji[rolledClass.rarity] || '⚪'} **${rolledClass.name}**\n*${rolledClass.rarity}*`)
      .addFields(
        { name: '📜 Description', value: rolledClass.description || 'Aucune description', inline: false },
        { name: '💪 FOR', value: `${rolledClass.strength_modifier >= 0 ? '+' : ''}${rolledClass.strength_modifier}`, inline: true },
        { name: '🧠 INT', value: `${rolledClass.intelligence_modifier >= 0 ? '+' : ''}${rolledClass.intelligence_modifier}`, inline: true },
        { name: '⚡ AGI', value: `${rolledClass.agility_modifier >= 0 ? '+' : ''}${rolledClass.agility_modifier}`, inline: true },
        { name: '🛡️ VIT', value: `${rolledClass.vitality_modifier >= 0 ? '+' : ''}${rolledClass.vitality_modifier}`, inline: true },
        { name: '✨ CHA', value: `${rolledClass.charisma_modifier >= 0 ? '+' : ''}${rolledClass.charisma_modifier}`, inline: true },
        { name: '❤️ HP', value: `x${rolledClass.hp_modifier}`, inline: true },
        { name: '💙 Mana', value: `x${rolledClass.mana_modifier}`, inline: true }
      );

    if (rolledClass.image_url) {
      embed.setThumbnail(rolledClass.image_url);
    }

    await interaction.editReply({ embeds: [embed] });
  },
};

function rollRandomClass(classes) {
  const rarityWeights = {
    Legendary: 1,
    Epic: 9,
    Rare: 20,
    Common: 70,
  };

  const weightedClasses = [];

  for (const cls of classes) {
    const weight = rarityWeights[cls.rarity] || 50;
    for (let i = 0; i < weight; i++) {
      weightedClasses.push(cls);
    }
  }

  return weightedClasses[Math.floor(Math.random() * weightedClasses.length)];
}

function getRarityColor(rarity) {
  const colors = {
    Common: '#CCCCCC',
    Rare: '#3498db',
    Epic: '#9b59b6',
    Legendary: '#f39c12',
  };

  return colors[rarity] || '#CCCCCC';
}
