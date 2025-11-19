const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { supabase } = require('../../config/supabase');
const { getOrCreatePlayer } = require('../../utils/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Voir votre inventaire')
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('Type d\'items à afficher')
        .addChoices(
          { name: 'Tout', value: 'all' },
          { name: 'Artefacts', value: 'artifacts' },
          { name: 'Potions', value: 'potions' },
          { name: 'Matériaux', value: 'materials' }
        )),

  async execute(interaction) {
    await interaction.deferReply();

    const type = interaction.options.getString('type') || 'all';
    const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

    const embed = new EmbedBuilder()
      .setColor('#3498db')
      .setTitle(`🎒 Inventaire de ${player.username}`)
      .setDescription(`💰 Coins: ${player.coins}`);

    if (type === 'all' || type === 'artifacts') {
      const { data: artifacts } = await supabase
        .from('player_artifacts')
        .select('*, artifact:artifacts(*)')
        .eq('player_id', player.discord_id);

      if (artifacts && artifacts.length > 0) {
        const equipped = artifacts.filter(a => a.equipped);
        const unequipped = artifacts.filter(a => !a.equipped);

        if (equipped.length > 0) {
          let text = '';
          for (const item of equipped) {
            text += `⚔️ **${item.artifact.name}** (${item.artifact.rarity}) - ${item.artifact.slot}\n`;
          }
          embed.addFields({ name: '✅ Artefacts Équipés', value: text, inline: false });
        }

        if (unequipped.length > 0) {
          let text = '';
          for (const item of unequipped) {
            text += `${item.artifact.name} (${item.artifact.rarity}) - ${item.artifact.slot}\n`;
          }
          embed.addFields({ name: '📦 Artefacts Non Équipés', value: text, inline: false });
        }
      }
    }

    if (type === 'all' || type === 'potions') {
      const { data: potions } = await supabase
        .from('player_inventory')
        .select('*')
        .eq('player_id', player.discord_id)
        .eq('item_type', 'potion');

      if (potions && potions.length > 0) {
        let text = '';
        for (const potion of potions) {
          text += `💊 ${potion.item_id} x${potion.quantity}\n`;
        }
        embed.addFields({ name: '💊 Potions', value: text, inline: false });
      }
    }

    if (type === 'all' || type === 'materials') {
      const { data: materials } = await supabase
        .from('player_inventory')
        .select('*')
        .eq('player_id', player.discord_id)
        .eq('item_type', 'material');

      if (materials && materials.length > 0) {
        let text = '';
        for (const material of materials) {
          text += `🔨 ${material.item_id} x${material.quantity}\n`;
        }
        embed.addFields({ name: '🔨 Matériaux', value: text, inline: false });
      }
    }

    if (embed.data.fields?.length === 0 || !embed.data.fields) {
      embed.setDescription(`${embed.data.description}\n\n*Inventaire vide*`);
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
