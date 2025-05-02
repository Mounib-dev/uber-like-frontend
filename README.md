1. Cloner le repository
Commencez par cloner le repository Git en utilisant la commande suivante :
git clone https://github.com/Mounib-dev/uber-like-frontend.git
2. Installer les dépendances
Une fois le repository cloné, accède au dossier du front-end et installe toutes les dépendances nécessaires avec la commande suivante :
cd <dossier_du_frontend>
npm install
3. Configurer les variables d’environnement
Crée un fichier .env à la racine du dossier front. Ce fichier contiendra des variables d’environnement importantes pour le fonctionnement de l’application.
contenu du fichier  .env :
VITE_API_GATEWAY='http://localhost:3000/gateway'
4. Démarrer le front-end
Lance l’application front-end avec la commande suivante :

npm run dev
L'application sera alors accessible sur http://localhost:3000 (ou le port configuré).

