import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Dashboard() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalClasses: 0,
    totalSpells: 0,
    totalEnemies: 0,
    totalArtifacts: 0,
    totalExpeditions: 0,
    totalBoosters: 0,
    totalAvatars: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [players, classes, spells, enemies, artifacts, expeditions, boosters, avatars] = await Promise.all([
      supabase.from('players').select('*', { count: 'exact', head: true }),
      supabase.from('classes').select('*', { count: 'exact', head: true }),
      supabase.from('spells').select('*', { count: 'exact', head: true }),
      supabase.from('enemies').select('*', { count: 'exact', head: true }),
      supabase.from('artifacts').select('*', { count: 'exact', head: true }),
      supabase.from('expeditions').select('*', { count: 'exact', head: true }),
      supabase.from('boosters').select('*', { count: 'exact', head: true }),
      supabase.from('avatars').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      totalPlayers: players.count || 0,
      totalClasses: classes.count || 0,
      totalSpells: spells.count || 0,
      totalEnemies: enemies.count || 0,
      totalArtifacts: artifacts.count || 0,
      totalExpeditions: expeditions.count || 0,
      totalBoosters: boosters.count || 0,
      totalAvatars: avatars.count || 0,
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Vue d'ensemble du bot RPG</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>👥 Joueurs</h3>
          <div className="value">{stats.totalPlayers}</div>
        </div>

        <div className="stat-card">
          <h3>🎭 Classes</h3>
          <div className="value">{stats.totalClasses}</div>
        </div>

        <div className="stat-card">
          <h3>✨ Sorts</h3>
          <div className="value">{stats.totalSpells}</div>
        </div>

        <div className="stat-card">
          <h3>👹 Ennemis</h3>
          <div className="value">{stats.totalEnemies}</div>
        </div>

        <div className="stat-card">
          <h3>⚔️ Artefacts</h3>
          <div className="value">{stats.totalArtifacts}</div>
        </div>

        <div className="stat-card">
          <h3>🗺️ Expéditions</h3>
          <div className="value">{stats.totalExpeditions}</div>
        </div>

        <div className="stat-card">
          <h3>🎁 Boosters</h3>
          <div className="value">{stats.totalBoosters}</div>
        </div>

        <div className="stat-card">
          <h3>🖼️ Avatars</h3>
          <div className="value">{stats.totalAvatars}</div>
        </div>
      </div>

      <div className="card">
        <h2>Bienvenue sur le panel d'administration</h2>
        <p style={{ color: 'var(--gray)', marginTop: '0.5rem' }}>
          Utilisez le menu de navigation pour gérer tous les aspects du bot RPG Solo Leveling.
        </p>
        <ul style={{ marginTop: '1rem', marginLeft: '1.5rem', color: 'var(--gray)' }}>
          <li>Créez et modifiez des classes avec leurs bonus de stats</li>
          <li>Ajoutez des sorts avec leurs effets et coûts</li>
          <li>Configurez les ennemis et leurs loot tables</li>
          <li>Gérez les artefacts et leurs bonus</li>
          <li>Créez des expéditions avec récompenses</li>
          <li>Configurez les boosters et leur contenu</li>
          <li>Ajoutez des avatars cosmétiques</li>
          <li>Ajustez les paramètres du casino</li>
          <li>Gérez les joueurs et leurs stats</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
