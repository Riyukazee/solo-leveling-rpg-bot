import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Spells from './pages/Spells';
import Enemies from './pages/Enemies';
import Artifacts from './pages/Artifacts';
import Expeditions from './pages/Expeditions';
import Boosters from './pages/Boosters';
import Avatars from './pages/Avatars';
import Casino from './pages/Casino';
import Players from './pages/Players';
import Sidebar from './components/Sidebar';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/spells" element={<Spells />} />
            <Route path="/enemies" element={<Enemies />} />
            <Route path="/artifacts" element={<Artifacts />} />
            <Route path="/expeditions" element={<Expeditions />} />
            <Route path="/boosters" element={<Boosters />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/casino" element={<Casino />} />
            <Route path="/players" element={<Players />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
