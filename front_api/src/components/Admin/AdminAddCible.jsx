import { useState } from 'react';
import axiosInstance from '../../Data/axiosConfig';
import { useNavigate } from 'react-router-dom';
import BoutonRetour from './BoutonRetour';

const AdminAddCible = () => {
  const [type, setType] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('type', type);

    try {
      await axiosInstance.post('/admin/cible/ajouter', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Cible ajoutée avec succès.');
      setError(null);
      setTimeout(() => {
        navigate('/admin/cible');
      }, 3000);
    } catch (error) {
      setError('Erreur lors de l\'ajout de la cible.');
      setSuccessMessage(null);
      console.error('Erreur lors de l\'ajout de la cible:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Ajouter une Cible</h1>
      <BoutonRetour />
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type</label>
          <input
            type="text"
            className="form-control"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>
    </div>
  );
};

export default AdminAddCible;
