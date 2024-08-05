// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import './assets/css/Navbar.css';
import Home from './pages/Home';
import PreloaderAndContactInfo from './components/PreloaderAndContactInfo';
import QuiSommesNousPage from './pages/QuiSommesNous';
import Pedagogie from './pages/Pedagogie';
import Formation from './pages/Formation';
import './index.css';
import DetailFormationPage from './pages/DetailFormation';
import ContactForm from './pages/Contact';
import LoginForm from './pages/Login';
import { AuthProvider } from './Data/AuthContext';
import Admin from './pages/Admin';
import CarouselForm from './components/Admin/AdminCarousel';
import CarouselList from './pages/AdminCarousel';
import CarouselEdit from './components/Admin/AdminEditCarousel';
import CategorieList from './pages/AdminCategorie';
import AdminEditCategorie from './components/Admin/AdminEditCategorie';
import AdminAddCategorie from './components/Admin/AdminAddCategories';
import AproposList from './pages/AdminApropos';
import AdminAddApropos from './components/Admin/AdminAddApropos';
import AdminEditApropos from './components/Admin/AdminEditApropos';
import CibleList from './pages/AdminCible';
import AdminAddCible from './components/Admin/AdminAddCible';
import AdminEditCible from './components/Admin/AdminEditCible';
import PersonnelList from './pages/AdminPeronnel';
import AdminEditPersonnel from './components/Admin/AdminEditPeronnel';
import FormationList from './pages/AdminFormation';
import AdminAddFormations from './components/Admin/AdminAddFormations';
import AdminEditFormation from './components/Admin/AdminEditFormation';
import ProgrammeList from './pages/AdminProgramme';
import AdminAddProgramme from './components/Admin/AdminAddProgramme';
import AdminEditProgramme from './components/Admin/AdminEditProgramme';
import Footer from './components/Footer';
import ResetPasswordForm from './pages/ResetPassword';
import CodeVerificationForm from './pages/CodeResetPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <PreloaderAndContactInfo />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apropos" element={<QuiSommesNousPage />} />
          <Route path="/pedagogie" element={<Pedagogie />} />
          <Route path="/formation" element={<Formation />} />
          <Route path="/formation/details/:slug" element={<DetailFormationPage />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/hades" element={<LoginForm />} />
          <Route path="/zeus" element={<Admin />} />
          <Route path="/admin/carousel/ajouter" element={<CarouselForm />} />
          <Route path="/admin/carousel" element={< CarouselList/>} />
          <Route path="/admin/carousel/edit/:id" element={< CarouselEdit/>} />
          <Route path="/admin/categorie" element={< CategorieList/>} />
          <Route path="/admin/categorie/edit/:id" element={< AdminEditCategorie/>} />
          <Route path="/admin/categorie/ajouter" element={< AdminAddCategorie/>} />
          <Route path="/admin/apropos" element={< AproposList/>} />
          <Route path="/admin/apropos/ajouter" element={< AdminAddApropos/>} />
          <Route path="/admin/apropos/edit/:id" element={< AdminEditApropos/>} />
          <Route path="/admin/cible" element={< CibleList/>} />
          <Route path="/admin/cible/ajouter" element={< AdminAddCible/>} />
          <Route path="/admin/cible/edit/:id" element={< AdminEditCible/>} />
          <Route path="/admin/personnel" element={< PersonnelList/>} />
          <Route path="/admin/personnel/edit/:id" element={< AdminEditPersonnel/>} />
          <Route path="/admin/formation" element={< FormationList/>} />
          <Route path="/admin/formation/ajouter" element={< AdminAddFormations/>} />
          <Route path="/admin/formation/edit/:id" element={< AdminEditFormation/>} />
          <Route path="/admin/programme" element={< ProgrammeList/>} />
          <Route path="/admin/programme/ajouter" element={< AdminAddProgramme/>} />
          <Route path="/admin/programme/edit/:id" element={< AdminEditProgramme/>} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/verify-code" element={<CodeVerificationForm />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
