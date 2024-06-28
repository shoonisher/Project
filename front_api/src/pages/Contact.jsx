import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [personnels, setPersonnels] = useState([]);
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:8000/api/personnels')
      .then(response => {
        setPersonnels(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error('Error fetching personnel data:', error);
      });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://localhost:8000/contact', form, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        setFormStatus(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        setFormStatus({ status: 'error', message: 'Une erreur s\'est produite.' });
      });
  };

  return (
    <div className="content">
      <h1 className="text-center mt-5">Formulaire de Contact</h1>
      <div className="container">
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
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group mb-5">
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Téléphone"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 form-group mb-5">
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Localisation"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group mb-5">
                    <input
                      type="text"
                      name="formation"
                      value={form.formation}
                      onChange={handleChange}
                      placeholder="Formation"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 form-group mb-5">
                    <input
                      type="date"
                      name="datepicker"
                      value={form.datepicker}
                      onChange={handleChange}
                      placeholder="Date"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 form-group mb-5">
                    <input
                      type="number"
                      name="personne"
                      value={form.personne}
                      onChange={handleChange}
                      placeholder="Nombre de personnes"
                      className="form-control"
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
                  {formStatus.error}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="contact-info h-100">
              {personnels.length > 0 ? (
                personnels.map((personnel, index) => (
                  <div key={index}>
                    <p className="mb-5">
                      <img className="w-100" src={`/uploads/images/contact/${personnel.imageName}`} alt={personnel.titre} />
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
                        <img className="w-50 m-5" src="/img/Handicap2.png" alt="Handicap" />
                      </li>
                    </ul>
                  </div>
                ))
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
