import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const { language, toggleLanguage } = useLanguage();

  const text = {
    en: { home: 'Home', kundli: 'Kundli', remedies: 'Remedies', puja: 'Puja', contact: 'Contact', switch: 'ಕನ್ನಡ' },
    kn: { home: 'ಮನೆ', kundli: 'ಕುಂಡ್ಲಿ', remedies: 'ಪರಿಹಾರ', puja: 'ಪೂಜೆ', contact: 'ಸಂಪರ್ಕ', switch: 'English' },
  };

  return (
    <nav className="navbar">
      <div className="logo">🔯 AstroGuru</div>
      <ul className="nav-links">
        <li>{text[language].home}</li>
        <li>{text[language].kundli}</li>
        <li>{text[language].remedies}</li>
        <li>{text[language].puja}</li>
        <li>{text[language].contact}</li>
      </ul>
      <button className="lang-btn" onClick={toggleLanguage}>{text[language].switch}</button>
    </nav>
  );
};

export default Navbar;
