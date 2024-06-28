<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Karser\Recaptcha3Bundle\Form\Recaptcha3Type;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\MonthType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Karser\Recaptcha3Bundle\Validator\Constraints\Recaptcha3;

class ContactFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Nom *',
                'required' => true,
            ])
            ->add('email', EmailType::class, [
                'label' => 'Email *',
                'required' => true,
            ])
            ->add('phone', ChoiceType::class, [
                'label' => 'Professionnels / Particuliers *',
                'choices' => [
                    'Selectionner votre status' => 'selectionner',
                    'Professionnel' => 'professionnel',
                    'Particulier' => 'particulier',
                ],
                'required' => true,
            ])
            // Ajoutez les autres champs en suivant le même modèle
            ->add('location', ChoiceType::class, [
                'label' => 'Lieu de formation *',
                'choices' => [
                    'Selectionner votre lieu' => 'selectionner',
                    'Dans vos locaux' => 'Dans vos locaux',
                    'Dans l\'un de nos centres' => 'Dans l\'un de nos centres',
                ],
                'required' => true,
            ])
            // Ajoutez les autres champs en suivant le même modèle
            ->add('formation', ChoiceType::class, [
                'label' => 'Types de Formation *',
                'choices' => [
                    'Selectionner votre formation' => 'selectionner',
                    'Distanciel' => 'distanciel',
                    'Présentiel' => 'presentiel',
                ],
                'required' => true,
            ])
            // Ajoutez les autres champs en suivant le même modèle
            ->add('datepicker', DateType::class, [
                'label' => 'Période de formation *',
                'required' => true,
            ])
            // Ajoutez les autres champs en suivant le même modèle
            ->add('personne', NumberType::class, [
                'label' => 'Nombre de personnes ? *',
                'required' => true,
            ])
            // Ajoutez les autres champs en suivant le même modèle
            ->add('message', TextareaType::class, [
                'label' => 'Message *',
                'required' => true,
            ]);
        $builder->add('captcha', Recaptcha3Type::class, [
            'constraints' => new Recaptcha3(),
            'action_name' => 'homepage',
            'locale' => 'fr',
        ]);
    }
}
