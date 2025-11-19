import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Artifacts() {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', rarity: 'Common', slot: 'weapon', image_url: '',
    strength_bonus: 0, intelligence_bonus: 0, agility_bonus: 0, vitality_bonus: 0, charisma_bonus: 0,
    hp_bonus: 0, mana_bonus: 0, crit_bonus: 0, damage_bonus: 0, xp_bonus: 0, coin_bonus: 0, price: 500,
  });

  useEffect(() => { loadArtifacts(); }, []);

  const loadArtifacts = async () => {
    setLoading(true);
    const { data } = await supabase.from('artifacts').select('*').order('name');
    setArtifacts(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await supabase.from('artifacts').update(formData).eq('id', editing.id);
    else await supabase.from('artifacts').insert([formData]);
    setShowModal(false); setEditing(null); loadArtifacts();
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer?')) {
      await supabase.from('artifacts').delete().eq('id', id);
      loadArtifacts();
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>Artefacts</h1></div>
      <div className="card">
        <div className="card-header">
          <h2>Liste des Artefacts</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nouvel Artefact</button>
        </div>
        <table className="table">
          <thead><tr><th>Nom</th><th>Slot</th><th>Rareté</th><th>Prix</th><th>Actions</th></tr></thead>
          <tbody>
            {artifacts.map((a) => (
              <tr key={a.id}>
                <td><strong>{a.name}</strong></td>
                <td>{a.slot}</td>
                <td><span className={`badge badge-${a.rarity.toLowerCase()}`}>{a.rarity}</span></td>
                <td>{a.price}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary btn-small" onClick={() => { setEditing(a); setFormData(a); setShowModal(true); }}>✏️</button>
                    <button className="btn btn-danger btn-small" onClick={() => handleDelete(a.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Artefact</h2><button className="modal-close" onClick={() => setShowModal(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Nom</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Slot</label>
                  <select value={formData.slot} onChange={(e) => setFormData({...formData, slot: e.target.value})}>
                    <option value="weapon">Arme</option><option value="helmet">Casque</option>
                    <option value="chest">Torse</option><option value="ring">Anneau</option><option value="amulet">Amulette</option>
                  </select>
                </div>
                <div className="form-group"><label>Rareté</label>
                  <select value={formData.rarity} onChange={(e) => setFormData({...formData, rarity: e.target.value})}>
                    <option value="Common">Commun</option><option value="Rare">Rare</option>
                    <option value="Epic">Épique</option><option value="Legendary">Légendaire</option>
                  </select>
                </div>
                <div className="form-group"><label>Prix</label><input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>FOR</label><input type="number" value={formData.strength_bonus} onChange={(e) => setFormData({...formData, strength_bonus: parseInt(e.target.value)})} /></div>
                <div className="form-group"><label>INT</label><input type="number" value={formData.intelligence_bonus} onChange={(e) => setFormData({...formData, intelligence_bonus: parseInt(e.target.value)})} /></div>
                <div className="form-group"><label>AGI</label><input type="number" value={formData.agility_bonus} onChange={(e) => setFormData({...formData, agility_bonus: parseInt(e.target.value)})} /></div>
                <div className="form-group"><label>VIT</label><input type="number" value={formData.vitality_bonus} onChange={(e) => setFormData({...formData, vitality_bonus: parseInt(e.target.value)})} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Artifacts;
