import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../assets/css/style.css'; // Assurez-vous de créer et importer ce fichier CSS pour les styles

const DetailFormation = ({ formation, programmes }) => {
    const [activeIndices, setActiveIndices] = useState([]);

    const toggleAccordion = (index) => {
        setActiveIndices((prevIndices) => {
            if (prevIndices.includes(index)) {
                return prevIndices.filter((i) => i !== index);
            } else {
                return [...prevIndices, index];
            }
        });
    };

    useEffect(() => {
        const acc = document.getElementsByClassName('formation_button');

        const handleClick = function () {
            this.classList.toggle('active');
            var panel = this.nextElementSibling;
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
                this.style.height = this.offsetHeight + 'px'; // Set the height explicitly
            } else {
                panel.style.display = 'block';
                this.style.height = 'auto'; // Reset the height to auto
            }
        };

        for (let i = 0; i < acc.length; i++) {
            acc[i].addEventListener('click', handleClick);
        }

        return () => {
            for (let i = 0; i < acc.length; i++) {
                acc[i].removeEventListener('click', handleClick);
            }
        };
    }, [programmes]);

    return (
        <div>
            <h1 className="text-center formation_title">{formation.nom}</h1>
            <div className="container w-100 mt-5">
                <h2>Objectif de la formation :</h2>
                <div dangerouslySetInnerHTML={{ __html: formation.description }} />
            </div>
            <div className="formation mt-5 w-100 justify-content-center">
                <figure>
                    <h3>Programme de la Formation</h3>
                    {programmes.map((programme, index) => (
                        <div key={index}>
                            <div
                                className="formation_button"
                                onClick={() => toggleAccordion(index)}
                            >
                                <span>{programme.title}</span>
                                <span>{Number(programme.points)} points</span>
                            </div>
                            <div
                                className={`accordion-content ${activeIndices.includes(index) ? 'active' : ''} text-white`}
                                dangerouslySetInnerHTML={{ __html: programme.description }}
                            />
                        </div>
                    ))}
                </figure>
                <figure>
                    <div className="table-container text-end">
                        <h3 className="text-center">Prix : {formation.prix} € TTC</h3>
                        <h5 className="my-3 text-center">
                            <Link className="btn-info" to="/contact">Contactez-Nous</Link>
                        </h5>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="text-start">Public</th>
                                    <td className="text-nowrap">{formation.public.type}</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className="text-start">Durée</th>
                                    <td>{formation.duree}</td>
                                </tr>
                                <tr>
                                    <th className="text-start">Langue</th>
                                    <td>{formation.langue}</td>
                                </tr>
                                <tr>
                                    <th className="text-start">Lieu</th>
                                    <td>{formation.lieu}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </figure>
            </div>
        </div>
    );
};

DetailFormation.propTypes = {
    formation: PropTypes.shape({
        nom: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        prix: PropTypes.number.isRequired,
        public: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
        ]).isRequired,
        duree: PropTypes.string.isRequired,
        langue: PropTypes.string.isRequired,
        lieu: PropTypes.string.isRequired,
    }).isRequired,
    programmes: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        points: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    })).isRequired,
};

export default DetailFormation;
