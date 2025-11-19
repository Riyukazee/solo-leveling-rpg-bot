import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Avatars() {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAvatars(); }, []);

  const loadAvatars = async () => {
    const { data } = await supabase.from('avatars').select('*').order('name');
    setAvatars(data || []);
    setLoading(false);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header"><h1>Avatars</h1><p>Gérer les skins cosmétiques</p></div>
      <div className="card">
        <div className="card-header"><h2>Liste des Avatars</h2></div>
        <table className="table">
          <thead><tr><th>Nom</th><th>Rareté</th><th>Prix</th><th>Actions</th></tr></thead>
          <tbody>
            {avatars.map((a) => (
              <tr key={a.id}>
                <td><strong>{a.name}</strong></td>
                <td><span className={`badge badge-${a.rarity.toLowerCase()}`}>{a.rarity}</span></td>
                <td>{a.price}</td>
                <td><button className="btn btn-secondary btn-small">✏️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Avatars;
