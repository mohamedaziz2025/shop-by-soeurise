# Soeurise - Marketplace Communautaire Premium

![Soeurise Logo](./logo-soeurise/logo-main.png)

## 🚨 PROBLÈME DE DESIGN ? Lisez ceci en premier !

### Le site apparaît en noir et blanc ?

**Solution rapide :**
1. **Redémarrez le serveur frontend** :
   ```bash
   cd frontend
   # Arrêtez avec Ctrl+C puis :
   npm run dev
   ```

2. **Vérifiez la page de test** : http://localhost:3000/test
   - Si les couleurs s'affichent → problème résolu
   - Si toujours noir/blanc → continuez

3. **Vérifiez PostCSS** :
   ```javascript
   // postcss.config.js doit contenir :
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

4. **Copiez les logos** dans `frontend/public/logo-soeurise/` :
   - `logo_soeurise-removebg-preview.png`
   - `logo_soeurise.jpg`

### Couleurs du thème :
- 🟢 **Vert Émeraude** (#059669) - Principal
- 🩷 **Rose Magenta** (#db2777) - Communauté
- 🔵 **Bleu Indigo** (#2563eb) - Shopping
- ⚫ **Gris foncé** (#111827) - Footer

---

## 🎯 Vue d'ensemble

Soeurise est une marketplace communautaire multi-vendeurs premium destinée à une communauté de +200 000 femmes musulmanes engagées. La plateforme propose un **label de confiance** avec des sous-boutiques indépendantes, un système de paiement split automatique via Stripe Connect, et une gestion complète des commandes multi-boutiques.

## ✨ Fonctionnalités principales

### Pour les Clientes
- 🛍️ Parcourir une marketplace de produits premium sélectionnés
- 🛒 Panier multi-boutiques intelligent avec calcul automatique des frais de livraison
- 💳 Paiement unique pour plusieurs boutiques via Stripe
- 📦 Suivi des commandes et livraisons par boutique
- ⭐ Système d'avis et de notation
- 💝 Liste de souhaits
- 📱 Interface responsive et moderne

### Pour les Vendeuses
- 🏪 Création et gestion de sous-boutique personnalisée
- 📊 Dashboard de vente complet avec statistiques
- 📦 Gestion des produits et variantes
- 🚚 Gestion des expéditions et livraisons
- 💰 Réception automatique des paiements via Stripe Connect
- 📈 Suivi des commissions et revenus

### Pour les Administrateurs
- 👥 Validation et modération des boutiques
- ✅ Approbation des produits
- 📊 Dashboard global avec métriques
- 💸 Gestion des commissions (20-25% configurable)
- 🔍 Supervision des opérations
- 📈 Rapports détaillés

## 🏗️ Architecture Technique

### Backend (NestJS)
```
backend/
├── src/
│   ├── auth/              # Authentification JWT + Refresh Token
│   ├── users/             # Gestion utilisateurs (CLIENT/SELLER/ADMIN)
│   ├── shops/             # Sous-boutiques multi-vendeurs
│   ├── products/          # Produits + Variantes
│   ├── cart/              # Panier multi-boutiques
│   ├── orders/            # Commandes + Split automatique
│   ├── payments/          # Stripe Connect + Webhooks
│   ├── shipments/         # Livraisons par boutique
│   ├── reviews/           # Avis clients
│   ├── admin/             # Administration
│   ├── common/            # Guards, Decorators, Pipes
│   └── schemas/           # MongoDB Schemas (Mongoose)
```

### Frontend (Next.js 14)
```
frontend/
├── src/
│   ├── app/
│   │   ├── (public)/      # Pages publiques
│   │   ├── (auth)/        # Pages client
│   │   ├── seller/        # Dashboard vendeuse
│   │   └── admin/         # Admin panel
│   ├── components/        # Composants réutilisables
│   ├── lib/              # Utilitaires & API client
│   └── store/            # State management (Zustand)
```

### Base de données (MongoDB)
- User & SellerProfile
- Shop (sous-boutiques)
- Product & ProductVariant
- Cart
- Order & OrderItem
- Payment & Payout
- Shipment
- Review

## 🚀 Installation & Lancement

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- MongoDB (ou via Docker)
- Compte Stripe (mode test ou production)

### 1. Clone du projet
```bash
git clone <repository-url>
cd marketplace-soeurise
```

### 2. Configuration des variables d'environnement

Copier les fichiers d'exemple :
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Éditer les fichiers avec vos clés Stripe et autres configurations.

### 3. Lancement avec Docker (Recommandé)

```bash
docker-compose up -d
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend API : http://localhost:4000
- MongoDB : localhost:27017

### 4. Lancement en mode développement

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

### Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Déconnexion

### Shops
- `GET /api/v1/shops` - Liste des boutiques
- `GET /api/v1/shops/slug/:slug` - Détails d'une boutique
- `POST /api/v1/shops` - Créer une boutique (SELLER)
- `PUT /api/v1/shops/seller/my-shop` - Modifier sa boutique

### Products
- `GET /api/v1/products` - Liste des produits
- `GET /api/v1/products/slug/:slug` - Détails d'un produit
- `POST /api/v1/products` - Créer un produit (SELLER)
- `PUT /api/v1/products/:id` - Modifier un produit

### Cart
- `GET /api/v1/cart` - Récupérer le panier
- `POST /api/v1/cart/add` - Ajouter au panier
- `PUT /api/v1/cart/item/:productId` - Modifier quantité
- `DELETE /api/v1/cart/item/:productId` - Retirer du panier

### Orders
- `POST /api/v1/orders` - Créer une commande
- `GET /api/v1/orders/my-orders` - Mes commandes
- `GET /api/v1/orders/:id` - Détails d'une commande

### Payments
- `POST /api/v1/payments/create-intent` - Créer un Payment Intent
- `POST /api/v1/payments/webhook` - Webhook Stripe
- `POST /api/v1/payments/connect/create` - Créer compte Stripe Connect (SELLER)

## 💳 Configuration Stripe

### 1. Créer un compte Stripe

Allez sur [stripe.com](https://stripe.com) et créez un compte.

### 2. Activer Stripe Connect

1. Tableau de bord Stripe → **Connect**
2. Activez **Express** (comptes connectés simplifiés)
3. Récupérez votre **Client ID**

### 3. Configurer les clés

Dans vos fichiers `.env` :
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Webhooks

Configurez un webhook sur :
```
https://votre-domaine.com/api/v1/payments/webhook
```

Événements à écouter :
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

## 🎨 Logos & Branding

Tous les logos officiels de la marque Soeurise sont dans le dossier :
```
logo-soeurise/
├── logo-main.png
├── logo-white.png
└── favicon.ico
```

Ces logos sont utilisés dans :
- Header & Footer du frontend
- Emails transactionnels
- Documents PDF (factures, etc.)

## 📊 Système de Commissions

La plateforme prélève automatiquement une commission sur chaque vente :
- **Taux par défaut** : 20-25% (configurable dans `.env`)
- **Application automatique** lors du split de paiement
- **Transparence totale** pour les vendeurs
- **Rapports détaillés** dans l'admin

### Exemple de Split

Pour une commande de 100€ avec commission de 20% :
```
Total client : 100€
├─ Commission plateforme : 20€
└─ Payout vendeur : 80€
```

## 🚚 Gestion des Livraisons

Chaque boutique gère ses propres livraisons :
- **Tarif plafonné** par la plateforme
- **Livraison gratuite** configurable (dès X€)
- **Délais estimés** par boutique
- **Tracking** via transporteur
- **Statuts** : PENDING → PREPARING → SHIPPED → DELIVERED

## 🔒 Sécurité

- ✅ JWT Authentication avec Refresh Token
- ✅ RBAC (Role-Based Access Control)
- ✅ Rate Limiting
- ✅ Validation des DTO
- ✅ Protection CSRF
- ✅ HTTPS obligatoire en production
- ✅ Logs des actions sensibles
- ✅ RGPD-ready

## 📈 Scalabilité

- Architecture modulaire NestJS
- MongoDB indexé pour performance
- Composants React réutilisables
- Cache possible (Redis)
- CDN pour assets statiques
- Déploiement Docker
- Monitoring & alertes

## 🧪 Tests

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## 📝 Règles Métier

### Validation des Boutiques
- Soumission d'un dossier complet
- Validation manuelle par admin
- Critères : qualité, éthique, conformité
- Suspension possible si non-conformité

### Commissions
- 20-25% sur chaque vente
- Configurable par admin
- Application automatique
- Visible dans les rapports

### Livraison
- Chaque boutique gère sa livraison
- Frais plafonnés par la plateforme
- Livraison gratuite dès seuil défini
- Délais max par marque

## 🤝 Contribution

Ce projet est propriétaire et destiné à usage interne. Pour toute question ou amélioration, contactez l'équipe technique.

## 📄 Licence

Propriétaire - Tous droits réservés © 2026 Soeurise

## 📞 Support

- Email : support@soeurise.com
- Documentation API : http://localhost:4000/api/docs (en développement)
- Slack : #team-tech

---

**Fait avec ❤️ pour la communauté Soeurise**
