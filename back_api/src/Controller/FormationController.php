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
            'formations' => [],
            'categories' => [],
        ];
        
        foreach ($formations as $formation) {
            $data['formations'][] = [
                'id' => $formation->getId(),
                'title' => $formation->getTitle(),
                'description' => $formation->getDescription(),
                // Ajoutez d'autres propriétés nécessaires
            ];
        }
        
        foreach ($categories as $categorie) {
            $data['categories'][] = [
                'id' => $categorie->getId(),
                'name' => $categorie->getName(),
                // Ajoutez d'autres propriétés nécessaires
            ];
        }
        
        return new JsonResponse($data);
    }

    #[Route('/formation/details/{slug}', name: 'app_details', methods: ['GET'])]
    public function details(Formation $formation): JsonResponse
    {
        $programmes = $formation->getProgrammes(); // Assurez-vous que getProgrammes() retourne les programmes liés
        
        $data = [
            'formation' => [
                'id' => $formation->getId(),
                'title' => $formation->getTitle(),
                'description' => $formation->getDescription(),
                // Ajoutez d'autres propriétés nécessaires
            ],
            'programmes' => [],
        ];
        
        foreach ($programmes as $programme) {
            $data['programmes'][] = [
                'id' => $programme->getId(),
                'title' => $programme->getTitle(),
                'description' => $programme->getDescription(),
                // Ajoutez d'autres propriétés nécessaires
            ];
        }
        
        return new JsonResponse($data);
    }
}
