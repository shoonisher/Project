// Qualities.jsx
import React from 'react';
import Base_Img_Url from '../Data/Data';

const Quality = ({ image, title, text }) => (
  <div className="col-12 col-md-4">
    <div className="qualites">
    <img src={`https://localhost:8000/${image}`} className="d-block w-100" alt={title} />
      <p>{text}</p>
    </div>
  </div>
);

const Qualities = () => (
  <section>
    <h3 className="qualites-title my-3">NOS <span>QUALITES</span></h3>
    <div className="container-fluid">
      <div className="row mt-5">
        <Quality image="/img/Pedagogie.png" title="Pédagogie" text="Notre pédagogie privilégie le savoir-être et le savoir-faire, s'inspirant des meilleures pratiques des entreprises leaders du marché." />
        <Quality image="/img/Innovation.png" title="Innovation" text="Notre méthode intègre les dernières innovations pour des formations modernes et efficaces." />
        <Quality image="/img/Authenticite.png" title="Authenticité" text="Notre approche authentique garantit des formations sincères et transparentes." />
      </div>
      <div className="row">
        <Quality image="/img/Communication.png" title="Communication" text="Notre stratégie de communication claire et ouverte enrichit chaque session de formation." />
        <Quality image="/img/Developpement.png" title="Développement" text="Notre développement s'appuie sur la R&D pour intégrer les compétences de demain." />
        <Quality image="/img/Coatching.png" title="Coaching" text="Notre coaching tire parti des méthodes éprouvées pour maximiser le potentiel individuel." />
      </div>
    </div>
  </section>
);

export default Qualities;
