const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { supabase } = require('../../config/supabase');
const { getOrCreatePlayer } = require('../../utils/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spells')
    .setDescription('Gérer vos sorts')
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('Voir vos sorts disponibles'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('shop')
        .setDescription('Voir les sorts disponibles à l\'achat'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('buy')
        .setDescription('Acheter un sort')
        .addStringOption(option =>
          option
            .setName('spell_name')
            .setDescription('Nom du sort')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('equip')
        .setDescription('Équiper un sort')
        .addStringOption(option =>
          option
            .setName('spell_name')
            .setDescription('Nom du sort')
            .setRequired(true))
        .addIntegerOption(option =>
          option
            .setName('slot')
            .setDescription('Emplacement (1-4)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(4)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('unequip')
        .setDescription('Déséquiper un sort')
        .addIntegerOption(option =>
          option
            .setName('slot')
            .setDescription('Emplacement (1-4)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(4))),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'list') {
      await showPlayerSpells(interaction);
    } else if (subcommand === 'shop') {
      await showSpellShop(interaction);
    } else if (subcommand === 'buy') {
      await buySpell(interaction);
    } else if (subcommand === 'equip') {
      await equipSpell(interaction);
    } else if (subcommand === 'unequip') {
      await unequipSpell(interaction);
    }
  },
};

async function showPlayerSpells(interaction) {
  await interaction.deferReply();

  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: playerSpells } = await supabase
    .from('player_spells')
    .select('*, spell:spells(*)')
    .eq('player_id', player.discord_id);

  if (!playerSpells || playerSpells.length === 0) {
    return interaction.editReply('📚 Vous n\'avez aucun sort. Utilisez `/spells shop` pour en acheter.');
  }

  const embed = new EmbedBuilder()
    .setColor('#9b59b6')
    .setTitle('📚 Vos Sorts');

  const equipped = playerSpells.filter(ps => ps.slot !== null).sort((a, b) => a.slot - b.slot);
  const unequipped = playerSpells.filter(ps => ps.slot === null);

  if (equipped.length > 0) {
    let equipText = '';
    for (const ps of equipped) {
      const s = ps.spell;
      equipText += `**Slot ${ps.slot}**: ${s.name} (${s.mana_cost} mana) - ${s.base_damage} dégâts\n`;
    }
    embed.addFields({ name: '⚔️ Équipés', value: equipText, inline: false });
  }

  if (unequipped.length > 0) {
    let unequipText = '';
    for (const ps of unequipped) {
      const s = ps.spell;
      unequipText += `${s.name} (${s.mana_cost} mana) - ${s.base_damage} dégâts\n`;
    }
    embed.addFields({ name: '📦 Non équipés', value: unequipText, inline: false });
  }

  await interaction.editReply({ embeds: [embed] });
}

async function showSpellShop(interaction) {
  await interaction.deferReply();

  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  if (!player.class_id) {
    return interaction.editReply('❌ Vous devez avoir une classe pour acheter des sorts. Utilisez `/roll_class`.');
  }

  const { data: availableSpells } = await supabase
    .from('spells')
    .select('*')
    .eq('class_id', player.class_id)
    .lte('level_required', player.level);

  if (!availableSpells || availableSpells.length === 0) {
    return interaction.editReply('❌ Aucun sort disponible pour votre classe et niveau.');
  }

  const { data: ownedSpells } = await supabase
    .from('player_spells')
    .select('spell_id')
    .eq('player_id', player.discord_id);

  const ownedIds = new Set(ownedSpells?.map(ps => ps.spell_id) || []);

  const shopSpells = availableSpells.filter(s => !ownedIds.has(s.id));

  if (shopSpells.length === 0) {
    return interaction.editReply('✅ Vous possédez déjà tous les sorts disponibles !');
  }

  const embed = new EmbedBuilder()
    .setColor('#f39c12')
    .setTitle('🏪 Boutique de Sorts')
    .setDescription(`💰 Vos coins: ${player.coins}`);

  for (const spell of shopSpells) {
    embed.addFields({
      name: `${spell.name} - ${spell.price} coins`,
      value: `${spell.description}\n💙 Coût: ${spell.mana_cost} | ⚔️ Dégâts: ${spell.base_damage} (${spell.damage_type}) | 📊 Niv. ${spell.level_required}`,
      inline: false,
    });
  }

  embed.setFooter({ text: 'Utilisez /spells buy <nom> pour acheter' });

  await interaction.editReply({ embeds: [embed] });
}

async function buySpell(interaction) {
  await interaction.deferReply();

  const spellName = interaction.options.getString('spell_name');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  if (!player.class_id) {
    return interaction.editReply('❌ Vous devez avoir une classe.');
  }

  const { data: spell } = await supabase
    .from('spells')
    .select('*')
    .eq('class_id', player.class_id)
    .ilike('name', spellName)
    .lte('level_required', player.level)
    .maybeSingle();

  if (!spell) {
    return interaction.editReply('❌ Sort introuvable ou non disponible pour votre classe/niveau.');
  }

  const { data: existing } = await supabase
    .from('player_spells')
    .select('*')
    .eq('player_id', player.discord_id)
    .eq('spell_id', spell.id)
    .maybeSingle();

  if (existing) {
    return interaction.editReply('❌ Vous possédez déjà ce sort.');
  }

  if (player.coins < spell.price) {
    return interaction.editReply(`❌ Pas assez de coins. Coût: ${spell.price}, Vous: ${player.coins}`);
  }

  await supabase
    .from('player_spells')
    .insert({
      player_id: player.discord_id,
      spell_id: spell.id,
    });

  await supabase
    .from('players')
    .update({ coins: player.coins - spell.price })
    .eq('discord_id', player.discord_id);

  await interaction.editReply(`✅ **${spell.name}** acheté pour ${spell.price} coins !`);
}

async function equipSpell(interaction) {
  await interaction.deferReply();

  const spellName = interaction.options.getString('spell_name');
  const slot = interaction.options.getInteger('slot');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: playerSpell } = await supabase
    .from('player_spells')
    .select('*, spell:spells(*)')
    .eq('player_id', player.discord_id)
    .ilike('spell.name', spellName)
    .maybeSingle();

  if (!playerSpell) {
    return interaction.editReply('❌ Vous ne possédez pas ce sort.');
  }

  await supabase
    .from('player_spells')
    .update({ slot: null })
    .eq('player_id', player.discord_id)
    .eq('slot', slot);

  await supabase
    .from('player_spells')
    .update({ slot })
    .eq('player_id', player.discord_id)
    .eq('spell_id', playerSpell.spell_id);

  await interaction.editReply(`✅ **${playerSpell.spell.name}** équipé dans le slot ${slot} !`);
}

async function unequipSpell(interaction) {
  await interaction.deferReply();

  const slot = interaction.options.getInteger('slot');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: playerSpell } = await supabase
    .from('player_spells')
    .select('*, spell:spells(*)')
    .eq('player_id', player.discord_id)
    .eq('slot', slot)
    .maybeSingle();

  if (!playerSpell) {
    return interaction.editReply(`❌ Aucun sort équipé dans le slot ${slot}.`);
  }

  await supabase
    .from('player_spells')
    .update({ slot: null })
    .eq('player_id', player.discord_id)
    .eq('slot', slot);

  await interaction.editReply(`✅ **${playerSpell.spell.name}** déséquipé du slot ${slot}.`);
}
