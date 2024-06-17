// CourseCard.jsx
import React from 'react';

const CourseCard = ({ course }) => (
  <div className="col-md-4">
    <div className="cartes">
      <a href={`/formations/${course.slug}`}>
        <img 
          src={`https://localhost:8000/uploads/formation/${course.imageName}`} 
          className="card-img-top" 
          alt={`Formation - ${course.nom}`} 
        />
        <div className="card-body px-3 py-1">
          <h5 className="card-title">{course.nom}</h5>
          <p className="card-text">
            <strong>{course.public}</strong><br />
            <i>{course.duree}</i>
          </p>
        </div>
      </a>
    </div>
  </div>
);

export default CourseCard;
