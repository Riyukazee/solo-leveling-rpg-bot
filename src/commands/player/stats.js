const { SlashCommandBuilder } = require('discord.js');
const { getOrCreatePlayer, updatePlayerStats } = require('../../utils/player');
const { calculateMaxHP, calculateMaxMana } = require('../../utils/experience');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Gérer vos points de statistiques')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Ajouter des points à une statistique')
        .addStringOption(option =>
          option
            .setName('stat')
            .setDescription('La statistique à augmenter')
            .setRequired(true)
            .addChoices(
              { name: 'FOR (Force)', value: 'strength' },
              { name: 'INT (Intelligence)', value: 'intelligence' },
              { name: 'AGI (Agilité)', value: 'agility' },
              { name: 'VIT (Vitalité)', value: 'vitality' },
              { name: 'CHA (Charisme)', value: 'charisma' }
            ))
        .addIntegerOption(option =>
          option
            .setName('points')
            .setDescription('Nombre de points à ajouter')
            .setRequired(true)
            .setMinValue(1)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('Voir vos points de stats disponibles')),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'view') {
      const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);
      return interaction.reply({
        content: `📊 Vous avez **${player.stat_points}** points de statistiques disponibles.\nUtilisez \`/stats add\` pour les distribuer.`,
        ephemeral: true,
      });
    }

    if (subcommand === 'add') {
      const stat = interaction.options.getString('stat');
      const points = interaction.options.getInteger('points');

      const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

      if (player.stat_points < points) {
        return interaction.reply({
          content: `❌ Vous n'avez que ${player.stat_points} points disponibles.`,
          ephemeral: true,
        });
      }

      const updates = {
        [stat]: player[stat] + points,
        stat_points: player.stat_points - points,
      };

      if (stat === 'vitality') {
        updates.max_hp = calculateMaxHP(player.vitality + points, player.level, player.class_id);
        updates.hp = updates.max_hp;
      }

      if (stat === 'intelligence') {
        updates.max_mana = calculateMaxMana(player.intelligence + points, player.level, player.class_id);
        updates.mana = updates.max_mana;
      }

      await updatePlayerStats(interaction.user.id, updates);

      const statNames = {
        strength: 'Force',
        intelligence: 'Intelligence',
        agility: 'Agilité',
        vitality: 'Vitalité',
        charisma: 'Charisme',
      };

      await interaction.reply({
        content: `✅ +${points} ${statNames[stat]} !\n${updates.max_hp ? `HP Max: ${updates.max_hp}\n` : ''}${updates.max_mana ? `Mana Max: ${updates.max_mana}\n` : ''}Points restants: ${updates.stat_points}`,
        ephemeral: true,
      });
    }
  },
};
