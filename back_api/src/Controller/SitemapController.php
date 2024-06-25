<?php

namespace App\Controller;

use App\Repository\FormationRepository;
use App\Repository\ProgrammeRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SitemapController extends AbstractController
{
    #[Route('/sitemap', name: 'app_sitemap', defaults: ['_format' => 'json'])]
    public function index(Request $request, FormationRepository $formationRepository, ProgrammeRepository $programmeRepository): JsonResponse
    {
        $hostname = $request->getSchemeAndHttpHost();

        $urls = [];

        $urls[] = $this->generateUrl('app_accueil', [], true);
        $urls[] = $this->generateUrl('app_formation', [], true);
        $urls[] = $this->generateUrl('app_contact', [], true);
        $urls[] = $this->generateUrl('app_apropos', [], true);
        $urls[] = $this->generateUrl('app_mention', [], true);
        $urls[] = $this->generateUrl('app_condition', [], true);
        $urls[] = $this->generateUrl('app_politique', [], true);
        $urls[] = $this->generateUrl('app_reglement', [], true);

        foreach ($formationRepository->findAll() as $formation) {
            $formationNameSlug = strtolower(str_replace(' ', '-', $formation->getSlug()));
            $url = $this->generateUrl('app_details', ['slug' => $formationNameSlug], true);

            // Clean up URL (optional)
            $cleanedUrl = str_replace(['?', '='], '', $url);
            $cleanedUrl = preg_replace('#/{2,}#', '/', $cleanedUrl);

            $urls[] = $cleanedUrl;
        }

        return new JsonResponse($urls);
    }
}
