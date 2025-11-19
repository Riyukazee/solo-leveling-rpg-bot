const { supabase } = require('../config/supabase');
const { addXP } = require('../utils/experience');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    try {
      const { data: config } = await supabase
        .from('config')
        .select('value')
        .eq('key', 'xp_channels')
        .maybeSingle();

      if (config && config.value.allowed && config.value.allowed.length > 0) {
        if (!config.value.allowed.includes(message.channel.id)) {
          return;
        }
      }

      await addXP(message.author.id, message.author.username, message.content);
    } catch (error) {
      console.error('Erreur XP message:', error);
    }
  },
};
