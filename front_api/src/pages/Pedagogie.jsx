import React from 'react';
import Carousel from '../components/Carousel/Pedagogie';

const Pedagogie = () => {
  return (
    <div>
      <Carousel />
      <div className='container' style={{ backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '10px' }}>
        <h1 style={{ color: '#4b0082' }}>Bienvenue à notre entreprise de formations en cybersécurité</h1>
        <p style={{ color: '#4682b4' }}>Nous offrons des formations de pointe pour vous aider à protéger vos systèmes et données.</p>
      <section>
        <h2 style={{ color: '#2e8b57' }}>Nos Formations</h2>
        <p style={{ color: '#4682b4' }}>Nous proposons des formations de qualité pour vous aider à protéger vos systèmes et données.</p>
      </section>
      <section>
        <h2 className='text-left' style={{ color: '#2e8b57' }}>Pourquoi choisir nos formations ?</h2>
        <ul>
          <li style={{ color: '#4682b4' }}>Experts en cybersécurité avec des années d'expérience</li>
          <li style={{ color: '#4682b4' }}>Programmes de formation complets et à jour</li>
          <li style={{ color: '#4682b4' }}>Support continu et ressources supplémentaires</li>
        </ul>
      </section>
      <section>
        <h2 style={{ color: '#2e8b57' }}>Contactez-nous</h2>
        <p style={{ color: '#4682b4' }}>Pour plus d'informations sur nos formations, veuillez nous <a href="/contact" style={{ color: '#ff4500' }}>contactez</a>.</p>
      </section>
      </div>
    </div>
  );
};

export default Pedagogie;
