<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource()]
class PasswordForgottenRequestInput
{

    #[Assert\Email()]
    #[Assert\NotBlank()]
    #[Groups(['password-forgotten:write'])]
    public $username;

}
