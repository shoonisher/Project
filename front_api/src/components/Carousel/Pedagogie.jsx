// src/components/Carousel.jsx
import React from 'react';
import Base_API from '../../Data/Base_API';

const Carousel = () => {
  return (
    <div className="qsn d-flex justify-content-center">
      <img src={`${Base_API}/img/notre_pedagogie.png`} alt="Pedagogie" />
      <h1 className="qsn_text">Pedagogie</h1>
    </div>
  );
};

export default Carousel;
