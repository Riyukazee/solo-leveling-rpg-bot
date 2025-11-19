-- Sample Data for Solo Leveling RPG Bot
-- Execute these queries in Supabase SQL Editor to quickly populate your database

-- ========================================
-- CLASSES
-- ========================================

INSERT INTO classes (name, description, rarity, hp_modifier, mana_modifier, strength_modifier, intelligence_modifier, agility_modifier, vitality_modifier, charisma_modifier) VALUES
('Novice', 'Classe de départ, stats équilibrées', 'Common', 1.0, 1.0, 0, 0, 0, 0, 0),
('Assassin', 'Spécialiste des attaques rapides et critiques', 'Rare', 0.9, 0.8, 5, 0, 10, -2, 0),
('Mage', 'Maître des arts magiques destructeurs', 'Epic', 0.7, 1.5, -3, 15, 0, -5, 5),
('Tank', 'Guerrier résistant avec beaucoup de HP', 'Rare', 1.5, 0.6, 8, 0, -3, 15, 0),
('Archer', 'Tireur d''élite avec précision mortelle', 'Rare', 0.9, 0.9, 3, 0, 12, 0, 3),
('Paladin', 'Guerrier saint combinant force et magie', 'Epic', 1.2, 1.1, 8, 8, 0, 10, 5),
('Necromancien', 'Invocateur de morts-vivants', 'Legendary', 0.8, 1.3, 0, 18, 0, 0, -5);

-- ========================================
-- SPELLS
-- ========================================

-- Spells pour Assassin
INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Shadow Strike', 'Frappe depuis les ombres', 15, 45, 'physical', 'agility', 1, 300 FROM classes WHERE name = 'Assassin';

INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Deadly Poison', 'Applique un poison mortel', 25, 60, 'physical', 'agility', 5, 800 FROM classes WHERE name = 'Assassin';

INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Backstab', 'Coup dans le dos dévastateur', 35, 90, 'physical', 'strength', 10, 1500 FROM classes WHERE name = 'Assassin';

-- Spells pour Mage
INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Fireball', 'Boule de feu explosive', 20, 55, 'magical', 'intelligence', 1, 400 FROM classes WHERE name = 'Mage';

INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Ice Storm', 'Tempête de glace dévastatrice', 30, 75, 'magical', 'intelligence', 5, 1000 FROM classes WHERE name = 'Mage';

INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Meteor', 'Invoque un météore destructeur', 50, 120, 'magical', 'intelligence', 15, 3000 FROM classes WHERE name = 'Mage';

-- Spells pour Tank
INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Shield Bash', 'Coup de bouclier étourdissant', 15, 35, 'physical', 'strength', 1, 250 FROM classes WHERE name = 'Tank';

INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Taunt', 'Provoque l''ennemi', 20, 40, 'physical', 'strength', 3, 600 FROM classes WHERE name = 'Tank';

INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Earthquake', 'Séisme dévastateur', 40, 85, 'physical', 'vitality', 10, 2000 FROM classes WHERE name = 'Tank';

-- Spells pour Archer
INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Piercing Arrow', 'Flèche perçante', 15, 50, 'physical', 'agility', 1, 350 FROM classes WHERE name = 'Archer';

INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Multi-Shot', 'Tir multiple', 25, 65, 'physical', 'agility', 5, 900 FROM classes WHERE name = 'Archer';

INSERT INTO spells (class_id, name, description, mana_cost, base_damage, damage_type, scaling_stat, level_required, price)
SELECT id, 'Rain of Arrows', 'Pluie de flèches', 45, 110, 'physical', 'agility', 12, 2500 FROM classes WHERE name = 'Archer';

-- ========================================
-- ENEMIES
-- ========================================

-- Niveau 1-5
INSERT INTO enemies (name, description, image_url, level, hp, strength, intelligence, agility, xp_reward, coin_reward) VALUES
('Goblin', 'Petite créature verte faible', 'https://i.imgur.com/goblin.png', 1, 50, 8, 3, 5, 50, 25),
('Slime', 'Masse gélatineuse', 'https://i.imgur.com/slime.png', 2, 70, 5, 0, 2, 75, 35),
('Loup', 'Loup sauvage affamé', 'https://i.imgur.com/wolf.png', 3, 90, 12, 2, 10, 100, 50),
('Bandit', 'Voleur de bas étage', 'https://i.imgur.com/bandit.png', 4, 110, 15, 5, 8, 125, 65),
('Goblin Guerrier', 'Goblin bien entraîné', 'https://i.imgur.com/goblin_warrior.png', 5, 130, 18, 5, 12, 150, 80);

-- Niveau 6-10
INSERT INTO enemies (name, description, image_url, level, hp, strength, intelligence, agility, xp_reward, coin_reward) VALUES
('Orc', 'Créature brutale et forte', 'https://i.imgur.com/orc.png', 6, 180, 25, 5, 8, 200, 100),
('Squelette', 'Guerrier mort-vivant', 'https://i.imgur.com/skeleton.png', 7, 160, 20, 8, 15, 250, 120),
('Zombie', 'Mort-vivant affamé', 'https://i.imgur.com/zombie.png', 8, 220, 28, 3, 5, 300, 150),
('Dark Wolf', 'Loup des ténèbres', 'https://i.imgur.com/dark_wolf.png', 9, 200, 30, 10, 20, 350, 180),
('Bandit Chef', 'Leader des bandits', 'https://i.imgur.com/bandit_chief.png', 10, 250, 35, 15, 18, 400, 200);

-- Niveau 11-20
INSERT INTO enemies (name, description, image_url, level, hp, strength, intelligence, agility, xp_reward, coin_reward) VALUES
('Troll', 'Géant régénérant', 'https://i.imgur.com/troll.png', 12, 400, 45, 8, 10, 600, 300),
('Dark Mage', 'Sorcier corrompu', 'https://i.imgur.com/dark_mage.png', 15, 350, 20, 60, 15, 900, 450),
('Golem', 'Créature de pierre', 'https://i.imgur.com/golem.png', 18, 600, 55, 5, 5, 1200, 600),
('Wyvern', 'Dragon mineur', 'https://i.imgur.com/wyvern.png', 20, 500, 50, 30, 35, 1500, 750);

-- Boss 20+
INSERT INTO enemies (name, description, image_url, level, hp, strength, intelligence, agility, xp_reward, coin_reward) VALUES
('Dragon Rouge', 'Dragon ancien craché le feu', 'https://i.imgur.com/red_dragon.png', 25, 1000, 80, 50, 40, 3000, 1500),
('Lich', 'Nécromancien immortel', 'https://i.imgur.com/lich.png', 30, 900, 40, 100, 30, 4000, 2000),
('Demon Lord', 'Seigneur des démons', 'https://i.imgur.com/demon_lord.png', 40, 2000, 120, 80, 60, 8000, 4000),
('Shadow King', 'Roi des ombres', 'https://i.imgur.com/shadow_king.png', 50, 3000, 150, 100, 80, 15000, 7500);

-- ========================================
-- ARTIFACTS
-- ========================================

-- Armes
INSERT INTO artifacts (name, description, rarity, slot, strength_bonus, intelligence_bonus, agility_bonus, damage_bonus, price) VALUES
('Épée Rouillée', 'Une vieille épée', 'Common', 'weapon', 3, 0, 0, 0.05, 100),
('Dague de Vol', 'Dague légère et rapide', 'Rare', 'weapon', 2, 0, 5, 0.10, 500),
('Bâton Magique', 'Bâton canaliseur de magie', 'Rare', 'weapon', 0, 8, 0, 0.15, 600),
('Épée du Dragon', 'Forgée avec des écailles de dragon', 'Epic', 'weapon', 15, 0, 5, 0.25, 2000),
('Arc Elfique', 'Arc des elfes anciens', 'Epic', 'weapon', 5, 0, 12, 0.20, 1800),
('Lame des Ombres', 'Épée légendaire des assassins', 'Legendary', 'weapon', 10, 0, 20, 0.40, 5000);

-- Casques
INSERT INTO artifacts (name, description, rarity, slot, vitality_bonus, intelligence_bonus, hp_bonus, price) VALUES
('Casque de Cuir', 'Protection basique', 'Common', 'helmet', 2, 0, 20, 80),
('Heaume de Fer', 'Casque solide', 'Rare', 'helmet', 5, 0, 50, 400),
('Couronne du Sage', 'Couronne magique', 'Epic', 'helmet', 3, 10, 30, 1500),
('Heaume de Dragon', 'Casque en écailles de dragon', 'Legendary', 'helmet', 15, 0, 150, 4000);

-- Armures
INSERT INTO artifacts (name, description, rarity, slot, vitality_bonus, strength_bonus, hp_bonus, price) VALUES
('Tunique Simple', 'Vêtement basique', 'Common', 'chest', 3, 0, 30, 100),
('Armure de Plates', 'Armure lourde', 'Rare', 'chest', 8, 3, 80, 600),
('Robe du Mage', 'Robe enchantée', 'Epic', 'chest', 5, 0, 50, 1200),
('Armure de Dragon', 'Armure complète en écailles', 'Legendary', 'chest', 20, 10, 200, 6000);

-- Anneaux
INSERT INTO artifacts (name, description, rarity, slot, agility_bonus, crit_bonus, price) VALUES
('Anneau de Bronze', 'Anneau simple', 'Common', 'ring', 1, 0.02, 50),
('Anneau de Vitesse', 'Augmente l''agilité', 'Rare', 'ring', 5, 0.05, 300),
('Anneau du Tueur', 'Augmente les critiques', 'Epic', 'ring', 8, 0.15, 1000),
('Anneau Légendaire', 'Puissance ultime', 'Legendary', 'ring', 15, 0.30, 3500);

-- Amulettes
INSERT INTO artifacts (name, description, rarity, slot, intelligence_bonus, mana_bonus, xp_bonus, price) VALUES
('Amulette Simple', 'Bijou basique', 'Common', 'amulet', 2, 10, 0.05, 80),
('Amulette de Sagesse', 'Augmente l''intelligence', 'Rare', 'amulet', 6, 30, 0.10, 450),
('Amulette du Maître', 'Puissante amulette', 'Epic', 'amulet', 12, 60, 0.20, 1500),
('Amulette Divine', 'Touche des dieux', 'Legendary', 'amulet', 20, 120, 0.50, 5000);

-- ========================================
-- EXPEDITIONS
-- ========================================

INSERT INTO expeditions (name, description, duration_minutes, min_level, rewards) VALUES
('Forêt Sombre', 'Exploration d''une forêt mystérieuse', 30, 1,
'[{"type":"coins","chance":100,"min":50,"max":150},{"type":"xp","chance":100,"min":30,"max":80}]'::jsonb),

('Mine Abandonnée', 'Recherche de minerais précieux', 60, 5,
'[{"type":"coins","chance":100,"min":100,"max":300},{"type":"xp","chance":100,"min":80,"max":200}]'::jsonb),

('Ruines Antiques', 'Exploration de ruines anciennes', 120, 10,
'[{"type":"coins","chance":100,"min":200,"max":500},{"type":"xp","chance":100,"min":150,"max":350}]'::jsonb),

('Donjon Maudit', 'Donjon dangereux mais rentable', 180, 15,
'[{"type":"coins","chance":100,"min":400,"max":800},{"type":"xp","chance":100,"min":300,"max":600}]'::jsonb),

('Tour du Nécromancien', 'Tour infestée de morts-vivants', 240, 20,
'[{"type":"coins","chance":100,"min":600,"max":1200},{"type":"xp","chance":100,"min":500,"max":1000}]'::jsonb);

-- ========================================
-- AVATARS
-- ========================================

INSERT INTO avatars (name, description, image_url, rarity, price, premium_only) VALUES
('Chasseur Débutant', 'Avatar de départ', 'https://i.imgur.com/avatar1.png', 'Common', 0, false),
('Assassin Masqué', 'Avatar d''assassin', 'https://i.imgur.com/avatar2.png', 'Rare', 1000, false),
('Archimage', 'Avatar de mage puissant', 'https://i.imgur.com/avatar3.png', 'Epic', 2500, false),
('Chevalier Dragon', 'Chevalier légendaire', 'https://i.imgur.com/avatar4.png', 'Legendary', 5000, false),
('Chasseur de Rangs S', 'Avatar premium exclusif', 'https://i.imgur.com/avatar5.png', 'Legendary', 10000, true);

-- ========================================
-- BOOSTERS
-- ========================================

INSERT INTO boosters (name, description, price, premium_only, loot_table) VALUES
('Pack Débutant', 'Pack pour nouveaux joueurs', 500, false,
'[{"type":"coins","chance":100,"amount":200},{"type":"artifact","chance":30,"id":"random","rarity":"Common"}]'::jsonb),

('Pack Guerrier', 'Pack contenant des armes', 1000, false,
'[{"type":"coins","chance":100,"amount":500},{"type":"artifact","chance":50,"id":"random","rarity":"Rare"}]'::jsonb),

('Pack Légendaire', 'Pack premium avec chances de légendaires', 5000, false,
'[{"type":"coins","chance":100,"amount":2000},{"type":"artifact","chance":80,"id":"random","rarity":"Epic"},{"type":"artifact","chance":10,"id":"random","rarity":"Legendary"}]'::jsonb);

-- ========================================
-- VERIFICATION
-- ========================================

-- Vérifier le nombre d'entrées créées
SELECT 'Classes' as table_name, COUNT(*) as count FROM classes
UNION ALL
SELECT 'Sorts', COUNT(*) FROM spells
UNION ALL
SELECT 'Ennemis', COUNT(*) FROM enemies
UNION ALL
SELECT 'Artefacts', COUNT(*) FROM artifacts
UNION ALL
SELECT 'Expéditions', COUNT(*) FROM expeditions
UNION ALL
SELECT 'Avatars', COUNT(*) FROM avatars
UNION ALL
SELECT 'Boosters', COUNT(*) FROM boosters;
