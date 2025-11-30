// src/App.js
import React from 'react';
import KundliForm from './components/KundliForm';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';

function App() {
 

  return (
    <div className="App p-4">
      
      <LanguageProvider>
      <Navbar />
      <KundliForm />
      <Footer />
      </LanguageProvider>
    </div>
  );
}

export default App;
