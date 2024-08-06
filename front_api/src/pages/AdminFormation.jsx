import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Data/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import BoutonRetour from '../components/Admin/BoutonRetour';
import { AuthContext } from '../Data/AuthContext';
import Base_API from '../Data/Base_API';

const FormationList = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/hades');
      return;
    }

    const fetchFormations = async () => {
      try {
        const response = await axiosInstance.get('/admin/formations');
        if (Array.isArray(response.data)) {
          setFormations(response.data);
        } else {
          throw new Error('La réponse de l\'API n\'est pas un tableau.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, [isLoggedIn, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        await axiosInstance.delete(`/admin/formation/${id}/delete`);
        setFormations(formations.filter(formation => formation.id !== id));
        setSuccessMessage('Formation supprimée avec succès.');
        setError(null);
      } catch (error) {
        setError('Erreur lors de la suppression de la formation.');
        setSuccessMessage(null);
        console.error('Erreur lors de la suppression de la formation:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Liste des Formations</h1>
      <div className="mb-3">
        <Link to="/admin/formation/ajouter" className="btn btn-primary">Ajouter</Link>
        <BoutonRetour />
      </div>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Objectif Formation</th>
            <th>Prix</th>
            <th>Nombre de Chapitres</th>
            <th>Durée</th>
            <th>Langue</th>
            <th>Lieu</th>
            <th>Catégorie</th>
            <th>Photo</th>
            <th>Accueil</th>
            <th>Public</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {formations.map((formation) => (
            <tr key={formation.id}>
              <td>{formation.id || 'ID non disponible'}</td>
              <td>{formation.nom || 'Nom non disponible'}</td>
              <td>{formation.objectif_formation || 'Objectif non disponible'}</td>
              <td>{formation.prix || 'Prix non disponible'}</td>
              <td>{formation.nombre_chapitre || 'Nombre de chapitres non disponible'}</td>
              <td>{formation.duree || 'Durée non disponible'}</td>
              <td>{formation.langue || 'Langue non disponible'}</td>
              <td>{formation.lieu || 'Lieu non disponible'}</td>
              <td>{formation.categorie ? formation.categorie.nom : 'Catégorie non disponible'}</td>
              <td>{formation.picture ? <img src={`${Base_API}/uploads/images/formation/${formation.picture}`} alt="Formation" width="50" height="50" /> : 'Photo non disponible'}</td>
              <td>{formation.isAccueil ? 'Oui' : 'Non'}</td>
              <td>{formation.cible ? formation.cible.type : 'Type non disponible'}</td>
              <td>{formation.slug || 'Slug non disponible'}</td>
              <td>
                <Link to={`/admin/formation/edit/${formation.id}`} className="btn btn-warning btn-sm me-2">Modifier</Link>
                <button onClick={() => handleDelete(formation.id)} className="btn btn-danger btn-sm">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormationList;
