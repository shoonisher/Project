<?php

namespace App\Controller;

use App\Entity\Cible;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AdminCible extends AbstractController
{
    #[Route('/admin/cible', name: 'admin_cible_index', methods: ['GET'])]
    public function index(ManagerRegistry $doctrine): JsonResponse
    {
        $cibles = $doctrine->getRepository(Cible::class)->findAll();

        // Convertir les entités en tableau
        $data = array_map(function (Cible $cible) {
            return [
                'id' => $cible->getId(),
                'type' => $cible->getType(),
            ];
        }, $cibles);

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    #[Route("/admin/cible/ajouter", name: "admin_cible_create", methods: ["POST"])]
    public function createCible(Request $request, ManagerRegistry $doctrine)
    {
        $data = $request->request->all();

        if (empty($data['type'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "type" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $cible = new Cible();
        $cible->setType($data['type']);

        try {
            $entityManager = $doctrine->getManager();
            $entityManager->persist($cible);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Échec de la création dans la base de données: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Cible créée avec succès.',
        ], JsonResponse::HTTP_OK);
    }

    #[Route("/admin/cible/edit/{id}", name: "admin_cible_update", methods: ["POST", "GET"])]
    public function updateCible(int $id, Request $request, ManagerRegistry $doctrine)
    {
        $cible = $doctrine->getRepository(Cible::class)->find($id);

        if (!$cible) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Cible non trouvée.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }
        if ($request->isMethod('GET')) {
            return new JsonResponse([
                'id' => $cible->getId(),
                'type' => $cible->getType(),
            ], JsonResponse::HTTP_OK);
        }

        $data = $request->request->all();

        if (!empty($data['type'])) {
            $cible->setType($data['type']);
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
            'message' => 'Cible mise à jour avec succès.',
        ], JsonResponse::HTTP_OK);
    }

    #[Route("/admin/cible/{id}/delete", name: "admin_cible_delete", methods: ["DELETE"])]
    public function deleteCible(int $id, ManagerRegistry $doctrine)
    {
        $cible = $doctrine->getRepository(Cible::class)->find($id);

        if (!$cible) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Cible non trouvée.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $entityManager = $doctrine->getManager();
            $entityManager->remove($cible);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Échec de la suppression dans la base de données: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Cible supprimée avec succès.',
        ], JsonResponse::HTTP_OK);
    }
}
