<?php

namespace App\Dto;

use App\Validator\Constraint\IsValidActivationCode;

#[IsValidActivationCode] //relie le Dto à la containte
class ActivationCodeValidator
{
    public $code;
    public $email;
}
