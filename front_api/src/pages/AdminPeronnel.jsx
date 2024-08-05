import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../Data/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import BoutonRetour from '../components/Admin/BoutonRetour';
import { AuthContext } from '../Data/AuthContext';

const PersonnelList = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/hades');
      return;
    }

    const fetchPersonnel = async () => {
      try {
        const response = await axiosInstance.get('/admin/personnel');
        if (Array.isArray(response.data)) {
          setPersonnel(response.data);
        } else {
          throw new Error('La réponse de l\'API n\'est pas un tableau.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, [isLoggedIn, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Liste du Personnel</h1>
      <div className="mb-3">
        <BoutonRetour />
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Email</th>
            <th>Titre</th>
            <th>Téléphone</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {personnel.map((person) => (
            <tr key={person.id}>
              <td>{person.email || 'Email non disponible'}</td>
              <td>{person.titre || 'Titre non disponible'}</td>
              <td>{person.telephone || 'Téléphone non disponible'}</td>
              <td>{person.picture ? <img src={`http://localhost:8000/uploads/images/personnel/${person.picture}`} alt="Personnel" width="50" height="50" /> : 'Photo non disponible'}</td>
              <td>
                <Link to={`/admin/personnel/edit/${person.id}`} className="btn btn-warning btn-sm me-2">Modifier</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PersonnelList;
