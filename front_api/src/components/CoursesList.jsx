// CoursesList.jsx
import React from 'react';
import CourseCard from './CourseCard';

const CoursesList = ({ formations }) => (
  <section className="fiche-container">
    <div className="row w-100 justify-content-around container-fluid">
      {formations.filter(formation => formation.isAccueil === 1).map(formation => (
        <CourseCard key={formation.id} course={formation} />
      ))}
    </div>
  </section>
);

export default CoursesList;
