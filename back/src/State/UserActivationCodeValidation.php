<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\ActivationCodeInput;
use App\Dto\ActivationCodeValidator;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class UserActivationCodeValidation implements ProcessorInterface
{
    private $validator;
    private $userRepository;
    private $entityManager;

    public function __construct(private readonly ProcessorInterface $processor, ValidatorInterface $validator, UserRepository $userRepository, EntityManagerInterface $entityManager)
    {
        $this->validator = $validator;
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
    }

    public function supports($data, array $context = []): bool
    {
        return $data instanceof ActivationCodeInput;
    }

    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        // $this->processor est definit dans config/service.yaml
        // $processor: '@api_platform.doctrine.orm.state.persist_processor'

        // Actions avant persist:

        // si $data est une instance du Dto ActivationCodeInput
        if($this->supports($data)){
          $activationCodeValidator = new ActivationCodeValidator();
          $activationCodeValidator->code = $data->activationCode;
          $activationCodeValidator->email = $data->username;

          // on vérifie le code
          $errors = $this->validator->validate($activationCodeValidator);
          if ($errors->count() > 0) {
              return $errors;
          }
          

          // si c'est bon on met à jour le User
          $user =  $this->userRepository->findOneBy(['username' => $data->username]);
          $user->setIsEnabled(true);

          // We expire the code by setting the date to now
          $user->setActivationCodeExpiresAt(new \DateTime());

          $this->entityManager->persist($user);
          $this->entityManager->flush();

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
