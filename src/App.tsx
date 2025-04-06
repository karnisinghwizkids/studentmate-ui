import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Splash } from './components/Splash';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <Splash onComplete={() => setShowSplash(false)} />
      ) : (
        <div className="min-h-screen bg-primary-bg text-primary-text">
          <Header />
          <Outlet />
        </div>
      )}
    </>
  );
}

export default App;