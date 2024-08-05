import { useState } from 'react';
import axiosInstance from '../Data/axiosConfig';

const CodeVerificationForm = () => {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendCode = async () => {
    try {
      const response = await axiosInstance.post('/api/password-forgotten-new-password', {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.status === 200) {
        setMessage('Le code a été renvoyé avec succès.');
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'envoi du code');
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/password-forgotten-new-password', {
        code: code,
        username: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.status === 200) {
        setMessage('Le code a été vérifié avec succès.');
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la vérification du code');
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
            <h1 className="h3 mb-3 font-weight-normal text-center">Vérifiez votre code</h1>
            <form className="form-verify-code" onSubmit={handleSubmit}>
              <label htmlFor="inputEmail" className="sr-only">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="inputEmail"
                className="form-control mb-2"
                placeholder="Email"
                required
                autoFocus
              />
              <label htmlFor="inputPassword" className="sr-only">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="inputPassword"
                className="form-control mb-2"
                placeholder="Mot de passe"
                required
              />
              <label htmlFor="inputCode" className="sr-only">Code de vérification</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                id="inputCode"
                className="form-control mb-2"
                placeholder="Code de vérification"
                required
              />
              <div className="text-center">
                <button className="btn btn-lg btn-primary" type="submit">Modifier le mot de passe</button>
              </div>
            </form>
            <div className="text-center mt-3">
              <button className="btn btn-lg btn-secondary" onClick={handleResendCode}>Renvoyer le code</button>
            </div>
          </div>
          <p className="mt-3">Oups, vous vous êtes peut-être trompé de chemin ?</p>
          <a className="text-danger text-decoration-none" href="/">Retour à l'accueil</a>
        </div>
      </div>
    </div>
  );
};

export default CodeVerificationForm;
