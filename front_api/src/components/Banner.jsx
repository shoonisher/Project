// Banner.jsx
import React from 'react';

const Banner = () => (
  <div>
    <img className='bandeau w-100' src="https://localhost:8000/img/Bandeau.png" alt="Explorez, apprenez, progressez" />
    <div className="d-flex flex-column align-items-center text-center">
      <h4 className="bandeau_text">Explorez, apprenez, progressez : C'est notre priorité</h4>
      <h4 className="bandeau_contact mt-2 ">Etes-vous prêt à démarrer ?</h4>
      <a className='btn-bandeau px-4 py-2  text-center' href="/contact">Contactez-nous</a>
    </div>
  </div>
);

export default Banner;
