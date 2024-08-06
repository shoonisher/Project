// src/components/PresenceSection.jsx
import React from 'react';
import Base_API from '../../Data/Base_API';

const PresenceSection = () => {
  return (
    <div className="row mt-5 d-flex align-items-center justify-content-center">
      <div className="col-md-6">
        <img src={`${Base_API}/img/france.png`} alt="Équipe" className="img-fluid rounded" />
      </div>
      <div className="col-md-6">
        <h5 className="text-decoration-none text-center apropos">Notre présence nationale</h5>
        <p className="text-decoration-none">Nos interventions couvrent l'ensemble du territoire français, s'adressant à tous les profils d'apprenants. Que vous préfériez une formation dans vos locaux ou dans notre centre de formation à Paris, nous sommes là pour répondre à vos besoins. Nous sommes engagés à adapter nos modules de formation pour les rendre accessibles au maximum. L'accessibilité et l'inclusivité sont au cœur de notre approche, et nous veillons à ce que chacun puisse bénéficier pleinement de nos programmes.</p>
      </div>
    </div>
  );
};

export default PresenceSection;
