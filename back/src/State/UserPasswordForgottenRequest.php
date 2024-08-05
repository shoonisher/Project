<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\PasswordForgottenRequestInput;
use App\Repository\UserRepository;
use App\Security\ActivationCodeService;
use App\Security\PasswordForgottenCodeService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

final class UserPasswordForgottenRequest implements ProcessorInterface
{
    private $userRepository;
    private $entityManager;

    public function __construct(private readonly ProcessorInterface $processor, UserRepository $userRepository, EntityManagerInterface $entityManager, private PasswordForgottenCodeService $passwordService)
    {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
    }

    public function supports($data, array $context = []): bool
    {
        return $data instanceof PasswordForgottenRequestInput;
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
          if($user){
            $this->passwordService->generateCodeAndSendByMail($user);
            $this->entityManager->persist($user);
            $this->entityManager->flush();
          }

          // succes - envoi d'un  code 204 (http_no_content)
          $response = new Response();
          $response->setContent(json_encode(["message" => "Code envoyé"]));
          $response->setStatusCode(Response::HTTP_OK);
          return $response;
          
        }
        
        // succes - envoi d'un  code 204 (http_no_content)
        $response = new Response();
        $response->setContent(json_encode(["error" => "Input type mismatch"]));
        $response->setStatusCode(Response::HTTP_FORBIDDEN);
        return $response;
    }

    public function remove($data, array $context = [])
    {
      // empty
    }
}
