import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../assets/css/style.css";
import PopularCourses from '../components/PopularCourses';
import CoursesList from '../components/Formation/CourseList';
import DownloadCatalogue from '../components/DownloadCatalogue';

function App() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch data from Symfony API
        axios.get('https://localhost:8000/formation')
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
