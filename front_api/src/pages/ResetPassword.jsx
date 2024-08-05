import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Data/axiosConfig';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/password-forgotten-request', {
        username: email
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.status === 200) {
        navigate('/verify-code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      setMessage('');
    }
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center align-items-center">
        <div className="w-100 mt-5">
          <div className="border p-3">
            {message && (
              <div className="alert alert-success">{message}</div>
            )}
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            <h1 className="h3 mb-3 font-weight-normal text-center">Réinitialiser votre mot de passe</h1>
            <form className="form-reset-password" onSubmit={handleSubmit}>
              <label htmlFor="inputEmail" className="sr-only">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="inputEmail"
                className="form-control mb-2"
                placeholder="Adresse email"
                required
                autoFocus
              />
              <div className="text-center">
                <button className="btn btn-lg btn-primary" type="submit">Réinitialiser le mot de passe</button>
              </div>
            </form>
          </div>
          <p className="mt-3">Oups, vous vous êtes peut-être trompé de chemin ?</p>
          <a className="text-danger text-decoration-none" href="/">Retour à l'accueil</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
