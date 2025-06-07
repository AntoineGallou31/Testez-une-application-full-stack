# Projet Yoga

Application de réservation pour des sessions de Yoga.

Objectif: créer des tests unitaires, d'intégration et end-to-end pour cette application avec une couverture de 80%.

# Technologies

- Java 11
- Angular 14.1.0
- MySql

Tests Back:
- JUnit
- Mockito
- Jacoco

Tests Front:
- Cypress
- Jest


# Outils

- VsCode pour le Front
- IntelliJ pour le back
- Postman pour tester les API
- MySql pour la bdd


## Installer le projet

- Cloner le projet : > git clone https://github.com/nousseibak/yoga.git
- Ouvrir MySql, créer la table yoga
- Insérer les données dans cette table avec le script qui se trouve dans : `ressources/sql/script.sql`
- Dans Postman, importer la collection qui se trouve ici:  ressources/postman/yoga.postman_collection.json


## Démarrer le projet

Pour le front, ouvrir le dossier front :

- Installer les dépendences avec: > npm install
- Lancer le Front-end: > npm run start;

Pour le Back, ouvrir le dossier back :

- Modifier le fichier properties avec les informations de la base de donnée
- Installer les dépendances : > mvn clean install
- Lancer le projet

Pour tester les fonctionnalités de l'application:

- Ouvrir un navigateur et aller à l'adresse : http://localhost:4200/

Compte admin par défaut pour tester l'application :
- login: yoga@studio.com
- password: test!1234


## Tests

#### E2E

- Lancer les tests e2e : > npm run e2e
- Cypress s'ouvre, choisir un navigateur et lancer le fichier all.cy.ts
- Generer le coverage report (lancer les tests e2e d'abord): > npm run e2e:coverage
- Le rapport est disponible ici : > front/coverage/lcov-report/index.html

#### Tests Unitaires

Pour le front:

- Lancer les tests: > npm run test
- En cas de modification des tests, pour suivre les modifs: > npm run test:watch
- Générer le rapport de couverture: npm test -- --coverage
- Le rapport se trouve dans le dossier: front/coverage/jest/lcov-report/index.html


Pour le back:

- Lancer les tests: mvn  clean test
- Le rapport généré avec jacoco se trouve dans le dossier: target/site/jacoco/index.html
