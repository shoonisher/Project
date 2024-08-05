<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Core\Exception\AccountExpiredException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\AuthenticationExpiredException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;


class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(UserInterface $user)
    {
        if (!$user instanceof User) {
            return;
        }
    }

    public function checkPostAuth(UserInterface $user)
    {

        if (!$user instanceof User) {
            return;
        }

        if (!$user->getIsEnabled()) {
            throw new AuthenticationException('Compte non actif');
        }
    }

}
