<?php
# api/src/State/UserPasswordHasher.php

namespace App\State;

use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Operation;
use Symfony\Component\Mime\Address;
use App\Security\ActivationCodeService;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use App\Security\SecurityActivationCodeService;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserPasswordHasher implements ProcessorInterface
{
    public function __construct(private readonly ProcessorInterface $processor, private readonly UserPasswordHasherInterface $passwordHasher, private MailerInterface $mailer)
    {
    }

    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        // $this->processor est definit dans config/service.yaml
        // $processor: '@api_platform.doctrine.orm.state.persist_processor'

        // Actions avant persist:
        if (!$data->getPlainPassword()) {
            return $this->processor->process($data, $operation, $uriVariables, $context);
        }

        $hashedPassword = $this->passwordHasher->hashPassword(
            $data,
            $data->getPlainPassword()
        );
        $data->setPassword($hashedPassword);
        $data->eraseCredentials();
        if($operation instanceof Post) {
            $activationCode = SecurityActivationCodeService::generateNewCode();
            $data->setActivationCode($activationCode['code']);
            $data->setActivationCodeExpiresAt($activationCode['expirationDate']);
        }
        $result =  $this->processor->process($data, $operation, $uriVariables, $context);

        // actions apres persist:

        // envoi du mail si c'est une action POST et non PATCH
        if($operation instanceof Post) {
            $email = (new TemplatedEmail())
                ->from('moi@example.com')
                ->to(new Address($data->getUsername()))
                ->subject('Activez votre compte!')

                // path of the Twig template to render
                ->htmlTemplate('emails/registration.html.twig')

                // pass variables (name => value) to the template
                ->context([
                    'activationCode' => $activationCode
                ]);

            $this->mailer->send($email);
        }

        return $result;
    }
}
