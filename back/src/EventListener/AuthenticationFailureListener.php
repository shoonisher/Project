<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;

class AuthenticationFailureListener
{
    public function onAuthenticationFailureResponse(AuthenticationFailureEvent $event): void
    {
        $message = $event->getException()->getMessage();
        $statusCode = $event->getResponse()->getStatusCode();
        $response = $event->getResponse();
        
        $event->setResponse($response->setContent(json_encode(["code" => $statusCode, "error" => $message])));
    }
}
