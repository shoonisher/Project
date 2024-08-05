import { useState, useEffect } from 'react';
import axios from 'axios';
import "../assets/css/style.css";
import Carousel from '../components/Carousel';
import Welcome from '../components/Welcome';
import Separator from '../components/Separator';
import Qualities from '../components/Qualities';
import Banner from '../components/Banner';
import PopularCourses from '../components/PopularCourses';
import CoursesList from '../components/CoursesList';
import DownloadCatalogue from '../components/DownloadCatalogue';
import axiosInstance from '../Data/axiosConfig';

function App() {
    const [carousels, setCarousels] = useState([]);
    const [formations, setFormations] = useState([]);

    useEffect(() => {
        // Fetch data from Symfony API
        axiosInstance.get('/home')
            .then(response => {
                console.log(response.data); // Vérifiez les données de la réponse ici
                setCarousels(response.data.carousels);
                setFormations(response.data.formations);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
            <div>
                <Carousel carousels={carousels} />
                <h1 className="text-center my-4">Bienvenue sur MORRINGAN</h1>
                <div className="container">
                    <Welcome />
                    <Separator />
                    <Qualities />
                </div>
                <Banner />
                <div className="container">
                    <PopularCourses />
                    <CoursesList formations={formations} />
                    <DownloadCatalogue />
                </div>
            </div>
    );
}

export default App;
