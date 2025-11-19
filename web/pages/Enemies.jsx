import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Enemies() {
  const [enemies, setEnemies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    level: 1,
    hp: 50,
    strength: 5,
    intelligence: 5,
    agility: 5,
    xp_reward: 50,
    coin_reward: 25,
  });

  useEffect(() => {
    loadEnemies();
  }, []);

  const loadEnemies = async () => {
    setLoading(true);
    const { data } = await supabase.from('enemies').select('*').order('level');
    setEnemies(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await supabase.from('enemies').update(formData).eq('id', editing.id);
    } else {
      await supabase.from('enemies').insert([formData]);
    }
    setShowModal(false);
    setEditing(null);
    resetForm();
    loadEnemies();
  };

  const handleEdit = (enemy) => {
    setEditing(enemy);
    setFormData({ ...enemy });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer cet ennemi?')) {
      await supabase.from('enemies').delete().eq('id', id);
      loadEnemies();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
      level: 1,
      hp: 50,
      strength: 5,
      intelligence: 5,
      agility: 5,
      xp_reward: 50,
      coin_reward: 25,
    });
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Ennemis</h1>
        <p>Gérer les ennemis du jeu</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Liste des Ennemis</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nouvel Ennemi</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Niveau</th>
              <th>HP</th>
              <th>FOR</th>
              <th>INT</th>
              <th>AGI</th>
              <th>XP</th>
              <th>Coins</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enemies.map((enemy) => (
              <tr key={enemy.id}>
                <td><strong>{enemy.name}</strong></td>
                <td>{enemy.level}</td>
                <td>{enemy.hp}</td>
                <td>{enemy.strength}</td>
                <td>{enemy.intelligence}</td>
                <td>{enemy.agility}</td>
                <td>{enemy.xp_reward}</td>
                <td>{enemy.coin_reward}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary btn-small" onClick={() => handleEdit(enemy)}>✏️</button>
                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(enemy.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditing(null); resetForm(); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Modifier l\'Ennemi' : 'Nouvel Ennemi'}</h2>
              <button className="modal-close" onClick={() => { setShowModal(false); setEditing(null); resetForm(); }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="form-group">
                <label>URL Image</label>
                <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Niveau</label>
                  <input type="number" value={formData.level} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>HP</label>
                  <input type="number" value={formData.hp} onChange={(e) => setFormData({ ...formData, hp: parseInt(e.target.value) })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Force</label>
                  <input type="number" value={formData.strength} onChange={(e) => setFormData({ ...formData, strength: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Intelligence</label>
                  <input type="number" value={formData.intelligence} onChange={(e) => setFormData({ ...formData, intelligence: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Agilité</label>
                  <input type="number" value={formData.agility} onChange={(e) => setFormData({ ...formData, agility: parseInt(e.target.value) })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>XP Récompense</label>
                  <input type="number" value={formData.xp_reward} onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Coins Récompense</label>
                  <input type="number" value={formData.coin_reward} onChange={(e) => setFormData({ ...formData, coin_reward: parseInt(e.target.value) })} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => { setShowModal(false); setEditing(null); resetForm(); }}>Annuler</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enemies;
