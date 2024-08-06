<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

class UserController extends AbstractController
{
    private $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    #[Route('/profile', name: 'user_profile', methods: ['GET'])]
    public function getCurrentUser(): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $user = $this->getUser();

        if (!$user instanceof UserInterface) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Utilisateur non trouvé.',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            'status' => 'success',
            'username' => $user->getUserIdentifier(),
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/me', name: 'user_me', methods: ['GET'])]
    public function getCurrentUserMe(): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $user = $this->getUser();

        return new JsonResponse([
            'email' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
        ], JsonResponse::HTTP_OK);
    }
}