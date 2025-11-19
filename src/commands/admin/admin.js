const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { supabase } = require('../../config/supabase');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Commandes d\'administration')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommandGroup(group =>
      group
        .setName('class')
        .setDescription('Gérer les classes')
        .addSubcommand(subcommand =>
          subcommand
            .setName('create')
            .setDescription('Créer une nouvelle classe')
            .addStringOption(option =>
              option
                .setName('name')
                .setDescription('Nom de la classe')
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName('rarity')
                .setDescription('Rareté')
                .setRequired(true)
                .addChoices(
                  { name: 'Commun', value: 'Common' },
                  { name: 'Rare', value: 'Rare' },
                  { name: 'Épique', value: 'Epic' },
                  { name: 'Légendaire', value: 'Legendary' }
                ))
            .addStringOption(option =>
              option
                .setName('description')
                .setDescription('Description de la classe')))
        .addSubcommand(subcommand =>
          subcommand
            .setName('list')
            .setDescription('Lister toutes les classes')))
    .addSubcommandGroup(group =>
      group
        .setName('spell')
        .setDescription('Gérer les sorts')
        .addSubcommand(subcommand =>
          subcommand
            .setName('create')
            .setDescription('Créer un nouveau sort')
            .addStringOption(option =>
              option
                .setName('class_name')
                .setDescription('Nom de la classe')
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName('name')
                .setDescription('Nom du sort')
                .setRequired(true))
            .addIntegerOption(option =>
              option
                .setName('mana_cost')
                .setDescription('Coût en mana')
                .setRequired(true))
            .addIntegerOption(option =>
              option
                .setName('base_damage')
                .setDescription('Dégâts de base')
                .setRequired(true))
            .addIntegerOption(option =>
              option
                .setName('price')
                .setDescription('Prix d\'achat')
                .setRequired(true)))
        .addSubcommand(subcommand =>
          subcommand
            .setName('list')
            .setDescription('Lister tous les sorts')))
    .addSubcommandGroup(group =>
      group
        .setName('enemy')
        .setDescription('Gérer les ennemis')
        .addSubcommand(subcommand =>
          subcommand
            .setName('create')
            .setDescription('Créer un nouvel ennemi')
            .addStringOption(option =>
              option
                .setName('name')
                .setDescription('Nom de l\'ennemi')
                .setRequired(true))
            .addIntegerOption(option =>
              option
                .setName('level')
                .setDescription('Niveau')
                .setRequired(true))
            .addIntegerOption(option =>
              option
                .setName('hp')
                .setDescription('Points de vie')
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName('image_url')
                .setDescription('URL de l\'image')
                .setRequired(true)))
        .addSubcommand(subcommand =>
          subcommand
            .setName('list')
            .setDescription('Lister tous les ennemis')))
    .addSubcommandGroup(group =>
      group
        .setName('player')
        .setDescription('Gérer les joueurs')
        .addSubcommand(subcommand =>
          subcommand
            .setName('set_coins')
            .setDescription('Modifier les coins d\'un joueur')
            .addUserOption(option =>
              option
                .setName('user')
                .setDescription('Le joueur')
                .setRequired(true))
            .addIntegerOption(option =>
              option
                .setName('amount')
                .setDescription('Montant')
                .setRequired(true)))
        .addSubcommand(subcommand =>
          subcommand
            .setName('set_level')
            .setDescription('Modifier le niveau d\'un joueur')
            .addUserOption(option =>
              option
                .setName('user')
                .setDescription('Le joueur')
                .setRequired(true))
            .addIntegerOption(option =>
              option
                .setName('level')
                .setDescription('Niveau')
                .setRequired(true)))),

  async execute(interaction) {
    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (group === 'class') {
      if (subcommand === 'create') {
        await createClass(interaction);
      } else if (subcommand === 'list') {
        await listClasses(interaction);
      }
    } else if (group === 'spell') {
      if (subcommand === 'create') {
        await createSpell(interaction);
      } else if (subcommand === 'list') {
        await listSpells(interaction);
      }
    } else if (group === 'enemy') {
      if (subcommand === 'create') {
        await createEnemy(interaction);
      } else if (subcommand === 'list') {
        await listEnemies(interaction);
      }
    } else if (group === 'player') {
      if (subcommand === 'set_coins') {
        await setPlayerCoins(interaction);
      } else if (subcommand === 'set_level') {
        await setPlayerLevel(interaction);
      }
    }
  },
};

async function createClass(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const name = interaction.options.getString('name');
  const rarity = interaction.options.getString('rarity');
  const description = interaction.options.getString('description') || '';

  const { data, error } = await supabase
    .from('classes')
    .insert({
      name,
      rarity,
      description,
    })
    .select()
    .single();

  if (error) {
    return interaction.editReply(`❌ Erreur: ${error.message}`);
  }

  await interaction.editReply(`✅ Classe **${name}** (${rarity}) créée avec succès!\nID: ${data.id}`);
}

async function listClasses(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const { data: classes } = await supabase
    .from('classes')
    .select('*')
    .order('name');

  if (!classes || classes.length === 0) {
    return interaction.editReply('❌ Aucune classe créée.');
  }

  const embed = new EmbedBuilder()
    .setColor('#3498db')
    .setTitle('📋 Liste des Classes');

  for (const cls of classes) {
    embed.addFields({
      name: `${cls.name} (${cls.rarity})`,
      value: `FOR: ${cls.strength_modifier} | INT: ${cls.intelligence_modifier} | AGI: ${cls.agility_modifier}`,
      inline: false,
    });
  }

  await interaction.editReply({ embeds: [embed] });
}

async function createSpell(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const className = interaction.options.getString('class_name');
  const name = interaction.options.getString('name');
  const manaCost = interaction.options.getInteger('mana_cost');
  const baseDamage = interaction.options.getInteger('base_damage');
  const price = interaction.options.getInteger('price');

  const { data: cls } = await supabase
    .from('classes')
    .select('*')
    .ilike('name', `%${className}%`)
    .maybeSingle();

  if (!cls) {
    return interaction.editReply('❌ Classe introuvable.');
  }

  const { data, error } = await supabase
    .from('spells')
    .insert({
      class_id: cls.id,
      name,
      mana_cost: manaCost,
      base_damage: baseDamage,
      price,
      damage_type: 'physical',
      scaling_stat: 'strength',
    })
    .select()
    .single();

  if (error) {
    return interaction.editReply(`❌ Erreur: ${error.message}`);
  }

  await interaction.editReply(`✅ Sort **${name}** créé pour la classe **${cls.name}**!\nDégâts: ${baseDamage} | Mana: ${manaCost} | Prix: ${price}`);
}

async function listSpells(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const { data: spells } = await supabase
    .from('spells')
    .select('*, class:classes(name)')
    .order('name');

  if (!spells || spells.length === 0) {
    return interaction.editReply('❌ Aucun sort créé.');
  }

  const embed = new EmbedBuilder()
    .setColor('#9b59b6')
    .setTitle('📋 Liste des Sorts');

  for (const spell of spells) {
    embed.addFields({
      name: `${spell.name} (${spell.class?.name || 'Aucune classe'})`,
      value: `Dégâts: ${spell.base_damage} | Mana: ${spell.mana_cost} | Prix: ${spell.price}`,
      inline: false,
    });
  }

  await interaction.editReply({ embeds: [embed] });
}

async function createEnemy(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const name = interaction.options.getString('name');
  const level = interaction.options.getInteger('level');
  const hp = interaction.options.getInteger('hp');
  const imageUrl = interaction.options.getString('image_url');

  const strength = Math.floor(level * 1.5);
  const xpReward = Math.floor(level * 50);
  const coinReward = Math.floor(level * 25);

  const { data, error } = await supabase
    .from('enemies')
    .insert({
      name,
      level,
      hp,
      image_url: imageUrl,
      strength,
      intelligence: 5,
      agility: 5,
      xp_reward: xpReward,
      coin_reward: coinReward,
    })
    .select()
    .single();

  if (error) {
    return interaction.editReply(`❌ Erreur: ${error.message}`);
  }

  await interaction.editReply(`✅ Ennemi **${name}** (Niv. ${level}) créé!\nHP: ${hp} | FOR: ${strength}\nRécompenses: ${xpReward} XP, ${coinReward} coins`);
}

async function listEnemies(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const { data: enemies } = await supabase
    .from('enemies')
    .select('*')
    .order('level');

  if (!enemies || enemies.length === 0) {
    return interaction.editReply('❌ Aucun ennemi créé.');
  }

  const embed = new EmbedBuilder()
    .setColor('#e74c3c')
    .setTitle('📋 Liste des Ennemis');

  for (const enemy of enemies) {
    embed.addFields({
      name: `${enemy.name} (Niv. ${enemy.level})`,
      value: `HP: ${enemy.hp} | FOR: ${enemy.strength} | Récompenses: ${enemy.xp_reward} XP, ${enemy.coin_reward} coins`,
      inline: false,
    });
  }

  await interaction.editReply({ embeds: [embed] });
}

async function setPlayerCoins(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const user = interaction.options.getUser('user');
  const amount = interaction.options.getInteger('amount');

  const { error } = await supabase
    .from('players')
    .update({ coins: amount })
    .eq('discord_id', user.id);

  if (error) {
    return interaction.editReply(`❌ Erreur: ${error.message}`);
  }

  await interaction.editReply(`✅ Coins de **${user.username}** définis à ${amount}.`);
}

async function setPlayerLevel(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const user = interaction.options.getUser('user');
  const level = interaction.options.getInteger('level');

  const { error } = await supabase
    .from('players')
    .update({ level })
    .eq('discord_id', user.id);

  if (error) {
    return interaction.editReply(`❌ Erreur: ${error.message}`);
  }

  await interaction.editReply(`✅ Niveau de **${user.username}** défini à ${level}.`);
}
