import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Data/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import BoutonRetour from '../components/Admin/BoutonRetour';
import { AuthContext } from '../Data/AuthContext';
import Base_API from '../Data/Base_API';

const AproposList = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [apropos, setApropos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/hades');
      return;
    }

    const fetchApropos = async () => {
      try {
        const response = await axiosInstance.get('/admin/apropos');
        if (Array.isArray(response.data)) {
          setApropos(response.data);
        } else {
          throw new Error('La réponse de l\'API n\'est pas un tableau.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApropos();
  }, [isLoggedIn, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await axiosInstance.delete(`/admin/apropos/${id}/delete`);
        setApropos(apropos.filter(apropos => apropos.id !== id));
        setSuccessMessage('A propos supprimé avec succès.'); // Afficher le message de succès
        setError(null); // Réinitialiser les messages d'erreur
      } catch (error) {
        setError('Erreur lors de la suppression de l\'élément.'); // Afficher le message d'erreur
        setSuccessMessage(null); // Réinitialiser les messages de succès
        console.error('Erreur lors de la suppression de l\'élément:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Liste des A propos</h1>
      <div className="mb-3 d-flex justify-content-between">
        <Link to="/admin/apropos/ajouter" className="btn btn-success">Ajouter un A propos</Link>
        <BoutonRetour />
      </div>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Text</th>
            <th>image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apropos.length > 0 ? (
            apropos.map(apropos => (
              <tr key={apropos.id}>
                <td>{apropos.text}</td>
                <td><img src={`${Base_API}/uploads/images/apropos/${apropos.picture}`} alt={apropos.titre} width="100" /></td>
                <td>
                  <Link to={`/admin/apropos/edit/${apropos.id}`} className="btn btn-warning btn-sm me-2">Modifier</Link>
                  <button onClick={() => handleDelete(apropos.id)} className="btn btn-danger btn-sm">Supprimer</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">Aucun A propos trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AproposList;
