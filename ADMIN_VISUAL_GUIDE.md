# 🎨 Admin Panel - Visual Navigation Guide

## Admin Dashboard Navigation Map

```
┌─────────────────────────────────────────────────────┐
│  ADMIN DASHBOARD                                    │
│  ├── Dashboard Overview                             │
│  │   ├── Stats Cards (Users, Shops, Products)      │
│  │   ├── Pending Approvals Section                 │
│  │   ├── Recent Orders                             │
│  │   └── Top Products                              │
│  │                                                  │
│  ├── 👥 Users Management                           │
│  │   ├── /admin/users (List & Search)              │
│  │   └── /admin/users/create ✨ NEW                │
│  │       ├── Form: firstName, lastName, email      │
│  │       ├── password (min 8 chars)               │
│  │       ├── phone, role, status selectors        │
│  │       └── Submit → Success redirect            │
│  │                                                  │
│  ├── 🏪 Shops Management                           │
│  │   ├── /admin/shops (List & Search)              │
│  │   └── /admin/shops/create ✨ NEW                │
│  │       ├── Form: name, description               │
│  │       ├── logo upload (with preview)           │
│  │       ├── categories (multi-select)             │
│  │       ├── shippingPrice (MANDATORY)            │
│  │       ├── phone, address, city, postal code     │
│  │       ├── country, returnPolicy                │
│  │       └── Submit → Success redirect            │
│  │                                                  │
│  ├── 📦 Products Management                        │
│  │   ├── /admin/products (List & Search)           │
│  │   └── /admin/products/create ✨ NEW             │
│  │       ├── Form: name, description               │
│  │       ├── price, stock, category                │
│  │       ├── slug (auto-generated)                │
│  │       ├── metaDescription (max 160 chars)      │
│  │       ├── images upload (multiple, preview)     │
│  │       ├── variants (dynamic add/remove)         │
│  │       └── Submit → Success redirect            │
│  │                                                  │
│  ├── 🛍️ Orders Management                          │
│  │   └── /admin/orders                             │
│  │                                                  │
│  ├── 📊 Analytics                                  │
│  │   └── /admin/analytics                          │
│  │                                                  │
│  └── ⚙️ Settings                                   │
│      └── /admin/settings                           │
└─────────────────────────────────────────────────────┘
```

---

## 📱 Page Layouts

### List Pages Layout

```
┌────────────────────────────────────────────┐
│  📌 Sticky Header                          │
│  ├── Page Title & Subtitle                 │
│  ├── Search Bar                            │
│  └── Notifications & Profile               │
├────────────────────────────────────────────┤
│  📋 Content Area (Scrollable)              │
│  ├── Search & Filter Section               │
│  │   ├── Search Input                      │
│  │   ├── Status Filter                     │
│  │   ├── Category Filter                   │
│  │   └── [Create Button] ✨ NEW            │
│  │                                         │
│  ├── List/Grid of Items                    │
│  │   ├── Item 1 with Actions               │
│  │   ├── Item 2 with Actions               │
│  │   └── Item N with Actions               │
│  │                                         │
│  └── Pagination (if needed)                │
└────────────────────────────────────────────┘
```

### Create Pages Layout

```
┌────────────────────────────────────────────┐
│  📌 Sticky Header                          │
│  ├── Page Title "Créer un [Resource]"      │
│  ├── Page Subtitle                         │
│  └── Notifications & Profile               │
├────────────────────────────────────────────┤
│  📝 Content Area (Scrollable)              │
│  ├── [← Back Button]                       │
│  │                                         │
│  ├── [Error Alert] (if any)                │
│  │  ⚠️ Message                             │
│  │                                         │
│  ├── Form Card                             │
│  │  ├── Section 1: Basic Info              │
│  │  │   ├── [Input Field]                  │
│  │  │   ├── [Textarea Field]               │
│  │  │   └── [File Upload] (if applicable)  │
│  │  │                                      │
│  │  ├── Section 2: Details                 │
│  │  │   ├── [Select Dropdown]              │
│  │  │   ├── [Multi-select] (if applicable) │
│  │  │   └── [Input Field]                  │
│  │  │                                      │
│  │  ├── Section 3: Additional              │
│  │  │   └── [Textarea/Dynamic Fields]      │
│  │  │                                      │
│  │  └── Buttons                            │
│  │     ├── [Cancel Button]                 │
│  │     └── [Submit Button]                 │
│  │        (shows "Création..." when loading)│
└────────────────────────────────────────────┘
```

---

## 🎯 User Creation Page Details

### Page Route
```
/admin/users/create
```

### Form Structure
```
┌─────────────────────────────────────┐
│ ← Retour                            │
├─────────────────────────────────────┤
│ Créer un utilisateur                │
│ Ajouter un utilisateur...           │
├─────────────────────────────────────┤
│                                     │
│ ⚠️ [Error Message] (if any)         │
│                                     │
│ ┌───────────────────────────────┐  │
│ │ Informations générales        │  │
│ │                               │  │
│ │ Nom: [____________]           │  │
│ │ Prénom: [____________]        │  │
│ │ Email: [____________@__]      │  │
│ │ Mot de passe: [____________]  │  │
│ │ Téléphone: [____________]     │  │
│ │ Rôle: [v Sélectionner] ✓      │  │
│ │ Statut: [v Sélectionner] ✓    │  │
│ │                               │  │
│ │ ┌─────────────┐ ┌──────────┐ │  │
│ │ │  Annuler    │ │  Créer   │ │  │
│ │ └─────────────┘ └──────────┘ │  │
│ └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Form Fields Details
```
Field          Type          Validation         Required
────────────────────────────────────────────────────────
firstName      Text Input    Not empty           ✅ Yes
lastName       Text Input    Not empty           ✅ Yes
email          Email Input   Valid email         ✅ Yes
password       Password      Min 8 chars         ✅ Yes
phone          Tel Input     Phone format        ❌ No
role           Dropdown      USER/SELLER/ADMIN   ✅ Yes
status         Dropdown      ACTIVE/INACTIVE/... ✅ Yes
```

---

## 🏪 Shop Creation Page Details

### Page Route
```
/admin/shops/create
```

### Form Sections
```
┌──────────────────────────────────────────┐
│ ← Retour                                 │
├──────────────────────────────────────────┤
│ Créer une boutique                       │
│ Ajouter une nouvelle boutique...        │
├──────────────────────────────────────────┤
│                                          │
│ ⚠️ [Error Message] (if any)              │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ SECTION 1: Informations générales  │  │
│ │                                    │  │
│ │ Nom: [________________] ✓          │  │
│ │ Description: [_______________] ✓   │  │
│ │                                    │  │
│ │ Logo Upload:                       │  │
│ │ ┌──────────┐  [Télécharger]       │  │
│ │ │ [image]  │  Upload logo          │  │
│ │ └──────────┘                       │  │
│ │                                    │  │
│ │ SECTION 2: Catégories              │  │
│ │ ☐ Mode          ☐ Cosmétiques      │  │
│ │                                    │  │
│ │ SECTION 3: Livraison et adresse    │  │
│ │ Prix: [_____]€ ✓ (MANDATORY)       │  │
│ │ Téléphone: [____________]          │  │
│ │ Adresse: [________________]        │  │
│ │ Ville: [____________]              │  │
│ │ Code postal: [______]              │  │
│ │ Pays: [France______]               │  │
│ │                                    │  │
│ │ SECTION 4: Politiques              │  │
│ │ Politique de retour:               │  │
│ │ [____________________]             │  │
│ │                                    │  │
│ │ ┌──────────────┐ ┌─────────────┐  │  │
│ │ │  Annuler     │ │  Créer      │  │  │
│ │ └──────────────┘ └─────────────┘  │  │
│ └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### Key Features
- **Logo Upload**: 
  - Shows preview (24x24px)
  - Click to upload
  - Supports common image formats
  
- **Shipping Price** (⭐ MANDATORY):
  - Required field
  - Decimal support (e.g., 5.99€)
  - Per-shop configuration
  
- **Categories** (Multi-select):
  - Can select multiple
  - Checkboxes interface

---

## 📦 Product Creation Page Details

### Page Route
```
/admin/products/create
```

### Form Sections
```
┌────────────────────────────────────────────────┐
│ ← Retour                                       │
├────────────────────────────────────────────────┤
│ Créer un produit                               │
│ Ajouter un nouveau produit...                 │
├────────────────────────────────────────────────┤
│                                                │
│ ⚠️ [Error Message] (if any)                    │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ SECTION 1: Informations générales        │  │
│ │                                          │  │
│ │ Nom: [________________] ✓                │  │
│ │ Description: [________________] ✓        │  │
│ │ Slug: [auto-generated-slug] (readonly)  │  │
│ │ Meta Description: [________] (0/160)     │  │
│ │                                          │  │
│ │ SECTION 2: Prix et stock                 │  │
│ │ Prix (€): [_____] ✓                      │  │
│ │ Stock: [_____] ✓                         │  │
│ │                                          │  │
│ │ SECTION 3: Catégorie                     │  │
│ │ [v Sélectionner une catégorie] ✓         │  │
│ │   - Mode                                 │  │
│ │   - Cosmétiques                          │  │
│ │   - Électronique                         │  │
│ │   - Maison                               │  │
│ │                                          │  │
│ │ SECTION 4: Images                        │  │
│ │ ┌────────┐ ┌────────┐ ┌────────┐ [...] │  │
│ │ │ [Img1] │ │ [Img2] │ │ Ajouter│       │  │
│ │ │   ✕    │ │   ✕    │ │ images │       │  │
│ │ └────────┘ └────────┘ └────────┘       │  │
│ │                                          │  │
│ │ SECTION 5: Variantes                     │  │
│ │ ┌──────────────────────────────────────┐ │  │
│ │ │ Variante 1                         ✕ │ │  │
│ │ │ Nom: [Couleur________]               │ │  │
│ │ │ Options: [Rouge, Bleu, Noir]       │ │  │
│ │ └──────────────────────────────────────┘ │  │
│ │ [+ Ajouter une variante]                 │  │
│ │                                          │  │
│ │ ┌──────────────┐ ┌──────────────────┐   │  │
│ │ │  Annuler     │ │  Créer le produit│   │  │
│ │ └──────────────┘ └──────────────────┘   │  │
│ └──────────────────────────────────────────┘  │
│                                                │
└────────────────────────────────────────────────┘
```

### Advanced Features

**Auto-Slug Generation**:
```
User Input: "T-shirt en coton"
Generated Slug: "t-shirt-en-coton"
(Real-time as user types)
```

**Meta Description Counter**:
```
Input: "Magnifique t-shirt de..."
Counter: [Typed chars]/160
Shows when approaching limit
Max enforced at 160 chars
```

**Image Gallery**:
```
Multiple Images:
┌─────┬─────┬─────┐
│ Img1│ Img2│ Img3│
│ [✕] │ [✕] │ [✕] │
└─────┴─────┴─────┘
Each image removable via ✕ button
```

**Variants Management**:
```
Add Variant Button → New Variant Section
                   ├── Name: [_____]
                   ├── Options: [_____,_____,_____]
                   └── Remove [✕]

Can add multiple variants
(e.g., Color, Size, Material)
```

---

## 🔄 Navigation Flows

### Happy Path: Create User
```
Users List Page
    ↓
Click "Créer un utilisateur"
    ↓
/admin/users/create
    ↓
Fill Form (7 fields)
    ↓
Click "Créer l'utilisateur"
    ↓
API Call: POST /api/admin/users
    ↓
Success Response
    ↓
Redirect: /admin/users
    ↓
User List Shows New User ✅
```

### Happy Path: Create Shop
```
Shops List Page
    ↓
Click "Créer une boutique"
    ↓
/admin/shops/create
    ↓
Fill Form (name, description, logo, etc.)
    ↓
Upload Logo (shows preview)
    ↓
Set Mandatory Shipping Price
    ↓
Click "Créer la boutique"
    ↓
API Call: POST /api/shops (FormData)
    ↓
Success Response
    ↓
Redirect: /admin/shops
    ↓
Shop List Shows New Shop ✅
```

### Happy Path: Create Product
```
Products List Page
    ↓
Click "Créer un produit"
    ↓
/admin/products/create
    ↓
Fill Basic Info (name, description)
    ↓
Set Price & Stock
    ↓
Select Category
    ↓
Upload Product Images
    ↓
Add Variants (optional)
    ↓
Click "Créer le produit"
    ↓
API Call: POST /api/products (FormData)
    ↓
Success Response
    ↓
Redirect: /admin/products
    ↓
Product List Shows New Product ✅
```

---

## 📲 Responsive Breakpoints

### Mobile (< 640px)
- Stacked layout
- Full-width inputs
- Single column
- Simplified navigation
- Touch-friendly buttons

### Tablet (640px - 1024px)
- 2-column grid for some sections
- Optimized spacing
- Readable text size
- Good touch targets

### Desktop (> 1024px)
- Multi-column layouts
- Optimal spacing
- All features visible
- Full sidebar visible

---

## ✨ Interactive Features

### Form Validation
```
✅ Success State: Green border, no message
⚠️ Warning State: Orange border, helper text
❌ Error State: Red border, error message
```

### Loading State
```
Before: [Créer le produit]
        Click!
During: [Création en cours...]
        (button disabled, spinner inside)
After:  Redirect to list page
```

### Image Preview
```
Before upload: Camera icon
After upload: [Preview thumbnail]
             with ✕ remove button
Multiple:     Gallery with delete buttons
```

---

## 🎨 Color Scheme

- **Primary Action**: Blue (#2563EB)
- **Success**: Green (#10B981)
- **Error**: Red (#DC2626)
- **Warning**: Orange (#F59E0B)
- **Background**: Light gray (#F9FAFB)
- **Borders**: Gray (#E5E7EB)

---

## 📐 Spacing Standards

- **Form Sections**: 32px gap
- **Form Fields**: 16px gap
- **Button Group**: 16px gap
- **Padding**: 32px container, 16px inputs
- **Border Radius**: 8px inputs, 8px buttons, 12px cards

---

**Visual Guide Complete** ✅
All pages are fully responsive and follow consistent design patterns.

