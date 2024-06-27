// src/components/PreloaderAndContactInfo.jsx
import React, { useEffect } from 'react';

const PreloaderAndContactInfo = () => {
  useEffect(() => {
    const hidePreloader = () => {
      const preloaderContainer = document.querySelector('.preloader-container');
      if (preloaderContainer) {
        preloaderContainer.style.display = 'none';
      }
    };

    window.addEventListener('load', hidePreloader);
    return () => {
      window.removeEventListener('load', hidePreloader);
    };
  }, []);

  return (
    <div>
      <div className="preloader-container">
        <div className="preloader"></div>
      </div>
      <div className="num_tel">
        <span className="text-white">
          <i className="bi bi-telephone"></i> Tel :
          <a href="tel:+33768165061">+33 7 68 16 50 61</a>
        </span>
        <span className="separator">|</span>
        <span className="text-white">
          <i className="bi bi-envelope"></i> Mail :
          <a href="mailto:contact@morringan.fr">contact@morringan.fr</a>
        </span>
        <span className="separator">|</span>
        <a href="https://www.linkedin.com/company/102878054" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-linkedin"></i>
        </a>
      </div>
    </div>
  );
};

export default PreloaderAndContactInfo;
