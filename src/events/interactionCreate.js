const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    try {
      await interaction.client.commands
        .get(interaction.commandName)
        .execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Une erreur est survenue.',
        ephemeral: true,
      });
    }
  },
};
