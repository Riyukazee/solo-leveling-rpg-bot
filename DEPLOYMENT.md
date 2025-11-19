# Guide de Déploiement Complet

Ce guide vous explique comment déployer le bot Discord et le panel d'administration.

## Partie 1: Configuration du Bot Discord

### 1. Créer l'Application Discord

1. Rendez-vous sur https://discord.com/developers/applications
2. Cliquez sur **"New Application"**
3. Nommez votre application: `Solo Leveling RPG`
4. Acceptez les termes et créez

### 2. Créer le Bot

1. Dans le menu latéral, cliquez sur **"Bot"**
2. Cliquez sur **"Add Bot"** → **"Yes, do it!"**
3. Personnalisez:
   - Nom du bot
   - Photo de profil

### 3. Activer les Intents (IMPORTANT!)

Dans la section **"Privileged Gateway Intents"**:
- ✅ **PRESENCE INTENT**
- ✅ **SERVER MEMBERS INTENT**
- ✅ **MESSAGE CONTENT INTENT**

Cliquez sur **"Save Changes"**

### 4. Récupérer le Token

1. Dans la section **"Bot"**
2. Cliquez sur **"Reset Token"**
3. **COPIEZ LE TOKEN** (gardez-le secret!)

### 5. Récupérer le Client ID

1. Menu latéral → **"General Information"**
2. Copiez **"APPLICATION ID"**

### 6. Inviter le Bot

1. Menu latéral → **"OAuth2"** → **"URL Generator"**
2. **Scopes:**
   - ✅ `bot`
   - ✅ `applications.commands`
3. **Bot Permissions:**
   - ✅ Send Messages
   - ✅ Send Messages in Threads
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Read Message History
   - ✅ Use Slash Commands
   - ✅ Add Reactions
4. Copiez l'URL générée et ouvrez-la
5. Sélectionnez votre serveur → **"Authorize"**

## Partie 2: Configuration Locale

### 1. Configurer les Variables d'Environnement

Ouvrez `.env` et remplissez:

```env
DISCORD_TOKEN=votre_token_du_bot_ici
DISCORD_CLIENT_ID=votre_client_id_ici
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key_ici
```

### 2. Enregistrer les Commandes Slash

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
✅ Bot connecté en tant que Solo Leveling RPG#1234
🎮 Prêt sur 1 serveur(s)
```

## Partie 3: Panel d'Administration Web

### 1. Créer un Compte Admin

Le panel utilise Supabase Auth. Pour créer le premier compte admin:

1. Démarrez le serveur de développement:
```bash
npm run dev
```

2. Ouvrez http://localhost:3000
3. Cliquez sur **"Créer un compte"**
4. Entrez votre email et mot de passe
5. Vérifiez votre email pour confirmer

### 2. Construire pour la Production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## Partie 4: Hébergement du Bot (24/7)

### Option A: Serveur Local (Toujours Allumé)

Si vous avez un PC/serveur toujours allumé:

1. Assurez-vous que Node.js est installé
2. Gardez le terminal ouvert avec `npm start`
3. Le bot restera en ligne tant que le terminal est ouvert

### Option B: VPS (Recommandé)

Services recommandés:
- **DigitalOcean** (5$/mois)
- **Linode** (5$/mois)
- **Hetzner** (3€/mois)

Sur votre VPS:

```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cloner votre projet
git clone votre-repo
cd solo-leveling-rpg-bot

# Installer les dépendances
npm install

# Configurer .env
nano .env

# Enregistrer les commandes
npm run deploy

# Utiliser PM2 pour garder le bot en ligne
npm install -g pm2
pm2 start index.js --name solo-leveling-bot
pm2 save
pm2 startup
```

### Option C: Service Gratuit (Limitations)

**Railway.app:**

1. Créez un compte sur https://railway.app
2. Cliquez sur **"New Project"** → **"Deploy from GitHub"**
3. Connectez votre repo
4. Ajoutez les variables d'environnement
5. Le bot se déploiera automatiquement

**Note:** Les services gratuits ont souvent des limitations de temps d'activité.

## Partie 5: Hébergement du Panel Web

### Option A: Vercel (Gratuit - Recommandé)

1. Créez un compte sur https://vercel.com
2. Cliquez sur **"Add New Project"**
3. Importez votre repository GitHub
4. Configuration:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Ajoutez les variables d'environnement:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Déployez!

### Option B: Netlify (Gratuit)

1. Créez un compte sur https://netlify.com
2. Cliquez sur **"Add new site"** → **"Import from Git"**
3. Connectez votre repo
4. Configuration:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Ajoutez les variables d'environnement
6. Déployez!

### Option C: GitHub Pages

```bash
npm run build
cd dist
git init
git add -A
git commit -m "Deploy"
git push -f git@github.com:username/repo.git main:gh-pages
```

## Partie 6: Configuration Initiale du Contenu

Une fois le bot et le panel déployés:

### 1. Connexion au Panel Admin

1. Accédez à votre panel (ex: https://votre-site.vercel.app)
2. Connectez-vous avec votre compte admin

### 2. Créer du Contenu Initial

**Classes de Base:**
- Dashboard → Classes → Nouvelle Classe
- Créez: Novice, Assassin, Mage, Tank, Archer

**Ennemis:**
- Dashboard → Ennemis → Nouvel Ennemi
- Créez des ennemis de différents niveaux (1-50)
- URL images: utilisez des URLs d'images hébergées (Imgur, etc.)

**Sorts:**
- Dashboard → Sorts → Nouveau Sort
- Créez au moins 3-4 sorts par classe

**Artefacts:**
- Dashboard → Artefacts → Nouvel Artefact
- Créez armes, casques, armures avec différentes raretés

### 3. Tester le Bot

Sur votre serveur Discord:

```
/profil          → Voir votre profil
/fight           → Combattre un ennemi
/roll_class      → Obtenir une classe
/casino slots 10 → Tester le casino
```

## Sécurité

### 🔒 Points Importants

1. **Ne jamais partager:**
   - Le token du bot Discord
   - Les clés Supabase
   - Les mots de passe admin

2. **Fichier .env:**
   - Ne JAMAIS commit le fichier `.env`
   - Déjà dans `.gitignore`

3. **Supabase RLS:**
   - Les policies sont déjà configurées
   - Seul l'admin peut modifier via le panel

## Maintenance

### Mettre à Jour le Bot

```bash
# Arrêter le bot
pm2 stop solo-leveling-bot

# Récupérer les mises à jour
git pull

# Réinstaller les dépendances si nécessaire
npm install

# Redémarrer
pm2 restart solo-leveling-bot
```

### Voir les Logs

```bash
# Logs en temps réel
pm2 logs solo-leveling-bot

# Logs des 100 dernières lignes
pm2 logs solo-leveling-bot --lines 100
```

### Backup de la Base de Données

Dans Supabase Dashboard:
1. Settings → Database
2. Cliquez sur **"Backup now"**
3. Les backups sont automatiques chaque jour

## Dépannage

### Le bot ne se connecte pas
- ✅ Vérifiez le token dans `.env`
- ✅ Vérifiez que les intents sont activés
- ✅ Vérifiez que `npm run deploy` a été exécuté

### Les commandes ne s'affichent pas
- ✅ Lancez `npm run deploy`
- ✅ Attendez 5 minutes (propagation Discord)
- ✅ Rechargez Discord (Ctrl + R)

### Le panel ne charge pas
- ✅ Vérifiez les URLs Supabase dans `.env`
- ✅ Vérifiez que le build s'est bien passé
- ✅ Vérifiez les logs de Vercel/Netlify

### Les joueurs ne gagnent pas d'XP
- ✅ Vérifiez MESSAGE CONTENT INTENT activé
- ✅ Vérifiez que le message fait au moins 5 caractères
- ✅ Respectez le cooldown de 10 secondes

## Support

Si vous rencontrez des problèmes:

1. Vérifiez les logs: `pm2 logs solo-leveling-bot`
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que toutes les variables d'environnement sont définies
4. Vérifiez les permissions du bot sur Discord

## Architecture Finale

```
Bot Discord (VPS/Railway)
    ↓
Supabase Database (Cloud)
    ↓
Panel Admin (Vercel/Netlify)
```

Tout est connecté à la même base de données Supabase, permettant une gestion en temps réel.
