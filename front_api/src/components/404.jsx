// src/components/Error400.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error400 = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Erreur 404 - Page non trouvée</h1>
      <p style={styles.text}>La page que vous recherchez n'existe pas.</p>
      <button style={styles.button} onClick={handleBackHome}>
        Retourner à l'accueil
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  header: {
    fontSize: '2rem',
    color: '#ff4d4f',
  },
  text: {
    fontSize: '1.25rem',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Error400;
