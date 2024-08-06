<?php

namespace App\Controller;

use App\Entity\Formation;
use App\Entity\Programme;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\String\Slugger\SluggerInterface;

class AdminProgramme extends AbstractController
{
    #[Route('/admin/programme', name: 'admin_programme_index', methods: ['GET'])]
    public function index(ManagerRegistry $doctrine): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $programmes = $doctrine->getRepository(Programme::class)->findAll();

        $data = array_map(function ($programme) {
            return [
                'id' => $programme->getId(),
                'titre' => $programme->getTitre(),
                'description' => $programme->getDescription(),
                'point' => $programme->getPoint(),
                'slug' => $programme->getSlug(),
                'formation' => $programme->getFormation()->getNom(),
            ];
        }, $programmes);

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    #[Route('/admin/programme/ajouter', name: 'admin_programme_create', methods: ['POST'])]
    public function create(Request $request, ManagerRegistry $doctrine, SluggerInterface $slugger): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = json_decode($request->getContent(), true);

        if (empty($data['titre'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "titre" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['description'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "description" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['point'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "point" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['formation_id'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "formation_id" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $formation = $doctrine->getRepository(Formation::class)->find($data['formation_id']);
        if (!$formation) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Formation non trouvée.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $programme = new Programme();
        $programme->setTitre($data['titre']);
        $programme->setDescription($data['description']);
        $programme->setPoint($data['point']);
        $programme->setSlug($slugger->slug($data['titre'])->lower());
        $programme->setFormation($formation);

        try {
            $entityManager = $doctrine->getManager();
            $entityManager->persist($programme);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Échec de la création dans la base de données: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Programme créé avec succès.',
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/admin/programme/edit/{id}', name: 'admin_programme_update', methods: ['POST', 'GET'])]
    public function update(int $id, Request $request, ManagerRegistry $doctrine, SluggerInterface $slugger): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $programme = $doctrine->getRepository(Programme::class)->find($id);

        if (!$programme) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Programme non trouvé.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($request->isMethod('GET')) {
            return new JsonResponse([
                'id' => $programme->getId(),
                'titre' => $programme->getTitre(),
                'description' => $programme->getDescription(),
                'point' => $programme->getPoint(),
                'slug' => $programme->getSlug(),
                'formation_id' => $programme->getFormation()->getId(),
            ], JsonResponse::HTTP_OK);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['titre'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "titre" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (empty($data['description'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "description" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (empty($data['point'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "point" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (empty($data['formation_id'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "formation_id" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $programme->setTitre($data['titre']);
        $programme->setSlug($slugger->slug($data['titre'])->lower());
        $programme->setDescription($data['description']);
        $programme->setPoint($data['point']);

        $formation = $doctrine->getRepository(Formation::class)->find($data['formation_id']);
        if (!$formation) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Formation non trouvée.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }
        $programme->setFormation($formation);

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
            'message' => 'Programme mis à jour avec succès.',
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/admin/programme/delete/{id}', name: 'admin_programme_delete', methods: ['DELETE'])]
    public function delete(int $id, ManagerRegistry $doctrine): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $programme = $doctrine->getRepository(Programme::class)->find($id);

        if (!$programme) {
            return $this->json(['message' => 'Programme not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager = $doctrine->getManager();
        $entityManager->remove($programme);
        $entityManager->flush();

        return $this->json(['message' => 'Programme deleted'], JsonResponse::HTTP_NO_CONTENT);
    }
}
