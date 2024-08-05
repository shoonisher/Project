import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../Data/axiosConfig';

const AdminEditCategorie = () => {
  const [formData, setFormData] = useState({
    nom: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategorieData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/categorie/edit/${id}`);
        setFormData({
          nom: response.data.nom || '',
          description: response.data.description || ''
        });
        setSuccessMessage('Catégorie mise à jour avec succès.');
        setError(null);
        setTimeout(() => {
          navigate('/admin/categorie');
        }, 3000);
      } catch (error) {
        setError('Erreur lors du chargement des données de la catégorie.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorieData();
  }, [id, navigate]);

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
      await axiosInstance.post(`/admin/categorie/edit/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Catégorie mise à jour avec succès.');
      setError(null);
      navigate('/admin/categorie');
    } catch (error) {
      setError('Erreur lors de la mise à jour de la catégorie.');
      setSuccessMessage(null);
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Modifier la Catégorie</h1>
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
        <button type="submit" className="btn btn-primary">Mettre à jour la Catégorie</button>
      </form>
    </div>
  );
};

export default AdminEditCategorie;
