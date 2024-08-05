import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Data/axiosConfig';
import Base_Img_Url from '../Data/Data';
import { Link, useNavigate } from 'react-router-dom';
import BoutonRetour from '../components/Admin/BoutonRetour';
import { AuthContext } from '../Data/AuthContext';

const CarouselList = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [carousels, setCarousels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/hades');
      return;
    }

    const fetchCarousels = async () => {
      try {
        const response = await axiosInstance.get('/admin/carousel');
        if (Array.isArray(response.data)) {
          setCarousels(response.data);
        } else {
          throw new Error('La réponse de l\'API n\'est pas un tableau.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarousels();
  }, [isLoggedIn, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await axiosInstance.delete(`/admin/carousel/${id}/delete`);
        setCarousels(carousels.filter(carousel => carousel.id !== id));
        setSuccessMessage('Carousel supprimé avec succès.'); // Afficher le message de succès
        setError(null); // Réinitialiser les messages d'erreur
      } catch (error) {
        setError('Erreur lors de la suppression du carousel.'); // Afficher le message d'erreur
        setSuccessMessage(null); // Réinitialiser les messages de succès
        console.error('Erreur lors de la suppression du carousel:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Liste des Carousels</h1>
      <div className="mb-3 d-flex justify-content-between">
        <Link to="/admin/carousel/ajouter" className="btn btn-success">Ajouter un Carousel</Link>
        <BoutonRetour />
      </div>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Position</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {carousels.length > 0 ? (
            carousels.map(carousel => (
              <tr key={carousel.id}>
                <td>{carousel.titre}</td>
                <td>{carousel.position}</td>
                <td><img src={`${Base_Img_Url}${carousel.picture}`} alt={carousel.titre} width="100" /></td>
                <td>
                  <Link to={`/admin/carousel/edit/${carousel.id}`} className="btn btn-warning btn-sm me-2">Modifier</Link>
                  <button onClick={() => handleDelete(carousel.id)} className="btn btn-danger btn-sm">Supprimer</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">Aucun carousel trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CarouselList;
