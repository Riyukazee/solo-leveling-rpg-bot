import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Expeditions() {
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadExpeditions(); }, []);

  const loadExpeditions = async () => {
    const { data } = await supabase.from('expeditions').select('*').order('min_level');
    setExpeditions(data || []);
    setLoading(false);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>Expéditions</h1><p>Gérer les expéditions AFK</p></div>
      <div className="card">
        <div className="card-header"><h2>Liste des Expéditions</h2></div>
        <table className="table">
          <thead><tr><th>Nom</th><th>Niveau Min</th><th>Durée</th><th>Actions</th></tr></thead>
          <tbody>
            {expeditions.map((e) => (
              <tr key={e.id}>
                <td><strong>{e.name}</strong></td>
                <td>{e.min_level}</td>
                <td>{e.duration_minutes} min</td>
                <td><button className="btn btn-secondary btn-small">✏️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expeditions;
