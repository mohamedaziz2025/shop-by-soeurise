# Guide d'installation - Soeurise

## Démarrage Rapide (5 minutes)

### Option 1 : Docker (Recommandé)

1. **Prérequis**
   - Docker Desktop installé
   - Docker Compose installé

2. **Configuration**
   ```bash
   # Copier les variables d'environnement
   cp .env.example .env
   
   # Éditer .env avec vos clés Stripe
   nano .env
   ```

3. **Lancement**
   ```bash
   docker-compose up -d
   ```

4. **Accès**
   - Frontend : http://localhost:3000
   - Backend : http://localhost:4000
   - MongoDB : localhost:27017

### Option 2 : Installation Manuelle

#### Backend

```bash
cd backend

# Installation des dépendances
npm install

# Configuration
cp .env.example .env
nano .env  # Éditer avec vos configurations

# Lancement en mode développement
npm run start:dev
```

#### Frontend

```bash
cd frontend

# Installation des dépendances
npm install

# Configuration
cp .env.local.example .env.local
nano .env.local  # Éditer avec vos configurations

# Lancement en mode développement
npm run dev
```

#### MongoDB (si non Docker)

```bash
# Installation MongoDB (macOS)
brew install mongodb-community

# Démarrage
brew services start mongodb-community

# Ou avec Docker uniquement pour MongoDB
docker run -d -p 27017:27017 --name soeurise-mongodb mongo:7.0
```

## Configuration Stripe

### 1. Créer un compte Stripe Test

1. Allez sur https://dashboard.stripe.com/register
2. Créez un compte (mode Test)

### 2. Récupérer les clés API

1. Dashboard → **Developers** → **API keys**
2. Copiez :
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### 3. Activer Stripe Connect

1. Dashboard → **Connect** → **Settings**
2. Activez **Express accounts**
3. Récupérez le **Client ID** (ca_...)

### 4. Configurer les Webhooks

1. Dashboard → **Developers** → **Webhooks**
2. Cliquez sur **Add endpoint**
3. URL : `http://localhost:4000/api/v1/payments/webhook`
4. Événements :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copiez le **Signing secret** (whsec_...)

### 5. Mettre à jour les .env

**Backend (.env)**
```env
STRIPE_SECRET_KEY=sk_test_votre_cle
STRIPE_WEBHOOK_SECRET=whsec_votre_secret
STRIPE_CONNECT_CLIENT_ID=ca_votre_client_id
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle
```

## Initialisation des Données

### Créer un compte Admin

```bash
# Via l'API directement
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "Soeurise",
    "email": "admin@soeurise.com",
    "password": "Admin123!",
    "role": "ADMIN"
  }'
```

Ou via MongoDB :
```javascript
// Se connecter à MongoDB
mongosh

// Utiliser la base de données
use soeurise

// Mettre à jour l'utilisateur pour le rendre admin
db.users.updateOne(
  { email: "admin@soeurise.com" },
  { $set: { role: "ADMIN" } }
)
```

### Créer des données de test

Vous pouvez utiliser les scripts de seed (à créer) ou ajouter manuellement via l'interface.

## Variables d'Environnement

### Backend (.env)

```env
# Environment
NODE_ENV=development

# Server
PORT=4000
API_PREFIX=api/v1

# Database
MONGODB_URI=mongodb://localhost:27017/soeurise

# JWT
JWT_SECRET=votre-secret-jwt-min-32-caracteres
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=votre-secret-refresh-min-32-caracteres
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...

# Platform
PLATFORM_COMMISSION_RATE=20

# Email (optionnel pour le moment)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=noreply@soeurise.com
MAIL_PASSWORD=your_password
MAIL_FROM=Soeurise <noreply@soeurise.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_DEST=./uploads

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_ENABLE_SELLER_REGISTRATION=true
```

## Vérification de l'installation

### Backend

1. **Healthcheck API**
   ```bash
   curl http://localhost:4000/api/v1/auth/me
   ```

2. **MongoDB**
   ```bash
   mongosh
   use soeurise
   db.users.find()
   ```

### Frontend

1. Ouvrez http://localhost:3000
2. Vérifiez que la page d'accueil s'affiche
3. Testez la connexion

## Dépannage

### Erreur MongoDB

```bash
# Vérifier que MongoDB tourne
docker ps | grep mongodb

# Redémarrer MongoDB
docker restart soeurise-mongodb
```

### Erreur Port déjà utilisé

```bash
# Trouver le processus utilisant le port
lsof -i :4000  # ou :3000

# Tuer le processus
kill -9 <PID>
```

### Erreur Stripe

- Vérifiez que vos clés sont correctes (mode Test)
- Vérifiez que le webhook est configuré
- Testez avec Stripe CLI :
  ```bash
  stripe listen --forward-to localhost:4000/api/v1/payments/webhook
  ```

### Erreur NPM Install

```bash
# Nettoyer le cache
npm cache clean --force

# Supprimer node_modules
rm -rf node_modules package-lock.json

# Réinstaller
npm install
```

## Commandes Utiles

### Docker

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend

# Arrêter tout
docker-compose down

# Supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

### MongoDB

```bash
# Se connecter
mongosh soeurise

# Voir les collections
show collections

# Compter les documents
db.users.count()
db.shops.count()
db.products.count()
```

### Développement

```bash
# Backend - Watch mode
cd backend
npm run start:dev

# Frontend - Dev mode
cd frontend
npm run dev

# Backend - Build
npm run build

# Frontend - Build
npm run build
```

## Prochaines Étapes

1. ✅ Installation terminée
2. 📝 Créer un compte admin
3. 🏪 Créer quelques boutiques de test
4. 📦 Ajouter des produits
5. 🧪 Tester le parcours client complet
6. 💳 Tester le paiement avec les cartes de test Stripe

## Cartes de Test Stripe

```
Carte réussie : 4242 4242 4242 4242
Carte échec : 4000 0000 0000 0002
3D Secure : 4000 0027 6000 3184

Date expiration : n'importe quelle date future
CVC : n'importe quel code 3 chiffres
```

## Support

Si vous rencontrez des problèmes :
1. Consultez les logs : `docker-compose logs -f`
2. Vérifiez les variables d'environnement
3. Contactez l'équipe technique

---

**Installation réussie ! Bienvenue sur Soeurise 🎉**
