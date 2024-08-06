import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../Data/axiosConfig';
import Base_API from '../../Data/Base_API';

const CarouselEdit = () => {
  const [formData, setFormData] = useState({
    titre: '',
    position: '',
    picture: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/carousel/edit/${id}`);
        setFormData({
          titre: response.data.titre || '',
          position: response.data.position || '',
          picture: response.data.picture || ''
        });
      } catch (error) {
        setError('Erreur lors du chargement des données du carousel.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
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
    data.append('titre', formData.titre);
    data.append('position', formData.position);
    if (formData.picture) {
      data.append('picture', formData.picture);
    }

    try {
      await axiosInstance.post(`/admin/carousel/edit/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Carousel mis à jour avec succès.');
      setError(null);
      setTimeout(() => {
        navigate('/admin/carousel');
      }, 3000);
    } catch (error) {
      setError('Erreur lors de la mise à jour du carousel.');
      setSuccessMessage(null);
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Modifier le Carousel</h1>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
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
          <label htmlFor="position" className="form-label">Position</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez la position"
            required
          />
          <div className="invalid-feedback">La position est requise.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">Image</label>
            {formData.picture && <img src={`${Base_API}/uploads/images/carousel/${formData.picture}`} alt="Carousel" width="100" className="d-block mb-2" />}
          <input
            type="file"
            id="picture"
            name="picture"
            onChange={handleChange}
            className="form-control"
          />
          <div className="invalid-feedback">Veuillez sélectionner une image.</div>
        </div>
        <button type="submit" className="btn btn-primary">Mettre à jour le Carousel</button>
      </form>
    </div>
  );
};

export default CarouselEdit;
