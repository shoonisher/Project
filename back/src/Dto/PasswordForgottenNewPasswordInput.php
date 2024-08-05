<?php

namespace App\Dto;

use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

const PWD_FORGOT_WRITE = 'password-forgotten:write';

#[ApiResource()]
class PasswordForgottenNewPasswordInput
{
  #[Assert\NotBlank]
  #[Assert\Length(6)]
  #[Groups([PWD_FORGOT_WRITE])]
  public $code;

  #[Assert\Email]
  #[Assert\Length(max:180)]
  #[Groups([PWD_FORGOT_WRITE])]
  public $username;

  #[Assert\NotBlank]
  #[Assert\Length(
      min: 8,
      max: 32,
      minMessage: "Votre mot de passe doit contenir {{ limit }} caractères au minimum.",
      maxMessage: "Votre mot de passe doit contenir {{ limit }} caractères au maximum."
  )]
  #[Assert\Regex(
      "/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/",
      message: "le mot de passe doit comporter au moins un caractère majuscule, un caractère minuscule, un nombre et un caractère spécial"
  )]
  #[Groups([PWD_FORGOT_WRITE])]
  public $password;

}
