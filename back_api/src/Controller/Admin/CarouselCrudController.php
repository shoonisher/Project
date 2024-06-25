<?php

namespace App\Controller\Admin;

use App\Entity\Carousel;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use Vich\UploaderBundle\Form\Type\VichImageType;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;

class CarouselCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Carousel::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
        ->setEntityLabelInPlural('Carousel')
        ->setEntityLabelInSingular('Carousels')
        ->setPageTitle('index', 'MORRINGAN - Administration du Carousel')
        ;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')
                ->hideOnIndex()
                ->hideOnForm(),
            TextField::new('titre'),
            TextField::new('imageFile')->setFormType(VichImageType::class)->hideOnIndex()->setLabel('Image 1350 X 720 px .webp'),
            ImageField::new('imageName')->setBasePath('/uploads/images/carousel/')->onlyOnIndex()->setLabel('Image'),
            NumberField::new('position')->setLabel('Position'),
        ];
    }
}
