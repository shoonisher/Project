<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource()]
class ActivationCodeResendInput
{
    #[Assert\Email]
    #[Assert\Length(max:180)]
    #[Groups(['user:write'])]
    public $username;
}
