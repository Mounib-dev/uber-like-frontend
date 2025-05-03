1. Cloner le repository

Commencez par cloner le repository Git en utilisant la commande suivante :

git clone https://github.com/Mounib-dev/uber-like-frontend.git

2. Installation des dépendances

Une fois le repository cloné, accède au dossier du front-end et installe toutes les dépendances nécessaires avec la commande suivante :

cd <dossier_du_frontend>

npm install

4. Configurer les variables d’environnement

Crée un fichier .env à la racine du dossier front. Ce fichier contiendra des variables d’environnement importantes pour le fonctionnement de l’application.

contenu du fichier .env :
VITE_API_GATEWAY='http://localhost:3000/gateway'

5. Démarrer le front-end

Lance l’application front-end avec la commande suivante :

npm run dev

6. Inscrivez-vous 3 fois, en créant 3 comptes différents

Les adresses mail doivent être différentes

Lorsque vous entrerez un numéro de téléphone, commencez obligatoire par "0" sinon le formulaire restera bloqué

Une fois les 3 inscriptions terminés, vos 3 utilisautes auront le rôle "client", il faudra alors manuellement sur votre base de données modifier le rôle de deux d'entre eux en mettant respectivement les valeurs à "chef" et "livreur", ça doit être exactement ces valeurs sinon l'application ne fonctionnera pas correctement.
