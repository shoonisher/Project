<?php

namespace App\Dto;

use App\Validator\Constraint\IsValidPasswordForgottenCode;

#[IsValidPasswordForgottenCode]
class PasswordForgottenNewPasswordValidator
{
  
  public $code;

  public $username;

  public $password;

}
