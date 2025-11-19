import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Casino() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadConfigs(); }, []);

  const loadConfigs = async () => {
    const { data } = await supabase.from('casino_config').select('*');
    setConfigs(data || []);
    setLoading(false);
  };

  const toggleEnabled = async (id, enabled) => {
    await supabase.from('casino_config').update({ enabled: !enabled }).eq('id', id);
    loadConfigs();
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>Casino</h1><p>Configuration des jeux de casino</p></div>
      <div className="card">
        <div className="card-header"><h2>Jeux de Casino</h2></div>
        <table className="table">
          <thead><tr><th>Jeu</th><th>Statut</th><th>Mise Min</th><th>Mise Max</th><th>Actions</th></tr></thead>
          <tbody>
            {configs.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.game_type}</strong></td>
                <td>
                  <span className={`badge ${c.enabled ? 'badge-rare' : 'badge-common'}`}>
                    {c.enabled ? 'Activé' : 'Désactivé'}
                  </span>
                </td>
                <td>{c.min_bet}</td>
                <td>{c.max_bet}</td>
                <td>
                  <button className="btn btn-secondary btn-small" onClick={() => toggleEnabled(c.id, c.enabled)}>
                    {c.enabled ? '🔴' : '🟢'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Casino;
