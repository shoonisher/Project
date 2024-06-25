<?php

namespace App\Controller\Admin;

use App\Entity\Apropos;
use App\Entity\Carousel;
use App\Entity\Categorie;
use App\Entity\Cible;
use App\Entity\Formation;
use App\Entity\Personnel;
use App\Entity\Programme;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractDashboardController
{
    #[Route('/zeus', name: 'admin')]
    public function index(): Response
    {
        return $this->render('admin/dashboard.html.twig');
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('MORRINGAN - Administration')
            ->renderContentMaximized()
            ;
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkToRoute('Retour au site', 'fa fa-home', 'app_accueil');
        yield MenuItem::linkToCrud('Carousel', 'fa fa-images', Carousel::class);
        yield MenuItem::linkToCrud('Categorie', 'fas fa-list', Categorie::class);
        yield MenuItem::linkToCrud('Cible', 'fas fa-bullseye', Cible::class);
        yield MenuItem::linkToCrud('Info Personnel', 'fas fa-envelope', Personnel::class);
        yield MenuItem::linkToCrud('Formation', 'fa fa-graduation-cap', Formation::class);
        yield MenuItem::linkToCrud('Programme formation', 'fa fa-camera', Programme::class);
    }
}
