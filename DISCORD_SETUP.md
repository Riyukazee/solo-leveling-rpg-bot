# Configuration du Bot sur Discord Developer Portal

Ce guide vous aide à configurer correctement votre bot sur https://discord.com/developers/applications

## Étape 1: Créer l'Application

1. Rendez-vous sur https://discord.com/developers/applications
2. Cliquez sur **"New Application"** (bouton bleu en haut à droite)
3. Entrez le nom: `Solo Leveling RPG` (ou votre choix)
4. Acceptez les Terms of Service
5. Cliquez sur **"Create"**

## Étape 2: Configurer les Informations Générales

Dans **"General Information"**:

1. **App Icon**: Téléchargez une image pour votre bot (optionnel)
2. **Description**: Ajoutez une description:
   ```
   Bot RPG inspiré de Solo Leveling avec système de combat, classes, sorts, artefacts, casino et bien plus!
   ```
3. **Tags**: Ajoutez des tags pertinents:
   - `game`
   - `rpg`
   - `leveling`

4. **Copy Application ID**: Gardez cet ID, c'est votre `DISCORD_CLIENT_ID`

## Étape 3: Créer le Bot

1. Dans le menu de gauche, cliquez sur **"Bot"**
2. Cliquez sur **"Add Bot"**
3. Confirmez en cliquant **"Yes, do it!"**

### Configuration du Bot:

**Username**: Changez le nom si nécessaire (ex: `Solo Leveling RPG`)

**Icon**: Même image que l'application

**Public Bot**:
- ✅ **ON** si vous voulez que n'importe qui puisse inviter le bot
- ❌ **OFF** si vous voulez garder le bot privé

**Requires OAuth2 Code Grant**:
- ❌ **OFF** (laissez désactivé)

## Étape 4: ACTIVER LES INTENTS (CRUCIAL!)

Scrollez jusqu'à **"Privileged Gateway Intents"**

**ACTIVEZ CES 3 INTENTS:**

1. ✅ **PRESENCE INTENT**
   - Permet au bot de voir le statut des utilisateurs

2. ✅ **SERVER MEMBERS INTENT**
   - Permet au bot de voir les membres du serveur

3. ✅ **MESSAGE CONTENT INTENT** ⚠️ **TRÈS IMPORTANT**
   - Permet au bot de lire le contenu des messages
   - **OBLIGATOIRE** pour le système d'XP par messages

**Cliquez sur "Save Changes" en bas!**

## Étape 5: Récupérer le Token

1. Toujours dans **"Bot"**, scrollez vers le haut
2. Section **"TOKEN"**
3. Cliquez sur **"Reset Token"**
4. Confirmez avec votre mot de passe Discord
5. **COPIEZ LE TOKEN IMMÉDIATEMENT**
   - ⚠️ Il ne sera plus visible après!
   - C'est votre `DISCORD_TOKEN`

**⚠️ SÉCURITÉ:**
- Ne partagez JAMAIS ce token
- Ne le mettez JAMAIS sur GitHub
- Régénérez-le si vous pensez qu'il a été compromis

## Étape 6: Générer le Lien d'Invitation

1. Menu de gauche → **"OAuth2"** → **"URL Generator"**

2. **Scopes** (cochez ces cases):
   - ✅ `bot`
   - ✅ `applications.commands`

3. **Bot Permissions** (cochez ces permissions):

   **General Permissions:**
   - ✅ Read Messages/View Channels

   **Text Permissions:**
   - ✅ Send Messages
   - ✅ Send Messages in Threads
   - ✅ Create Public Threads
   - ✅ Create Private Threads
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Add Reactions
   - ✅ Use External Emojis
   - ✅ Mention @everyone, @here, and All Roles
   - ✅ Read Message History
   - ✅ Use Slash Commands

4. **Copiez l'URL générée** en bas de la page

## Étape 7: Inviter le Bot sur Votre Serveur

1. Collez l'URL copiée dans votre navigateur
2. Sélectionnez le serveur où vous voulez inviter le bot
   - Vous devez avoir la permission **"Manage Server"**
3. Vérifiez les permissions
4. Cliquez sur **"Authorize"**
5. Complétez le captcha si demandé

✅ **Votre bot est maintenant sur votre serveur!**

## Étape 8: Configurer le Fichier .env

Dans votre projet, ouvrez le fichier `.env` et remplissez:

```env
DISCORD_TOKEN=votre_token_copié_étape_5
DISCORD_CLIENT_ID=votre_application_id_étape_2
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_supabase
```

## Étape 9: Enregistrer les Commandes Slash

Dans le terminal, à la racine du projet:

```bash
npm run deploy
```

Vous devriez voir:
```
Enregistrement de XX commandes...
✅ XX commandes enregistrées avec succès!
```

⏳ **Attendez 5-10 minutes** pour que les commandes se propagent sur Discord.

## Étape 10: Démarrer le Bot

```bash
npm start
```

Vous devriez voir:
```
✅ Bot connecté en tant que Solo Leveling RPG#1234
🎮 Prêt sur 1 serveur(s)
```

## Étape 11: Tester le Bot

Sur votre serveur Discord:

1. Tapez `/` dans un salon
2. Vous devriez voir les commandes du bot apparaître
3. Testez quelques commandes:
   ```
   /profil
   /fight
   /casino slots 10
   ```

## Vérification des Intents

Si le bot ne répond pas aux messages pour l'XP:

1. Retournez sur https://discord.com/developers/applications
2. Sélectionnez votre application
3. **Bot** → **Privileged Gateway Intents**
4. Vérifiez que **MESSAGE CONTENT INTENT** est ✅ ON
5. Redémarrez le bot

## Problèmes Courants

### Les commandes n'apparaissent pas

**Solution:**
1. Vérifiez que `npm run deploy` a bien fonctionné
2. Attendez 5-10 minutes
3. Rechargez Discord (Ctrl+R ou Cmd+R)
4. Ré-invitez le bot avec le scope `applications.commands`

### Le bot est "offline"

**Solution:**
1. Vérifiez que `npm start` est en cours d'exécution
2. Vérifiez le token dans `.env`
3. Vérifiez les logs du bot pour les erreurs

### Erreur "Missing Access"

**Solution:**
1. Ré-invitez le bot avec toutes les permissions nécessaires
2. Vérifiez que le bot a accès au salon où vous testez

### L'XP ne fonctionne pas

**Solution:**
1. **MESSAGE CONTENT INTENT** doit être ✅ activé
2. Le message doit faire au moins 5 caractères
3. Respectez le cooldown de 10 secondes entre messages
4. Redémarrez le bot après avoir activé l'intent

## Configuration Avancée (Optionnel)

### Installer le Bot sur Plusieurs Serveurs

Pour permettre à d'autres serveurs d'inviter le bot:

1. **Bot** → **Public Bot**: ✅ ON
2. Partagez votre lien d'invitation

### Vérification du Bot

Pour avoir le badge "Verified Bot" (75+ serveurs):

1. **General Information** → **Verification**
2. Suivez les instructions de Discord

### Personnalisation

**About Me Section:**
- **Bot** → **About Me**
- Ajoutez une description riche en markdown

**Rich Presence:**
- Configuré dans le code du bot
- Voir `src/events/ready.js`

## Résumé des URLs Importantes

- **Developer Portal**: https://discord.com/developers/applications
- **Bot Permissions Calculator**: https://discordapi.com/permissions.html
- **Discord API Docs**: https://discord.com/developers/docs

## Checklist de Configuration

- [ ] Application créée
- [ ] Bot ajouté
- [ ] Les 3 Intents activés
- [ ] Token copié et mis dans `.env`
- [ ] Client ID copié et mis dans `.env`
- [ ] Lien d'invitation généré
- [ ] Bot invité sur le serveur
- [ ] Commandes enregistrées (`npm run deploy`)
- [ ] Bot démarré (`npm start`)
- [ ] Commandes testées sur Discord

✅ **Votre bot est maintenant configuré et opérationnel!**

## Support

Si vous rencontrez des problèmes:

1. Vérifiez cette checklist
2. Consultez les logs: `npm start`
3. Vérifiez les permissions du bot sur votre serveur
4. Assurez-vous que les 3 intents sont activés
5. Consultez [SETUP.md](./SETUP.md) pour plus de détails
