# HRnet

HRnet est une application de gestion des ressources humaines développée avec React, TypeScript et Vite. Elle permet de gérer les employés, leurs informations et leurs départements.

## Installation

Pour installer le projet, suivez les étapes ci-dessous :

1. Clonez le dépôt :

   ```sh
   git clone https://github.com/oHminod/HRNet.git
   ```

2. Accédez au répertoire du projet :

   ```sh
   cd HRnet
   ```

3. Installez les dépendances :

   ```sh
   npm install
   ```

4. Démarrez le serveur de développement :
   ```sh
   npm run dev
   ```

## Utilisation

### Composants principaux

- `DatePicker`: Un composant de sélection de date.
- `Select`: Un composant de sélection personnalisé.
- `Header`: Le composant d'en-tête de l'application.
- `Layout`: Le composant de mise en page principale.

### Hooks

- `useEmployees`: Un hook pour gérer les employés.
- `useLocalStorage`: Un hook pour gérer le stockage local.

### Pages

- `HomePage`: La page d'accueil pour créer un nouvel employé.
- `EmployeesPage`: La page pour afficher et gérer les employés existants.

### Utilitaires

- `data.ts`: Contient les listes de départements et d'états.
- `employeesContext.tsx`: Fournit le contexte pour les employés.
- `routes.tsx`: Définit les routes de l'application.

## Déploiement

Pour construire le projet pour la production, exécutez :

```sh
npm run build
```

Pour prévisualiser le projet avant de le déployer, exécutez :

```sh
npm run preview
```
