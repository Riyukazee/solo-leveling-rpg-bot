const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { supabase } = require('../../config/supabase');
const { getOrCreatePlayer } = require('../../utils/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('artifact')
    .setDescription('Gérer vos artefacts')
    .addSubcommand(subcommand =>
      subcommand
        .setName('equip')
        .setDescription('Équiper un artefact')
        .addStringOption(option =>
          option
            .setName('name')
            .setDescription('Nom de l\'artefact')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('unequip')
        .setDescription('Déséquiper un artefact')
        .addStringOption(option =>
          option
            .setName('slot')
            .setDescription('Emplacement de l\'artefact')
            .setRequired(true)
            .addChoices(
              { name: 'Arme', value: 'weapon' },
              { name: 'Casque', value: 'helmet' },
              { name: 'Torse', value: 'chest' },
              { name: 'Anneau', value: 'ring' },
              { name: 'Amulette', value: 'amulet' }
            )))
    .addSubcommand(subcommand =>
      subcommand
        .setName('shop')
        .setDescription('Voir la boutique d\'artefacts')),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'equip') {
      await equipArtifact(interaction);
    } else if (subcommand === 'unequip') {
      await unequipArtifact(interaction);
    } else if (subcommand === 'shop') {
      await showArtifactShop(interaction);
    }
  },
};

async function equipArtifact(interaction) {
  await interaction.deferReply();

  const name = interaction.options.getString('name');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: playerArtifact } = await supabase
    .from('player_artifacts')
    .select('*, artifact:artifacts(*)')
    .eq('player_id', player.discord_id)
    .ilike('artifact.name', `%${name}%`)
    .eq('equipped', false)
    .maybeSingle();

  if (!playerArtifact) {
    return interaction.editReply('❌ Artefact non trouvé dans votre inventaire ou déjà équipé.');
  }

  const slot = playerArtifact.artifact.slot;

  await supabase
    .from('player_artifacts')
    .update({ equipped: false })
    .eq('player_id', player.discord_id)
    .eq('equipped', true)
    .eq('artifact.slot', slot);

  await supabase
    .from('player_artifacts')
    .update({ equipped: true })
    .eq('id', playerArtifact.id);

  await interaction.editReply(`✅ **${playerArtifact.artifact.name}** équipé dans l'emplacement ${slot} !`);
}

async function unequipArtifact(interaction) {
  await interaction.deferReply();

  const slot = interaction.options.getString('slot');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: equipped } = await supabase
    .from('player_artifacts')
    .select('*, artifact:artifacts(*)')
    .eq('player_id', player.discord_id)
    .eq('equipped', true)
    .eq('artifact.slot', slot)
    .maybeSingle();

  if (!equipped) {
    return interaction.editReply(`❌ Aucun artefact équipé dans l'emplacement ${slot}.`);
  }

  await supabase
    .from('player_artifacts')
    .update({ equipped: false })
    .eq('id', equipped.id);

  await interaction.editReply(`✅ **${equipped.artifact.name}** déséquipé.`);
}

async function showArtifactShop(interaction) {
  await interaction.deferReply();

  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('*')
    .order('price');

  if (!artifacts || artifacts.length === 0) {
    return interaction.editReply('❌ La boutique est vide. Demandez à un admin de créer des artefacts.');
  }

  const embed = new EmbedBuilder()
    .setColor('#f39c12')
    .setTitle('🏪 Boutique d\'Artefacts')
    .setDescription(`💰 Vos coins: ${player.coins}`);

  for (const artifact of artifacts.slice(0, 10)) {
    const bonuses = [];
    if (artifact.strength_bonus > 0) bonuses.push(`+${artifact.strength_bonus} FOR`);
    if (artifact.intelligence_bonus > 0) bonuses.push(`+${artifact.intelligence_bonus} INT`);
    if (artifact.agility_bonus > 0) bonuses.push(`+${artifact.agility_bonus} AGI`);
    if (artifact.vitality_bonus > 0) bonuses.push(`+${artifact.vitality_bonus} VIT`);
    if (artifact.hp_bonus > 0) bonuses.push(`+${artifact.hp_bonus} HP`);
    if (artifact.mana_bonus > 0) bonuses.push(`+${artifact.mana_bonus} Mana`);

    embed.addFields({
      name: `${artifact.name} (${artifact.rarity}) - ${artifact.price} coins`,
      value: `📍 ${artifact.slot}\n${bonuses.join(' | ') || 'Aucun bonus'}`,
      inline: true,
    });
  }

  embed.setFooter({ text: 'Utilisez /admin artifact pour acheter (nécessite permission admin)' });

  await interaction.editReply({ embeds: [embed] });
}
