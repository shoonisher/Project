// axiosConfig.js
import axios from 'axios';
import Base_API from './Base_API';

// Créer une instance d'Axios
const axiosInstance = axios.create({
  baseURL: Base_API, // Remplacez par l'URL de votre API
});

// Ajouter un interceptor pour ajouter le jeton à chaque requête sortante
axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;