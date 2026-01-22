# Architecture des Paniers Multi-Boutiques

## Vue d'ensemble

Le système implémente une architecture de **paniers indépendants par boutique** pour la marketplace multi-vendeurs. Chaque boutique possède son propre panier logique avec calcul séparé des frais de livraison et des totaux.

---

## 🏗️ Architecture Backend

### Schéma Cart (MongoDB)

```typescript
Cart {
  userId?: ObjectId,         // Utilisateur authentifié
  guestId?: string,          // Invité (localStorage)
  
  items: [{
    productId: ObjectId,
    variantId?: ObjectId,
    shopId: ObjectId,         // 🔑 CLÉ: Identifiant de la boutique
    quantity: number,
    price: number,
    productSnapshot: {
      name, image, slug
    }
  }],
  
  subtotal: number,
  totalItems: number,
  lastActivityAt: Date
}
```

**Points clés:**
- Un seul document `Cart` par utilisateur/invité
- Les items contiennent `shopId` pour le regroupement
- Le calcul des totaux sépare automatiquement par boutique

---

### Service: Calcul des Totaux par Boutique

**Méthode:** `calculateCartTotals(cart)`

**Logique:**
1. **Regroupement** - Les items sont regroupés par `shopId`
2. **Calcul par boutique:**
   - Sous-total = Somme des (prix × quantité) des items
   - Frais de livraison selon la config de chaque boutique:
     - `freeShippingThreshold` → Gratuit si seuil atteint
     - `flatRate` → Tarif fixe sinon
     - `maxShippingCost` → Plafond imposé par la plateforme
   - Total boutique = Sous-total + Livraison

3. **Agrégation globale:**
   - Total général = Somme de tous les totaux boutiques
   - Retour structuré avec `itemsByShop[]`

**Structure de retour:**
```typescript
{
  items: CartItem[],              // Tous les items à plat
  itemsByShop: [{
    shopId: string,
    shop: ShopDocument,           // Info boutique complète
    items: [{
      product: ProductDocument,
      variant?: VariantDocument,
      quantity: number,
      price: number,
      subtotal: number
    }],
    subtotal: number,            // Sous-total boutique
    shipping: number,            // Frais livraison boutique
    total: number                // Total boutique
  }],
  totals: {
    subtotal: number,            // Total général
    shipping: number,            // Livraison totale
    total: number,               // Total à payer
    itemCount: number,
    shopCount: number            // Nombre de boutiques
  }
}
```

---

### Création de Commandes

**Service:** `OrdersService.createOrder()`

**Workflow:**
1. Récupération du panier utilisateur
2. **Regroupement automatique par boutique**
3. Création d'une **commande parente** (globale)
4. Pour chaque boutique:
   - Création d'une **sous-commande** (`isSubOrder: true`)
   - Création des `OrderItem` liés
   - Création du `Shipment` séparé
   - Calcul commission plateforme
5. Mise à jour totaux commande parente
6. Vidage du panier

**Résultat:**
```typescript
{
  parentOrder: Order,        // Commande globale (PENDING_PAYMENT)
  subOrders: Order[],        // 1 sous-commande par boutique
  message: string
}
```

---

## 🎨 Architecture Frontend

### Store Zustand: `useCartStore`

**État:**
```typescript
{
  cart: {
    itemsByShop: ShopCart[],
    totals: GlobalTotals
  },
  loading: boolean,
  // ... méthodes
}
```

**Méthodes:**
- `fetchCart()` - Récupère le panier depuis l'API
- `addItem()` - Ajoute un produit (avec guestId pour invités)
- `updateItemQuantity()` - Modifie quantité
- `removeItem()` - Retire un article
- `setCart()` - Met à jour l'état local

---

### Page Panier (`/cart`)

**Design:**

#### 1. Header Dynamique
```
Mon Panier
{shopCount} boutiques • {itemCount} articles
```

#### 2. Alerte Multi-Boutiques
Affichée si `cart.totals.shopCount > 1`:
```
🔵 Paniers indépendants
Vos articles proviennent de X boutiques différentes.
Chaque boutique aura son propre panier et vous effectuerez
un paiement séparé pour chacune.
```

#### 3. Cartes Boutiques
Pour chaque boutique dans `cart.itemsByShop`:

```
┌─────────────────────────────────────────────┐
│ [Logo] BOUTIQUE NAME                        │
│        Panier indépendant          €XX.XX   │
├─────────────────────────────────────────────┤
│ • Produit 1   [- 2 +]  €XX.XX              │
│ • Produit 2   [- 1 +]  €XX.XX              │
├─────────────────────────────────────────────┤
│ Sous-total boutique:          €XX.XX        │
│ 🚚 Livraison:                Gratuite ✓    │
│ ─────────────────────────────────────────   │
│ Total à payer:                €XX.XX        │
└─────────────────────────────────────────────┘
```

#### 4. Récapitulatif Global (Sticky Sidebar)
```
Récapitulatif Global
───────────────────
Boutiques:     X
Articles:      X

Sous-total:    €XXX
Livraison:     €XX
───────────────────
Total Général: €XXX

Paiements séparés par boutique

[Procéder au paiement]
```

---

## 💳 Flux de Paiement

### Étapes

1. **Panier** (`/cart`)
   - Visualisation des paniers séparés
   - Calculs indépendants par boutique
   - Bouton "Procéder au paiement"

2. **Checkout** (`/checkout`)
   - Affichage des sous-commandes
   - Saisie adresse livraison (unique)
   - Choix mode paiement

3. **Paiement Séparé**
   ```
   Pour chaque sous-commande:
     1. Création Payment Intent Stripe
     2. Confirmation paiement
     3. Mise à jour statut commande
     4. Notification vendeur
   ```

4. **Confirmation**
   - Email récapitulatif global
   - Suivi indépendant par boutique

---

## 🔑 Points Clés

### Avantages

✅ **Isolation financière** - Chaque vendeur reçoit uniquement son CA  
✅ **Livraison optimisée** - Frais calculés par boutique  
✅ **Traçabilité** - Suivi séparé des expéditions  
✅ **Flexibilité** - Chaque boutique gère ses politiques de livraison  
✅ **Commission plateforme** - Calculée sur chaque sous-commande  

### Contraintes

⚠️ **UX** - Utilisateur effectue plusieurs paiements si multi-boutiques  
⚠️ **Gestion invités** - `guestId` en localStorage pour paniers anonymes  
⚠️ **Fusion paniers** - Lors de la connexion, fusion guest → user cart  

---

## 📊 Exemple Concret

**Scénario:** Client achète dans 2 boutiques

### Panier Initial
```
Boutique A (Mode):
  - Robe:       €45 × 1 = €45
  - Hijab:      €15 × 2 = €30
  Sous-total:   €75
  Livraison:    Gratuite (seuil €50)
  Total:        €75

Boutique B (Cosmétiques):
  - Crème:      €25 × 1 = €25
  Sous-total:   €25
  Livraison:    €5
  Total:        €30

───────────────────────
Total Général: €105
Boutiques:     2
```

### Commandes Créées

**Commande Parente** (ID: `ORDER-001`)
```
Status:   PENDING_PAYMENT
Subtotal: €100
Shipping: €5
Total:    €105
```

**Sous-Commande 1** (Boutique A)
```
ParentOrderId: ORDER-001
Status:        PENDING_PAYMENT
Subtotal:      €75
Shipping:      €0
Total:         €75
Items:         2
```

**Sous-Commande 2** (Boutique B)
```
ParentOrderId: ORDER-001
Status:        PENDING_PAYMENT
Subtotal:      €25
Shipping:      €5
Total:         €30
Items:         1
```

### Paiements Stripe

1. **Intent 1** (Boutique A): €75 → Stripe → Compte vendeur A
2. **Intent 2** (Boutique B): €30 → Stripe → Compte vendeur B

**Commission plateforme** (20%):
- Boutique A: €75 × 20% = €15
- Boutique B: €30 × 20% = €6

---

## 🚀 API Endpoints

### Cart
```
GET    /cart?guestId=xxx           - Récupérer panier (avec regroupement)
POST   /cart/add                    - Ajouter produit
PUT    /cart/item/:id               - Modifier quantité
DELETE /cart/item/:id               - Retirer produit
DELETE /cart/clear                  - Vider panier
POST   /cart/merge                  - Fusionner guest → user cart
```

### Orders
```
POST   /orders                      - Créer commande (split auto par boutique)
GET    /orders/my-orders            - Commandes client
GET    /orders/:id                  - Détails commande (+ sous-commandes)
GET    /orders/seller/orders        - Commandes vendeur
PUT    /orders/:id/status           - Maj statut (vendeur/admin)
```

---

## 🎯 Design Tokens Utilisés

### Couleurs
- Paniers: `indigo-50/600` (Mode), `rose-50/600` (Cosmétiques)
- Accents: `pink-600`, `gray-900`
- États: `green-600` (gratuit), `red-500` (retirer)

### Border Radius
- Cartes boutiques: `rounded-[2.5rem]` (40px)
- Boutons/inputs: `rounded-xl` (12px)
- CTA: `rounded-full`

### Typographie
- Titres boutiques: `font-black text-xl`
- Prix: `font-black text-indigo-600`
- Labels: `uppercase tracking-widest text-xs`

---

## 📝 Prochaines Améliorations

1. **Paiement groupé optionnel** - Option de payer toutes les boutiques en 1 fois
2. **Coupons par boutique** - Code promo spécifique vendeur
3. **Retrait en point relais** - Par boutique ou global
4. **Notifications push** - Suivi en temps réel par boutique
5. **Dashboard vendeur** - Stats par panier/commande

---

**Date:** 22 janvier 2026  
**Version:** 1.0
