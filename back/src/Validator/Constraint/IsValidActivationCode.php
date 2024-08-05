<?php

namespace App\Validator\Constraint;

use Symfony\Component\Validator\Constraint;

// permet de lancer la validation
// en ne passant que le Dto a la méthode validate
#[\Attribute]
class IsValidActivationCode extends Constraint
{
    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}
