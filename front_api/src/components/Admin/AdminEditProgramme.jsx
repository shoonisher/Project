import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../Data/axiosConfig';
import BoutonRetour from './BoutonRetour';

const AdminEditProgramme = () => {
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        point: '',
        formation: '',
        slug: '',
    });
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchProgrammeData = async () => {
            try {
                const response = await axiosInstance.get(`/admin/programme/edit/${id}`);
                setFormData({
                    titre: response.data.titre || '',
                    description: response.data.description || '',
                    point: response.data.point || '',
                    formation: response.data.formation_id || '',
                    slug: response.data.slug || '',
                });
            } catch (error) {
                setError('Erreur lors du chargement des données du programme.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchFormations = async () => {
            try {
                const response = await axiosInstance.get('/admin/formations');
                setFormations(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des formations:', error);
            }
        };

        fetchProgrammeData();
        fetchFormations();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
            slug: name === 'titre' ? value.toLowerCase().replace(/ /g, '-') : formData.slug
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.titre) {
            setError('Le champ "titre" est requis.');
            return;
        }
        if (!formData.description) {
            setError('Le champ "description" est requis.');
            return;
        }
        if (!formData.point) {
            setError('Le champ "point" est requis.');
            return;
        }
        if (!formData.formation) {
            setError('Le champ "formation_id" est requis.');
            return;
        }

        const data = {
            titre: formData.titre,
            description: formData.description,
            point: formData.point,
            formation_id: formData.formation,
            slug: formData.slug,
        };

        try {
            const response = await axiosInstance.post(`/admin/programme/edit/${id}`, data);

            if (response.data.status === 'success') {
                setSuccessMessage('Programme modifié avec succès.');
                setError(null);
                setTimeout(() => {
                    navigate('/admin/programme');
                }, 3000);
            } else {
                setError(response.data.message);
                setSuccessMessage(null);
            }
        } catch (error) {
            setError('Erreur lors de la modification du programme.');
            setSuccessMessage(null);
            console.error('Erreur lors de la modification du programme:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Modifier un Programme</h1>
            <div className="mb-3">
                <BoutonRetour />
            </div>
            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
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
                    <label htmlFor="slug" className="form-label">Slug</label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        className="form-control"
                        placeholder="Slug"
                        readOnly
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Entrez la description"
                        required
                    />
                    <div className="invalid-feedback">La description est requise.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="point" className="form-label">Point</label>
                    <input
                        type="number"
                        id="point"
                        name="point"
                        value={formData.point}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Entrez le point"
                        required
                    />
                    <div className="invalid-feedback">Le point est requis.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="formation" className="form-label">Formation</label>
                    <select
                        id="formation"
                        name="formation"
                        value={formData.formation}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Sélectionnez une formation</option>
                        {formations.map((formation) => (
                            <option key={formation.id} value={formation.id}>
                                {formation.nom} {formation.id === formData.formation ? '(Sélectionné)' : ''}
                            </option>
                        ))}
                    </select>
                    <div className="invalid-feedback">La formation est requise.</div>
                </div>
                <button type="submit" className="btn btn-primary">Modifier</button>
            </form>
        </div>
    );
};

export default AdminEditProgramme;
