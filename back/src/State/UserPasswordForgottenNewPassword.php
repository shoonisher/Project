<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\PasswordForgottenNewPasswordInput;
use App\Dto\PasswordForgottenNewPasswordValidator;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class UserPasswordForgottenNewPassword implements ProcessorInterface
{
    private $validator;
    private $userRepository;
    private $entityManager;

    public function __construct(private readonly ProcessorInterface $processor, ValidatorInterface $validator, UserRepository $userRepository, EntityManagerInterface $entityManager, private readonly UserPasswordHasherInterface $passwordHasher)
    {
        $this->validator = $validator;
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
    }

    public function supports($data, array $context = []): bool
    {
        return $data instanceof PasswordForgottenNewPasswordInput;
    }

    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        // $this->processor est definit dans config/service.yaml
        // $processor: '@api_platform.doctrine.orm.state.persist_processor'

        // Actions avant persist:

        // si $data est une instance du Dto ActivationCodeInput
        if($this->supports($data)){
          $passwordForgottenNewPasswordValidator = new PasswordForgottenNewPasswordValidator();
          $passwordForgottenNewPasswordValidator->code = $data->code;
          $passwordForgottenNewPasswordValidator->username = $data->username;
          $passwordForgottenNewPasswordValidator->password = $data->password;

          // on vérifie le code
          $errors = $this->validator->validate($passwordForgottenNewPasswordValidator);
          if ($errors->count() > 0) {
              return $errors;
          }
          
          // si c'est bon on met à jour le User
          $user =  $this->userRepository->findOneBy(['username' => $data->username]);
          
          if($user) {
            $hashedPassword = $this->passwordHasher->hashPassword(
              $user,
              $data->password
            );
            $user->setPassword($hashedPassword);
            $user->eraseCredentials();
            // We expire the code by setting the date to now
            $user->setPasswordForgottenCode(null);
            $user->setPasswordForgottenCodeExpiresAt(null);

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            // succes - envoi d'un  code 204 (http_no_content)
            $response = new Response();
            $response->setContent(json_encode(["message" => "Succes modification"]));
            $response->setStatusCode(Response::HTTP_OK);
            return $response;
          }
        }
        
        // succes - envoi d'un  code 204 (http_no_content)
        $response = new Response();
        $response->setContent(json_encode(["error" => "Echec modification"]));
        $response->setStatusCode(Response::HTTP_FORBIDDEN);
        return $response;
    }

    public function remove($data, array $context = [])
    {
      // empty
    }
}
