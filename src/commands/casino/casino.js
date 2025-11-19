const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { supabase } = require('../../config/supabase');
const { getOrCreatePlayer, updatePlayerStats } = require('../../utils/player');

const activeSessions = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('casino')
    .setDescription('Accéder au casino')
    .addSubcommand(subcommand =>
      subcommand
        .setName('roulette')
        .setDescription('Jouer à la roulette')
        .addIntegerOption(option =>
          option
            .setName('bet')
            .setDescription('Montant de la mise')
            .setRequired(true)
            .setMinValue(1))
        .addStringOption(option =>
          option
            .setName('choice')
            .setDescription('Votre pari')
            .setRequired(true)
            .addChoices(
              { name: 'Rouge', value: 'rouge' },
              { name: 'Noir', value: 'noir' },
              { name: 'Pair', value: 'pair' },
              { name: 'Impair', value: 'impair' }
            )))
    .addSubcommand(subcommand =>
      subcommand
        .setName('blackjack')
        .setDescription('Jouer au blackjack')
        .addIntegerOption(option =>
          option
            .setName('bet')
            .setDescription('Montant de la mise')
            .setRequired(true)
            .setMinValue(1)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('slots')
        .setDescription('Jouer aux machines à sous')
        .addIntegerOption(option =>
          option
            .setName('bet')
            .setDescription('Montant de la mise')
            .setRequired(true)
            .setMinValue(1))),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'roulette') {
      await playRoulette(interaction);
    } else if (subcommand === 'blackjack') {
      await playBlackjack(interaction);
    } else if (subcommand === 'slots') {
      await playSlots(interaction);
    }
  },
};

async function playRoulette(interaction) {
  await interaction.deferReply();

  const bet = interaction.options.getInteger('bet');
  const choice = interaction.options.getString('choice');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: config } = await supabase
    .from('casino_config')
    .select('*')
    .eq('game_type', 'roulette')
    .maybeSingle();

  if (!config || !config.enabled) {
    return interaction.editReply('❌ La roulette est actuellement désactivée.');
  }

  if (bet < config.min_bet || bet > config.max_bet) {
    return interaction.editReply(`❌ Mise invalide. Min: ${config.min_bet}, Max: ${config.max_bet}`);
  }

  if (player.coins < bet) {
    return interaction.editReply(`❌ Pas assez de coins. Vous: ${player.coins}`);
  }

  const result = Math.floor(Math.random() * 37);
  const isRouge = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(result);
  const isNoir = result !== 0 && !isRouge;
  const isPair = result !== 0 && result % 2 === 0;
  const isImpair = result !== 0 && result % 2 === 1;

  let won = false;
  let multiplier = 0;

  if (choice === 'rouge' && isRouge) {
    won = true;
    multiplier = config.config.multipliers.rouge;
  } else if (choice === 'noir' && isNoir) {
    won = true;
    multiplier = config.config.multipliers.noir;
  } else if (choice === 'pair' && isPair) {
    won = true;
    multiplier = config.config.multipliers.pair;
  } else if (choice === 'impair' && isImpair) {
    won = true;
    multiplier = config.config.multipliers.impair;
  }

  const winnings = won ? bet * multiplier : -bet;

  await updatePlayerStats(player.discord_id, {
    coins: player.coins + winnings,
  });

  const embed = new EmbedBuilder()
    .setColor(won ? '#00FF00' : '#FF0000')
    .setTitle('🎰 Roulette')
    .setDescription(`La boule s'arrête sur... **${result}** ${isRouge ? '🔴' : isNoir ? '⚫' : '🟢'}`)
    .addFields(
      { name: 'Votre pari', value: choice, inline: true },
      { name: 'Mise', value: `${bet} coins`, inline: true },
      { name: 'Résultat', value: won ? `✅ Gagné ${winnings} coins!` : `❌ Perdu ${Math.abs(winnings)} coins`, inline: true },
      { name: 'Nouveau solde', value: `${player.coins + winnings} coins`, inline: false }
    );

  await interaction.editReply({ embeds: [embed] });
}

async function playBlackjack(interaction) {
  if (activeSessions.has(interaction.user.id)) {
    return interaction.reply({ content: '❌ Vous avez déjà une partie en cours.', ephemeral: true });
  }

  await interaction.deferReply();

  const bet = interaction.options.getInteger('bet');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: config } = await supabase
    .from('casino_config')
    .select('*')
    .eq('game_type', 'blackjack')
    .maybeSingle();

  if (!config || !config.enabled) {
    return interaction.editReply('❌ Le blackjack est actuellement désactivé.');
  }

  if (bet < config.min_bet || bet > config.max_bet) {
    return interaction.editReply(`❌ Mise invalide. Min: ${config.min_bet}, Max: ${config.max_bet}`);
  }

  if (player.coins < bet) {
    return interaction.editReply(`❌ Pas assez de coins. Vous: ${player.coins}`);
  }

  const playerHand = [drawCard(), drawCard()];
  const dealerHand = [drawCard(), drawCard()];

  const gameState = {
    playerHand,
    dealerHand,
    bet,
    playerId: player.discord_id,
    playerCoins: player.coins,
    config: config.config,
  };

  activeSessions.set(interaction.user.id, gameState);

  const embed = createBlackjackEmbed(gameState, false);
  const buttons = createBlackjackButtons();

  const message = await interaction.editReply({ embeds: [embed], components: [buttons] });

  const collector = message.createMessageComponentCollector({
    filter: i => i.user.id === interaction.user.id,
    time: 60000,
  });

  collector.on('collect', async i => {
    await handleBlackjackAction(i, gameState);
  });

  collector.on('end', () => {
    activeSessions.delete(interaction.user.id);
  });
}

function drawCard() {
  return Math.floor(Math.random() * 13) + 1;
}

function getCardValue(card) {
  if (card > 10) return 10;
  return card;
}

function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card === 1) {
      aces++;
      value += 11;
    } else {
      value += getCardValue(card);
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

function createBlackjackEmbed(state, showDealer) {
  const playerValue = calculateHandValue(state.playerHand);
  const dealerValue = calculateHandValue(state.dealerHand);

  const embed = new EmbedBuilder()
    .setColor('#2ecc71')
    .setTitle('🃏 Blackjack')
    .addFields(
      {
        name: '🎴 Vos cartes',
        value: `${state.playerHand.join(', ')} = **${playerValue}**`,
        inline: false,
      },
      {
        name: '🎴 Cartes du croupier',
        value: showDealer
          ? `${state.dealerHand.join(', ')} = **${dealerValue}**`
          : `${state.dealerHand[0]}, ?`,
        inline: false,
      },
      { name: '💰 Mise', value: `${state.bet} coins`, inline: true }
    );

  return embed;
}

function createBlackjackButtons() {
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('bj_hit')
        .setLabel('🎴 Hit')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('bj_stand')
        .setLabel('✋ Stand')
        .setStyle(ButtonStyle.Success)
    );

  return row;
}

async function handleBlackjackAction(interaction, state) {
  await interaction.deferUpdate();

  const action = interaction.customId;

  if (action === 'bj_hit') {
    state.playerHand.push(drawCard());
    const playerValue = calculateHandValue(state.playerHand);

    if (playerValue > 21) {
      await endBlackjack(interaction, state, 'bust');
      return;
    }

    const embed = createBlackjackEmbed(state, false);
    const buttons = createBlackjackButtons();

    await interaction.editReply({ embeds: [embed], components: [buttons] });
  } else if (action === 'bj_stand') {
    while (calculateHandValue(state.dealerHand) < 17) {
      state.dealerHand.push(drawCard());
    }

    const playerValue = calculateHandValue(state.playerHand);
    const dealerValue = calculateHandValue(state.dealerHand);

    let result;
    if (dealerValue > 21) {
      result = 'dealer_bust';
    } else if (playerValue > dealerValue) {
      result = 'win';
    } else if (playerValue < dealerValue) {
      result = 'lose';
    } else {
      result = 'tie';
    }

    await endBlackjack(interaction, state, result);
  }
}

async function endBlackjack(interaction, state, result) {
  activeSessions.delete(state.playerId);

  let winnings = 0;
  let message = '';

  if (result === 'bust') {
    winnings = -state.bet;
    message = '💀 Bust! Vous avez dépassé 21.';
  } else if (result === 'dealer_bust') {
    winnings = state.bet * state.config.win_multiplier;
    message = '🎉 Le croupier a dépassé 21! Vous gagnez!';
  } else if (result === 'win') {
    const playerValue = calculateHandValue(state.playerHand);
    if (playerValue === 21 && state.playerHand.length === 2) {
      winnings = state.bet * state.config.blackjack_multiplier;
      message = '🃏 BLACKJACK! Vous gagnez!';
    } else {
      winnings = state.bet * state.config.win_multiplier;
      message = '✅ Vous gagnez!';
    }
  } else if (result === 'lose') {
    winnings = -state.bet;
    message = '❌ Le croupier gagne.';
  } else if (result === 'tie') {
    winnings = 0;
    message = '🤝 Égalité! Mise remboursée.';
  }

  await updatePlayerStats(state.playerId, {
    coins: state.playerCoins + winnings,
  });

  const embed = createBlackjackEmbed(state, true);
  embed.setDescription(message);
  embed.addFields({
    name: 'Gains/Pertes',
    value: `${winnings >= 0 ? '+' : ''}${winnings} coins`,
    inline: true,
  });
  embed.addFields({
    name: 'Nouveau solde',
    value: `${state.playerCoins + winnings} coins`,
    inline: true,
  });

  await interaction.editReply({ embeds: [embed], components: [] });
}

async function playSlots(interaction) {
  await interaction.deferReply();

  const bet = interaction.options.getInteger('bet');
  const player = await getOrCreatePlayer(interaction.user.id, interaction.user.username);

  const { data: config } = await supabase
    .from('casino_config')
    .select('*')
    .eq('game_type', 'slots')
    .maybeSingle();

  if (!config || !config.enabled) {
    return interaction.editReply('❌ Les slots sont actuellement désactivés.');
  }

  if (bet < config.min_bet || bet > config.max_bet) {
    return interaction.editReply(`❌ Mise invalide. Min: ${config.min_bet}, Max: ${config.max_bet}`);
  }

  if (player.coins < bet) {
    return interaction.editReply(`❌ Pas assez de coins. Vous: ${player.coins}`);
  }

  const symbols = ['🍒', '🍋', '⭐', '💎', '7️⃣'];
  const weights = [40, 30, 20, 8, 2];

  function spinReel() {
    const total = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * total;

    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) return symbols[i];
    }

    return symbols[0];
  }

  const reel1 = spinReel();
  const reel2 = spinReel();
  const reel3 = spinReel();

  let winnings = 0;
  let resultText = '';

  if (reel1 === reel2 && reel2 === reel3) {
    const symbolMultipliers = {
      '🍒': 3,
      '🍋': 5,
      '⭐': 10,
      '💎': 25,
      '7️⃣': 50,
    };

    const multiplier = symbolMultipliers[reel1] || 3;
    winnings = bet * multiplier;
    resultText = `🎉 JACKPOT! Triple ${reel1} - x${multiplier}`;
  } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
    winnings = bet * 2;
    resultText = '✨ Double! x2';
  } else {
    winnings = -bet;
    resultText = '❌ Aucune combinaison';
  }

  await updatePlayerStats(player.discord_id, {
    coins: player.coins + winnings,
  });

  const embed = new EmbedBuilder()
    .setColor(winnings > 0 ? '#00FF00' : '#FF0000')
    .setTitle('🎰 Machine à Sous')
    .setDescription(`\n[ ${reel1} | ${reel2} | ${reel3} ]\n\n${resultText}`)
    .addFields(
      { name: 'Mise', value: `${bet} coins`, inline: true },
      { name: 'Gains/Pertes', value: `${winnings >= 0 ? '+' : ''}${winnings} coins`, inline: true },
      { name: 'Nouveau solde', value: `${player.coins + winnings} coins`, inline: false }
    );

  await interaction.editReply({ embeds: [embed] });
}
