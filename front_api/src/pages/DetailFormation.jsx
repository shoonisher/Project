import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DetailFormation from '../components/Formation/Details';

const DetailFormationPage = () => {
  const { slug } = useParams();
  const [formation, setFormation] = useState(null);
  const [programmes, setProgrammes] = useState(null);

  useEffect(() => {
    const fetchFormationDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:8000/formation/details/${slug}`);
        setFormation(response.data.formation);
        setProgrammes(response.data.programmes);
        console.log(response.data)
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    };

    fetchFormationDetails();
  }, [slug]);

  if (!formation) {
    return <div>Chargement...</div>;
  }
  return (
    <div>
      <DetailFormation formation={formation} programmes={programmes} />
    </div>
  );
};

export default DetailFormationPage;
