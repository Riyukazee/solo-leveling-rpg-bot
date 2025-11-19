import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPlayers(); }, []);

  const loadPlayers = async () => {
    const { data } = await supabase.from('players').select('*, class:classes(name)').order('level', { ascending: false }).limit(100);
    setPlayers(data || []);
    setLoading(false);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>Joueurs</h1><p>Gérer les joueurs du serveur</p></div>
      <div className="card">
        <div className="card-header"><h2>Liste des Joueurs (Top 100)</h2></div>
        <table className="table">
          <thead><tr><th>Pseudo</th><th>Niveau</th><th>XP</th><th>Coins</th><th>Classe</th><th>HP</th><th>Mana</th></tr></thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.discord_id}>
                <td><strong>{p.username}</strong></td>
                <td>{p.level}</td>
                <td>{p.xp}</td>
                <td>{p.coins}</td>
                <td>{p.class?.name || 'Novice'}</td>
                <td>{p.hp}/{p.max_hp}</td>
                <td>{p.mana}/{p.max_mana}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Players;
