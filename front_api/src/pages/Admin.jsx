import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axiosInstance from '../Data/axiosConfig';
import { AuthContext } from '../Data/AuthContext';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/hades');
    } else {
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get('/profile', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.data.status === 'error') {
            setError(response.data.message);
          } else {
            setUser({ username: response.data.username });
          }
        } catch (error) {
          navigate('/h');
        }
      };

      fetchUser();
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Page d'accueil</h1>
      {error && <p className="text-center text-danger">{error}</p>}
      {user && <p className="text-center">Bienvenue, {user.username}!</p>}
      <nav className="nav flex-column">
        <Link to="/admin/carousel" className=" btn btn-info mb-2">Carousel</Link>
        <Link to="/admin/categorie" className=" btn btn-info mb-2">Catégories</Link>
        <Link to="/admin/apropos" className=" btn btn-info mb-2">A propos</Link>
        <Link to="/admin/cible" className=" btn btn-info mb-2">Cibles</Link>
        <Link to="/admin/personnel" className=" btn btn-info mb-2">Personnel</Link>
        <Link to="/admin/formation" className=" btn btn-info mb-2">Formation</Link>
        <Link to="/admin/programme" className=" btn btn-info mb-2">Programme</Link>
      </nav>
    </div>
  );
};

export default Admin;
