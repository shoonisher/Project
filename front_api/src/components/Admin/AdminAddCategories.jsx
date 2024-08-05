import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Data/axiosConfig';

const AdminAddCategorie = () => {
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('description', formData.description);

    try {
      await axiosInstance.post('/admin/categorie/ajouter', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Catégorie ajoutée avec succès.');
      setError(null);
      setTimeout(() => {
        navigate('/admin/categorie');
      }, 3000);
    } catch (error) {
      setError('Erreur lors de l\'ajout de la catégorie.');
      setSuccessMessage(null);
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Ajouter une Catégorie</h1>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez le nom"
            required
          />
          <div className="invalid-feedback">Le nom est requis.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez la description"
            required
          />
          <div className="invalid-feedback">La description est requise.</div>
        </div>
        <button type="submit" className="btn btn-primary">Ajouter la Catégorie</button>
      </form>
    </div>
  );
};

export default AdminAddCategorie;
