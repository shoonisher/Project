// src/components/Carousel.jsx
import React from 'react';
import Base_API from '../../Data/Base_API';

const Carousel = () => {
  return (
    <div className="qsn d-flex justify-content-center">
      <img src={`${Base_API}/img/qui-sommes-nous.png`} alt="Qui-sommes-nous" />
      <h1 className="qsn_text">QUI SOMMES-NOUS ?</h1>
    </div>
  );
};

export default Carousel;
