# Système CRM - Soeurise Marketplace

## Vue d'ensemble

Le système CRM (Customer Relationship Management) de Soeurise offre des tableaux de bord complets pour les administrateurs et les vendeuses, avec des fonctionnalités avancées d'analytics, de gestion, et de suivi des performances.

## 🔐 Authentification Admin

### Page de login sécurisée
- **URL**: `/admin/login`
- **Sécurité**: Vérification du rôle ADMIN
- **Design**: Interface sécurisée avec thème dark
- **Redirection**: Automatique vers `/admin/dashboard` après connexion

### Accès
```
Email: admin@soeurise.com
```
Seuls les utilisateurs avec le rôle `ADMIN` peuvent accéder au panel administrateur.

---

## 📊 Dashboard Admin CRM

### URL
`/admin/dashboard`

### Fonctionnalités principales

#### 1. Vue d'ensemble (KPIs)
- **Revenus totaux**: Montant des ventes avec tendance
- **Utilisateurs**: Nombre total avec nouveaux utilisateurs du mois
- **Boutiques actives**: Statut et boutiques en attente
- **Commissions**: Revenus de la plateforme

#### 2. Métriques détaillées
- Taux de conversion
- Panier moyen
- Produits actifs
- Progression par rapport aux périodes précédentes

#### 3. Analytics visuels
- **Graphique des ventes**: Revenus par jour/semaine
- **Catégories populaires**: Distribution par catégorie
- Charts interactifs avec SimpleBarChart

#### 4. Gestion des approbations
- Boutiques en attente de validation
- Produits à approuver
- Actions rapides (Valider/Rejeter)

#### 5. Activité récente
- Nouvelles commandes
- Inscriptions utilisateurs
- Création de boutiques
- Ajout de produits
- Timeline en temps réel

#### 6. Actions rapides
- Créer un utilisateur
- Valider des boutiques
- Approuver des produits
- Générer des rapports

#### 7. Navigation
- **Dashboard**: Vue d'ensemble
- **Analytics**: Statistiques détaillées
- **Utilisateurs**: Gestion des comptes
- **Boutiques**: Gestion des shops
- **Produits**: Catalogue
- **Commandes**: Suivi des ventes
- **Commissions**: Rapports financiers
- **Paramètres**: Configuration

### API Endpoints (Admin)

```typescript
// Statistiques dashboard
GET /admin/dashboard/stats
Response: {
  totalUsers: number;
  totalShops: number;
  totalProducts: number;
  totalOrders: number;
  pendingShops: number;
  pendingProducts: number;
  monthlyRevenue: number;
  monthlyCommission: number;
  newUsersThisMonth: number;
  pendingOrders: number;
}

// Ventes par période
GET /admin/sales/stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

// Top boutiques
GET /admin/shops/top?limit=10

// Top produits
GET /admin/products/top?limit=10

// Boutiques en attente
GET /admin/shops/pending

// Produits en attente
GET /admin/products/pending

// Utilisateurs récents
GET /admin/users/recent?limit=20

// Commandes récentes
GET /admin/orders/recent?limit=20

// Rapport des commissions
GET /admin/commissions/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

---

## 💼 Dashboard Seller CRM

### URL
`/seller/dashboard`

### Fonctionnalités principales

#### 1. KPIs Vendeur
- **Ventes du mois**: Revenus avec nombre de commandes
- **Commandes en attente**: À traiter
- **Produits actifs**: Inventaire
- **Note moyenne**: Satisfaction client avec nombre d'avis

#### 2. Métriques détaillées
- Taux de conversion
- Visiteurs uniques
- Panier moyen
- Clients récurrents

#### 3. Analytics visuels
- **Revenus par semaine**: Évolution des ventes
- **Statut des commandes**: Distribution par état
  - ✅ Livrées
  - ⏰ En cours
  - ⚠️ À traiter
  - ❌ Annulées

#### 4. Commandes récentes
- Liste détaillée avec statuts
- Montants et clients
- Actions rapides (Voir détails)

#### 5. Produits les plus vendus
- Top 5 produits avec classement
- Nombre de ventes
- Revenus par produit

#### 6. Aperçu clients
- Clients totaux
- Taux de clients fidèles
- Satisfaction moyenne

#### 7. Actions rapides
- Ajouter un produit
- Traiter les commandes
- Gérer le stock
- Voir les rapports

#### 8. Navigation
- **Dashboard**: Vue d'ensemble
- **Produits**: Gestion catalogue
- **Commandes**: Suivi des ventes
- **Clients**: Base de données client
- **Analytics**: Rapports détaillés
- **Paramètres**: Configuration boutique

### API Endpoints (Seller)

```typescript
// Statistiques vendeur
GET /shops/seller/stats
Response: {
  revenue: number;
  ordersCount: number;
  activeProducts: number;
  totalProducts: number;
  averageRating: number;
  totalReviews: number;
  pendingOrders: number;
  inProgressOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  topProducts: Product[];
  recentOrders: Order[];
  totalCustomers: number;
  returningCustomers: number;
}

// Ma boutique
GET /shops/seller/my-shop

// Mettre à jour ma boutique
PUT /shops/seller/my-shop
```

---

## 🎨 Composants CRM Réutilisables

### StatCard
Carte de statistique avec gradient et tendance
```tsx
<StatCard
  title="Revenus totaux"
  value={formatPrice(15000)}
  subtitle="150 commandes"
  icon={<DollarSign />}
  trend={{ value: '+15.3%', isPositive: true }}
  color="green"
/>
```

### SimpleBarChart
Graphique en barres simple
```tsx
<SimpleBarChart
  data={[
    { label: 'Lun', value: 1200 },
    { label: 'Mar', value: 1800 },
  ]}
  height={250}
  color="#3b82f6"
/>
```

### DataTable
Tableau de données
```tsx
<DataTable
  headers={['Nom', 'Email', 'Statut']}
  rows={[
    ['John Doe', 'john@example.com', <StatusBadge status="Actif" type="success" />]
  ]}
  emptyMessage="Aucune donnée"
/>
```

### StatusBadge
Badge de statut coloré
```tsx
<StatusBadge status="Actif" type="success" />
<StatusBadge status="En attente" type="warning" />
<StatusBadge status="Erreur" type="error" />
```

### MetricCard
Carte de métrique avec progression
```tsx
<MetricCard
  title="Taux de conversion"
  value="3.24%"
  change={12.5}
  icon={<TrendingUp />}
/>
```

---

## 🔧 Configuration

### Frontend (Next.js)

#### Structure des fichiers
```
frontend/src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          # Login admin
│   │   └── dashboard/
│   │       └── page.tsx          # Dashboard admin
│   └── seller/
│       └── dashboard/
│           └── page.tsx          # Dashboard seller
├── components/
│   └── CRMComponents.tsx         # Composants réutilisables
└── lib/
    └── api.ts                    # API client
```

### Backend (NestJS)

#### Structure des modules
```
backend/src/
├── admin/
│   ├── admin.controller.ts
│   ├── admin.service.ts          # Stats et analytics admin
│   └── admin.module.ts
├── shops/
│   ├── shops.controller.ts
│   ├── shops.service.ts          # Stats vendeur
│   └── shops.module.ts
└── auth/
    ├── auth.controller.ts
    └── auth.service.ts           # Authentification
```

---

## 🚀 Utilisation

### Pour les administrateurs

1. **Se connecter**
   ```
   Aller sur: /admin/login
   Entrer les credentials admin
   ```

2. **Accéder au dashboard**
   - Vue d'ensemble automatique
   - KPIs en temps réel
   - Actions rapides disponibles

3. **Gérer la plateforme**
   - Valider les boutiques
   - Approuver les produits
   - Suivre les commissions
   - Générer des rapports

### Pour les vendeuses

1. **Se connecter**
   ```
   Aller sur: /login
   Se connecter avec un compte SELLER
   Redirection auto vers /seller/dashboard
   ```

2. **Utiliser le CRM**
   - Suivre les ventes en temps réel
   - Gérer les commandes
   - Analyser les performances
   - Optimiser le catalogue

---

## 📈 Fonctionnalités Analytics

### Filtres temporels
- 7 derniers jours
- 30 derniers jours
- 90 derniers jours
- 1 an

### Export de données
- Bouton "Exporter" disponible
- Format CSV/Excel
- Rapports personnalisables

### Notifications
- Alertes en temps réel
- Badge de notifications
- Centre de notifications

---

## 🎯 Prochaines améliorations

### Admin
- [ ] Gestion avancée des utilisateurs (CRUD complet)
- [ ] Tableau des commissions détaillé
- [ ] Système de notifications push
- [ ] Chat support intégré
- [ ] Rapports PDF automatiques

### Seller
- [ ] Inventaire intelligent avec alertes stock
- [ ] Gestion des promotions
- [ ] Messages clients
- [ ] Analytics avancés (Google Analytics intégration)
- [ ] Recommandations AI pour optimiser les ventes

---

## 🐛 Débogage

### Problèmes courants

**Admin ne peut pas se connecter**
- Vérifier le rôle de l'utilisateur dans la base de données
- S'assurer que `user.role === 'ADMIN'`

**Stats ne se chargent pas**
- Vérifier la connexion API
- Vérifier les tokens JWT
- Consulter les logs du backend

**Graphiques ne s'affichent pas**
- Vérifier que les données sont au bon format
- S'assurer que les valeurs sont numériques

---

## 📝 Notes techniques

### Sécurité
- Routes protégées par JWT
- Guards de rôles (ADMIN, SELLER)
- Vérification côté backend et frontend

### Performance
- Lazy loading des données
- Pagination des listes
- Cache des statistiques (TODO)

### Responsive
- Desktop first
- Tablette supportée
- Mobile adaptatif

---

## 🤝 Support

Pour toute question ou problème, contactez l'équipe technique.

---

**Version**: 1.0.0  
**Date**: Janvier 2026  
**Auteur**: Équipe Soeurise
