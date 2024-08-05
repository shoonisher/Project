import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Data/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import BoutonRetour from '../components/Admin/BoutonRetour';
import { AuthContext } from '../Data/AuthContext';

const CategorieList = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/hades');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/admin/categories');
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          throw new Error('La réponse de l\'API n\'est pas un tableau.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isLoggedIn, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await axiosInstance.delete(`/admin/categorie/${id}/delete`);
        setCategories(categories.filter(categorie => categorie.id !== id));
        setSuccessMessage('Catégorie supprimée avec succès.');
        setError(null);
      } catch (error) {
        setError('Erreur lors de la suppression de la catégorie.');
        setSuccessMessage(null);
        console.error('Erreur lors de la suppression de la catégorie:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Liste des Catégories</h1>
      <div className="mb-3 d-flex justify-content-between">
        <Link to="/admin/categorie/ajouter" className="btn btn-success">Ajouter une Catégorie</Link>
        <BoutonRetour />
      </div>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((categorie) => (
            <tr key={categorie.id}>
              <td>{categorie.nom || 'Nom non disponible'}</td>
              <td>
                <Link to={`/admin/categorie/edit/${categorie.id}`} className="btn btn-warning btn-sm me-2">Modifier</Link>
                <button onClick={() => handleDelete(categorie.id)} className="btn btn-danger btn-sm">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategorieList;
