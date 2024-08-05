<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class AproposController extends AbstractController
{
    #[Route('/apropos', name: 'app_apropos')]
    public function index(): JsonResponse
    {
        return new JsonResponse([
            'controller_name' => 'AproposController',
            'message' => 'This is the about page'
        ]);
    }
}
