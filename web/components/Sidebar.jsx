import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/classes', label: 'Classes', icon: '🎭' },
    { path: '/spells', label: 'Sorts', icon: '✨' },
    { path: '/enemies', label: 'Ennemis', icon: '👹' },
    { path: '/artifacts', label: 'Artefacts', icon: '⚔️' },
    { path: '/expeditions', label: 'Expéditions', icon: '🗺️' },
    { path: '/boosters', label: 'Boosters', icon: '🎁' },
    { path: '/avatars', label: 'Avatars', icon: '🖼️' },
    { path: '/casino', label: 'Casino', icon: '🎰' },
    { path: '/players', label: 'Joueurs', icon: '👥' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>⚔️ Solo Leveling RPG</h1>
        <p>Admin Panel</p>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <button onClick={handleLogout} className="nav-item" style={{ marginTop: '2rem' }}>
          <span style={{ marginRight: '0.5rem' }}>🚪</span>
          Déconnexion
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
