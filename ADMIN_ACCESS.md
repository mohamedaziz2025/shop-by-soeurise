# Accès Admin Par Défaut

Un utilisateur administrateur par défaut a été créé pour faciliter l'accès initial au système.

## Informations de Connexion

- **Email** : `admin@soeurise.com`
- **Mot de passe** : `Admin123!`

## Comment utiliser

1. **Démarrer le serveur backend** :
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Démarrer le serveur frontend** :
   ```bash
   cd frontend
   npm run dev
   ```

3. **Se connecter** :
   - Aller sur `http://localhost:3000/login`
   - Utiliser les identifiants admin ci-dessus
   - Après connexion, accéder au dashboard admin via `http://localhost:3000/admin/dashboard`

## Sécurité

⚠️ **Important** : Veuillez changer ce mot de passe après la première connexion !

## Créer un nouvel admin (si nécessaire)

Si vous devez recréer l'admin ou créer un autre compte admin :

```bash
cd backend
npm run seed:admin
```

Le script vérifiera automatiquement s'il existe déjà un admin et n'en créera pas de nouveau si c'est le cas.

## Fonctionnalités Admin

L'utilisateur admin a accès à :
- Dashboard avec statistiques globales
- Gestion des utilisateurs
- Gestion des boutiques
- Gestion des produits
- Gestion des commandes
- Gestion des paiements
- Paramètres système