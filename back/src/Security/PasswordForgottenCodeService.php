<?php

// src/Security/PasswordForgottenCodeService.php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;
use App\Security\SecurityActivationCodeService;

class PasswordForgottenCodeService
{
    private $mailer;
    private $twig;

    public function __construct(
        MailerInterface $mailer,
        Environment $twig
    ) {
        $this->mailer = $mailer;
        $this->twig = $twig;
    }

    public function generateCodeAndSendByMail(User $user) {
        $passwordForgottenCode = SecurityActivationCodeService::generateNewCode();
        $user->setPasswordForgottenCode($passwordForgottenCode['code']);
        $user->setPasswordForgottenCodeExpiresAt($passwordForgottenCode['expirationDate']);

        $email = (new Email())
            ->from('moi@example.com')
            ->to($user->getUsername())
            ->subject('Réinitialisation de votre mot de passe')
            ->html(
                $this->twig->render('emails/password-forgotten.html.twig', [
                    'passwordForgottenCode' => $passwordForgottenCode
                ])
            )
        ;

        $this->mailer->send($email);

        return $user;
    }
}
