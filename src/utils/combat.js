const { supabase } = require('../config/supabase');

function calculateDamage(attacker, defender, damageType, baseDamage, scalingStat) {
  let damage = baseDamage;

  if (scalingStat === 'strength') {
    damage += attacker.strength * 2;
  } else if (scalingStat === 'intelligence') {
    damage += attacker.intelligence * 2;
  } else if (scalingStat === 'agility') {
    damage += attacker.agility * 1.5;
  }

  if (attacker.damage_bonus) {
    damage *= (1 + attacker.damage_bonus);
  }

  const critChance = (attacker.agility / 100) + (attacker.crit_bonus || 0);
  const isCrit = Math.random() < critChance;

  if (isCrit) {
    damage *= 2;
  }

  const variation = 0.85 + (Math.random() * 0.3);
  damage *= variation;

  damage = Math.max(1, Math.floor(damage));

  return { damage, isCrit };
}

function calculateEnemyDamage(enemy, player) {
  let damage = enemy.strength * 1.5;

  const variation = 0.85 + (Math.random() * 0.3);
  damage *= variation;

  const dodgeChance = player.agility / 200;
  const isDodged = Math.random() < dodgeChance;

  if (isDodged) {
    damage = 0;
  }

  damage = Math.max(0, Math.floor(damage));

  return { damage, isDodged };
}

async function getRandomEnemy(playerLevel) {
  const minLevel = Math.max(1, playerLevel - 2);
  const maxLevel = playerLevel + 3;

  const { data: enemies } = await supabase
    .from('enemies')
    .select('*')
    .gte('level', minLevel)
    .lte('level', maxLevel);

  if (!enemies || enemies.length === 0) {
    const { data: allEnemies } = await supabase
      .from('enemies')
      .select('*')
      .limit(10);

    if (!allEnemies || allEnemies.length === 0) {
      return null;
    }

    return allEnemies[Math.floor(Math.random() * allEnemies.length)];
  }

  return enemies[Math.floor(Math.random() * enemies.length)];
}

function processLootTable(lootTable) {
  const rewards = {
    coins: 0,
    xp: 0,
    items: [],
  };

  if (!lootTable || lootTable.length === 0) {
    return rewards;
  }

  for (const entry of lootTable) {
    const roll = Math.random() * 100;

    if (roll < entry.chance) {
      if (entry.type === 'coins') {
        rewards.coins += entry.amount;
      } else if (entry.type === 'xp') {
        rewards.xp += entry.amount;
      } else if (entry.type === 'artifact') {
        rewards.items.push({
          type: 'artifact',
          id: entry.artifact_id,
        });
      } else if (entry.type === 'potion') {
        rewards.items.push({
          type: 'potion',
          id: entry.potion_id,
          quantity: entry.quantity || 1,
        });
      }
    }
  }

  return rewards;
}

module.exports = {
  calculateDamage,
  calculateEnemyDamage,
  getRandomEnemy,
  processLootTable,
};
