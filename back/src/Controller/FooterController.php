<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class FooterController extends AbstractController
{
    #[Route('/mentionlegales', name: 'app_mention')]
    public function mention(): JsonResponse
    {
        return new JsonResponse([
            'controller_name' => 'FooterController',
            'page' => 'mentions légales',
            'content' => 'Contenu des mentions légales'
        ]);
    }

    #[Route('/condition', name: 'app_condition')]
    public function condition(): JsonResponse
    {
        return new JsonResponse([
            'controller_name' => 'FooterController',
            'page' => 'conditions générales',
            'content' => 'Contenu des conditions générales'
        ]);
    }

    #[Route('/politique', name: 'app_politique')]
    public function politique(): JsonResponse
    {
        return new JsonResponse([
            'controller_name' => 'FooterController',
            'page' => 'politique de confidentialité',
            'content' => 'Contenu de la politique de confidentialité'
        ]);
    }

    #[Route('/reglement', name: 'app_reglement')]
    public function reglement(): JsonResponse
    {
        return new JsonResponse([
            'controller_name' => 'FooterController',
            'page' => 'règlement intérieur',
            'content' => 'Contenu du règlement intérieur'
        ]);
    }
}
