const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { supabase } = require('../../config/supabase');
const { getOrCreatePlayer, updatePlayerStats } = require('../../utils/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Gérer vos avatars/skins')
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('Voir vos avatars débloqués'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Définir votre avatar actuel')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Nom de l\'avatar')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('shop')
        .setDescription('Voir la boutique d\'avatars'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('buy')
        .setDescription('Acheter un avatar')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Nom de l\'avatar')
            .setRequired(true))),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'list') {
      await listAvatars(interaction);
    } else if (subcommand === 'set') {
      await setAvatar(interaction);
    } else if (subcommand === 'shop') {
      await showAvatarShop(interaction);
    } else if (subcommand === 'buy') {
      await buyAvatar(interaction);
    }
  },
};

async function listAvatars(interaction) {
  await interaction.deferReply();

  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: unlockedAvatars } = await supabase
    .from('player_avatars')
    .select('*, avatar:avatars(*)')
    .eq('player_id', player.discord_id);

  if (!unlockedAvatars || unlockedAvatars.length === 0) {
    return interaction.editReply('❌ Vous n\'avez aucun avatar débloqué. Visitez `/avatar shop` pour en acheter.');
  }

  const embed = new EmbedBuilder()
    .setColor('#9b59b6')
    .setTitle('🎭 Vos Avatars');

  for (const ua of unlockedAvatars) {
    const isActive = player.avatar_id === ua.avatar_id;
    embed.addFields({
      name: `${isActive ? '✅ ' : ''}${ua.avatar.name} (${ua.avatar.rarity})`,
      value: ua.avatar.description || 'Avatar cosmétique',
      inline: true,
    });
  }

  embed.setFooter({ text: 'Utilisez /avatar set <nom> pour changer votre avatar' });

  await interaction.editReply({ embeds: [embed] });
}

async function setAvatar(interaction) {
  await interaction.deferReply();

  const name = interaction.options.getString('name');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: avatar } = await supabase
    .from('avatars')
    .select('*')
    .ilike('name', `%${name}%`)
    .maybeSingle();

  if (!avatar) {
    return interaction.editReply('❌ Avatar introuvable.');
  }

  const { data: unlocked } = await supabase
    .from('player_avatars')
    .select('*')
    .eq('player_id', player.discord_id)
    .eq('avatar_id', avatar.id)
    .maybeSingle();

  if (!unlocked) {
    return interaction.editReply('❌ Vous ne possédez pas cet avatar. Achetez-le d\'abord avec `/avatar buy`.');
  }

  await updatePlayerStats(player.discord_id, {
    avatar_id: avatar.id,
  });

  await interaction.editReply(`✅ Avatar changé en **${avatar.name}**!`);
}

async function showAvatarShop(interaction) {
  await interaction.deferReply();

  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: avatars } = await supabase
    .from('avatars')
    .select('*')
    .eq('premium_only', false)
    .order('price');

  if (!avatars || avatars.length === 0) {
    return interaction.editReply('❌ La boutique est vide. Demandez à un admin de créer des avatars.');
  }

  const { data: unlockedAvatars } = await supabase
    .from('player_avatars')
    .select('avatar_id')
    .eq('player_id', player.discord_id);

  const unlockedIds = new Set(unlockedAvatars?.map(ua => ua.avatar_id) || []);

  const embed = new EmbedBuilder()
    .setColor('#f39c12')
    .setTitle('🎭 Boutique d\'Avatars')
    .setDescription(`💰 Vos coins: ${player.coins}`);

  for (const avatar of avatars) {
    const owned = unlockedIds.has(avatar.id);

    embed.addFields({
      name: `${owned ? '✅ ' : ''}${avatar.name} (${avatar.rarity}) - ${avatar.price} coins`,
      value: avatar.description || 'Avatar cosmétique',
      inline: true,
    });
  }

  embed.setFooter({ text: 'Utilisez /avatar buy <nom> pour acheter' });

  await interaction.editReply({ embeds: [embed] });
}

async function buyAvatar(interaction) {
  await interaction.deferReply();

  const name = interaction.options.getString('name');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: avatar } = await supabase
    .from('avatars')
    .select('*')
    .ilike('name', `%${name}%`)
    .eq('premium_only', false)
    .maybeSingle();

  if (!avatar) {
    return interaction.editReply('❌ Avatar introuvable ou non disponible.');
  }

  const { data: existing } = await supabase
    .from('player_avatars')
    .select('*')
    .eq('player_id', player.discord_id)
    .eq('avatar_id', avatar.id)
    .maybeSingle();

  if (existing) {
    return interaction.editReply('❌ Vous possédez déjà cet avatar.');
  }

  if (player.coins < avatar.price) {
    return interaction.editReply(`❌ Pas assez de coins. Coût: ${avatar.price}, Vous: ${player.coins}`);
  }

  await supabase
    .from('player_avatars')
    .insert({
      player_id: player.discord_id,
      avatar_id: avatar.id,
    });

  await updatePlayerStats(player.discord_id, {
    coins: player.coins - avatar.price,
    avatar_id: avatar.id,
  });

  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('🎭 Avatar Acheté!')
    .setDescription(`**${avatar.name}** (${avatar.rarity})`)
    .addFields({ name: '💰 Prix', value: `${avatar.price} coins`, inline: true });

  if (avatar.image_url) {
    embed.setThumbnail(avatar.image_url);
  }

  await interaction.editReply({ embeds: [embed] });
}
