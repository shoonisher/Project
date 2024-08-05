import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Data/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import BoutonRetour from '../components/Admin/BoutonRetour';
import { AuthContext } from '../Data/AuthContext';

const CibleList = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cibles, setCibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/hades');
      return;
    }

    const fetchCibles = async () => {
      try {
        const response = await axiosInstance.get('/admin/cible');
        if (Array.isArray(response.data)) {
          setCibles(response.data);
        } else {
          throw new Error('La réponse de l\'API n\'est pas un tableau.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCibles();
  }, [isLoggedIn, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette cible ?')) {
      try {
        await axiosInstance.delete(`/admin/cible/${id}/delete`);
        setCibles(cibles.filter(cible => cible.id !== id));
        setSuccessMessage('Cible supprimée avec succès.');
        setError(null);
      } catch (error) {
        setError('Erreur lors de la suppression de la cible.');
        setSuccessMessage(null);
        console.error('Erreur lors de la suppression de la cible:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Liste des Cibles</h1>
      <div className="mb-3">
        <Link to="/admin/cible/ajouter" className="btn btn-success">Ajouter une Cible</Link>
        <BoutonRetour />
      </div>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cibles.map((cible) => (
            <tr key={cible.id}>
              <td>{cible.type || 'Type non disponible'}</td>
              <td>
                <Link to={`/admin/cible/edit/${cible.id}`} className="btn btn-warning btn-sm me-2">Modifier</Link>
                <button onClick={() => handleDelete(cible.id)} className="btn btn-danger btn-sm">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CibleList;
