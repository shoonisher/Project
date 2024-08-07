<?php

namespace App\Controller;

use App\Entity\Formation;
use App\Entity\Personnel;
use Symfony\Component\Mime\Email;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ContactController extends AbstractController
{
    #[Route('/contact', name: 'app_contact', methods: ['POST', 'GET'])]
    public function index(Request $request, MailerInterface $mailer, ManagerRegistry $doctrine): JsonResponse
    {
        // Vérifiez si la requête est de type POST
        if ($request->isMethod('POST')) {
            $data = json_decode($request->getContent(), true);
            // Assurez-vous que les données sont bien envoyées en JSON
            if (json_last_error() === JSON_ERROR_NONE) {
                // Traitez les données envoyées par le formulaire
                $name = $data['name'] ?? null;
                $emailAddress = $data['email'] ?? null;
                $phone = $data['phone'] ?? null;
                $location = $data['location'] ?? null;
                $formationType = $data['formation'] ?? null;
                $numberOfPersons = $data['personne'] ?? null;
                $message = $data['message'] ?? null;

                // Créez et envoyez l'email au destinataire
                $email = (new Email())
                    ->from('site@morringan.fr') // Remplacez par l'adresse email de l'expéditeur
                    ->to('aognier93420@gmail.com') // Remplacez par l'adresse email du destinataire
                    ->subject('Nouvelle demande de contact')
                    ->html($this->renderView(
                        'emails/index.html.twig',
                        [
                            'name' => $name,
                            'email' => $emailAddress,
                            'message' => $message,
                            'phone' => $phone,
                            'location' => $location,
                            'formationType' => $formationType,
                            'numberOfPersons' => $numberOfPersons,
                        ]
                    ));

                $mailer->send($email);

                // Créez et envoyez l'email de confirmation à l'utilisateur
                $confirmationEmail = (new Email())
                    ->from('site@morringan.fr') // Remplacez par l'adresse email de l'expéditeur
                    ->to($emailAddress) // Adresse email de l'utilisateur
                    ->subject('Confirmation de votre demande de contact')
                    ->html($this->renderView(
                        'emails/confirmation.html.twig',
                        [
                            'name' => $name,
                            'email' => $emailAddress,
                            'phone' => $phone,
                            'location' => $location,
                            'formationType' => $formationType,
                            'numberOfPersons' => $numberOfPersons,
                            'message' => $message,
                        ]
                    ));

                $mailer->send($confirmationEmail);

                return new JsonResponse([
                    'status' => 'success',
                    'message' => 'Votre demande de contact a été envoyée avec succès.'
                ]);
            } else {
                return new JsonResponse([
                    'status' => 'error',
                    'message' => 'Données JSON invalides.',
                ]);
            }
        } else {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Méthode de requête invalide.',
            ]);
        }
    }

    #[Route('/api/personnel', name: 'api_personnel')]
    public function getPersonnel(ManagerRegistry $doctrine): JsonResponse
    {
        $personnel = $doctrine->getRepository(Personnel::class)->findOneBy([]);
    
        if ($personnel) {
            $personnelData = [
                'titre' => $personnel->getTitre(),
                'description' => $personnel->getDescription(),
                'imageName' => $personnel->getPicture(),
                'email' => $personnel->getEmail(),
                'telephone' => $personnel->getTelephone(),
            ];
    
            return new JsonResponse($personnelData);
        }
    
        return new JsonResponse(['error' => 'Aucun personnel trouvé.'], 404);
    }    

    #[Route('/formations/contact', name: 'api_formations')]
    public function getFormations(ManagerRegistry $doctrine): JsonResponse
    {
        $formations = $doctrine->getRepository(Formation::class)->findAll();
    
        if (is_array($formations) && !empty($formations)) {
            $formationsData = [];
            foreach ($formations as $formation) {
                $formationsData[] = [
                    'id' => $formation->getId(),
                    'name' => $formation->getNom(),
                ];
            }
    
            return new JsonResponse($formationsData);
        }
    
        return new JsonResponse(['error' => 'Aucune formation trouvée.'], 404);
    }
}

