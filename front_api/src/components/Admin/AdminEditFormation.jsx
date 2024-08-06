import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../Data/axiosConfig';
import BoutonRetour from './BoutonRetour';
import Base_API from '../../Data/Base_API';

const AdminEditFormation = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nom: '',
    objectifFormation: '',
    prix: '',
    nombreChapitres: '',
    duree: '',
    langue: '',
    lieu: '',
    categorie: '',
    picture: null,
    isAccueil: false,
    publicCible: ''
  });
  const [categories, setCategories] = useState([]);
  const [publicsCibles, setPublicsCibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormationData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/formation/edit/${id}`);
        setFormData({
          nom: response.data.nom || '',
          objectifFormation: response.data.objectifFormation || '',
          prix: response.data.prix || '',
          nombreChapitres: response.data.nombreChapitres || '',
          duree: response.data.duree || '',
          langue: response.data.langue || '',
          lieu: response.data.lieu || '',
          categorie: response.data.categorie || '',
          picture: response.data.picture || null,
          isAccueil: response.data.isAccueil || '',
          publicCible: response.data.publicCible || ''
        });
      } catch (error) {
        setError('Erreur lors du chargement des données de la formation.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

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

    fetchFormationData();
    fetchCategories();
    fetchPublicsCibles();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axiosInstance.post(`/admin/formation/edit/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Formation mise à jour avec succès.');
      setError(null);
      setTimeout(() => {
        navigate('/admin/formation');
      }, 3000);
    } catch (error) {
      setError('Erreur lors de la mise à jour de la formation.');
      setSuccessMessage(null);
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Modifier une Formation</h1>
      <div className="mb-3 d-flex justify-content-between">
        <BoutonRetour />
      </div>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez le nom"
            required
          />
          <div className="invalid-feedback">Le nom est requis.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="objectifFormation" className="form-label">Objectif de la Formation</label>
          <textarea
            id="objectifFormation"
            name="objectifFormation"
            value={formData.objectifFormation}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez l'objectif de la formation"
            required
          />
          <div className="invalid-feedback">L'objectif de la formation est requis.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="prix" className="form-label">Prix</label>
          <input
            type="number"
            id="prix"
            name="prix"
            value={formData.prix}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez le prix"
            required
          />
          <div className="invalid-feedback">Le prix est requis.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="nombreChapitres" className="form-label">Nombre de Chapitres</label>
          <input
            type="number"
            id="nombreChapitres"
            name="nombreChapitres"
            value={formData.nombreChapitres}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez le nombre de chapitres"
            required
          />
          <div className="invalid-feedback">Le nombre de chapitres est requis.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="duree" className="form-label">Durée</label>
          <input
            type="text"
            id="duree"
            name="duree"
            value={formData.duree}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez la durée"
            required
          />
          <div className="invalid-feedback">La durée est requise.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="langue" className="form-label">Langue</label>
          <input
            type="text"
            id="langue"
            name="langue"
            value={formData.langue}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez la langue"
            required
          />
          <div className="invalid-feedback">La langue est requise.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="lieu" className="form-label">Lieu</label>
          <input
            type="text"
            id="lieu"
            name="lieu"
            value={formData.lieu}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez le lieu"
            required
          />
          <div className="invalid-feedback">Le lieu est requis.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="categorie" className="form-label">Catégorie</label>
          <select
            id="categorie"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">La catégorie est requise.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="publicCible" className="form-label">Public Cible</label>
          <select
            id="publicCible"
            name="publicCible"
            value={formData.publicCible}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Sélectionnez un public cible</option>
            {publicsCibles.map((cible) => (
              <option key={cible.id} value={cible.id}>
                {cible.type}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">Le public cible est requis.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">Image</label>
          {formData.picture && (
            <div className="mb-3">
              <img src={`${Base_API}/uploads/images/formation/${formData.picture}`} alt="Formation" width="100" />
            </div>
          )}
          <input
            type="file"
            id="picture"
            name="picture"
            onChange={handleChange}
            className="form-control"
          />
          <div className="invalid-feedback">Veuillez sélectionner une image.</div>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            id="isAccueil"
            name="isAccueil"
            checked={formData.isAccueil}
            onChange={handleChange}
            className="form-check-input"
          />
          <label htmlFor="isAccueil" className="form-check-label">Afficher sur la page d'accueil</label>
        </div>
        <button type="submit" className="btn btn-primary">Mettre à jour</button>
      </form>
    </div>
  );
};

export default AdminEditFormation;
