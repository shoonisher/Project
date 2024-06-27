// src/pages/QuiSommesNousPage.jsx
import React from 'react';
import QuisommesNous from '../components/Meta/QuisommesNous';
import Carousel from '../components/Carousel/Quisommes-nous';
import ExpertiseSection from '../components/Quisommes-nous/ExpertiseSection';
import PresenceSection from '../components/Quisommes-nous/PresenceSection';

const QuiSommesNous = () => {
  return (
    <div>
      <QuisommesNous />
      <Carousel />
      <ExpertiseSection />
      <PresenceSection />
    </div>
  );
};

export default QuiSommesNous;
