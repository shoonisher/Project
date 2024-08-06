import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../Data/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Base_API from '../Data/Base_API';

const ContactForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    formation: '',
    datepicker: '',
    personne: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [personnel, setPersonnel] = useState(null);
  const [formations, setFormations] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/profile')
      .then(response => {
        setPersonnel(response.data);
      })
      .catch(error => {
        console.error('Error fetching personnel data:', error);
      });

    axiosInstance.get('/formations/contact')
      .then(response => {
        if (Array.isArray(response.data)) {
          setFormations(response.data);
        } else {
          console.error('Error: formations data is not an array');
        }
      })
      .catch(error => {
        console.error('Error fetching formations data:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance.post(`/contact`, form, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
      .then(response => {
        setFormStatus(response.data);
        console.log(response.data);
        if (response.data.status === 'success') {
          setForm({
            name: '',
            email: '',
            phone: '',
            location: '',
            formation: '',
            datepicker: '',
            personne: '',
            message: ''
          });
          setSuccessMessage('Votre message a été envoyé avec succès.');
          setTimeout(() => {
            navigate('/');
          }, 3000); // 3 seconds delay
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
      });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="content">
      <h1 className="text-center mt-5">Formulaire de Contact</h1>
      <div className="container">
        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}
        <div className="row align-items-stretch no-gutters contact-wrap contact">
          <div className="col-md-8">
            <div className="form h-100">
              <h2>Envoyer nous une demande de contact</h2>
              <p className="text-danger">
                * Champs obligatoires
              </p>

              <form className="mb-5" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 form-group mb-5">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nom"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group mb-5">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group mb-5">
                    <input
                      type="number"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Téléphone"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 form-group mb-5">
                    <select
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="">Sélectionnez une ville</option>
                      <option value="Paris">Paris</option>
                      <option value="Marseille">Marseille</option>
                      <option value="Lyon">Lyon</option>
                      <option value="Toulouse">Toulouse</option>
                      <option value="Nice">Nice</option>
                      <option value="Nantes">Nantes</option>
                      <option value="Strasbourg">Strasbourg</option>
                      <option value="Montpellier">Montpellier</option>
                      <option value="Bordeaux">Bordeaux</option>
                      <option value="Lille">Lille</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group mb-5">
                    <select
                      name="formation"
                      value={form.formation}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="">Sélectionnez une formation</option>
                      {formations.map((formation) => (
                        <option key={formation.id} value={formation.name}>
                          {formation.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 form-group mb-5">
                  <input
                      type="number"
                      name="personne"
                      value={form.personne}
                      onChange={handleChange}
                      placeholder="Nombre de personnes"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 form-group mb-5">
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Message"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 form-group">
                    <input type="submit" value="Envoyer message" className="btn btn-info" />
                    <span className="submitting"></span>
                  </div>
                </div>
              </form>

              {formStatus && (
                <div className={`form-message-${formStatus.status}`}>
                  {formStatus.message}
                  {formStatus.errors && formStatus.errors.map((error, index) => (
                    <div key={index} className="text-danger">
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="contact-info h-100">
              {personnel ? (
                <div>
                  <p className="mb-5">
                    <img className="w-100" src={`${Base_API}/uploads/images/personnel/${personnel.imageName}`} alt={personnel.titre} />
                  </p>
                  <h3>{personnel.titre}</h3>
                  <p className="mb-5" dangerouslySetInnerHTML={{ __html: personnel.description }}></p>
                  <ul className="list-unstyled">
                    <li className="d-flex">
                      <span className="wrap-icon icon-room mr-3"></span>
                      <span className="text">
                        <i className="bi bi-envelope"></i>
                        {personnel.email}
                      </span>
                    </li>
                    <li className="d-flex">
                      <span className="wrap-icon icon-phone mr-3"></span>
                      <span className="text">
                        <i className="bi bi-telephone"></i>
                        {personnel.telephone}
                      </span>
                    </li>
                    <li className="d-flex">
                      <img className="w-50 m-5" src={`${Base_API}/img/Handicap2.png`} alt="Handicap" />
                    </li>
                  </ul>
                </div>
              ) : (
                <p>Aucun personnel trouvé.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
