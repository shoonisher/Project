<?php

namespace App\Controller;

use App\Entity\Categorie;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AdminCategorie extends AbstractController
{
    #[Route('/admin/categories', name: 'admin_categorie_index', methods: ['GET'])]
    public function index(ManagerRegistry $doctrine): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $categories = $doctrine->getRepository(Categorie::class)->findAll();

        // Convertir les entités en tableau
        $data = array_map(function (Categorie $categorie) {
            return [
                'id' => $categorie->getId(),
                'nom' => $categorie->getNom(),
                'description' => $categorie->getDescription(),
            ];
        }, $categories);

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    #[Route("/admin/categorie/ajouter", name: "admin_categorie_create", methods: ["POST"])]
    public function createCategorie(Request $request, ManagerRegistry $doctrine)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = $request->request->all();

        if (empty($data['nom'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "nom" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['description'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "description" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $categorie = new Categorie();
        $categorie->setNom($data['nom']);
        $categorie->setDescription($data['description']);

        try {
            $entityManager = $doctrine->getManager();
            $entityManager->persist($categorie);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Échec de la création dans la base de données: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Categorie créée avec succès.',
        ], JsonResponse::HTTP_OK);
    }

    #[Route("/admin/categorie/edit/{id}", name: "admin_categorie_update", methods: ["POST", "GET"])]
    public function updateCategorie(int $id, Request $request, ManagerRegistry $doctrine)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $categorie = $doctrine->getRepository(Categorie::class)->find($id);

        if (!$categorie) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Categorie non trouvée.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($request->isMethod('GET')) {
            return new JsonResponse([
                'id' => $categorie->getId(),
                'nom' => $categorie->getNom(),
                'description' => $categorie->getDescription(),
            ], JsonResponse::HTTP_OK);
        }

        $data = $request->request->all();

        if (!empty($data['nom'])) {
            $categorie->setNom($data['nom']);
        }

        if (!empty($data['description'])) {
            $categorie->setDescription($data['description']);
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
            'message' => 'Categorie mise à jour avec succès.',
        ], JsonResponse::HTTP_OK);
    }

    #[Route("/admin/categorie/{id}/delete", name: "admin_categorie_delete", methods: ["DELETE"])]
    public function deleteCategorie(int $id, ManagerRegistry $doctrine)
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $categorie = $doctrine->getRepository(Categorie::class)->find($id);

        if (!$categorie) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Categorie non trouvée.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $entityManager = $doctrine->getManager();
            $entityManager->remove($categorie);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Échec de la suppression dans la base de données: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Categorie supprimée avec succès.',
        ], JsonResponse::HTTP_OK);
    }
}
