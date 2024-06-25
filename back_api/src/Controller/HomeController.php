<?php 

namespace App\Controller;

use App\Entity\Apropos;
use App\Entity\Carousel;
use App\Entity\Formation;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{
    #[Route('/home', name: 'app_home', methods: ['GET'])]
    public function home(ManagerRegistry $doctrine): JsonResponse
    {
        $formationRepository = $doctrine->getRepository(Formation::class);
        $carouselRepository = $doctrine->getRepository(Carousel::class);

        // Correction de la condition de filtrage
        $formations = $formationRepository->findBy(['isAccueil' => true]);
        $carousels = $carouselRepository->findBy([], ['position' => 'DESC']);

        $formationsData = array_map(function($formation) {
            return [
                'id' => $formation->getId(),
                'nom' => $formation->getNom(),
                'public' => $formation->getPublic() ? [
                    'id' => $formation->getPublic()->getId(),
                    'type' => $formation->getPublic()->getType(),
                ] : null,
                'duree' => $formation->getDuree(),
                'isAccueil' => $formation->getIsAccueil(),
                'slug' => $formation->getSlug(),
                'imageName' => $formation->getImageName(),
            ];
        }, $formations);

        $carouselsData = array_map(function($carousel) {
            return [
                'id' => $carousel->getId(),
                'titre' => $carousel->getTitre(),
                'imageName' => $carousel->getImageName(),
            ];
        }, $carousels);

        return new JsonResponse([
            'carousels' => $carouselsData,
            'formations' => $formationsData
        ]);
    }
}
