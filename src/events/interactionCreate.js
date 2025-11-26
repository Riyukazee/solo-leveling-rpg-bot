module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Erreur lors de l'exécution de ${interaction.commandName}:`, error);

      const errorMessage = {
        content: '❌ Une erreur est survenue lors de l\'exécution de cette commande.',
        ephemeral: true,
      };

      try {
        // Si déjà répondu → NE PAS refaire reply
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      } catch (err) {
        // SÉCURITÉ MAX : si Discord refuse quand même → ignorer
        console.error("Erreur dans le handler d'erreur:", err);
      }
    }
  },
};
