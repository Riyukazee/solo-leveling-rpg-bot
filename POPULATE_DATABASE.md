# Peupler la Base de Données

Ce guide explique comment remplir rapidement votre base de données avec des données d'exemple.

## Option 1: Via SQL (Rapide - Recommandé)

### Étapes:

1. **Accédez à Supabase:**
   - Connectez-vous sur https://supabase.com
   - Sélectionnez votre projet
   - Menu latéral → **SQL Editor**

2. **Exécutez le fichier SQL:**
   - Cliquez sur **"New query"**
   - Copiez TOUT le contenu de `SAMPLE_DATA.sql`
   - Collez dans l'éditeur
   - Cliquez sur **"Run"** (ou Ctrl+Enter)

3. **Vérifiez les résultats:**
   - En bas, vous devriez voir un tableau montrant:
     ```
     Classes: 7
     Sorts: 15
     Ennemis: 18
     Artefacts: 20
     Expéditions: 5
     Avatars: 5
     Boosters: 3
     ```

✅ **Votre base de données est maintenant remplie!**

### Note sur les Images

Les URLs d'images dans `SAMPLE_DATA.sql` sont des exemples.

**Pour de vraies images:**

1. **Téléchargez des images** sur un service gratuit:
   - https://imgur.com (recommandé)
   - https://imgbb.com
   - https://postimages.org

2. **Remplacez les URLs** dans le SQL avant d'exécuter:
   ```sql
   -- Remplacez ceci:
   'https://i.imgur.com/goblin.png'

   -- Par votre vraie URL:
   'https://i.imgur.com/abc123.png'
   ```

3. **Ou modifiez après** via le panel admin:
   - Ennemis → Modifier → Changer l'URL

## Option 2: Via le Panel Admin (Manuel)

Si vous préférez créer manuellement le contenu:

### Créer des Classes

1. Panel → **Classes** → **+ Nouvelle Classe**
2. Remplissez:
   - **Nom**: Assassin
   - **Rareté**: Rare
   - **HP Modifier**: 0.9
   - **Mana Modifier**: 0.8
   - **FOR**: +5
   - **AGI**: +10
3. Cliquez sur **Créer**
4. Répétez pour d'autres classes (Mage, Tank, etc.)

### Créer des Ennemis

1. Panel → **Ennemis** → **+ Nouvel Ennemi**
2. Remplissez:
   - **Nom**: Goblin
   - **Niveau**: 1
   - **HP**: 50
   - **Force**: 8
   - **URL Image**: (votre image)
   - **XP Récompense**: 50
   - **Coins Récompense**: 25
3. Créez plusieurs ennemis de différents niveaux

### Créer des Sorts

1. Panel → **Sorts** → **+ Nouveau Sort**
2. Sélectionnez une **Classe**
3. Remplissez:
   - **Nom**: Shadow Strike
   - **Mana**: 15
   - **Dégâts**: 45
   - **Type**: Physique
   - **Prix**: 300
4. Créez 3-4 sorts par classe

### Créer des Artefacts

1. Panel → **Artefacts** → **+ Nouvel Artefact**
2. Remplissez:
   - **Nom**: Épée Rouillée
   - **Slot**: Arme
   - **Rareté**: Commun
   - **Prix**: 100
   - **FOR**: +3
   - **Bonus Dégâts**: +5%
3. Créez des artefacts pour tous les slots

## Données Minimales Requises

Pour que le bot fonctionne correctement, vous devez avoir **AU MINIMUM**:

### Obligatoire:
- ✅ **3+ Classes** (au moins une pour roll_class)
- ✅ **5+ Ennemis** (différents niveaux pour /fight)
- ✅ **1+ Sort par classe** (pour system de combat)

### Recommandé:
- ⭐ **10+ Ennemis** (variété de niveaux 1-30)
- ⭐ **3+ Sorts par classe** (progression)
- ⭐ **10+ Artefacts** (différents slots et raretés)
- ⭐ **3+ Expéditions** (différents niveaux)
- ⭐ **5+ Avatars** (personnalisation)

## Structure Recommandée

### Classes (7 suggérées)
```
1. Novice (Common)       - Débutant
2. Assassin (Rare)       - DPS rapide
3. Mage (Epic)           - DPS magique
4. Tank (Rare)           - Tank
5. Archer (Rare)         - DPS à distance
6. Paladin (Epic)        - Hybride
7. Necromancien (Legendary) - Rare puissant
```

### Ennemis par Niveau
```
Niveau 1-5:    5 ennemis (Goblin, Slime, etc.)
Niveau 6-10:   5 ennemis (Orc, Squelette, etc.)
Niveau 11-20:  5 ennemis (Troll, Golem, etc.)
Niveau 21+:    3+ Boss (Dragon, Demon Lord, etc.)
```

### Sorts par Classe
```
Slot 1: Basique    (10-15 mana, 30-45 dégâts)
Slot 2: Avancé     (20-30 mana, 50-70 dégâts)
Slot 3: Puissant   (35-45 mana, 80-100 dégâts)
Slot 4: Ultimate   (50+ mana, 120+ dégâts)
```

### Artefacts par Slot
```
weapon:  5+ armes (différentes raretés)
helmet:  3+ casques
chest:   3+ armures
ring:    3+ anneaux
amulet:  3+ amulettes
```

## Équilibrage du Jeu

### Formules de Base

**Ennemis par Niveau:**
```
HP = 50 × niveau
Force = 5 + (niveau × 2)
XP Récompense = niveau × 50
Coins Récompense = niveau × 25
```

**Artefacts par Rareté:**
```
Common:     +1-3 stats,  0-10% bonus
Rare:       +4-8 stats,  10-20% bonus
Epic:       +9-15 stats, 20-30% bonus
Legendary:  +16-25 stats, 30-50% bonus
```

**Sorts par Tier:**
```
Tier 1 (Niv 1):  10-15 mana, 30-50 dégâts,  200-400 coins
Tier 2 (Niv 5):  20-30 mana, 55-75 dégâts,  600-1000 coins
Tier 3 (Niv 10): 35-45 mana, 80-110 dégâts, 1500-2500 coins
Tier 4 (Niv 15): 50+ mana,   120+ dégâts,   3000+ coins
```

## Mise à Jour des Données

### Ajouter Plus de Contenu

Pour ajouter du contenu après l'import initial:

1. **Via Panel Admin:**
   - Plus facile et visuel
   - Recommandé pour ajouts ponctuels

2. **Via SQL:**
   - Plus rapide pour ajouts en masse
   - Utilisez le même format que `SAMPLE_DATA.sql`

### Modifier des Données Existantes

1. **Dans le Panel:**
   - Cliquez sur le bouton ✏️ à côté de l'élément
   - Modifiez les valeurs
   - Enregistrez

2. **Dans Supabase SQL Editor:**
   ```sql
   UPDATE enemies
   SET hp = 100, strength = 15
   WHERE name = 'Goblin';
   ```

### Supprimer des Données

⚠️ **Attention:** La suppression est permanente!

1. **Dans le Panel:**
   - Cliquez sur 🗑️
   - Confirmez

2. **Dans Supabase:**
   ```sql
   DELETE FROM enemies WHERE name = 'Goblin';
   ```

## Backup des Données

Avant de faire des modifications importantes:

1. **Supabase Dashboard** → **Database** → **Backups**
2. Cliquez sur **"Backup now"**
3. Les backups sont conservés 7 jours (plan gratuit)

## Vérification

### Tester les Données

Une fois les données importées, testez sur Discord:

```
/fight           → Devrait trouver un ennemi
/roll_class      → Devrait donner une classe
/spells shop     → Devrait afficher des sorts
/artifact shop   → Devrait afficher des artefacts
/expedition list → Devrait lister les expéditions
```

### Voir les Données dans Supabase

1. Supabase Dashboard
2. **Table Editor** (menu latéral)
3. Sélectionnez une table (ex: `enemies`)
4. Vous devriez voir toutes les entrées

### Statistiques dans le Panel

1. Connectez-vous au panel admin
2. Dashboard
3. Vérifiez que les compteurs affichent:
   - Classes: 7
   - Ennemis: 18
   - Sorts: 15+
   - Artefacts: 20+
   - etc.

## Problèmes Courants

### Erreur "duplicate key value"

**Cause:** Vous essayez d'insérer des données qui existent déjà.

**Solution:**
```sql
-- Vider les tables avant de réimporter
TRUNCATE classes, spells, enemies, artifacts, expeditions, avatars, boosters CASCADE;
-- Puis réexécutez SAMPLE_DATA.sql
```

### Erreur "foreign key constraint"

**Cause:** Ordre d'insertion incorrect.

**Solution:** Exécutez `SAMPLE_DATA.sql` dans l'ordre (classes avant spells).

### Les images ne s'affichent pas

**Cause:** URLs invalides ou images supprimées.

**Solution:**
1. Téléchargez vos propres images sur Imgur
2. Mettez à jour les URLs dans le panel ou via SQL

## Ressources d'Images Gratuites

Pour trouver des images de monstres/personnages:

- **Pixabay**: https://pixabay.com (libre de droits)
- **Pexels**: https://pexels.com (photos gratuites)
- **Pinterest**: Recherchez "fantasy monsters" (pensez aux droits d'auteur)
- **DeviantArt**: Beaucoup d'artistes avec CC licenses
- **Wikimedia Commons**: Images libres

**Tip**: Recherchez "fantasy character sprite", "rpg monster", "game character art"

## Prochaines Étapes

Après avoir peuplé la base de données:

1. ✅ Testez toutes les commandes du bot
2. ✅ Créez votre propre contenu unique
3. ✅ Ajustez l'équilibrage selon vos joueurs
4. ✅ Ajoutez plus de contenu progressivement
5. ✅ Consultez les statistiques via le panel

## Support

- Problèmes d'import: Vérifiez les logs SQL dans Supabase
- Données manquantes: Utilisez la vérification SQL en fin de `SAMPLE_DATA.sql`
- Questions: Consultez [SETUP.md](./SETUP.md)
