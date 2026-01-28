# Correction: Panier vide après ajout de produit

## Problème identifié
Le panier affichait "Produit ajouté au panier" mais restait vide à l'ouverture.

## Cause racine
Les routes du panier dans `backend-express` n'étaient que des **placeholders TODO** :
- `GET /cart` - retournait un message "non implémenté"
- `POST /cart/add` - retournait un message "non implémenté"
- `PUT /cart/item/:productId` - retournait un message "non implémenté"
- `DELETE /cart/item/:productId` - retournait un message "non implémenté"
- `DELETE /cart/clear` - retournait un message "non implémenté"
- `POST /cart/merge` - retournait un message "non implémenté"

## Solution apportée

### 1. Création du modèle Cart (`backend-express/models/Cart.js`)
Modèle MongoDB pour stocker les paniers avec:
- Support des utilisateurs authentifiés (`userId`)
- Support des utilisateurs guests (`guestId`)
- Stockage des articles avec:
  - Référence au produit et à la boutique
  - Quantité, prix, snapshot du produit
  - Date d'ajout

### 2. Implémentation complète des routes (`backend-express/routes/cart.js`)

#### Fonctionnalités implémentées:

1. **GET /cart** - Récupérer le panier
   - Accepte les utilisateurs authentifiés ET les guests
   - Regroupe les articles par boutique
   - Calcule les totaux (sous-total, frais de port, total)
   - Applique les règles de livraison par boutique

2. **POST /cart/add** - Ajouter un article
   - Vérifie que le produit existe et est actif
   - Contrôle le stock disponible
   - Crée ou récupère le panier
   - Augmente la quantité si produit déjà présent
   - Retourne le panier complet mis à jour

3. **PUT /cart/item/:productId** - Mettre à jour la quantité
   - Modifie la quantité d'un article
   - Retourne le panier complet mis à jour

4. **DELETE /cart/item/:productId** - Supprimer un article
   - Supprime un article spécifique
   - Retourne le panier complet mis à jour

5. **DELETE /cart/clear** - Vider le panier
   - Vide tous les articles du panier

6. **POST /cart/merge** - Fusionner panier guest vers utilisateur
   - Après connexion, fusionne le panier du guest dans le panier utilisateur
   - Additionne les quantités pour les mêmes produits/variantes
   - Supprime le panier guest

#### Middleware optionnel
- Créé un middleware `optionalAuth` qui accepte:
  - Les utilisateurs authentifiés (avec token JWT)
  - Les utilisateurs guests (sans token)
- Différent du middleware `auth` standard qui rejette les requêtes sans token

#### Calcul des totaux
La fonction `calculateCartTotals()` :
- Regroupe les articles par boutique
- Calcule le sous-total par boutique
- Applique les frais de port selon la configuration:
  - Livraison gratuite si seuil atteint
  - Frais fixes ou pourcentage
  - Plafonnier max si défini
  - Livraison désactivée = prix configuré
- Retourne structure complète avec `itemsByShop` et totaux

## Impact
✅ Le panier fonctionne maintenant pour:
- Les utilisateurs authentifiés (avec userId)
- Les utilisateurs guests (avec guestId généré côté frontend)
- La synchronisation entre frontend et backend est fonctionnelle
- Les totaux sont calculés correctement par boutique
- Les articles persistent lors de l'ouverture du panier
