<?php

namespace App\Controller;

use App\Entity\Personnel;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;

class AdminPersonnel extends AbstractController
{
    #[Route('/admin/personnel', name: 'admin_personnel_index', methods: ['GET'])]
    public function index(ManagerRegistry $doctrine): JsonResponse
    {
        $personnels = $doctrine->getRepository(Personnel::class)->findAll();

        // Convertir les entités en tableau
        $data = array_map(function (Personnel $personnel) {
            return [
                'id' => $personnel->getId(),
                'titre' => $personnel->getTitre(),
                'description' => $personnel->getDescription(),
                'email' => $personnel->getEmail(),
                'telephone' => $personnel->getTelephone(),
                'picture' => $personnel->getPicture(),
            ];
        }, $personnels);

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    #[Route("/admin/personnel/edit/{id}", name: "admin_personnel_update", methods: ["POST", "GET"])]
    public function updatePersonnel(int $id, Request $request, ManagerRegistry $doctrine, SluggerInterface $slugger)
    {
        $personnel = $doctrine->getRepository(Personnel::class)->find($id);

        if (!$personnel) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Personnel non trouvé.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($request->isMethod('GET')) {
            return new JsonResponse([
                'id' => $personnel->getId(),
                'titre' => $personnel->getTitre(),
                'description' => $personnel->getDescription(),
                'email' => $personnel->getEmail(),
                'telephone' => $personnel->getTelephone(),
                'picture' => $personnel->getPicture(),
            ], JsonResponse::HTTP_OK);
        }

        $data = $request->request->all();
        $pictureFile = $request->files->get('picture'); // Pour les fichiers

        if (!empty($data['titre'])) {
            $personnel->setTitre($data['titre']);
        }

        if (!empty($data['description'])) {
            $personnel->setDescription($data['description']);
        }

        if (!empty($data['email'])) {
            $personnel->setEmail($data['email']);
        }

        if (!empty($data['telephone'])) {
            $personnel->setTelephone($data['telephone']);
        }

        // Mettre à jour l'image seulement si un nouveau fichier est fourni
        if ($pictureFile) {
            $originalFilename = pathinfo($pictureFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $pictureFile->guessExtension();

            try {
                // Déplace le fichier vers le répertoire des images
                $pictureFile->move(
                    $this->getParameter('personnel'),
                    $newFilename
                );
                $personnel->setPicture($newFilename);
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
            'message' => 'Personnel mis à jour avec succès.',
        ], JsonResponse::HTTP_OK);
    }
}
