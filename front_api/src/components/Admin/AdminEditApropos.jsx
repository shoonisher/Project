import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../Data/axiosConfig';
import BoutonRetour from './BoutonRetour';

const AdminEditApropos = () => {
  const { id } = useParams();
  const [text, setText] = useState('');
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApropos = async () => {
      try {
        const response = await axiosInstance.get(`/admin/apropos/edit/${id}`);
        setText(response.data.text);
        setPicture(response.data.picture);
      } catch (error) {
        setError('Erreur lors de la récupération des données.');
      }
    };

    fetchApropos();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', text);
    if (picture) {
      formData.append('picture', picture);
    }

    try {
      const response = await axiosInstance.post(`/admin/apropos/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccessMessage('A propos modifié avec succès.');
        setError(null);
        setTimeout(() => {
          navigate('/admin/apropos');
        }, 3000);
      }
    } catch (err) {
      setError('Erreur lors de la modification de l\'A propos.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Modifier un A propos</h1>
      <div className="mb-3 d-flex justify-content-between">
        <BoutonRetour />
      </div>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="text" className="form-label">Texte</label>
          <textarea
            id="text"
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">Image</label>
          {picture && (
            <div className="mb-3">
              <img src={`http://localhost:8000/uploads/images/apropos/${picture}`} alt="A propos" width="100" />
            </div>
          )}
          <input
            type="file"
            id="picture"
            className="form-control"
            onChange={(e) => setPicture(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">Modifier</button>
      </form>
    </div>
  );
};

export default AdminEditApropos;
