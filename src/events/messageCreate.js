const { Events } = require('discord.js');
const supabase = require('../config/supabase');
const { addXP } = require('../utils/experience');
const { getOrCreatePlayer } = require('../utils/player');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    console.log("💬 Nouveau message :", message.content);

    if (message.author.bot) return;

    await getOrCreatePlayer(message.author.id, message.author.username);

    await addXP(
      message.author.id,
      message.author.username,
      message.content
    );
  },
};
