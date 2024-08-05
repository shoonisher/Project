import axiosInstance from '../../Data/axiosConfig';
import { useNavigate } from 'react-router-dom'; // Import de useNavigate
import { useState } from 'react';

const CarouselForm = () => {
  const [formData, setFormData] = useState({
    titre: '',
    position: '',
    picture: null
  });
  
  const navigate = useNavigate(); // Initialisation du hook useNavigate

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Créez un objet FormData pour envoyer le fichier en multipart/form-data
    const data = new FormData();
    data.append('titre', formData.titre);
    data.append('position', formData.position);
    if (formData.picture) {
      data.append('picture', formData.picture);
    }

    try {
      // Envoyez la requête POST
      const response = await axiosInstance.post('/admin/carousel/ajouter', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Success:', response.data);

      // Réinitialisez le formulaire après une soumission réussie
      setFormData({
        titre: '',
        position: '',
        picture: null
      });

      // Réinitialiser les champs du formulaire (spécifique au champ de fichier)
      document.getElementById('picture').value = '';

      // Redirection vers la page des carousels après une soumission réussie
      setTimeout(() => {
        navigate('/admin/carousel');
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Ajouter une image au carousel</h1>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="titre" className="form-label">Titre</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez le titre"
            required
          />
          <div className="invalid-feedback">Le titre est requis.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="position" className="form-label">Position</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="form-control"
            placeholder="Entrez la position"
            required
          />
          <div className="invalid-feedback">La position est requise.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">Image</label>
          <input
            type="file"
            id="picture"
            name="picture"
            onChange={handleChange}
            className="form-control"
            required
          />
          <div className="invalid-feedback">Veuillez sélectionner une image.</div>
        </div>
        <button type="submit" className="btn btn-primary">Ajouter au Carousel</button>
      </form>
    </div>
  );
};

export default CarouselForm;
