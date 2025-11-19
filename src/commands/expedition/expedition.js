const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { supabase } = require('../../config/supabase');
const { getOrCreatePlayer, updatePlayerStats } = require('../../utils/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('expedition')
    .setDescription('Gérer vos expéditions')
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('Voir les expéditions disponibles'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Démarrer une expédition')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Nom de l\'expédition')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('status')
        .setDescription('Voir le statut de votre expédition'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('claim')
        .setDescription('Récupérer les récompenses de votre expédition')),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'list') {
      await listExpeditions(interaction);
    } else if (subcommand === 'start') {
      await startExpedition(interaction);
    } else if (subcommand === 'status') {
      await checkStatus(interaction);
    } else if (subcommand === 'claim') {
      await claimRewards(interaction);
    }
  },
};

async function listExpeditions(interaction) {
  await interaction.deferReply();

  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: expeditions } = await supabase
    .from('expeditions')
    .select('*')
    .lte('min_level', player.level)
    .order('min_level');

  if (!expeditions || expeditions.length === 0) {
    return interaction.editReply('❌ Aucune expédition disponible. Demandez à un admin d\'en créer.');
  }

  const embed = new EmbedBuilder()
    .setColor('#e67e22')
    .setTitle('🗺️ Expéditions Disponibles')
    .setDescription(`Niveau requis pour votre niveau (${player.level})`);

  for (const exp of expeditions) {
    const hours = Math.floor(exp.duration_minutes / 60);
    const minutes = exp.duration_minutes % 60;
    const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    embed.addFields({
      name: `${exp.name} (Niv. ${exp.min_level})`,
      value: `${exp.description}\n⏱️ Durée: ${duration}`,
      inline: false,
    });
  }

  embed.setFooter({ text: 'Utilisez /expedition start <nom> pour démarrer' });

  await interaction.editReply({ embeds: [embed] });
}

async function startExpedition(interaction) {
  await interaction.deferReply();

  const name = interaction.options.getString('name');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: activeExpedition } = await supabase
    .from('player_expeditions')
    .select('*')
    .eq('player_id', player.discord_id)
    .eq('claimed', false)
    .maybeSingle();

  if (activeExpedition) {
    return interaction.editReply('❌ Vous avez déjà une expédition en cours. Utilisez `/expedition status` pour voir le temps restant.');
  }

  const { data: expedition } = await supabase
    .from('expeditions')
    .select('*')
    .ilike('name', `%${name}%`)
    .maybeSingle();

  if (!expedition) {
    return interaction.editReply('❌ Expédition introuvable.');
  }

  if (player.level < expedition.min_level) {
    return interaction.editReply(`❌ Niveau requis: ${expedition.min_level}. Votre niveau: ${player.level}`);
  }

  const now = new Date();
  const endsAt = new Date(now.getTime() + expedition.duration_minutes * 60000);

  await supabase
    .from('player_expeditions')
    .insert({
      player_id: player.discord_id,
      expedition_id: expedition.id,
      started_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      claimed: false,
    });

  const hours = Math.floor(expedition.duration_minutes / 60);
  const minutes = expedition.duration_minutes % 60;
  const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('🗺️ Expédition Démarrée!')
    .setDescription(`Vous partez en expédition: **${expedition.name}**`)
    .addFields(
      { name: '⏱️ Durée', value: duration, inline: true },
      { name: '🏁 Fin', value: `<t:${Math.floor(endsAt.getTime() / 1000)}:R>`, inline: true }
    )
    .setFooter({ text: 'Utilisez /expedition claim quand l\'expédition est terminée' });

  await interaction.editReply({ embeds: [embed] });
}

async function checkStatus(interaction) {
  await interaction.deferReply();

  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: activeExpedition } = await supabase
    .from('player_expeditions')
    .select('*, expedition:expeditions(*)')
    .eq('player_id', player.discord_id)
    .eq('claimed', false)
    .maybeSingle();

  if (!activeExpedition) {
    return interaction.editReply('❌ Vous n\'avez aucune expédition en cours.');
  }

  const now = new Date();
  const endsAt = new Date(activeExpedition.ends_at);
  const isComplete = now >= endsAt;

  const embed = new EmbedBuilder()
    .setColor(isComplete ? '#00FF00' : '#e67e22')
    .setTitle('🗺️ Statut de l\'Expédition')
    .setDescription(`**${activeExpedition.expedition.name}**`)
    .addFields(
      { name: '⏱️ Statut', value: isComplete ? '✅ Terminée!' : '🔄 En cours...', inline: true },
      { name: '🏁 Fin', value: `<t:${Math.floor(endsAt.getTime() / 1000)}:R>`, inline: true }
    );

  if (isComplete) {
    embed.setFooter({ text: 'Utilisez /expedition claim pour récupérer vos récompenses!' });
  }

  await interaction.editReply({ embeds: [embed] });
}

async function claimRewards(interaction) {
  await interaction.deferReply();

  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: activeExpedition } = await supabase
    .from('player_expeditions')
    .select('*, expedition:expeditions(*)')
    .eq('player_id', player.discord_id)
    .eq('claimed', false)
    .maybeSingle();

  if (!activeExpedition) {
    return interaction.editReply('❌ Vous n\'avez aucune expédition à récupérer.');
  }

  const now = new Date();
  const endsAt = new Date(activeExpedition.ends_at);

  if (now < endsAt) {
    return interaction.editReply(`❌ Expédition non terminée. Fin: <t:${Math.floor(endsAt.getTime() / 1000)}:R>`);
  }

  const rewards = calculateExpeditionRewards(activeExpedition.expedition, player);

  await updatePlayerStats(player.discord_id, {
    coins: player.coins + rewards.coins,
    xp: player.xp + rewards.xp,
  });

  for (const item of rewards.items) {
    if (item.type === 'artifact') {
      await supabase.from('player_artifacts').insert({
        player_id: player.discord_id,
        artifact_id: item.id,
        equipped: false,
        durability: 100,
      });
    } else if (item.type === 'material') {
      const { data: existing } = await supabase
        .from('player_inventory')
        .select('*')
        .eq('player_id', player.discord_id)
        .eq('item_type', 'material')
        .eq('item_id', item.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('player_inventory')
          .update({ quantity: existing.quantity + item.quantity })
          .eq('id', existing.id);
      } else {
        await supabase.from('player_inventory').insert({
          player_id: player.discord_id,
          item_type: 'material',
          item_id: item.id,
          quantity: item.quantity,
        });
      }
    }
  }

  await supabase
    .from('player_expeditions')
    .update({ claimed: true, rewards: rewards })
    .eq('id', activeExpedition.id);

  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('🎉 Expédition Terminée!')
    .setDescription(`Vous avez terminé **${activeExpedition.expedition.name}**!`)
    .addFields(
      { name: '💰 Coins', value: `+${rewards.coins}`, inline: true },
      { name: '✨ XP', value: `+${rewards.xp}`, inline: true }
    );

  if (rewards.items.length > 0) {
    const itemText = rewards.items.map(i => `${i.type === 'artifact' ? '⚔️' : '🔨'} ${i.name || i.id}`).join('\n');
    embed.addFields({ name: '🎁 Items', value: itemText, inline: false });
  }

  await interaction.editReply({ embeds: [embed] });
}

function calculateExpeditionRewards(expedition, player) {
  const rewards = {
    coins: 0,
    xp: 0,
    items: [],
  };

  if (!expedition.rewards || expedition.rewards.length === 0) {
    rewards.coins = Math.floor(100 + Math.random() * 200);
    rewards.xp = Math.floor(50 + Math.random() * 100);
    return rewards;
  }

  for (const rewardEntry of expedition.rewards) {
    const roll = Math.random() * 100;

    if (roll < rewardEntry.chance) {
      if (rewardEntry.type === 'coins') {
        const amount = rewardEntry.min + Math.floor(Math.random() * (rewardEntry.max - rewardEntry.min + 1));
        rewards.coins += amount;
      } else if (rewardEntry.type === 'xp') {
        const amount = rewardEntry.min + Math.floor(Math.random() * (rewardEntry.max - rewardEntry.min + 1));
        rewards.xp += amount;
      } else if (rewardEntry.type === 'artifact') {
        rewards.items.push({
          type: 'artifact',
          id: rewardEntry.artifact_id,
          name: rewardEntry.name || 'Artefact',
        });
      } else if (rewardEntry.type === 'material') {
        rewards.items.push({
          type: 'material',
          id: rewardEntry.material_id,
          name: rewardEntry.name || 'Matériau',
          quantity: rewardEntry.quantity || 1,
        });
      }
    }
  }

  return rewards;
}
