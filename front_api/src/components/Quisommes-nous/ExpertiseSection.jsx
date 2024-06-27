// src/components/ExpertiseSection.jsx
import React from 'react';

const ExpertiseSection = () => {
  return (
    <div className="container-fluid my-5">
      <div className="row d-flex align-items-center justify-content-center">
        <div className="col-md-6">
          <h5 className="text-decoration-none text-center">Nos expertises</h5>
          <p className="text-decoration-none items-aligne-center">MORRINGAN est une entreprise avec une solide expérience de 20 ans en sécurité des systèmes d'information, complétée par une décennie en entrepreneuriat.</p>
          <p className="text-decoration-none items-aligne-center">Nous offrons une vaste gamme de formations spécialisées qui répondent aux besoins évolutifs du secteur de la sécurité de l'information et du monde de l'entreprenariat. Que vous souhaitiez renforcer vos compétences en cybersécurité, en gestion d'entreprise, nos programmes sont conçus pour vous équiper efficacement. Nous collaborons étroitement avec des experts de l'industrie pour assurer que nos formations restent pertinentes et à la pointe de la technologie.</p>
        </div>
        <div className="col-md-6">
          <img src="https://localhost:8000/img/formateur.png" alt="Équipe" className="img-fluid rounded" />
        </div>
      </div>
    </div>
  );
};

export default ExpertiseSection;
