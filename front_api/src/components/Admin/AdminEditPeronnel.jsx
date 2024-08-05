import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../Data/axiosConfig';

const AdminEditPersonnel = () => {
  const [formData, setFormData] = useState({
    email: '',
    titre: '',
    telephone: '',
    picture: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPersonnelData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/personnel/edit/${id}`);
        setFormData({
          email: response.data.email || '',
          titre: response.data.titre || '',
          telephone: response.data.telephone || '',
          picture: response.data.picture || '',
          description: response.data.description || '',
        });
      } catch (error) {
        setError('Erreur lors du chargement des données du personnel.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnelData();
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
    data.append('email', formData.email);
    data.append('titre', formData.titre);
    data.append('telephone', formData.telephone);
    if (formData.picture) {
      data.append('picture', formData.picture);
    }
    data.append('description', formData.description);

    try {
      await axiosInstance.post(`/admin/personnel/edit/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Personnel mis à jour avec succès.');
      setError(null);
      setTimeout(() => {
        navigate('/admin/personnel');
      }, 3000);
    } catch (error) {
      setError('Erreur lors de la mise à jour du personnel.');
      setSuccessMessage(null);
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Modifier le Personnel</h1>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez l&apos;email"
            required
          />
          <div className="invalid-feedback">L&apos;email est requis.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="titre" className="form-label">Titre</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez le titre"
            required
          />
          <div className="invalid-feedback">Le titre est requis.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="telephone" className="form-label">Téléphone</label>
          <input
            type="text"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez le téléphone"
            required
          />
          <div className="invalid-feedback">Le téléphone est requis.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">Photo</label>
          {formData.picture && <img src={`https://localhost:8000/uploads/images/personnel/${formData.picture}`} alt="Personnel" width="100" className="d-block mb-2" />}
          <input
            type="file"
            id="picture"
            name="picture"
            onChange={handleChange}
            className="form-control"
          />
          <div className="invalid-feedback">Veuillez sélectionner une photo.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description.replace(/<\/?[^>]+(>|$)/g, "")}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez la description"
            required
          />
          <div className="invalid-feedback">La description est requise.</div>
        </div>
        <button type="submit" className="btn btn-primary">Mettre à jour</button>
      </form>
    </div>
  );
};

export default AdminEditPersonnel;

