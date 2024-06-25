<?php

namespace App\Controller\Admin;

use App\Entity\Cible;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class CibleCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Cible::class;
    }
    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInPlural('Cibles')
            ->setEntityLabelInSingular('Cible')
            ->setPageTitle('index', 'MORRINGAN - Administration des Cibles');
    }


    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')
                ->hideOnIndex()
                ->hideOnForm()
                ->hideOnDetail(),

            TextField::new('type'),
        ];
    }

}
