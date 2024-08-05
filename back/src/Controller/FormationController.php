<?php

namespace App\Controller;

use App\Entity\Categorie;
use App\Entity\Formation;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class FormationController extends AbstractController
{
    #[Route('/formation', name: 'app_formation')]
    public function index(ManagerRegistry $doctrine): JsonResponse
    {
        $categories = $doctrine->getRepository(Categorie::class)->findAll();
        $formations = $doctrine->getRepository(Formation::class)->findAll();

        $data = [
            'categories' => [],
        ];

        foreach ($categories as $categorie) {
            $data['categories'][$categorie->getId()] = [
                'id' => $categorie->getId(),
                'name' => $categorie->getNom(),
                'description' => $categorie->getDescription(),
                'formations' => [],
            ];
        }

        foreach ($formations as $formation) {
            $category = $formation->getCategorie();
            if ($category) {
                $data['categories'][$category->getId()]['formations'][] = [
                    'id' => $formation->getId(),
                    'nom' => $formation->getNom(),
                    'isAccueil' => $formation->getIsAccueil(),
                    'slug' => $formation->getSlug(),
                    'imageName' => $formation->getPicture(),
                    'public' => $formation->getPublic() ? [
                        'id' => $formation->getPublic()->getId(),
                        'type' => $formation->getPublic()->getType(),
                    ] : null,
                    'duree' => $formation->getDuree(),
                    // Ajoutez d'autres propriétés nécessaires
                ];
            }
        }

        // Réindexer les catégories par valeurs et non par clés
        $data['categories'] = array_values($data['categories']);

        return new JsonResponse($data);
    }


    #[Route('/formation/details/{slug}', name: 'app_details', methods: ['GET'])]
    public function details(Formation $formation): JsonResponse
    {
        $programmes = $formation->getProgramme(); // Assurez-vous que getProgrammes() retourne les programmes liés

        $data = [
            'formation' => [
                'id' => $formation->getId(),
                'nom' => $formation->getNom(),
                'description' => $formation->getObjectifFormation(),
                'prix' => $formation->getPrix(),
                'duree' => $formation->getDuree(),
                'langue' => $formation->getLangue(),
                'lieu' => $formation->getLieu(),
                'isAccueil' => $formation->getIsAccueil(),
                'public' => $formation->getPublic()? [
                    'id' => $formation->getPublic()->getId(),
                    'type' => $formation->getPublic()->getType(),
                ] : null,
                'imageName' => $formation->getPicture(),
                // Ajoutez d'autres propriétés nécessaires
            ],
            'programmes' => [],
        ];

        foreach ($programmes as $programme) {
            $data['programmes'][] = [
                'id' => $programme->getId(),
                'title' => $programme->getTitre(),
                'description' => $programme->getDescription(),
                'points' => $programme->getPoint(),
                // Ajoutez d'autres propriétés nécessaires
            ];
        }

        return new JsonResponse($data);
    }
}
