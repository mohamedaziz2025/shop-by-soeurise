# Architecture Soeurise - Marketplace Communautaire Premium

## 🏗️ Vue d'ensemble

Soeurise est une marketplace communautaire multi-vendeurs avec label de confiance, destinée à une communauté de +200 000 femmes musulmanes engagées.

## 📊 Diagramme d'Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Next.js 14+ Frontend (App Router)                 │   │
│  │  - Public Pages (Marketplace, Shops, Products)            │   │
│  │  - Client Dashboard (Orders, Wishlist, Cart)              │   │
│  │  - Seller Dashboard (Products, Orders, Shop Management)   │   │
│  │  - Admin Panel (Shops Validation, Commissions, Ops)       │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API (HTTPS)
                         │ JWT Authentication
┌────────────────────────▼────────────────────────────────────────┐
│                       BACKEND LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              NestJS API (Node.js)                         │   │
│  │                                                            │   │
│  │  Modules:                                                  │   │
│  │  ├─ Auth Module (JWT + Refresh Token)                     │   │
│  │  ├─ Users Module (RBAC: CLIENT/SELLER/ADMIN)              │   │
│  │  ├─ Shops Module (Sous-boutiques multi-vendeurs)          │   │
│  │  ├─ Products Module (+ Variantes)                         │   │
│  │  ├─ Cart Module (Multi-boutiques)                         │   │
│  │  ├─ Orders Module (Split automatique par boutique)        │   │
│  │  ├─ Payments Module (Stripe Connect + Webhooks)           │   │
│  │  ├─ Shipments Module (Livraison par boutique)             │   │
│  │  ├─ Reviews Module (Avis clients)                         │   │
│  │  └─ Admin Module (Operations, Validation, Commissions)    │   │
│  │                                                            │   │
│  │  Services:                                                 │   │
│  │  ├─ Commission Service (20-25% plateforme)                │   │
│  │  ├─ Split Payment Service (Répartition automatique)       │   │
│  │  └─ Notification Service (Email, Webhooks)                │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬──────────────┬─────────────────────────┘
                         │              │
         ┌───────────────▼─┐    ┌──────▼──────────┐
         │    MongoDB      │    │  Stripe Connect │
         │   (Mongoose)    │    │   (Payments)    │
         │                 │    │                 │
         │ Collections:    │    │ - Marketplace   │
         │ - users         │    │ - Split Payouts │
         │ - shops         │    │ - Commissions   │
         │ - products      │    │ - Webhooks      │
         │ - carts         │    └─────────────────┘
         │ - orders        │
         │ - payments      │
         │ - shipments     │
         │ - reviews       │
         │ - payouts       │
         └─────────────────┘
```

## 🔄 Flux de Commande Multi-Boutiques

```
1. CLIENT ajoute produits → PANIER GLOBAL
   ├─ Produit A (Boutique 1)
   ├─ Produit B (Boutique 1)
   └─ Produit C (Boutique 2)

2. CHECKOUT → Split automatique
   ├─ Sous-Commande 1 (Boutique 1: A+B)
   │  ├─ Prix produits: 80€
   │  ├─ Livraison: 5€
   │  └─ Total: 85€
   │
   └─ Sous-Commande 2 (Boutique 2: C)
      ├─ Prix produits: 40€
      ├─ Livraison: 6€
      └─ Total: 46€

3. PAIEMENT UNIQUE via Stripe
   └─ Total: 131€
      │
      ├─→ Commission plateforme (20-25%)
      ├─→ Payout Boutique 1 (75-80% de 85€)
      └─→ Payout Boutique 2 (75-80% de 46€)

4. LIVRAISON indépendante par boutique
   ├─ Boutique 1: gère son expédition
   └─ Boutique 2: gère son expédition
```

## 🗂️ Structure du Projet

```
marketplace-soeurise/
├── logo-soeurise/              # LOGOS OFFICIELS (déjà créé)
│
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── auth/              # Authentification JWT
│   │   ├── users/             # Gestion utilisateurs
│   │   ├── shops/             # Sous-boutiques
│   │   ├── products/          # Produits & variantes
│   │   ├── cart/              # Panier multi-boutiques
│   │   ├── orders/            # Commandes & split
│   │   ├── payments/          # Stripe Connect
│   │   ├── shipments/         # Livraisons
│   │   ├── reviews/           # Avis clients
│   │   ├── admin/             # Administration
│   │   ├── common/            # Guards, Decorators, Pipes
│   │   │   ├── guards/
│   │   │   ├── decorators/
│   │   │   └── pipes/
│   │   ├── config/            # Configuration
│   │   └── schemas/           # Mongoose Schemas
│   ├── test/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js 14+ Frontend
│   ├── src/
│   │   ├── app/               # App Router
│   │   │   ├── (public)/      # Routes publiques
│   │   │   │   ├── page.tsx   # Homepage
│   │   │   │   ├── marketplace/
│   │   │   │   ├── categories/
│   │   │   │   ├── shops/[slug]/
│   │   │   │   └── product/[slug]/
│   │   │   │
│   │   │   ├── (auth)/        # Routes authentifiées
│   │   │   │   ├── account/
│   │   │   │   ├── orders/
│   │   │   │   ├── wishlist/
│   │   │   │   ├── cart/
│   │   │   │   └── checkout/
│   │   │   │
│   │   │   ├── seller/        # Dashboard vendeuse
│   │   │   │   ├── dashboard/
│   │   │   │   ├── products/
│   │   │   │   ├── orders/
│   │   │   │   └── settings/
│   │   │   │
│   │   │   └── admin/         # Admin panel
│   │   │       ├── dashboard/
│   │   │       ├── shops/
│   │   │       ├── commissions/
│   │   │       └── operations/
│   │   │
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── ui/           # Shadcn components
│   │   │   ├── layout/       # Header, Footer
│   │   │   ├── marketplace/  # Product cards, filters
│   │   │   └── cart/         # Cart components
│   │   │
│   │   ├── lib/              # Utilitaires
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   │
│   │   └── store/            # State management (Zustand)
│   │       ├── auth.ts
│   │       ├── cart.ts
│   │       └── user.ts
│   │
│   ├── public/
│   │   └── logo-soeurise/    # Logos (symlink ou copie)
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── docker-compose.yml         # Orchestration complète
└── README.md                  # Documentation principale
```

## 🔐 Sécurité & RBAC

### Rôles
- **CLIENT**: Achète des produits, gère ses commandes
- **SELLER**: Gère sa boutique, produits, commandes, livraisons
- **ADMIN**: Valide boutiques, gère commissions, supervise

### Guards NestJS
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SELLER', 'ADMIN')
```

## 💳 Système de Paiement

### Stripe Connect (Marketplace)
1. **Onboarding vendeur**: Création compte Stripe Connect
2. **Paiement client**: Charge unique sur compte plateforme
3. **Split automatique**: Répartition vers comptes vendeurs
4. **Commission**: 20-25% prélevée automatiquement
5. **Payout**: Transfert aux vendeurs selon planning

## 📦 Règles Métier

### Livraison
- Chaque boutique gère sa propre livraison
- Frais plafonnés (à définir par admin)
- Livraison gratuite dès X€ par boutique
- Délais max par marque

### Validation Boutiques
- Soumission dossier par vendeuse
- Validation manuelle par admin
- Critères qualité & éthique
- Suspension possible si non-conformité

### Commissions
- Configurable par admin (20-25%)
- Application automatique sur chaque vente
- Transparente pour vendeurs
- Reportable en temps réel

## 🚀 Déploiement

### Docker
```bash
docker-compose up -d
```

### Services
- **Frontend**: Port 3000
- **Backend**: Port 4000
- **MongoDB**: Port 27017

## 📈 Scalabilité

- Architecture modulaire NestJS
- Composants React réutilisables
- Base MongoDB indexée
- Cache Redis (optionnel)
- CDN pour assets statiques
- Rate limiting API
- Monitoring & logs

## 🎯 Positionnement

**Premium • Communautaire • Éthique • Label de confiance**

- Ciblage communauté féminine musulmane engagée
- Sélection rigoureuse des marques
- Transparence totale
- Expérience utilisateur premium
- Support client dédié
