<?php

namespace App\Controller\Admin;

use App\Entity\Formation;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use Vich\UploaderBundle\Form\Type\VichImageType;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\SlugField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\LocaleField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CountryField;
use EasyCorp\Bundle\EasyAdminBundle\Field\LanguageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;

class FormationCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Formation::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInPlural('Formations')
            ->setEntityLabelInSingular('Formation')
            ->setPageTitle('index', 'MORRINGAN - Administration des formations')
            ->addFormTheme('@FOSCKEditor/Form/ckeditor_widget.html.twig');
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')
                ->hideOnForm()
                ->hideOnIndex(),

            TextField::new('nom')
                ->setLabel("Nom"),

            SlugField::new('slug')->setTargetFieldName('nom'),

            AssociationField::new('categorie')
                ->setLabel('Catégorie')
                ->hideOnIndex(),

            AssociationField::new('public')
                ->setLabel('Public'),

            BooleanField::new('isAccueil')
                ->setLabel('Accueil'),

            TextField::new('imageFile')
                ->setFormType(VichImageType::class)
                ->hideOnIndex()
                ->setLabel('Image 350 X 230 px .webp'),

            ImageField::new('imageName')
                ->setBasePath('/uploads/images/formation/')
                ->onlyOnIndex()
                ->setLabel('Image'),

            TextEditorField::new('objectif_formation')
                ->setLabel('Objectif de la formation')
                ->hideOnIndex(),

            NumberField::new('prix')
                ->setLabel('Prix'),

            NumberField::new('nombre_chapitre')
                ->setLabel('Nombre de chapitres')
                ->hideOnIndex(),

            TextField::new('duree')
                ->setLabel('Durée')
                ->hideOnIndex(),

                ChoiceField::new('langue')
                    ->setLabel('langue')
                    ->setChoices([
                        'Français' => 'Français',
                        'Lyon' => 'Lyon',
                        'Marseille' => 'Marseille',
                    ])
                ->hideOnIndex(),

            ChoiceField::new('lieu')
                ->setLabel('Lieu')
                ->setChoices([
                    'Paris' => 'Paris',
                    'Lyon' => 'Lyon',
                    'Marseille' => 'Marseille',
                ])
                ->hideOnIndex(),
            ];
    }
}
