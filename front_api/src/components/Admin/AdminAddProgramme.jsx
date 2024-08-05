import { useState, useEffect } from 'react';
import axiosInstance from '../../Data/axiosConfig';
import { useNavigate } from 'react-router-dom';
import BoutonRetour from './BoutonRetour';

const AdminAddProgramme = () => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [point, setPoint] = useState('');
    const [formation, setFormation] = useState('');
    const [formations, setFormations] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                const response = await axiosInstance.get('/admin/formations');
                setFormations(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des formations:', error);
            }
        };

        fetchFormations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titre) {
            setError('Le champ "titre" est requis.');
            return;
        }
        if (!description) {
            setError('Le champ "description" est requis.');
            return;
        }
        if (!point) {
            setError('Le champ "point" est requis.');
            return;
        }
        if (!formation) {
            setError('Le champ "formation_id" est requis.');
            return;
        }

        const data = {
            titre,
            description,
            point,
            formation_id: formation,
        };

        try {
            const response = await axiosInstance.post('/admin/programme/ajouter', data);

            if (response.data.status === 'success') {
                setSuccessMessage('Programme ajouté avec succès.');
                setError(null);
                setTimeout(() => {
                    navigate('/admin/programme');
                }, 3000);
            } else {
                setError(response.data.message);
                setSuccessMessage(null);
            }
        } catch (error) {
            setError('Erreur lors de l\'ajout du programme.');
            setSuccessMessage(null);
            console.error('Erreur lors de l\'ajout du programme:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Ajouter un Programme</h1>
            <div className="mb-3">
                <BoutonRetour />
            </div>
            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="titre" className="form-label">Titre</label>
                    <input type="text" className="form-control" id="titre" value={titre} onChange={(e) => setTitre(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="point" className="form-label">Point</label>
                    <input type="number" className="form-control" id="point" value={point} onChange={(e) => setPoint(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="formation" className="form-label">Formation</label>
                    <select className="form-control" id="formation_id" value={formation} onChange={(e) => setFormation(e.target.value)} required>
                        <option value="">Sélectionnez une formation</option>
                        {formations.map((formation) => (
                            <option key={formation.id} value={formation.id}>
                                {formation.nom}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Ajouter</button>
            </form>
        </div>
    );
};

export default AdminAddProgramme;
