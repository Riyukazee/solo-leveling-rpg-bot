#!/bin/bash

# Script pour créer une archive du projet Solo Leveling RPG Bot

echo "📦 Création de l'archive du projet..."

# Créer l'archive en excluant les dossiers inutiles
tar -czf solo-leveling-rpg-bot.tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='*.tar.gz' \
  --exclude='*.zip' \
  .

if [ $? -eq 0 ]; then
    echo "✅ Archive créée avec succès : solo-leveling-rpg-bot.tar.gz"
    echo "📊 Taille de l'archive :"
    ls -lh solo-leveling-rpg-bot.tar.gz
else
    echo "❌ Erreur lors de la création de l'archive"
fi
