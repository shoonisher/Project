<?php

namespace App\State;

use App\Repository\UserRepository;
use ApiPlatform\Metadata\Operation;
use Symfony\Component\Mime\Address;
use App\Dto\ActivationCodeResendInput;
use App\Security\ActivationCodeService;
use Doctrine\ORM\EntityManagerInterface;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;
use App\Security\SecurityActivationCodeService;

final class UserActivationCodeResend implements ProcessorInterface
{
    private $userRepository;
    private $entityManager;

    public function __construct(private readonly ProcessorInterface $processor, UserRepository $userRepository, EntityManagerInterface $entityManager, private MailerInterface $mailer)
    {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
    }

    public function supports($data, array $context = []): bool
    {
        return $data instanceof ActivationCodeResendInput;
    }

    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        // $this->processor est definit dans config/service.yaml
        // $processor: '@api_platform.doctrine.orm.state.persist_processor'

        // Actions avant persist:

        // si $data est une instance du Dto ActivationCodeResendInput
        if($this->supports($data)){

          // si c'est bon on met à jour le User
          $user =  $this->userRepository->findOneBy(['username' => $data->username]);
          $activationCode = SecurityActivationCodeService::generateNewCode();
          $user->setActivationCode($activationCode['code']);
          $user->setActivationCodeExpiresAt($activationCode['expirationDate']);

          $this->entityManager->persist($user);
          $this->entityManager->flush();

          $email = (new TemplatedEmail())
                ->from('moi@example.com')
                ->to(new Address($user->getUsername()))
                ->subject('Nouveau code d\'activation')

                // path of the Twig template to render
                ->htmlTemplate('emails/registration.html.twig')

                // pass variables (name => value) to the template
                ->context([
                    'activationCode' => $activationCode
                ]);

          $this->mailer->send($email);

          // succes - envoi d'un  code 204 (http_no_content)
          $response = new Response();
          $response->setStatusCode(Response::HTTP_NO_CONTENT);
          return $response;
          
        }
        
        // succes - envoi d'un  code 204 (http_no_content)
        $response = new Response();
        $response->setStatusCode(Response::HTTP_FORBIDDEN);
        return $response;
    }

    public function remove($data, array $context = [])
    {
      // empty
    }
}
