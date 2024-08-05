<?php

namespace App\Controller;

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
                $formattedDatepicker = $data['datepicker'] ?? null;
                $numberOfPersons = $data['personne'] ?? null;
                $message = $data['message'] ?? null;

                // Créez et envoyez l'email
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
                            'formattedDatepicker' => $formattedDatepicker,
                        ]
                    ));

                $mailer->send($email);

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
}
