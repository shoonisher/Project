# Project

## Prérequis
- PHP >= 7.4
- Composer
- Node.js >= 12
- npm ou yarn
- Git

## Étapes d'installation
1. **Cloner le dépôt Symfony et React** ```bash git clone https://github.com/votre-utilisateur/votre-projet-symfony.git cd votre-projet-symfony git clone https://github.com/votre-utilisateur/votre-projet-react.git cd votre-projet-react ```
2. **Installer les dépendances PHP pour Symfony** Assurez-vous d'avoir Composer installé. Ensuite, exécutez : ```bash composer install ```
3. **Configurer les variables d'environnement pour Symfony** Copiez le fichier `.env` pour créer votre propre configuration locale : ```bash cp .env .env.local ``` Modifiez le fichier `.env.local` pour y ajouter vos paramètres de base de données et autres configurations nécessaires.
4. **Créer la base de données pour Symfony** Assurez-vous que votre serveur de base de données est en cours d'exécution. Ensuite, créez la base de données et exécutez les migrations : ```bash php bin/console doctrine:database:create php bin/console doctrine:migrations:migrate ```
5. **Installer les dépendances JavaScript pour React** Assurez-vous d'avoir npm ou yarn installé. Ensuite, exécutez : ```bash npm install # ou si vous utilisez yarn yarn install ```
6. **Compiler les assets JavaScript et CSS pour React** Pour compiler les assets en mode développement : ```bash npm run dev # ou si vous utilisez yarn yarn dev ``` Pour compiler les assets en mode production : ```bash npm run build # ou si vous utilisez yarn yarn build ```
7. **Lancer le serveur de développement Symfony** Utilisez la commande suivante pour démarrer le serveur de développement : ```bash symfony serve ``` Le projet sera disponible à l'adresse `http://localhost:8000`.
8. **Lancer l'application React** Pour lancer l'application React en mode développement, utilisez : ```bash npm start # ou si vous utilisez yarn yarn start ``` L'application React sera disponible à l'adresse `http://localhost:3000`.