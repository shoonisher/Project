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
    const [formStatus, setFormStatus] = useState(null);


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/contact', form)
            .then(response => {
                setFormStatus(response.data);
                console.log(form);
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
                                            type="days"
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
                                    {formStatus.message}
                                </div>
                            )}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
