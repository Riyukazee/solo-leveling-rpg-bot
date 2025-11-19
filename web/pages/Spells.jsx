import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Spells() {
  const [spells, setSpells] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSpell, setEditingSpell] = useState(null);
  const [formData, setFormData] = useState({
    class_id: '',
    name: '',
    description: '',
    mana_cost: 10,
    base_damage: 10,
    damage_type: 'physical',
    scaling_stat: 'strength',
    cooldown: 0,
    level_required: 1,
    price: 100,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [spellsData, classesData] = await Promise.all([
      supabase.from('spells').select('*, class:classes(name)').order('name'),
      supabase.from('classes').select('*').order('name'),
    ]);
    setSpells(spellsData.data || []);
    setClasses(classesData.data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingSpell) {
      await supabase.from('spells').update(formData).eq('id', editingSpell.id);
    } else {
      await supabase.from('spells').insert([formData]);
    }

    setShowModal(false);
    setEditingSpell(null);
    resetForm();
    loadData();
  };

  const handleEdit = (spell) => {
    setEditingSpell(spell);
    setFormData({
      class_id: spell.class_id,
      name: spell.name,
      description: spell.description || '',
      mana_cost: spell.mana_cost,
      base_damage: spell.base_damage,
      damage_type: spell.damage_type,
      scaling_stat: spell.scaling_stat,
      cooldown: spell.cooldown,
      level_required: spell.level_required,
      price: spell.price,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer ce sort?')) {
      await supabase.from('spells').delete().eq('id', id);
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      class_id: '',
      name: '',
      description: '',
      mana_cost: 10,
      base_damage: 10,
      damage_type: 'physical',
      scaling_stat: 'strength',
      cooldown: 0,
      level_required: 1,
      price: 100,
    });
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Sorts</h1>
        <p>Gérer les sorts du jeu</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Liste des Sorts</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nouveau Sort
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Classe</th>
              <th>Mana</th>
              <th>Dégâts</th>
              <th>Type</th>
              <th>Scale</th>
              <th>Niveau</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {spells.map((spell) => (
              <tr key={spell.id}>
                <td><strong>{spell.name}</strong></td>
                <td>{spell.class?.name || 'N/A'}</td>
                <td>{spell.mana_cost}</td>
                <td>{spell.base_damage}</td>
                <td>{spell.damage_type}</td>
                <td>{spell.scaling_stat}</td>
                <td>{spell.level_required}</td>
                <td>{spell.price}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary btn-small" onClick={() => handleEdit(spell)}>✏️</button>
                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(spell.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingSpell(null); resetForm(); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSpell ? 'Modifier le Sort' : 'Nouveau Sort'}</h2>
              <button className="modal-close" onClick={() => { setShowModal(false); setEditingSpell(null); resetForm(); }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Classe</label>
                <select value={formData.class_id} onChange={(e) => setFormData({ ...formData, class_id: e.target.value })} required>
                  <option value="">Sélectionner une classe</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nom</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Coût Mana</label>
                  <input type="number" value={formData.mana_cost} onChange={(e) => setFormData({ ...formData, mana_cost: parseInt(e.target.value) })} />
                </div>

                <div className="form-group">
                  <label>Dégâts Base</label>
                  <input type="number" value={formData.base_damage} onChange={(e) => setFormData({ ...formData, base_damage: parseInt(e.target.value) })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type de Dégâts</label>
                  <select value={formData.damage_type} onChange={(e) => setFormData({ ...formData, damage_type: e.target.value })}>
                    <option value="physical">Physique</option>
                    <option value="magical">Magique</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Stat de Scale</label>
                  <select value={formData.scaling_stat} onChange={(e) => setFormData({ ...formData, scaling_stat: e.target.value })}>
                    <option value="strength">Force</option>
                    <option value="intelligence">Intelligence</option>
                    <option value="agility">Agilité</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cooldown (tours)</label>
                  <input type="number" value={formData.cooldown} onChange={(e) => setFormData({ ...formData, cooldown: parseInt(e.target.value) })} />
                </div>

                <div className="form-group">
                  <label>Niveau Requis</label>
                  <input type="number" value={formData.level_required} onChange={(e) => setFormData({ ...formData, level_required: parseInt(e.target.value) })} />
                </div>

                <div className="form-group">
                  <label>Prix</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => { setShowModal(false); setEditingSpell(null); resetForm(); }}>Annuler</button>
                <button type="submit" className="btn btn-primary">{editingSpell ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Spells;
