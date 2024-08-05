<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Dto\ActivationCodeInput;
use App\Dto\ActivationCodeResendInput;
use App\Dto\PasswordForgottenNewPasswordInput;
use App\Dto\PasswordForgottenRequestInput;
use App\State\UserActivationCodeResend;
use App\State\UserActivationCodeValidation;
use App\State\UserPasswordForgottenNewPassword;
use App\State\UserPasswordForgottenRequest;
use App\State\UserPasswordHasher;
use Doctrine\DBAL\Types\Types;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;


const USER_CREATE = 'user:create';
const USER_WRITE = 'user:write';
const USER_READ = 'user:read';
const USER_UPDATE = 'user:update';
const PWD_FORGOT_WRITE = 'password-forgotten:write';

#[ApiResource(
    operations: [
        new GetCollection(
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Post(processor: UserPasswordHasher::class, validationContext: ['groups' => ['Default', USER_CREATE]]),
        new Post(
            name: 'activationCode',
            uriTemplate: '/users/activation-code',
            input: ActivationCodeInput::class,
            processor: UserActivationCodeValidation::class,
            denormalizationContext: ['groups' => [USER_WRITE]],
        ),
        new Post(
            name: 'activationCodeResend',
            uriTemplate: '/users/activation-code/resend',
            input: ActivationCodeResendInput::class,
            processor: UserActivationCodeResend::class,
            denormalizationContext: ['groups' => [USER_WRITE]],
        ),
        new Post(
            name: 'passwordForgottenRequest',
            uriTemplate: '/password-forgotten-request',
            input: PasswordForgottenRequestInput::class,
            processor: UserPasswordForgottenRequest::class,
            denormalizationContext: ['groups' => [PWD_FORGOT_WRITE]],
        ),
        new Post(
            name: 'passwordForgottenNewPassword',
            uriTemplate: '/password-forgotten-new-password',
            input: PasswordForgottenNewPasswordInput::class,
            processor: UserPasswordForgottenNewPassword::class,
            denormalizationContext: ['groups' => [PWD_FORGOT_WRITE]],
        ),
        new Get(
            security: "is_granted('ROLE_ADMIN') or object == user"
        ),
        new Patch(
            security: "is_granted('ROLE_ADMIN') or object == user",
            processor: UserPasswordHasher::class
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN') and object != user"
        ),
    ],
    normalizationContext: ['groups' => [USER_READ]],
    denormalizationContext: ['groups' => [USER_CREATE, USER_UPDATE]],
)]
#[UniqueEntity('username')]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[Groups([USER_READ])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups([USER_READ, USER_CREATE, USER_UPDATE])]
    #[ORM\Column(length: 180, unique: true)]
    private ?string $username = null;

    #[Groups([USER_CREATE, USER_UPDATE])]
    #[ORM\Column(type: 'json')]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[Assert\NotBlank(groups: [USER_CREATE])]
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

    #[Groups([USER_CREATE, USER_UPDATE])]
    private ?string $plainPassword = null;

    #[ORM\Column(type: 'integer')]
    private $activationCode;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ["default" => "CURRENT_TIMESTAMP"])]
    private $activationCodeExpiresAt;

    #[Groups([USER_READ])]
    #[ORM\Column(type: 'boolean')]
    private $isEnabled;

    #[Groups([PWD_FORGOT_WRITE])]
    #[ORM\Column(type: 'integer', nullable: true)]
    private $passwordForgottenCode;

    #[Groups([PWD_FORGOT_WRITE])]
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private $passwordForgottenCodeExpiresAt;

    public function __construct()
    {
        $this->isEnabled = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(string $password): static
    {
        $this->plainPassword = $password;

        return $this;
    }

    public function getActivationCode(): ?int
    {
        return $this->activationCode;
    }

    public function setActivationCode(int $activationCode): self
    {
        $this->activationCode = $activationCode;

        return $this;
    }

    public function getActivationCodeExpiresAt(): ?\DateTimeInterface
    {
        return $this->activationCodeExpiresAt;
    }

    public function setActivationCodeExpiresAt(\DateTimeInterface $activationCodeExpiresAt): self
    {
        $this->activationCodeExpiresAt = $activationCodeExpiresAt;

        return $this;
    }

    public function getIsEnabled(): ?bool
    {
        return $this->isEnabled;
    }

    public function setIsEnabled(bool $isEnabled): self
    {
        $this->isEnabled = $isEnabled;

        return $this;
    }

    public function getPasswordForgottenCode(): ?int
    {
        return $this->passwordForgottenCode;
    }

    public function setPasswordForgottenCode(?int $passwordForgottenCode): self
    {
        $this->passwordForgottenCode = $passwordForgottenCode;

        return $this;
    }

    public function getPasswordForgottenCodeExpiresAt(): ?\DateTimeInterface
    {
        return $this->passwordForgottenCodeExpiresAt;
    }

    public function setPasswordForgottenCodeExpiresAt(?\DateTimeInterface $passwordForgottenCodeExpiresAt): self
    {
        $this->passwordForgottenCodeExpiresAt = $passwordForgottenCodeExpiresAt;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }
}
