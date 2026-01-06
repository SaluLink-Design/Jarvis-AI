import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon"></div>
          <h1>JARVIS 3D AI</h1>
        </div>
        <div className="header-info">
          <span className="status-indicator">
            <span className="status-dot"></span>
            System Online
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;

