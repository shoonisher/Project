<?php

namespace App\Controller\Admin;

use App\Entity\Personnel;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use Vich\UploaderBundle\Form\Type\VichImageType;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TelephoneField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class PersonnelCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Personnel::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInPlural('Info Personnels')
            ->setEntityLabelInSingular('Info Personnel')
            ->setPageTitle('index', 'MORRINGAN - Administration des Info Personnels');
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')
                ->hideOnForm()
                ->hideOnIndex(),

            TextField::new('titre'),

            TextField::new('imageFile')
                ->setFormType(VichImageType::class)
                ->hideOnIndex()
                ->setLabel('Image 210 X 90 px .webp'),

            ImageField::new('imageName')
                ->setBasePath('/uploads/images/contact/')
                ->onlyOnIndex()
                ->setLabel('Image'),

            TextEditorField::new('description')
                ->hideOnIndex(),

            EmailField::new('email'),
            
            TelephoneField::new('telephone'),
        ];
    }
}
