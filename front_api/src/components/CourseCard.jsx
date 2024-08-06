/* eslint-disable react/prop-types */
// CourseCard.jsx
import { Link } from 'react-router-dom';
import Base_API from '../Data/Base_API';

const CourseCard = ({ course }) => {
  console.log(course);
  return (
    <div className="col-md-4">
      <div className="cartes">
        <Link to={`/formation/details/${course[0].slug}`}>
          <img 
            src={`${Base_API}/uploads/images/formation/${course[0].imageName}`} 
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
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
