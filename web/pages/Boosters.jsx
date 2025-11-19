import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Boosters() {
  const [boosters, setBoosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBoosters(); }, []);

  const loadBoosters = async () => {
    const { data } = await supabase.from('boosters').select('*').order('name');
    setBoosters(data || []);
    setLoading(false);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>Boosters</h1><p>Gérer les packs de cartes</p></div>
      <div className="card">
        <div className="card-header"><h2>Liste des Boosters</h2></div>
        <table className="table">
          <thead><tr><th>Nom</th><th>Prix</th><th>Premium</th><th>Actions</th></tr></thead>
          <tbody>
            {boosters.map((b) => (
              <tr key={b.id}>
                <td><strong>{b.name}</strong></td>
                <td>{b.price}</td>
                <td>{b.premium_only ? 'Oui' : 'Non'}</td>
                <td><button className="btn btn-secondary btn-small">✏️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Boosters;
