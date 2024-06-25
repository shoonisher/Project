<?php

namespace App\Controller\Admin;

use App\Entity\Programme;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\SlugField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class ProgrammeCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Programme::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInPlural('Programmes formations')
            ->setEntityLabelInSingular('Programme formation')
            ->setPageTitle('index', 'MORRINGAN - Administration des Programme formations');
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')
                ->hideOnForm()
                ->hideOnDetail()
                ->hideOnIndex(),

            TextField::new('titre'),

            SlugField::new('slug')->setTargetFieldName('titre'),

            SlugField::new('slug')->setTargetFieldName('titre')
            ->hideOnIndex()
            ->hideOnForm()
            ->hideOnDetail(),

            AssociationField::new('formation'),

            TextEditorField::new('description')
            ->hideOnIndex(),

            NumberField::new('point')
            ->hideOnIndex(),
        ];
    }
}
