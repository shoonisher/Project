import React from 'react';
import PropTypes from 'prop-types';
import CourseCard from '../CourseCard';

const CoursesList = ({ categories }) => {
  console.log(categories)
  const sanitizeHTML = (html) => {
    return { __html: html.replace(/<[^>]*>?/gm, '') };
  };
  return (
    <section className="fiche-container flex-column">
      {categories.map(category => (
        <div key={category.id} className="category-section">
          <h2>{category.name}</h2>
          <p dangerouslySetInnerHTML={sanitizeHTML(category.description)} />
          <div className="row w-100 justify-content-around container-fluid">
            {category.formations.map(formation => (
              <CourseCard key={formation.id} course={[formation]} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

CoursesList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
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
    })
  ).isRequired,
};

export default CoursesList;
