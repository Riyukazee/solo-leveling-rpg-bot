# 🎮 Bienvenue sur Solo Leveling RPG Bot!

## Par où commencer?

Suivez ces étapes dans l'ordre:

### 1️⃣ Installation (10 minutes)
👉 **Lisez:** [QUICK_START.md](./QUICK_START.md)

Ce guide vous permet de lancer le bot en 10 minutes:
- Configuration Discord
- Installation des dépendances
- Configuration .env
- Premier lancement

### 2️⃣ Configuration Discord Détaillée
👉 **Lisez:** [DISCORD_SETUP.md](./DISCORD_SETUP.md)

Guide pas à pas pour configurer le bot sur Discord:
- Créer l'application
- Activer les intents (IMPORTANT!)
- Récupérer le token
- Inviter le bot

### 3️⃣ Remplir la Base de Données
👉 **Lisez:** [POPULATE_DATABASE.md](./POPULATE_DATABASE.md)

Comment ajouter du contenu au jeu:
- Exécuter le SQL d'exemple
- Créer vos propres classes
- Ajouter des ennemis
- Configurer les artefacts

Le fichier **[SAMPLE_DATA.sql](./SAMPLE_DATA.sql)** contient des données prêtes à l'emploi!

### 4️⃣ Déploiement en Production
👉 **Lisez:** [DEPLOYMENT.md](./DEPLOYMENT.md)

Quand vous êtes prêt à déployer:
- Héberger le bot 24/7 (VPS, Railway)
- Héberger le panel web (Vercel, Netlify)
- Configuration de production
- Maintenance

## 📚 Documentation Complète

| Fichier | Description | Quand le lire? |
|---------|-------------|----------------|
| **[QUICK_START.md](./QUICK_START.md)** | Guide de démarrage rapide (10 min) | ⭐ EN PREMIER |
| **[DISCORD_SETUP.md](./DISCORD_SETUP.md)** | Configuration Discord étape par étape | Après installation |
| **[POPULATE_DATABASE.md](./POPULATE_DATABASE.md)** | Remplir la base de données | Après le bot lancé |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Déploiement en production | Quand tout fonctionne |
| **[README.md](./README.md)** | Vue d'ensemble du projet | Pour comprendre le projet |
| **[SETUP.md](./SETUP.md)** | Configuration initiale détaillée | Alternative à QUICK_START |
| **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** | Résumé technique complet | Pour les développeurs |
| **[SAMPLE_DATA.sql](./SAMPLE_DATA.sql)** | Données d'exemple (SQL) | À exécuter dans Supabase |

## 🚀 Installation Ultra-Rapide

Si vous voulez juste tester rapidement:

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer .env (ajoutez vos tokens)
cp .env.example .env
nano .env

# 3. Déployer les commandes Discord
npm run deploy

# 4. Démarrer le bot
npm start

# 5. Démarrer le panel admin (nouveau terminal)
npm run dev
```

Puis ouvrez http://localhost:3000 pour le panel admin!

## ✅ Checklist de Départ

Cochez au fur et à mesure:

### Configuration Initiale
- [ ] Node.js installé (v18+)
- [ ] Projet cloné et `npm install` exécuté
- [ ] Compte Discord Developer créé
- [ ] Application Discord créée
- [ ] Bot ajouté à l'application
- [ ] **3 Intents activés** (MESSAGE CONTENT, PRESENCE, SERVER MEMBERS)
- [ ] Token du bot copié
- [ ] Client ID copié
- [ ] Bot invité sur un serveur de test

### Base de Données
- [ ] Compte Supabase créé
- [ ] Projet Supabase créé
- [ ] URLs Supabase copiées
- [ ] Migration appliquée (automatique)
- [ ] Données d'exemple importées (SAMPLE_DATA.sql)

### Lancement
- [ ] Fichier `.env` configuré
- [ ] `npm run deploy` exécuté avec succès
- [ ] `npm start` lance le bot sans erreur
- [ ] Bot apparaît online sur Discord
- [ ] Commandes slash visibles dans Discord
- [ ] `npm run dev` lance le panel
- [ ] Panel accessible sur localhost:3000
- [ ] Compte admin créé

### Test
- [ ] `/profil` fonctionne
- [ ] `/fight` trouve un ennemi
- [ ] `/roll_class` donne une classe
- [ ] Messages donnent de l'XP
- [ ] Panel admin accessible et fonctionnel
- [ ] Création de contenu via le panel réussie

## 🎯 Objectifs par Étape

### Étape 1: Bot Fonctionnel (20 min)
Faire fonctionner le bot sur votre serveur Discord local.

**Fichiers à lire:**
- QUICK_START.md
- DISCORD_SETUP.md

**Résultat attendu:**
- Bot online sur Discord
- Commandes slash disponibles
- Messages donnent de l'XP

### Étape 2: Panel Admin (10 min)
Accéder au panel d'administration web.

**Actions:**
- `npm run dev`
- Créer compte admin
- Se connecter au panel

**Résultat attendu:**
- Panel accessible
- Dashboard affiche les stats
- Toutes les pages fonctionnent

### Étape 3: Contenu du Jeu (15 min)
Ajouter du contenu pour que le jeu soit jouable.

**Fichiers à lire:**
- POPULATE_DATABASE.md
- SAMPLE_DATA.sql

**Résultat attendu:**
- Au moins 5 classes
- Au moins 10 ennemis
- Plusieurs sorts par classe
- Plusieurs artefacts

### Étape 4: Déploiement (variable)
Mettre le bot et le panel en ligne 24/7.

**Fichiers à lire:**
- DEPLOYMENT.md

**Résultat attendu:**
- Bot accessible 24/7
- Panel web public
- Configuration production

## 🆘 Problèmes Courants

### Le bot ne se connecte pas
➡️ Vérifiez le token dans `.env`
➡️ Consultez: DISCORD_SETUP.md section "Récupérer le Token"

### Les commandes n'apparaissent pas
➡️ Exécutez `npm run deploy`
➡️ Attendez 5 minutes
➡️ Rechargez Discord (Ctrl+R)

### L'XP ne fonctionne pas
➡️ Activez MESSAGE CONTENT INTENT sur Discord
➡️ Consultez: DISCORD_SETUP.md section "Intents"

### Le panel ne charge pas
➡️ Vérifiez les URLs Supabase dans `.env`
➡️ Vérifiez que `npm run dev` est lancé

### Erreur "No enemies found"
➡️ Importez SAMPLE_DATA.sql
➡️ Consultez: POPULATE_DATABASE.md

## 📞 Besoin d'Aide?

1. **Consultez la documentation appropriée** (voir tableau ci-dessus)
2. **Vérifiez la checklist** (avez-vous tout coché?)
3. **Regardez les logs:**
   - Bot: dans le terminal où `npm start` tourne
   - Panel: Console du navigateur (F12)
   - Supabase: Logs dans le dashboard

## 🎨 Personnalisation

Une fois que tout fonctionne:

### Contenu du Jeu
- Créez vos propres classes
- Ajoutez des ennemis uniques
- Inventez des sorts originaux
- Designez des artefacts épiques

### Apparence
- Changez les couleurs du panel (web/styles/index.css)
- Modifiez les messages du bot
- Ajoutez des images personnalisées

### Équilibrage
- Ajustez les multiplicateurs XP
- Modifiez les drop rates
- Changez les prix des items
- Équilibrez les stats des classes

## 🚀 Prêt à Commencer?

👉 **Suivez le [QUICK_START.md](./QUICK_START.md) maintenant!**

Durée estimée: **30 minutes** pour tout configurer et tester.

---

## 📋 Résumé des Commandes

### Bot Discord
```bash
npm start           # Démarrer le bot
npm run deploy      # Déployer les commandes slash
```

### Panel Admin
```bash
npm run dev         # Mode développement
npm run build       # Build pour production
npm run preview     # Prévisualiser le build
```

### Maintenance
```bash
git pull            # Récupérer mises à jour
npm install         # Réinstaller dépendances
pm2 logs solo-rpg   # Voir les logs (production)
pm2 restart solo-rpg # Redémarrer (production)
```

## 🎯 Objectif Final

Un bot Discord RPG complet avec:
- ✅ Système de combat interactif
- ✅ Classes et sorts
- ✅ Artefacts et inventaire
- ✅ Casino (3 jeux)
- ✅ Expéditions AFK
- ✅ Système gacha
- ✅ Panel d'administration complet
- ✅ Gestion en temps réel

**Fonctionnel. Prêt à déployer. Entièrement personnalisable.**

---

**Bon développement! 🎮⚔️**
