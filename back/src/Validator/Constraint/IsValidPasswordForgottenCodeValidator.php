<?php

namespace App\Validator\Constraint;

use App\Dto\PasswordForgottenNewPasswordValidator;
use App\Repository\UserRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class IsValidPasswordForgottenCodeValidator extends ConstraintValidator
{
    // le nom de la classe relie ce validateur à la contrainte IsValidPasswordForgottenCode
    private $userRepository;

    public function __construct(UserRepository $userRepository, private readonly LoggerInterface $logger)
    {
        $this->userRepository = $userRepository;
    }

    public function validate($value, Constraint $constraint)
    {

        if (!$value instanceof PasswordForgottenNewPasswordValidator) {
            $this->context->buildViolation("Only PasswordForgottenNewPasswordInput is supported")
                ->addViolation()
            ;
            return;
        }

        $user = $this->userRepository->findOneBy(['username' => $value->username]);
        if (null === $user) {
            $this->context->buildViolation("Cet utilisateur n'existe pas")
                ->addViolation()
            ;
            return;
        }

        if ($user->getPasswordForgottenCodeExpiresAt() < new \DateTime()) {
            $this->context->buildViolation("Ce code est expiré")
                ->addViolation()
            ;
            return;
        }

        if ((int) $value->code !== $user->getPasswordForgottenCode()) {
            $this->context->buildViolation("Ce code n'est pas correct")
                ->addViolation()
            ;
        }
    }
}
