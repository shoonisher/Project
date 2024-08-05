<?php

namespace App\Controller;

use App\Entity\Carousel;
use App\Repository\CarouselRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class AdminCarousel extends AbstractController
{
    #[Route('/admin/carousel/ajouter', name: 'app_carousel', methods: ['POST'])]
    public function add(Request $request, ManagerRegistry $doctrine, SluggerInterface $slugger): JsonResponse
    {
        if (!$request->isMethod('POST')) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Méthode de requête invalide.',
            ], JsonResponse::HTTP_METHOD_NOT_ALLOWED);
        }

        $titre = $request->request->get('titre');
        $position = $request->request->get('position');
        $pictureFile = $request->files->get('picture');

        if (!$titre || !$position) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Les champs titre et position sont requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $carousel = new Carousel();
        $carousel->setTitre($titre);
        $carousel->setPosition($position);

        if ($pictureFile) {
            $originalFilename = pathinfo($pictureFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $pictureFile->guessExtension();

            try {
                // Déplace le fichier vers le répertoire des images
                $pictureFile->move(
                    $this->getParameter('carousel'),
                    $newFilename
                );
                $carousel->setPicture($newFilename);
            } catch (FileException $e) {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => 'Échec du téléchargement du fichier: ' . $e->getMessage(),
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
            }
        } else {
            $carousel->setPicture(null);
        }

        try {
            $entityManager = $doctrine->getManager();
            $entityManager->persist($carousel);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Échec de l\'enregistrement dans la base de données: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Carousel enregistré avec succès.',
        ]);
    }

    #[Route('/admin/carousel', name: 'admin_carousel_index', methods: ['GET'])]
    public function index(CarouselRepository $carouselRepository): JsonResponse
    {
        $carousels = $carouselRepository->findAll();

        // Convertir les entités en tableau
        $data = array_map(function (Carousel $carousel) {
            return [
                'id' => $carousel->getId(),
                'titre' => $carousel->getTitre(),
                'position' => $carousel->getPosition(),
                'picture' => $carousel->getPicture(),
            ];
        }, $carousels);

        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('/admin/carousel/{id}/delete', name: 'admin_carousel_delete', methods: ['DELETE'])]
    public function delete(int $id, CarouselRepository $carouselRepository, ManagerRegistry $doctrine): JsonResponse
    {
        $carousel = $carouselRepository->find($id);

        if (!$carousel) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Carousel non trouvé.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $entityManager = $doctrine->getManager();
            $entityManager->remove($carousel);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Échec de la suppression dans la base de données: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Carousel supprimé avec succès.',
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/admin/carousel/edit/{id}', name: 'admin_carousel_update', methods: ['GET', 'POST'])]
    public function update(
        int $id,
        Request $request,
        CarouselRepository $carouselRepository,
        ManagerRegistry $doctrine,
        SluggerInterface $slugger
    ): JsonResponse {
        $carousel = $carouselRepository->find($id);

        if (!$carousel) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Carousel non trouvé.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($request->isMethod('GET')) {
            return new JsonResponse([
                'id' => $carousel->getId(),
                'titre' => $carousel->getTitre(),
                'position' => $carousel->getPosition(),
                'picture' => $carousel->getPicture(),
            ], JsonResponse::HTTP_OK);
        }

        // Pour les requêtes POST, traiter les données du formulaire
        $data = $request->request->all(); // Pour les données non-fichiers
        $pictureFile = $request->files->get('picture'); // Pour les fichiers

        // Mettre à jour le titre seulement s'il est fourni
        if (!empty($data['titre'])) {
            $carousel->setTitre($data['titre']);
        }

        // Mettre à jour la position seulement si elle est fournie
        if (!empty($data['position'])) {
            $carousel->setPosition($data['position']);
        }

        // Mettre à jour l'image seulement si un nouveau fichier est fourni
        if ($pictureFile) {
            $originalFilename = pathinfo($pictureFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $pictureFile->guessExtension();

            try {
                // Déplace le fichier vers le répertoire des images
                $pictureFile->move(
                    $this->getParameter('carousel'),
                    $newFilename
                );
                $carousel->setPicture($newFilename);
            } catch (FileException $e) {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => 'Échec du téléchargement du fichier: ' . $e->getMessage(),
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        try {
            $entityManager = $doctrine->getManager();
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Échec de la mise à jour dans la base de données: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Carousel mis à jour avec succès.',
        ], JsonResponse::HTTP_OK);
    }
}
