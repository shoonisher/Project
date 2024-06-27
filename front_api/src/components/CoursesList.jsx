// CoursesList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import CourseCard from '../components/CourseCard';

const filterAccueilFormations = (formations) => {
  return formations.filter(formation => formation.isAccueil === true);
};


const CoursesList = ({ formations }) => {
  const filteredFormations = filterAccueilFormations(formations);
  console.log(filteredFormations);
  return (
    <section className="fiche-container">
      <div className="row w-100 justify-content-around container-fluid">
        {filteredFormations.length && filteredFormations.map(formation => (
          <CourseCard key={formation.id} course={[formation]} />
        ))}
      </div>
    </section>
  );
};

CoursesList.propTypes = {
  formations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      isAccueil: PropTypes.bool.isRequired,
      slug: PropTypes.string.isRequired,
      imageName: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired,
      public: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
      duree: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CoursesList;
