const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { supabase } = require('../../config/supabase');
const { getOrCreatePlayer, updatePlayerStats } = require('../../utils/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('booster')
    .setDescription('Gérer les boosters')
    .addSubcommand(subcommand =>
      subcommand
        .setName('shop')
        .setDescription('Voir les boosters disponibles'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('buy')
        .setDescription('Acheter un booster')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Nom du booster')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('open')
        .setDescription('Ouvrir un booster')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Nom du booster')
            .setRequired(true))),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'shop') {
      await showBoosterShop(interaction);
    } else if (subcommand === 'buy') {
      await buyBooster(interaction);
    } else if (subcommand === 'open') {
      await openBooster(interaction);
    }
  },
};

async function showBoosterShop(interaction) {
  await interaction.deferReply();

  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: boosters } = await supabase
    .from('boosters')
    .select('*')
    .eq('premium_only', false);

  if (!boosters || boosters.length === 0) {
    return interaction.editReply('❌ Aucun booster disponible. Demandez à un admin d\'en créer.');
  }

  const embed = new EmbedBuilder()
    .setColor('#9b59b6')
    .setTitle('🎁 Boutique de Boosters')
    .setDescription(`💰 Vos coins: ${player.coins}`);

  for (const booster of boosters) {
    embed.addFields({
      name: `${booster.name} - ${booster.price} coins`,
      value: booster.description || 'Pack mystérieux contenant des récompenses aléatoires',
      inline: false,
    });
  }

  embed.setFooter({ text: 'Utilisez /booster buy <nom> pour acheter' });

  await interaction.editReply({ embeds: [embed] });
}

async function buyBooster(interaction) {
  await interaction.deferReply();

  const name = interaction.options.getString('name');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: booster } = await supabase
    .from('boosters')
    .select('*')
    .ilike('name', `%${name}%`)
    .eq('premium_only', false)
    .maybeSingle();

  if (!booster) {
    return interaction.editReply('❌ Booster introuvable.');
  }

  if (player.coins < booster.price) {
    return interaction.editReply(`❌ Pas assez de coins. Coût: ${booster.price}, Vous: ${player.coins}`);
  }

  const { data: existing } = await supabase
    .from('player_inventory')
    .select('*')
    .eq('player_id', player.discord_id)
    .eq('item_type', 'booster')
    .eq('item_id', booster.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('player_inventory')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('player_inventory')
      .insert({
        player_id: player.discord_id,
        item_type: 'booster',
        item_id: booster.id,
        quantity: 1,
      });
  }

  await updatePlayerStats(player.discord_id, {
    coins: player.coins - booster.price,
  });

  await interaction.editReply(`✅ **${booster.name}** acheté! Utilisez \`/booster open ${booster.name}\` pour l'ouvrir.`);
}

async function openBooster(interaction) {
  await interaction.deferReply();

  const name = interaction.options.getString('name');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: booster } = await supabase
    .from('boosters')
    .select('*')
    .ilike('name', `%${name}%`)
    .maybeSingle();

  if (!booster) {
    return interaction.editReply('❌ Booster introuvable.');
  }

  const { data: inventory } = await supabase
    .from('player_inventory')
    .select('*')
    .eq('player_id', player.discord_id)
    .eq('item_type', 'booster')
    .eq('item_id', booster.id)
    .maybeSingle();

  if (!inventory || inventory.quantity < 1) {
    return interaction.editReply('❌ Vous ne possédez pas ce booster.');
  }

  const rewards = rollBoosterRewards(booster.loot_table);

  for (const reward of rewards) {
    if (reward.type === 'avatar') {
      const { data: existingAvatar } = await supabase
        .from('player_avatars')
        .select('*')
        .eq('player_id', player.discord_id)
        .eq('avatar_id', reward.id)
        .maybeSingle();

      if (!existingAvatar) {
        await supabase
          .from('player_avatars')
          .insert({
            player_id: player.discord_id,
            avatar_id: reward.id,
          });
      }
    } else if (reward.type === 'artifact') {
      await supabase
        .from('player_artifacts')
        .insert({
          player_id: player.discord_id,
          artifact_id: reward.id,
          equipped: false,
          durability: 100,
        });
    } else if (reward.type === 'coins') {
      await updatePlayerStats(player.discord_id, {
        coins: player.coins + reward.amount,
      });
    } else if (reward.type === 'class') {
      await updatePlayerStats(player.discord_id, {
        class_id: reward.id,
      });
    }
  }

  if (inventory.quantity > 1) {
    await supabase
      .from('player_inventory')
      .update({ quantity: inventory.quantity - 1 })
      .eq('id', inventory.id);
  } else {
    await supabase
      .from('player_inventory')
      .delete()
      .eq('id', inventory.id);
  }

  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('🎁 Ouverture de Booster!')
    .setDescription(`**${booster.name}**\n\n✨ Contenu obtenu:`);

  for (const reward of rewards) {
    let emoji = '🎁';
    let text = '';

    if (reward.type === 'avatar') {
      emoji = '🎭';
      text = `**${reward.name}** (${reward.rarity})`;
    } else if (reward.type === 'artifact') {
      emoji = '⚔️';
      text = `**${reward.name}** (${reward.rarity})`;
    } else if (reward.type === 'coins') {
      emoji = '💰';
      text = `**${reward.amount}** coins`;
    } else if (reward.type === 'class') {
      emoji = '🎭';
      text = `Classe: **${reward.name}** (${reward.rarity})`;
    }

    embed.addFields({
      name: `${emoji} ${reward.rarity || 'Commun'}`,
      value: text,
      inline: true,
    });
  }

  if (booster.image_url) {
    embed.setThumbnail(booster.image_url);
  }

  await interaction.editReply({ embeds: [embed] });
}

function rollBoosterRewards(lootTable) {
  const rewards = [];

  if (!lootTable || lootTable.length === 0) {
    rewards.push({
      type: 'coins',
      amount: 100 + Math.floor(Math.random() * 400),
      rarity: 'Commun',
    });
    return rewards;
  }

  for (const entry of lootTable) {
    const roll = Math.random() * 100;

    if (roll < entry.chance) {
      rewards.push({
        type: entry.type,
        id: entry.id,
        name: entry.name,
        rarity: entry.rarity,
        amount: entry.amount,
      });
    }
  }

  if (rewards.length === 0) {
    rewards.push({
      type: 'coins',
      amount: 50,
      rarity: 'Commun',
    });
  }

  return rewards;
}
