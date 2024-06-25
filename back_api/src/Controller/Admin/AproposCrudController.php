<?php

namespace App\Controller\Admin;

use App\Entity\Apropos;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use Vich\UploaderBundle\Form\Type\VichImageType;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;

class AproposCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Apropos::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
        ->setEntityLabelInPlural('Apropos')
        ->setEntityLabelInSingular('Apropos')
        ->setPageTitle('index', 'MORRINGAN - Administration du Apropo')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')
                ->hideOnIndex()
                ->hideOnForm(),
            TextField::new('imageFile')->setFormType(VichImageType::class)->hideOnIndex()->setLabel('Image 550 X 370 px .webp'),
            ImageField::new('imageName')->setBasePath('/uploads/images/apropos/')->onlyOnIndex()->setLabel('Image'),
            TextareaField::new('text')
        ];
    }
}
