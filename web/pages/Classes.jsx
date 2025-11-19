import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rarity: 'Common',
    image_url: '',
    hp_modifier: 1.0,
    mana_modifier: 1.0,
    strength_modifier: 0,
    intelligence_modifier: 0,
    agility_modifier: 0,
    vitality_modifier: 0,
    charisma_modifier: 0,
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    const { data } = await supabase.from('classes').select('*').order('name');
    setClasses(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingClass) {
      await supabase.from('classes').update(formData).eq('id', editingClass.id);
    } else {
      await supabase.from('classes').insert([formData]);
    }

    setShowModal(false);
    setEditingClass(null);
    resetForm();
    loadClasses();
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      description: cls.description || '',
      rarity: cls.rarity,
      image_url: cls.image_url || '',
      hp_modifier: cls.hp_modifier,
      mana_modifier: cls.mana_modifier,
      strength_modifier: cls.strength_modifier,
      intelligence_modifier: cls.intelligence_modifier,
      agility_modifier: cls.agility_modifier,
      vitality_modifier: cls.vitality_modifier,
      charisma_modifier: cls.charisma_modifier,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer cette classe?')) {
      await supabase.from('classes').delete().eq('id', id);
      loadClasses();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      rarity: 'Common',
      image_url: '',
      hp_modifier: 1.0,
      mana_modifier: 1.0,
      strength_modifier: 0,
      intelligence_modifier: 0,
      agility_modifier: 0,
      vitality_modifier: 0,
      charisma_modifier: 0,
    });
  };

  const getRarityBadge = (rarity) => {
    const badges = {
      Common: 'badge-common',
      Rare: 'badge-rare',
      Epic: 'badge-epic',
      Legendary: 'badge-legendary',
    };
    return `badge ${badges[rarity] || 'badge-common'}`;
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Classes</h1>
        <p>Gérer les classes du jeu</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Liste des Classes</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nouvelle Classe
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Rareté</th>
              <th>HP Mod</th>
              <th>Mana Mod</th>
              <th>FOR</th>
              <th>INT</th>
              <th>AGI</th>
              <th>VIT</th>
              <th>CHA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td><strong>{cls.name}</strong></td>
                <td><span className={getRarityBadge(cls.rarity)}>{cls.rarity}</span></td>
                <td>x{cls.hp_modifier}</td>
                <td>x{cls.mana_modifier}</td>
                <td>{cls.strength_modifier >= 0 ? '+' : ''}{cls.strength_modifier}</td>
                <td>{cls.intelligence_modifier >= 0 ? '+' : ''}{cls.intelligence_modifier}</td>
                <td>{cls.agility_modifier >= 0 ? '+' : ''}{cls.agility_modifier}</td>
                <td>{cls.vitality_modifier >= 0 ? '+' : ''}{cls.vitality_modifier}</td>
                <td>{cls.charisma_modifier >= 0 ? '+' : ''}{cls.charisma_modifier}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary btn-small" onClick={() => handleEdit(cls)}>
                      ✏️
                    </button>
                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(cls.id)}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {classes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>
            Aucune classe créée. Cliquez sur "Nouvelle Classe" pour commencer.
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingClass(null); resetForm(); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClass ? 'Modifier la Classe' : 'Nouvelle Classe'}</h2>
              <button className="modal-close" onClick={() => { setShowModal(false); setEditingClass(null); resetForm(); }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rareté</label>
                  <select
                    value={formData.rarity}
                    onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                  >
                    <option value="Common">Commun</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Épique</option>
                    <option value="Legendary">Légendaire</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>URL Image</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Modificateur HP</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.hp_modifier}
                    onChange={(e) => setFormData({ ...formData, hp_modifier: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Modificateur Mana</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.mana_modifier}
                    onChange={(e) => setFormData({ ...formData, mana_modifier: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Force (FOR)</label>
                  <input
                    type="number"
                    value={formData.strength_modifier}
                    onChange={(e) => setFormData({ ...formData, strength_modifier: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Intelligence (INT)</label>
                  <input
                    type="number"
                    value={formData.intelligence_modifier}
                    onChange={(e) => setFormData({ ...formData, intelligence_modifier: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Agilité (AGI)</label>
                  <input
                    type="number"
                    value={formData.agility_modifier}
                    onChange={(e) => setFormData({ ...formData, agility_modifier: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vitalité (VIT)</label>
                  <input
                    type="number"
                    value={formData.vitality_modifier}
                    onChange={(e) => setFormData({ ...formData, vitality_modifier: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Charisme (CHA)</label>
                  <input
                    type="number"
                    value={formData.charisma_modifier}
                    onChange={(e) => setFormData({ ...formData, charisma_modifier: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => { setShowModal(false); setEditingClass(null); resetForm(); }}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClass ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classes;
