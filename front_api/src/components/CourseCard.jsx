/* eslint-disable react/prop-types */
// CourseCard.jsx
import React from 'react';

const CourseCard = ({ course }) => {
  console.log(course)
  return(
  <div className="col-md-4">
    <div className="cartes">
      <a href={`/formations/${course[0].slug}`}>
        <img 
          src={`https://localhost:8000/uploads/images/formation/${course[0].imageName}`} 
          className="card-img-top" 
          alt={`Formation - ${course[0].nom}`} 
        />
        <div className="card-body px-3 py-1">
          <h5 className="card-title">{course[0].nom}</h5>
          <p className="card-text">
            <strong>{typeof course[0].public.type === 'undefined' ? '' : course[0].public.type }</strong><br />
            <i>{course[0].duree}</i>
          </p>
        </div>
      </a>
    </div>
  </div>)
};

export default CourseCard;
