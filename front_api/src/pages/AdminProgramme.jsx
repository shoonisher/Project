import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Data/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import BoutonRetour from '../components/Admin/BoutonRetour';
import { AuthContext } from '../Data/AuthContext';

const ProgrammeList = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/hades');
      return;
    }

    const fetchProgrammes = async () => {
      try {
        const response = await axiosInstance.get('/admin/programme');
        if (Array.isArray(response.data)) {
          setProgrammes(response.data);
        } else {
          throw new Error('La réponse de l\'API n\'est pas un tableau.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, [isLoggedIn, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
      try {
        await axiosInstance.delete(`/admin/programme/delete/${id}`);
        setProgrammes(programmes.filter(programme => programme.id !== id));
        setSuccessMessage('Programme supprimé avec succès.');
        setError(null);
      } catch (error) {
        setError('Erreur lors de la suppression du programme.');
        setSuccessMessage(null);
        console.error('Erreur lors de la suppression du programme:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Liste des Programmes</h1>
      <div className="mb-3">
        <Link to="/admin/programme/ajouter" className="btn btn-primary">Ajouter</Link>
        <BoutonRetour />
      </div>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Point</th>
            <th>Slug</th>
            <th>Formation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programmes.map((programme) => (
            <tr key={programme.id}>
              <td>{programme.id || 'ID non disponible'}</td>
              <td>{programme.titre || 'Titre non disponible'}</td>
              <td>{programme.description || 'Description non disponible'}</td>
              <td>{programme.point || 'Point non disponible'}</td>
              <td>{programme.slug || 'Slug non disponible'}</td>
              <td>{programme.formation || 'Formation non disponible'}</td>
              <td>
                <Link to={`/admin/programme/edit/${programme.id}`} className="btn btn-warning btn-sm me-2">Modifier</Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(programme.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgrammeList;
