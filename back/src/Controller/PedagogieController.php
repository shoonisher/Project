<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class PedagogieController extends AbstractController
{
    #[Route('/pedagogie', name: 'app_pedagogie')]
    public function index(): JsonResponse
    {
        // Construire les données que vous souhaitez retourner en JSON
        $data = [
            'controller_name' => 'PedagogieController',
            'message' => 'Bienvenue sur la page de pédagogie.'
        ];

        // Retourner une réponse JSON
        return new JsonResponse($data);
    }
}
