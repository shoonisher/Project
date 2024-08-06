<?php

namespace App\Controller;

use App\Entity\Categorie;
use App\Entity\Cible;
use App\Entity\Formation;
use App\Repository\FormationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Cocur\Slugify\Slugify;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;

class AdminFormation extends AbstractController
{
    private $entityManager;
    private $formationRepository;

    public function __construct(EntityManagerInterface $entityManager, FormationRepository $formationRepository)
    {
        $this->entityManager = $entityManager;
        $this->formationRepository = $formationRepository;
    }

    #[Route('/admin/formations', name: 'admin_formations', methods: ['GET'])]
    public function index(ManagerRegistry $doctrine): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        $formations = $doctrine->getRepository(Formation::class)->findAll();

        // Convertir les entités en tableau
        $data = array_map(function (Formation $formation) {
            return [
                'id' => $formation->getId(),
                'nom' => $formation->getNom(),
                'objectif_formation' => $formation->getObjectifFormation(),
                'prix' => $formation->getPrix(),
                'nombre_chapitre' => $formation->getNombreChapitre(),
                'duree' => $formation->getDuree(),
                'langue' => $formation->getLangue(),
                'lieu' => $formation->getLieu(),
                'categorie' => $formation->getCategorie() ? [
                    'id' => $formation->getCategorie()->getId(),
                    'nom' => $formation->getCategorie()->getNom(),
                    'description' => $formation->getCategorie()->getDescription(),
                ] : null,
                'picture' => $formation->getPicture(),
                'isAccueil' => $formation->getIsAccueil(),
                'public' => $formation->getPublic() ? [
                    'id' => $formation->getPublic()->getId(),
                    'type' => $formation->getPublic()->getType(),
                ] : null,
                'slug' => $formation->getSlug(),
            ];
        }, $formations);

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    #[Route('/admin/formations/{id}', name: 'admin_formations_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $formation = $this->formationRepository->find($id);

        if (!$formation) {
            return $this->json(['message' => 'Formation not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        return $this->json($formation);
    }

    #[Route('/admin/formation/ajouter', name: 'admin_formations_create', methods: ['POST'])]
    public function create(Request $request, ManagerRegistry $doctrine, SluggerInterface $slugger): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = $request->request->all();
        $pictureFile = $request->files->get('picture'); // Pour les fichiers

        if (empty($data['nom'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "nom" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['objectif_formation'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "objectif_formation" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['prix'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "prix" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['nombre_chapitre'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "nombre_chapitre" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['duree'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "duree" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['langue'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "langue" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['lieu'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "lieu" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['categorie_id'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "categorie_id" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['isAccueil'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "isAccueil" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }
        if (empty($data['public_id'])) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "public_id" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $formation = new Formation();
        $formation->setNom($data['nom']);
        $formation->setObjectifFormation($data['objectif_formation']);
        $formation->setPrix($data['prix']);
        $formation->setNombreChapitre($data['nombre_chapitre']);
        $formation->setDuree($data['duree']);
        $formation->setLangue($data['langue']);
        $formation->setLieu($data['lieu']);
        $formation->setCategorie($doctrine->getRepository(Categorie::class)->find($data['categorie_id']));
        $formation->setIsAccueil($data['isAccueil']);
        $formation->setPublic($doctrine->getRepository(Cible::class)->find($data['public_id']));

        // Mettre à jour l'image seulement si un nouveau fichier est fourni
        if ($pictureFile) {
            $originalFilename = pathinfo($pictureFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $pictureFile->guessExtension();

            try {
                // Déplace le fichier vers le répertoire des images
                $pictureFile->move(
                    $this->getParameter('formations'),
                    $newFilename
                );
                $formation->setPicture($newFilename);
            } catch (FileException $e) {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => 'Échec du téléchargement du fichier: ' . $e->getMessage(),
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
            }
        } else {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Le champ "picture" est requis.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $slugify = new Slugify();
        $formation->setSlug($slugify->slugify($data['nom']));

        try {
            $entityManager = $doctrine->getManager();
            $entityManager->persist($formation);
            $entityManager->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Échec de la création dans la base de données: ' . $e->getMessage(),
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse([
            'status' => 'success',
            'message' => 'Formation créée avec succès.',
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/admin/formation/edit/{id}', name: 'admin_formations_update', methods: ['POST', 'GET'])]
    public function updateFormation(int $id, Request $request, ManagerRegistry $doctrine, SluggerInterface $slugger): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $formation = $doctrine->getRepository(Formation::class)->find($id);

        if (!$formation) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Formation non trouvée.',
            ], JsonResponse::HTTP_NOT_FOUND);
        }
        if ($request->isMethod('GET')) {
            return new JsonResponse([
                'id' => $formation->getId(),
                'nom' => $formation->getNom(),
                'objectif_formation' => $formation->getObjectifFormation(),
                'prix' => $formation->getPrix(),
                'nombre_chapitre' => $formation->getNombreChapitre(),
                'duree' => $formation->getDuree(),
                'langue' => $formation->getLangue(),
                'lieu' => $formation->getLieu(),
                'categorie' => $formation->getCategorie()->getNom(),
                'picture' => $formation->getPicture(),
                'isAccueil' => $formation->getIsAccueil(),
                'public' => $formation->getPublic()->getType(),
            ], JsonResponse::HTTP_OK);
        }

        $data = $request->request->all();

        if (!empty($data['nom'])) {
            $formation->setNom($data['nom']);
        }
        if (!empty($data['objectif_formation'])) {
            $formation->setObjectifFormation($data['objectif_formation']);
        }
        if (!empty($data['prix'])) {
            $formation->setPrix($data['prix']);
        }
        if (!empty($data['nombre_chapitre'])) {
            $formation->setNombreChapitre($data['nombre_chapitre']);
        }
        if (!empty($data['duree'])) {
            $formation->setDuree($data['duree']);
        }
        if (!empty($data['langue'])) {
            $formation->setLangue($data['langue']);
        }
        if (!empty($data['lieu'])) {
            $formation->setLieu($data['lieu']);
        }
        if (!empty($data['categorie_id'])) {
            $categorie = $doctrine->getRepository(Categorie::class)->find($data['categorie_id']);
            if ($categorie) {
                $formation->setCategorie($categorie);
            }
        }
        if (!empty($data['public_id'])) {
            $public = $doctrine->getRepository(Cible::class)->find($data['public_id']);
            if ($public) {
                $formation->setPublic($public);
            }
        }

        // Mettre à jour l'image seulement si un nouveau fichier est fourni
        $pictureFile = $request->files->get('picture');
        if ($pictureFile) {
            $originalFilename = pathinfo($pictureFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $pictureFile->guessExtension();

            try {
                // Déplace le fichier vers le répertoire des images
                $pictureFile->move(
                    $this->getParameter('formations'),
                    $newFilename
                );
                $formation->setPicture($newFilename);
            } catch (FileException $e) {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => 'Échec du téléchargement du fichier: ' . $e->getMessage(),
                ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        if (!empty($data['isAccueil'])) {
            $formation->setIsAccueil($data['isAccueil']);
        }

        $slugify = new Slugify();
        $formation->setSlug($slugify->slugify($data['nom']));

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
            'message' => 'Formation mise à jour avec succès.',
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/admin/formation/{id}/delete', name: 'admin_formations_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $formation = $this->formationRepository->find($id);

        if (!$formation) {
            return $this->json(['message' => 'Formation not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($formation);
        $this->entityManager->flush();

        return $this->json(['message' => 'Formation deleted'], JsonResponse::HTTP_NO_CONTENT);
    }
}
