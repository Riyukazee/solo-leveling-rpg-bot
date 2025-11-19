module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
    console.log(`🎮 Prêt sur ${client.guilds.cache.size} serveur(s)`);
    client.user.setActivity('Solo Leveling RPG', { type: 'PLAYING' });
  },
};
