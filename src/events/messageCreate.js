const { supabase } = require('../config/supabase');
const { addXP } = require('../utils/experience');
const { getOrCreatePlayer } = require('../utils/player');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    try {
      // 1️⃣ Création automatique du profil si inexistant
      await getOrCreatePlayer(message.author.id, message.author.username);

      // 2️⃣ Vérification config des channels XP
      const { data: config } = await supabase
        .from('config')
        .select('value')
        .eq('key', 'xp_channels')
        .maybeSingle();

      if (config && config.value.allowed && config.value.allowed.length > 0) {
        if (!config.value.allowed.includes(message.channel.id)) {
          return; // Channel non autorisé pour l'XP
        }
      }

      // 3️⃣ Ajout d'XP
      await addXP(
        message.author.id,
        message.author.username,
        message.content
      );

    } catch (error) {
      console.error('❌ Erreur XP / création profil :', error);
    }
  },
};

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    console.log("📩 Nouveau message reçu :", message.content);

    if (message.author.bot) return;

