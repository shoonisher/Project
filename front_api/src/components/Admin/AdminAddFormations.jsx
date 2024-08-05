import { useState, useEffect } from 'react';
import axiosInstance from '../../Data/axiosConfig';
import { useNavigate } from 'react-router-dom';
import BoutonRetour from './BoutonRetour';

const AdminAddFormations = () => {
  const [nom, setNom] = useState('');
  const [objectifFormation, setObjectifFormation] = useState('');
  const [prix, setPrix] = useState('');
  const [nombreChapitres, setNombreChapitres] = useState('');
  const [duree, setDuree] = useState('');
  const [langue, setLangue] = useState('');
  const [lieu, setLieu] = useState('');
  const [categorie, setCategorie] = useState('');
  const [categories, setCategories] = useState([]);
  const [picture, setPicture] = useState(null);
  const [isAccueil, setIsAccueil] = useState(false);
  const [publicCible, setPublicCible] = useState('');
  const [publicsCibles, setPublicsCibles] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/admin/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    const fetchPublicsCibles = async () => {
      try {
        const response = await axiosInstance.get('/admin/cible');
        setPublicsCibles(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des cibles:', error);
      }
    };

    fetchCategories();
    fetchPublicsCibles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('nom', nom);
    data.append('objectif_formation', objectifFormation);
    data.append('prix', prix);
    data.append('nombre_chapitre', nombreChapitres);
    data.append('duree', duree);
    data.append('langue', langue);
    data.append('lieu', lieu);
    data.append('categorie_id', categorie);
    data.append('picture', picture);
    data.append('isAccueil', isAccueil);
    data.append('public_id', publicCible);

    try {
      const response = await axiosInstance.post('/admin/formation/ajouter', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status === 'success') {
        setSuccessMessage('Formation ajoutée avec succès.');
        setError(null);
        setTimeout(() => {
          navigate('/admin/formation');
        }, 3000);
      } else {
        setError(response.data.message);
        setSuccessMessage(null);
      }
    } catch (error) {
      setError('Erreur lors de l\'ajout de la formation.');
      setSuccessMessage(null);
      console.error('Erreur lors de l\'ajout de la formation:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Ajouter une Formation</h1>
      <div className="mb-3">
        <BoutonRetour />
      </div>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom</label>
          <input type="text" className="form-control" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="objectifFormation" className="form-label">Objectif Formation</label>
          <input type="text" className="form-control" id="objectifFormation" value={objectifFormation} onChange={(e) => setObjectifFormation(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="prix" className="form-label">Prix</label>
          <input type="number" className="form-control" id="prix" value={prix} onChange={(e) => setPrix(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="nombreChapitres" className="form-label">Nombre de Chapitres</label>
          <input type="number" className="form-control" id="nombreChapitres" value={nombreChapitres} onChange={(e) => setNombreChapitres(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="duree" className="form-label">Durée</label>
          <input type="text" className="form-control" id="duree" value={duree} onChange={(e) => setDuree(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="langue" className="form-label">Langue</label>
          <input type="text" className="form-control" id="langue" value={langue} onChange={(e) => setLangue(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="lieu" className="form-label">Lieu</label>
          <input type="text" className="form-control" id="lieu" value={lieu} onChange={(e) => setLieu(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label htmlFor="categorie" className="form-label">Catégorie</label>
          <select className="form-control" id="categorie" value={categorie} onChange={(e) => setCategorie(e.target.value)} required>
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">Photo</label>
          <input type="file" className="form-control" id="picture" onChange={(e) => setPicture(e.target.files[0])} required />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="isAccueil" checked={isAccueil} onChange={(e) => setIsAccueil(e.target.checked)} />
          <label className="form-check-label" htmlFor="isAccueil">Accueil</label>
        </div>
        <div className="mb-3">
          <label htmlFor="publicCible" className="form-label">Public</label>
          <select className="form-control" id="publicCible" value={publicCible} onChange={(e) => setPublicCible(e.target.value)} required>
            <option value="">Sélectionner un public</option>
            {publicsCibles.map((cible) => (
              <option key={cible.id} value={cible.id}>{cible.type}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>
    </div>
  );
};

export default AdminAddFormations;
