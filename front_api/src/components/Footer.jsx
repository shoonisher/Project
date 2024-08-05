import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-5">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Votre entreprise. Tous droits réservés.</p>
        <p>
          <a href="/mentions-legales" className="text-white">Mentions légales</a> | 
          <a href="/politique-de-confidentialite" className="text-white"> Politique de confidentialité</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
