<?php

namespace App\Controller;

use App\Entity\Personnel;
use App\Form\ContactFormType;
use Symfony\Component\Mime\Email;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ContactController extends AbstractController
{
    #[Route('/contact', name: 'app_contact')]
    public function index(Request $request, MailerInterface $mailer, ManagerRegistry $doctrine): JsonResponse
    {
        $personnels = $doctrine->getRepository(Personnel::class)->findAll();

        $personnelData = [];
        foreach ($personnels as $personnel) {
            $personnelData[] = [
                'titre' => $personnel->getTitre(),
                'description' => $personnel->getDescription(),
                'imageName' => $personnel->getImageName(),
                'email' => $personnel->getEmail(),
                'telephone' => $personnel->getTelephone(),
            ];
        }

        // Create the form
        $form = $this->createForm(ContactFormType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $formData = $form->getData();

            // Extract data from the form
            $name = $formData['name'];
            $emailAddress = $formData['email'];
            $phone = $formData['phone'];
            $location = $formData['location'];
            $formationType = $formData['formation'];
            $formattedDatepicker = $formData['datepicker']->format('Y-m');
            $numberOfPersons = $formData['personne'];
            $message = $formData['message'];

            // Create and send email
            $email = (new Email())
                ->from('site@morringan.fr') // Set the sender email address
                ->to('aognier93420@gmail.com') // Set the recipient email address
                ->subject('Nouvelle demande de contact')
                ->html($this->renderView(
                    'email/index.html.twig',
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
        }

        return new JsonResponse([
            'status' => 'error',
            'message' => 'Le formulaire contient des erreurs.',
            'form_errors' => (string) $form->getErrors(true, false)
        ]);
    }

    #[Route('/api/personnels', name: 'api_personnels')]
    public function getPersonnels(ManagerRegistry $doctrine): JsonResponse
    {
        $personnels = $doctrine->getRepository(Personnel::class)->findAll();

        $personnelData = [];
        foreach ($personnels as $personnel) {
            $personnelData[] = [
                'titre' => $personnel->getTitre(),
                'description' => $personnel->getDescription(),
                'imageName' => $personnel->getImageName(),
                'email' => $personnel->getEmail(),
                'telephone' => $personnel->getTelephone(),
            ];
        }

        return new JsonResponse($personnelData);
    }
}
