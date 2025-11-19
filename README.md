# Solo Leveling RPG - Bot Discord avec Panel Admin

Bot Discord RPG complet inspiré de Solo Leveling avec un panel d'administration web pour gérer tout le contenu du jeu.

## Caractéristiques

### Bot Discord

**Combat Interactif**
- Système de combat avec boutons interactifs
- HP/Mana en temps réel avec barres de progression
- 4 emplacements d'attaques (1 basique + 3 sorts)
- Système de critique et d'esquive
- Récompenses: XP, coins, loot d'artefacts

**Progression**
- Gain d'XP en envoyant des messages (anti-spam intégré)
- Système de niveau infini avec courbe exponentielle
- 5 points de stats par niveau à distribuer (FOR/INT/AGI/VIT/CHA)
- HP/Mana max qui augmentent avec les stats

**Classes & Sorts**
- Roll de classe aléatoire avec raretés (Common/Rare/Epic/Legendary)
- Chaque classe a ses modificateurs de stats uniques
- Boutique de sorts par classe
- Système d'équipement de sorts (4 slots)

**Inventaire & Artefacts**
- 5 emplacements d'équipement (arme, casque, torse, anneau, amulette)
- Bonus de stats multiples par artefact
- Boutique d'artefacts
- Inventaire complet

**Casino**
- Roulette (rouge/noir, pair/impair)
- Blackjack interactif avec boutons
- Machine à sous avec multiplicateurs

**Expéditions AFK**
- Donjons avec durée configurable
- Récompenses automatiques à la fin
- Système de claim des récompenses
- Drop d'artefacts et matériaux

**Système Gacha**
- Boosters achetables avec coins
- Ouverture de packs avec loot tables
- Avatars cosmétiques
- Système de rareté

### Panel d'Administration Web

**Dashboard**
- Vue d'ensemble des statistiques
- Nombre de joueurs, classes, ennemis, etc.

**Gestion Complète**
- **Classes**: Créer, modifier, supprimer avec tous les paramètres
- **Sorts**: Gestion complète des sorts par classe
- **Ennemis**: Configuration des ennemis et loot tables
- **Artefacts**: Création d'artefacts avec bonus multiples
- **Expéditions**: Configuration des donjons AFK
- **Boosters**: Gestion des packs de cartes
- **Avatars**: Ajout de skins cosmétiques
- **Casino**: Activation/désactivation des jeux
- **Joueurs**: Vue et gestion des joueurs

**Interface Moderne**
- Design responsive
- Thème sombre/clair
- Navigation intuitive
- Authentification Supabase

## Installation Rapide

### Prérequis

- Node.js 18+
- Compte Discord Developer
- Projet Supabase (gratuit)

### Configuration

1. **Cloner le projet**
```bash
git clone votre-repo
cd solo-leveling-rpg-bot
npm install
```

2. **Configurer `.env`**
```env
DISCORD_TOKEN=votre_token
DISCORD_CLIENT_ID=votre_client_id
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_key
```

3. **Enregistrer les commandes Discord**
```bash
npm run deploy
```

4. **Démarrer le bot**
```bash
npm start
```

5. **Démarrer le panel admin (développement)**
```bash
npm run dev
```

Panel accessible sur http://localhost:3000

## Déploiement

Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour un guide complet de déploiement sur:
- VPS (DigitalOcean, Hetzner)
- Railway.app (bot)
- Vercel (panel admin)
- Netlify (panel admin)

## Commandes du Bot

### Joueur

- `/profil` - Afficher votre profil
- `/stats add <stat> <points>` - Distribuer vos points de stats
- `/fight` - Combattre un monstre

### Classes & Sorts

- `/roll_class` - Obtenir une classe (1000 coins)
- `/spells list` - Voir vos sorts
- `/spells shop` - Boutique de sorts
- `/spells buy <nom>` - Acheter un sort
- `/spells equip <nom> <slot>` - Équiper un sort
- `/spells unequip <slot>` - Déséquiper un sort

### Inventaire

- `/inventory [type]` - Voir votre inventaire
- `/artifact equip <nom>` - Équiper un artefact
- `/artifact unequip <slot>` - Déséquiper un artefact
- `/artifact shop` - Boutique d'artefacts

### Casino

- `/casino roulette <mise> <choix>` - Roulette
- `/casino blackjack <mise>` - Blackjack
- `/casino slots <mise>` - Machine à sous

### Expéditions

- `/expedition list` - Voir les expéditions
- `/expedition start <nom>` - Démarrer une expédition
- `/expedition status` - Voir le statut
- `/expedition claim` - Récupérer les récompenses

### Boosters & Avatars

- `/booster shop` - Voir les boosters
- `/booster buy <nom>` - Acheter un booster
- `/booster open <nom>` - Ouvrir un booster
- `/avatar list` - Vos avatars
- `/avatar shop` - Boutique d'avatars
- `/avatar buy <nom>` - Acheter un avatar
- `/avatar set <nom>` - Changer d'avatar

### Admin (Permission Administrator)

- `/admin class create/list` - Gérer les classes
- `/admin spell create/list` - Gérer les sorts
- `/admin enemy create/list` - Gérer les ennemis
- `/admin player set_coins/set_level` - Modifier les joueurs

## Architecture

```
┌─────────────────┐
│  Bot Discord    │
│  (Node.js)      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Supabase     │
│   (Database)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Panel Admin    │
│  (React/Vite)   │
└─────────────────┘
```

## Base de Données

15 tables Supabase:
- `players` - Profils joueurs
- `classes` - Classes disponibles
- `spells` - Sorts du jeu
- `player_spells` - Sorts des joueurs
- `artifacts` - Artefacts du jeu
- `player_artifacts` - Inventaire artefacts
- `avatars` - Skins cosmétiques
- `player_avatars` - Avatars débloqués
- `enemies` - Ennemis du jeu
- `expeditions` - Expéditions AFK
- `player_expeditions` - Expéditions actives
- `boosters` - Packs de cartes
- `player_inventory` - Inventaire général
- `casino_config` - Configuration casino
- `config` - Configuration globale

Row Level Security (RLS) activé sur toutes les tables.

## Technologies

**Bot:**
- discord.js 14
- Node.js
- Supabase

**Panel Admin:**
- React 19
- Vite
- React Router
- Supabase Auth

## Sécurité

- Authentification Supabase pour le panel admin
- Row Level Security (RLS) sur toutes les tables
- Variables d'environnement pour les secrets
- Token Discord jamais exposé

## Développement

### Lancer en mode développement

**Bot:**
```bash
npm start
```

**Panel Admin:**
```bash
npm run dev
```

### Build du panel

```bash
npm run build
```

Fichiers générés dans `dist/`

## Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Ouvrez une Pull Request

## Licence

MIT

## Support

Pour toute question:
1. Consultez [SETUP.md](./SETUP.md) pour l'installation
2. Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour le déploiement
3. Vérifiez les logs du bot
4. Vérifiez la console du navigateur (panel admin)

## Roadmap

- [ ] Système de guildes
- [ ] PvP Arena
- [ ] Événements mondiaux
- [ ] Classements (leaderboards)
- [ ] Quêtes journalières/hebdomadaires
- [ ] Craft d'items
- [ ] Système de pets
- [ ] Raids multi-joueurs
