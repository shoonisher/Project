<?php

namespace App\Validator\Constraint;

use App\Dto\ActivationCodeValidator;
use App\Repository\UserRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class IsValidActivationCodeValidator extends ConstraintValidator
{
    // le nom de la classe relie ce validateur à la contrainte isValidActivationCode
    private $userRepository;

    public function __construct(UserRepository $userRepository, private readonly LoggerInterface $logger)
    {
        $this->userRepository = $userRepository;
    }

    public function validate($value, Constraint $constraint)
    {

        if (!$value instanceof ActivationCodeValidator) {
            $this->context->buildViolation("Only ActivationCodeValidator is supported")
                ->addViolation()
            ;
            return;
        }

        $user = $this->userRepository->findOneBy(['username' => $value->email]);
        if (null === $user) {
            $this->context->buildViolation("Cet utilisateur n'existe pas")
                ->addViolation()
            ;
            return;
        }

        if ($user->getIsEnabled()) {
          $this->context->buildViolation("Cet utilisateur est déjà validé")
              ->addViolation()
          ;
          return;
      }

        if ($user->getActivationCodeExpiresAt() < new \DateTime()) {
            $this->context->buildViolation("Ce code est expiré")
                ->addViolation()
            ;
            return;
        }

        if ((int) $value->code !== $user->getActivationCode()) {
            $this->context->buildViolation("Ce code n'est pas correct")
                ->addViolation()
            ;
        }
    }
}
