# Solo Leveling RPG Bot - Guide d'Installation

## Configuration du Bot Discord

### 1. Créer une Application Discord

1. Accédez au [Portail Développeur Discord](https://discord.com/developers/applications)
2. Cliquez sur "New Application"
3. Donnez un nom à votre application (ex: "Solo Leveling RPG")
4. Acceptez les conditions et créez

### 2. Créer le Bot

1. Dans le menu de gauche, cliquez sur "Bot"
2. Cliquez sur "Add Bot"
3. Confirmez en cliquant "Yes, do it!"

### 3. Configurer les Intents

**IMPORTANT**: Activez les intents suivants dans la section "Privileged Gateway Intents":
- ✅ **PRESENCE INTENT**
- ✅ **SERVER MEMBERS INTENT**
- ✅ **MESSAGE CONTENT INTENT**

Sauvegardez les changements.

### 4. Récupérer le Token

1. Dans la section "Bot", cliquez sur "Reset Token"
2. Copiez le token affiché
3. **GARDEZ CE TOKEN SECRET!**

### 5. Récupérer le Client ID

1. Dans le menu de gauche, cliquez sur "General Information"
2. Copiez l'**Application ID** (c'est le Client ID)

### 6. Inviter le Bot sur votre Serveur

1. Dans le menu de gauche, cliquez sur "OAuth2" > "URL Generator"
2. Cochez les scopes suivants:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Cochez les permissions suivantes:
   - ✅ Send Messages
   - ✅ Read Messages/View Channels
   - ✅ Read Message History
   - ✅ Add Reactions
   - ✅ Use Slash Commands
4. Copiez l'URL générée et ouvrez-la dans votre navigateur
5. Sélectionnez votre serveur et autorisez

## Configuration du Projet

### 1. Configurer les Variables d'Environnement

Ouvrez le fichier `.env` et remplissez:

```env
DISCORD_TOKEN=votre_token_ici
DISCORD_CLIENT_ID=votre_client_id_ici
VITE_SUPABASE_URL=déjà_configuré
VITE_SUPABASE_ANON_KEY=déjà_configuré
```

### 2. Enregistrer les Commandes Slash

Exécutez cette commande pour enregistrer toutes les commandes sur Discord:

```bash
npm run deploy
```

Vous devriez voir: `✅ XX commandes enregistrées avec succès!`

### 3. Démarrer le Bot

```bash
npm start
```

Le bot devrait afficher:
```
✅ Bot connecté en tant que [Nom du Bot]#1234
🎮 Prêt sur X serveur(s)
```

## Configuration Initiale (Admin)

Une fois le bot démarré, utilisez les commandes admin pour créer le contenu de base:

### 1. Créer des Classes

```
/admin class create name:Assassin rarity:Rare description:Chasseur spécialisé dans les attaques rapides
/admin class create name:Mage rarity:Epic description:Maître des arts magiques
/admin class create name:Tank rarity:Common description:Guerrier résistant
```

### 2. Créer des Sorts

```
/admin spell create class_name:Assassin name:Shadow Strike mana_cost:20 base_damage:50 price:500
/admin spell create class_name:Mage name:Fireball mana_cost:30 base_damage:70 price:800
```

### 3. Créer des Ennemis

```
/admin enemy create name:Goblin level:1 hp:50 image_url:https://example.com/goblin.png
/admin enemy create name:Orc level:5 hp:200 image_url:https://example.com/orc.png
/admin enemy create name:Dragon level:20 hp:1000 image_url:https://example.com/dragon.png
```

## Commandes Disponibles

### Commandes Joueur

- `/profil` - Voir votre profil de chasseur
- `/stats add <stat> <points>` - Distribuer vos points de stats
- `/fight` - Combattre un monstre (HP/Mana avec boutons interactifs)

### Classes & Sorts

- `/roll_class` - Obtenir une classe aléatoire (1000 coins)
- `/spells list` - Voir vos sorts
- `/spells shop` - Boutique de sorts
- `/spells buy <nom>` - Acheter un sort
- `/spells equip <nom> <slot>` - Équiper un sort

### Inventaire & Artefacts

- `/inventory [type]` - Voir votre inventaire
- `/artifact equip <nom>` - Équiper un artefact
- `/artifact unequip <slot>` - Déséquiper un artefact
- `/artifact shop` - Boutique d'artefacts

### Casino

- `/casino roulette <mise> <choix>` - Jouer à la roulette
- `/casino blackjack <mise>` - Jouer au blackjack
- `/casino slots <mise>` - Machines à sous

### Expéditions

- `/expedition list` - Voir les expéditions disponibles
- `/expedition start <nom>` - Démarrer une expédition
- `/expedition status` - Statut de votre expédition
- `/expedition claim` - Récupérer les récompenses

### Boosters & Avatars

- `/booster shop` - Boutique de boosters
- `/booster buy <nom>` - Acheter un booster
- `/booster open <nom>` - Ouvrir un booster
- `/avatar list` - Vos avatars
- `/avatar shop` - Boutique d'avatars
- `/avatar buy <nom>` - Acheter un avatar
- `/avatar set <nom>` - Changer d'avatar

### Commandes Admin

- `/admin class create/list` - Gérer les classes
- `/admin spell create/list` - Gérer les sorts
- `/admin enemy create/list` - Gérer les ennemis
- `/admin player set_coins/set_level` - Modifier les joueurs

## Système de Progression

### XP et Niveaux

- Les joueurs gagnent de l'XP en envoyant des messages
- Cooldown de 10 secondes entre chaque gain d'XP
- À chaque niveau, le joueur gagne 5 points de stats à distribuer
- Les HP et Mana max augmentent avec le niveau et les stats

### Stats

- **FOR** (Force) - Augmente les dégâts physiques
- **INT** (Intelligence) - Augmente les dégâts magiques et la mana max
- **AGI** (Agilité) - Augmente les chances de critique et d'esquive
- **VIT** (Vitalité) - Augmente les HP max et la résistance
- **CHA** (Charisme) - Réductions dans les boutiques et bonus de coins

### Combat

- Système interactif avec image et 4 boutons
- Attaque de base (0 mana)
- 3 emplacements de sorts (coûtent de la mana)
- Les dégâts dépendent des stats, classe, sorts et artefacts
- Critiques basés sur l'agilité
- Victoire = coins, XP, chance de loot
- Défaite = perte de 5% des coins, HP/Mana restaurés

## Dépannage

### Le bot ne répond pas aux commandes

1. Vérifiez que le bot est en ligne
2. Vérifiez que les commandes ont été enregistrées (`npm run deploy`)
3. Vérifiez les permissions du bot sur le serveur

### Erreur de token invalide

- Vérifiez que le token dans `.env` est correct
- Le token ne doit pas avoir d'espaces avant/après

### Les joueurs ne gagnent pas d'XP

- Vérifiez que le MESSAGE CONTENT INTENT est activé
- Le joueur doit écrire au moins 5 caractères
- Il y a un cooldown de 10 secondes

### Erreur de base de données

- Vérifiez que les variables Supabase sont correctes dans `.env`
- La base de données est configurée automatiquement via les migrations

## Support

En cas de problème, vérifiez:
1. Les logs du bot dans la console
2. Que toutes les variables d'environnement sont définies
3. Que le bot a les bonnes permissions Discord
4. Que la base de données Supabase est accessible
