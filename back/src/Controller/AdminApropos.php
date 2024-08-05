<?php

namespace App\Controller;

use App\Entity\Apropos;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;

class AdminApropos extends AbstractController
{
    #[Route('/admin/apropos', name: 'admin_apropos_index', methods: ['GET'])]
    public function index(ManagerRegistry $doctrine): JsonResponse
    {
       $apropos = $doctrine->getRepository(Apropos::class)->findAll();
        // Convertir les entités en tableau
        $data = array_map(function (Apropos $apropos) {
            return [
                'id' => $apropos->getId(),
                'text' => $apropos->getText(),
                'picture' => $apropos->getPicture(),
            ];
        }, $apropos);

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    #[Route("/admin/apropos/ajouter", name: "admin_apropos_create", methods: ["POST"])]
    public function createApropos(Request $request, ManagerRegistry $doctrine, SluggerInterface $slugger)
    {
        $data = $request->request->all();
        $pictureFile = $request->files->get('picture');

        if (empty($data['text'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "text" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $apropos = new Apropos();
        $apropos->setText($data['text']);

        if ($pictureFile) {
            $originalFilename = pathinfo($pictureFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $pictureFile->guessExtension();

            try {
                $pictureFile->move(
                    $this->getParameter('apropos'),
                    $newFilename
                );
                $apropos->setPicture($newFilename);
            } catch (FileException $e) {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => 'Échec du téléchargement du fichier: ' . $e->getMessage(),
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        try {
            $entityManager = $doctrine->getManager();
            $entityManager->persist($apropos);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Échec de la création dans la base de données: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Apropos créé avec succès.',
        ], JsonResponse::HTTP_OK);
    }

    #[Route("/admin/apropos/edit/{id}", name: "admin_apropos_update", methods: ["POST", "GET"])]
    public function updateApropos(int $id, Request $request, ManagerRegistry $doctrine, SluggerInterface $slugger)
    {
        $apropos = $doctrine->getRepository(Apropos::class)->find($id);

        if (!$apropos) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Apropos non trouvé.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($request->isMethod('GET')) {
            return new JsonResponse([
                'id' => $apropos->getId(),
                'text' => $apropos->getText(),
                'picture' => $apropos->getPicture(),
            ], JsonResponse::HTTP_OK);
        }

        $data = $request->request->all();
        $pictureFile = $request->files->get('picture');

        if (!empty($data['text'])) {
            $apropos->setText($data['text']);
        }

        if ($pictureFile) {
            $originalFilename = pathinfo($pictureFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $pictureFile->guessExtension();

            try {
                $pictureFile->move(
                    $this->getParameter('apropos'),
                    $newFilename
                );
                $apropos->setPicture($newFilename);
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
            'message' => 'Apropos mis à jour avec succès.',
        ], JsonResponse::HTTP_OK);
    }

    #[Route("/admin/apropos/{id}/delete", name: "admin_apropos_delete", methods: ["DELETE"])]
    public function deleteApropos(int $id, ManagerRegistry $doctrine)
    {
        $apropos = $doctrine->getRepository(Apropos::class)->find($id);

        if (!$apropos) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Apropos non trouvé.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $entityManager = $doctrine->getManager();
            $entityManager->remove($apropos);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Échec de la suppression dans la base de données: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Apropos supprimé avec succès.',
        ], JsonResponse::HTTP_OK);
    }
}
