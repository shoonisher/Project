// src/components/Navbar.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Navbar.css';
import { AuthContext } from '../Data/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-absolute">
      <a className="navbar-brand navbar-logo" href="/">
        <img src="https://localhost:8000/img/Logo_blanc_simple_1.png" alt="Logo" />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-center text-center text_nav" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Accueil</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/formation">Formation</Link>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Le centre
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown" style={{ backgroundColor: 'rgba(104, 107, 174, 0.5)' }}>
              <Link className="dropdown-item" to="/apropos">Qui nous-sommes ?</Link>
              <Link className="dropdown-item" to="/pedagogie">Notre pédagogie</Link>
            </div>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">Contact</Link>
          </li>
          {isLoggedIn ? (
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={logout} style={{ color: 'white' }}>Se déconnecter</button>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="nav-link" to="/hades">Se connecter</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;