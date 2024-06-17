// Carousel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Base_Img_Url from '../Data/Data';
import "../assets/css/bootstrap.css";
import "../assets/css/style.css";
// Removed unnecessary import of bootstrap.js

const CarouselItem = ({ image, title, isActive }) => (
  <div className={`carousel-item ${isActive ? 'active' : ''}`}>
    <img src={`${Base_Img_Url}${image}`} className="d-block w-100" alt={title} />
  </div>
);

const Carousel = ({ carousels }) => (
  <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-indicators">
      {carousels.map((_, index) => (
        <button
          key={index}
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to={index}
          className={index === 0 ? 'active' : ''}
          aria-current={index === 0 ? 'true' : 'false'}
          aria-label={`Slide ${index + 1}`}
        ></button>
      ))}
    </div>
    <div className="carousel-inner w-100">
      {carousels.map((carousel, index) => (
        <CarouselItem
          key={index}
          image={carousel.imageName}
          title={carousel.titre}
          isActive={index === 0}
        />
      ))}
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>

    <div className="img_carousel">
      <div className="img-carousel_1 d-flex justify-content-around w-100">
        <figure>
          <img src="https://localhost:8000/img/Bouclier.png" alt="Image d'un bouclier" />
          <p className="text-large">Formation Qualifiante</p>
        </figure>
        <figure className="carousel_2">
          <img src="https://localhost:8000/img/Graphe.png" alt="Image d'un graphique" />
          <p className="text-large">Approche Innovante</p>
        </figure>
        <figure className="carousel_3">
          <img src="https://localhost:8000/img/Cible.png" alt="Image d'une cible" />
          <p className="text-large">Coaching</p>
        </figure>
      </div>
    </div>
    <div className="img-carousel_4">
      <img src="https://localhost:8000/img/Logo_blanc_simple_1.png" alt="Logo MORRINGAN" />
      <p>Le savoir n'a pas de frontière</p>
    </div>
  </div>
);

function App() {
  const [carousels, setCarousels] = useState([]);

  useEffect(() => {
    // Fetch data from Symfony API
    axios.get('https://localhost:8000/home')
      .then(response => {
        setCarousels(response.data.carousels);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <Carousel carousels={carousels} />
  );
}

export default App;
