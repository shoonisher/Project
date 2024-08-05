<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource()]
class ActivationCodeInput
{
    #[Assert\NotBlank]
    #[Assert\Length(6)]
    #[Groups(['user:write'])]
    public $activationCode;

    #[Assert\Email]
    #[Assert\Length(max:180)]
    #[Groups(['user:write'])]
    public $username;

    public function __toString() {
      return $this->activationCode . ' - ' . $this->username;
    }
}
