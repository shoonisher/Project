import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Data/axiosConfig'; // Importer l'instance configurée d'Axios

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
      }, 200);
      return () => clearInterval(timer);
    }
  }, [progress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(10); // Start the progress bar
    try {
      const response = await axiosInstance.post('/api/login', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', JSON.stringify(response.data.token));
        setIsLoggedIn(true);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setProgress(100); // Complete the progress bar
    }
  };
//decommenter avant mise en ligne
  if (isLoggedIn) {
    navigate('/');
    return;
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center align-items-center login">
        <div className="w-100 mt-5">
          <div className="border p-3">
            {error && (
              <div className="alert alert-danger">
                {error}
                <div className="progress mt-2">
                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            {isLoggedIn && (
              <div className="mb-3">
                Vous êtes connecté.
                {/* Ici vous pouvez ajouter un lien de déconnexion si nécessaire */}
              </div>
            )}

            <h1 className="h3 mb-3 font-weight-normal text-center">Veuillez vous connecter</h1>
            <p>Cet accès est strictement réservé aux administrateurs du site. Veuillez vous rapprocher de votre administrateur pour obtenir les accès.</p>

            <form className="form-signin" onSubmit={handleSubmit}>
              <label htmlFor="inputEmail" className="sr-only">Adresse email</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="inputEmail"
                className="form-control mb-2"
                placeholder="Adresse email"
                required
                autoFocus
              />

              <label htmlFor="inputPassword" className="sr-only">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="inputPassword"
                className="form-control mb-3"
                placeholder="Mot de passe"
                required
              />

              <div className="text-center">
                <button className="btn btn-lg btn-primary" type="submit">Se connecter</button>
              </div>
            </form>

            <p className="mt-3 text-center">
              <a href="/reset-password">Mot de passe oublié ?</a>
            </p>
          </div>
          <p className="mt-3">Oups, vous vous êtes peut-être trompé de chemin ?</p>
          <a className="text-danger text-decoration-none" href="/">Retour à l'accueil</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
