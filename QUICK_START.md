# Guide de Démarrage Rapide

Ce guide vous permet de lancer le bot et le panel en quelques minutes.

## Installation Ultra-Rapide (5 minutes)

### 1. Prérequis

- Node.js 18+ installé
- Compte Discord
- Compte Supabase (gratuit)

### 2. Configuration du Bot Discord

1. Allez sur https://discord.com/developers/applications
2. "New Application" → Nommez-le "Solo Leveling RPG"
3. Bot → "Add Bot"
4. **ACTIVEZ les 3 Intents** (PRESENCE, SERVER MEMBERS, MESSAGE CONTENT)
5. Copiez le Token
6. General Information → Copiez l'Application ID
7. OAuth2 → URL Generator:
   - Scopes: `bot`, `applications.commands`
   - Permissions: Cochez toutes les permissions "Text"
8. Copiez l'URL et invitez le bot sur votre serveur

📖 **Guide détaillé**: [DISCORD_SETUP.md](./DISCORD_SETUP.md)

### 3. Configuration du Projet

```bash
# Installer les dépendances
npm install

# Copier et configurer .env
cp .env.example .env
nano .env
```

Remplissez dans `.env`:
```env
DISCORD_TOKEN=votre_token_bot
DISCORD_CLIENT_ID=votre_application_id
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

### 4. Enregistrer les Commandes

```bash
npm run deploy
```

✅ Vous devriez voir: "✅ XX commandes enregistrées avec succès!"

### 5. Démarrer le Bot

```bash
npm start
```

✅ Vous devriez voir: "✅ Bot connecté en tant que..."

### 6. Démarrer le Panel Admin

Ouvrez un nouveau terminal:

```bash
npm run dev
```

✅ Panel accessible sur http://localhost:3000

### 7. Créer un Compte Admin

1. Ouvrez http://localhost:3000
2. Cliquez sur "Créer un compte"
3. Entrez email et mot de passe
4. Vérifiez votre email (Supabase envoie un lien)
5. Connectez-vous

### 8. Créer du Contenu Initial

Une fois connecté au panel:

**Créer une Classe:**
1. Classes → "+ Nouvelle Classe"
2. Nom: "Assassin"
3. Rareté: "Rare"
4. Modifs de stats: FOR +5, AGI +10
5. Enregistrer

**Créer un Ennemi:**
1. Ennemis → "+ Nouvel Ennemi"
2. Nom: "Goblin"
3. Niveau: 1
4. HP: 50
5. URL Image: https://i.imgur.com/example.png (utilisez une vraie image)
6. Enregistrer

**Créer un Sort:**
1. Sorts → "+ Nouveau Sort"
2. Classe: "Assassin"
3. Nom: "Shadow Strike"
4. Mana: 20
5. Dégâts: 50
6. Prix: 500
7. Enregistrer

### 9. Tester le Bot

Sur Discord:
```
/profil          → Voir votre profil
/fight           → Combattre (nécessite des ennemis)
/roll_class      → Obtenir une classe aléatoire (1000 coins)
/casino slots 10 → Tester la machine à sous
```

## Commandes Essentielles

### Pour le Bot Discord

```bash
# Démarrer le bot
npm start

# Redéployer les commandes (après modifications)
npm run deploy
```

### Pour le Panel Admin

```bash
# Mode développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

## Structure du Projet

```
solo-leveling-rpg-bot/
├── src/                    # Code du bot Discord
│   ├── bot.js             # Fichier principal
│   ├── commands/          # Toutes les commandes
│   ├── events/            # Événements Discord
│   └── utils/             # Fonctions utilitaires
├── web/                   # Panel d'administration
│   ├── pages/             # Pages React
│   ├── components/        # Composants React
│   └── styles/            # CSS
├── supabase/
│   └── migrations/        # Migrations de la BDD
├── index.js               # Point d'entrée bot
├── deploy-commands.js     # Script de déploiement
└── .env                   # Configuration (NE PAS COMMIT)
```

## Données Initiales Recommandées

Pour un démarrage optimal, créez:

### Classes (5 minimum)
1. **Novice** - Common - Stats neutres
2. **Assassin** - Rare - +FOR/AGI
3. **Mage** - Epic - +INT, +Mana
4. **Tank** - Rare - +VIT, +HP
5. **Archer** - Rare - +AGI

### Ennemis (par paliers de niveau)
- **Niveau 1-5**: Goblin, Slime, Loup
- **Niveau 5-10**: Orc, Bandit, Squelette
- **Niveau 10-20**: Troll, Dark Mage, Golem
- **Niveau 20+**: Dragon, Demon Lord, Boss

💡 **Astuce**: Utilisez des images de sites comme:
- https://imgur.com (upload gratuit)
- https://i.pinimg.com (Pinterest)
- https://art.pixilart.com

### Sorts (3-4 par classe)
Pour chaque classe, créez:
1. Sort basique (10 mana, 30 dégâts)
2. Sort intermédiaire (20 mana, 50 dégâts)
3. Sort puissant (35 mana, 80 dégâts)
4. Ultimate (50 mana, 120 dégâts)

### Artefacts (variés)
Créez des artefacts pour chaque slot:
- **Armes** (+FOR/+Dégâts)
- **Casques** (+VIT/+HP)
- **Armures** (+VIT/+Défense)
- **Anneaux** (+AGI/+Crit)
- **Amulettes** (+INT/+Mana)

## Déploiement Production

Une fois tout testé localement:

### Héberger le Bot (choisir UNE option)

**Option A: VPS (Recommandé)**
```bash
# Sur votre VPS
git clone votre-repo
cd solo-leveling-rpg-bot
npm install
npm run deploy
pm2 start index.js --name solo-rpg
pm2 save
```

**Option B: Railway.app (Gratuit)**
1. Créez un compte sur railway.app
2. "New Project" → "Deploy from GitHub"
3. Ajoutez les variables d'environnement
4. Le bot se déploie automatiquement

📖 **Guide complet**: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Héberger le Panel (choisir UNE option)

**Option A: Vercel (Gratuit - Recommandé)**
1. Compte sur vercel.com
2. "Import Project" → Sélectionnez votre repo
3. Build: `npm run build`
4. Output: `dist`
5. Ajoutez les variables d'environnement
6. Deploy!

**Option B: Netlify (Gratuit)**
1. Compte sur netlify.com
2. "Add new site" → GitHub
3. Build: `npm run build`
4. Publish: `dist`
5. Deploy!

## Maintenance Quotidienne

### Surveiller le Bot

```bash
# Voir les logs (si PM2)
pm2 logs solo-rpg

# Statut
pm2 status

# Redémarrer
pm2 restart solo-rpg
```

### Mettre à Jour

```bash
# Récupérer les mises à jour
git pull

# Réinstaller les dépendances si nécessaire
npm install

# Redéployer les commandes si modifiées
npm run deploy

# Redémarrer le bot
pm2 restart solo-rpg

# Rebuild le panel
npm run build
```

## Personnalisation Rapide

### Changer les Couleurs du Panel

Éditez `web/styles/index.css`:
```css
:root {
  --primary: #2563eb;        /* Bleu principal */
  --secondary: #10b981;      /* Vert secondaire */
  --danger: #ef4444;         /* Rouge danger */
}
```

### Modifier les Multiplicateurs XP/Coins

Dans le panel admin:
1. Dashboard
2. Utilisez les commandes `/admin` sur Discord

Ou directement dans Supabase:
1. Table: `config`
2. Key: `xp_rate`
3. Modifiez les valeurs JSON

### Ajouter/Modifier des Commandes

1. Créez un fichier dans `src/commands/[categorie]/`
2. Copiez la structure d'une commande existante
3. Modifiez selon vos besoins
4. Relancez `npm run deploy`
5. Redémarrez le bot

## Sécurité

### À FAIRE:
- ✅ Gardez `.env` secret
- ✅ Ne commit jamais le token Discord
- ✅ Utilisez des mots de passe forts pour le panel
- ✅ Activez 2FA sur Discord Developer Portal
- ✅ Faites des backups réguliers de Supabase

### À NE PAS FAIRE:
- ❌ Partager votre token bot
- ❌ Commit `.env` sur GitHub
- ❌ Donner accès admin à n'importe qui
- ❌ Désactiver RLS sur Supabase

## Résolution de Problèmes Express

| Problème | Solution Rapide |
|----------|----------------|
| Bot offline | Vérifiez token, relancez `npm start` |
| Commandes absentes | `npm run deploy`, attendez 5min |
| XP ne marche pas | Activez MESSAGE CONTENT INTENT |
| Panel ne charge pas | Vérifiez les URLs Supabase dans `.env` |
| Erreur de BDD | Vérifiez que les migrations sont appliquées |

## Ressources

- **Documentation complète**: [README.md](./README.md)
- **Configuration Discord**: [DISCORD_SETUP.md](./DISCORD_SETUP.md)
- **Configuration initiale**: [SETUP.md](./SETUP.md)
- **Déploiement**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## Checklist de Démarrage

- [ ] Node.js installé
- [ ] Bot Discord créé
- [ ] 3 Intents activés
- [ ] Token et Client ID récupérés
- [ ] Projet Supabase créé
- [ ] `.env` configuré
- [ ] `npm install` exécuté
- [ ] `npm run deploy` exécuté
- [ ] Bot démarré (`npm start`)
- [ ] Panel démarré (`npm run dev`)
- [ ] Compte admin créé
- [ ] Au moins 1 classe créée
- [ ] Au moins 3 ennemis créés
- [ ] Quelques sorts créés
- [ ] Bot testé sur Discord

✅ **Félicitations! Votre bot Solo Leveling RPG est opérationnel!**

## Support

Questions fréquentes → [SETUP.md](./SETUP.md)
Problèmes de déploiement → [DEPLOYMENT.md](./DEPLOYMENT.md)
Configuration Discord → [DISCORD_SETUP.md](./DISCORD_SETUP.md)
