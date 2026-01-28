# Vérification du Cart et de l'Affichage des Produits

## Problèmes Identifiés

### 1. **Affichage des images en détail produit** ✅ CORRIGÉ
**Location:** `frontend/src/app/product/[slug]/page.tsx`
**Problème résolu:** 
- ✅ Ajout de la fonction `getImageUrl()` (ligne 105-110)
- ✅ Remplacement de `Next.js Image` par `<img>` natif
- ✅ Ajout du gestionnaire d'erreur `onError` pour les images cassées
- ✅ Support des URLs relatives et absolues

**Changements:**
```tsx
const getImageUrl = (img: string | undefined) => {
  if (!img) return '/placeholder-product.png';
  if (img.startsWith('http')) return img;
  return `http://72.62.71.97:3001${img}`;
};

<img
  src={getImageUrl(product?.images?.[selectedImage])}
  alt={product?.name || 'Produit'}
  className="w-full h-full object-cover"
  onError={(e) => {
    (e.target as HTMLImageElement).src = '/placeholder-product.png';
  }}
/>
```

---

### 2. **Cart - Gestion d'images** ✅ CORRIGÉ
**Location:** `frontend/src/app/cart/page.tsx` (ligne 171-180)
**Problème résolu:**
- ✅ Remplacement de `Next.js Image` par `<img>` natif
- ✅ Ajout de la logique URL avec `API_BASE`
- ✅ Support URLs relatives ET absolutes
- ✅ Fallback pour images cassées

**Changements:**
```tsx
<img
  src={
    item.product.mainImage
      ? item.product.mainImage.startsWith('http')
        ? item.product.mainImage
        : `${API_BASE}${item.product.mainImage}`
      : '/placeholder-product.png'
  }
  alt={item.product.name}
  className="w-full h-full object-cover"
  onError={(e) => {
    (e.target as HTMLImageElement).src = '/placeholder-product.png';
  }}
/>
```

---

### 3. **ProductCard - Images** ✅ FONCTIONNEL
**Location:** `frontend/src/components/ProductCard.tsx`
**Problème:** Gère `imageError` mais seulement affiche un emoji
**Détails:**
- Ligne 85-92: Affiche juste "📦" en cas d'erreur
- Meilleure UX serait d'afficher initiales ou couleur

**Solution proposée:**
- Utiliser un gradient avec initiales du produit/shop en fallback

---

### 4. **Processus d'ajout au cart**
**Vérification:** ✅ CORRECT
**Détails vérifiés:**
- `frontend/src/store/cart.ts`: `addItem()` appelle correctement `api.addToCart()`
- `frontend/src/lib/api.ts` ligne 268: Endpoint `/cart/add` correct
- `frontend/src/components/ProductCard.tsx` ligne 51: Redirection vers détail produit si variantes
- `frontend/src/app/product/[slug]/page.tsx` ligne 90: Appelle `addItem()` avec tous les paramètres

**Points positifs:**
✅ Gère guestId automatiquement via localStorage
✅ Supporte variantes et quantités
✅ Refresh le cart après ajout

---

### 5. **API Backend - Cart Routes**
**Vérification:** ✅ À vérifier avec backend-express
**À vérifier:**
- Route POST `/api/cart/add` - Valide productId existe
- Route GET `/api/cart` - Retourne structure correcte `{ items, itemsByShop, totals }`
- Route PUT `/api/cart/item/:productId` - Met à jour quantité
- Route DELETE `/api/cart/item/:productId` - Supprime item

---

## Résumé des Actions Requises

### Critique (Fonctionnalité cassée)
1. **FIX Cart images** - Utiliser bon champ image et ajouter gestion d'erreur
2. **FIX Product detail images** - Ajouter gestion d'erreur et URL prefix

### Important (UX)
3. Améliorer fallback images (initiales au lieu d'emoji)
4. Ajouter feedback utilisateur lors d'ajout au cart
5. Vérifier messages d'erreur dans les formulaires

### À valider avec backend
- Structure réponse API cart
- Champs de produit retournés (mainImage vs images vs image)
- Gestion variantes dans cart

---

## Tests Recommandés

```bash
# Test 1: Ajouter produit simple sans variante au cart
curl -X POST http://72.62.71.97:3001/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"productId":"<ID>","quantity":1,"guestId":"test123"}'

# Test 2: Vérifier contenu cart
curl -X GET "http://72.62.71.97:3001/api/cart?guestId=test123"

# Test 3: Vérifier structure produit avec images
curl -X GET "http://72.62.71.97:3001/api/products/<ID>"
```

---

## Fichiers à modifier

1. ✏️ `frontend/src/app/cart/page.tsx` - Ligne ~168
2. ✏️ `frontend/src/app/product/[slug]/page.tsx` - Ligne ~150-160
3. ✏️ `frontend/src/components/ProductCard.tsx` - Ligne ~85-92 (fallback amélioration)
