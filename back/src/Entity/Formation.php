<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\FormationRepository;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;

#[ORM\Entity(repositoryClass: FormationRepository::class)]
#[ApiResource()]
class Formation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $objectif_formation = null;

    #[ORM\Column]
    private ?float $prix = null;

    #[ORM\Column]
    private ?float $nombre_chapitre = null;

    #[ORM\Column(length: 255)]
    private ?string $duree = null;

    #[ORM\Column(length: 255)]
    private ?string $langue = null;

    #[ORM\Column(length: 255)]
    private ?string $lieu = null;

    #[ORM\ManyToOne(inversedBy: 'formations')]
    private ?Categorie $categorie = null;

    #[ORM\Column(nullable: true)]
    private ?string $picture = null;

    #[ORM\Column]
    private ?bool $isAccueil = null;

    #[ORM\ManyToOne(inversedBy: 'formations')]
    private ?Cible $public = null;

    #[ORM\OneToMany(mappedBy: 'formation', targetEntity: Programme::class)]
    private Collection $programme;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    public function __construct()
    {
        $this->programme = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getObjectifFormation(): ?string
    {
        return $this->objectif_formation;
    }

    public function setObjectifFormation(string $objectif_formation): static
    {
        $this->objectif_formation = $objectif_formation;

        return $this;
    }

    public function getPrix(): ?float
    {
        return $this->prix;
    }

    public function setPrix(float $prix): static
    {
        $this->prix = $prix;

        return $this;
    }

    public function getNombreChapitre(): ?float
    {
        return $this->nombre_chapitre;
    }

    public function setNombreChapitre(float $nombre_chapitre): static
    {
        $this->nombre_chapitre = $nombre_chapitre;

        return $this;
    }

    public function getDuree(): ?string
    {
        return $this->duree;
    }

    public function setDuree(string $duree): static
    {
        $this->duree = $duree;

        return $this;
    }

    public function getLangue(): ?string
    {
        return $this->langue;
    }

    public function setLangue(string $langue): static
    {
        $this->langue = $langue;

        return $this;
    }

    public function getLieu(): ?string
    {
        return $this->lieu;
    }

    public function setLieu(string $lieu): static
    {
        $this->lieu = $lieu;

        return $this;
    }

    public function getCategorie(): ?Categorie
    {
        return $this->categorie;
    }

    public function setCategorie(?Categorie $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(?string $picture): static
    {
        $this->picture = $picture;

        return $this;
    }

    public function getIsAccueil(): ?bool
    {
        return $this->isAccueil;
    }

    public function setIsAccueil(bool $isAccueil): static
    {
        $this->isAccueil = $isAccueil;

        return $this;
    }

    public function getPublic(): ?Cible
    {
        return $this->public;
    }

    public function setPublic(?Cible $public): static
    {
        $this->public = $public;

        return $this;
    }

    /**
     * @return Collection<int, Programme>
     */
    public function getProgramme(): Collection
    {
        return $this->programme;
    }

    public function addProgramme(Programme $programme): static
    {
        if (!$this->programme->contains($programme)) {
            $this->programme->add($programme);
            $programme->setFormation($this);
        }

        return $this;
    }

    public function removeProgramme(Programme $programme): static
    {
        if ($this->programme->removeElement($programme)) {
            // set the owning side to null (unless already changed)
            if ($programme->getFormation() === $this) {
                $programme->setFormation(null);
            }
        }

        return $this;
    }

    public function __toString()
    {
        return $this->nom; 
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }
}
