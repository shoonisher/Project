import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../Data/axiosConfig';

const AdminEditCible = () => {
  const [formData, setFormData] = useState({
    type: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCibleData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/cible/edit/${id}`);
        setFormData({
          type: response.data.type || ''
        });
      } catch (error) {
        setError('Erreur lors du chargement des données de la cible.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCibleData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('type', formData.type);

    try {
      await axiosInstance.post(`/admin/cible/edit/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Cible mise à jour avec succès.');
      setError(null);
      setTimeout(() => {
        navigate('/admin/cible');
      }, 3000);
    } catch (error) {
      setError('Erreur lors de la mise à jour de la cible.');
      setSuccessMessage(null);
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Modifier la Cible</h1>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez le nom"
            required
          />
          <div className="invalid-feedback">Le nom est requis.</div>
        </div>
        <button type="submit" className="btn btn-primary">Mettre à jour</button>
      </form>
    </div>
  );
};

export default AdminEditCible;
