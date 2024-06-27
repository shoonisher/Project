import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import './assets/css/Navbar.css';
import Home from './pages/Home';
import PreloaderAndContactInfo from './components/PreloaderAndContactInfo'; // Assurez-vous de créer ce composant
import QuiSommesNousPage from './pages/QuiSommesNous';
import Pedagogie from './pages/Pedagogie';
import Formation from './pages/Formation';
import './index.css';
import DetailFormationPage from './pages/DetailFormation';
import ContactForm from './pages/Contact';

function App() {
  return (
    <Router>
        <PreloaderAndContactInfo />
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/apropos" element={<QuiSommesNousPage />} />
          <Route path="/pedagogie" element={<Pedagogie />} />
          <Route path="/formation" element={<Formation />} />
          <Route path="/formation/details/:slug" element={<DetailFormationPage />} />
          <Route path="/contact" element={<ContactForm/>}/>
        </Routes>
    </Router>
  );
}

export default App;
