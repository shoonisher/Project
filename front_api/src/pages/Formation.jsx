import { useState, useEffect } from 'react';
import axios from 'axios';
import "../assets/css/style.css";
import CoursesList from '../components/Formation/CourseList';
import axiosInstance from '../Data/axiosConfig';

function App() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch data from Symfony API
        axiosInstance.get('/formation')
            .then(response => {
                console.log(response.data); // Vérifiez les données de la réponse ici
                setCategories(response.data.categories);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div className='mt-5'>
            <CoursesList categories={categories} />
        </div>
    );
}

export default App;
