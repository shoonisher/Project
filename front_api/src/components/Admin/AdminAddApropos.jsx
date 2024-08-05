import { useState } from 'react';
import axiosInstance from '../../Data/axiosConfig';
import { useNavigate } from 'react-router-dom';
import BoutonRetour from './BoutonRetour';

const AdminAddApropos = () => {
  const [text, setText] = useState('');
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', text);
    formData.append('picture', picture);

    try {
      const response = await axiosInstance.post('/admin/apropos/ajouter', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccessMessage('A propos ajouté avec succès.');
        setError(null);
        setTimeout(() => {
          navigate('/admin/apropos');
        }, 3000);
      }
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'A propos.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Ajouter un A propos</h1>
      <div className="mb-3 d-flex justify-content-between">
        <BoutonRetour />
      </div>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="text" className="form-label">Texte</label>
          <textarea
            id="text"
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">Image</label>
          <input
            type="file"
            id="picture"
            className="form-control"
            onChange={(e) => setPicture(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>
    </div>
  );
};

export default AdminAddApropos;
