// Script pour ajouter des données fictives au marketplace
db = db.getSiblingDB('soeurise2');

// Fonction pour générer un ID unique
function generateId() {
  return new ObjectId();
}

// Utilisateur vendeur (on suppose qu'il existe déjà)
const sellerId = ObjectId('69775de9114ca8ee27bd6465');

// Données des boutiques
const shopsData = [
  {
    _id: generateId(),
    sellerId: sellerId,
    name: 'Mode Chic Parisienne',
    slug: 'mode-chic-parisienne-' + Date.now(),
    description: 'Collection élégante de vêtements et accessoires parisiens. Mode féminine raffinée pour toutes les occasions.',
    categories: ['Mode'],
    status: 'ACTIVE',
    logo: '/uploads/logos/default-logo.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingConfig: {
      enabled: true,
      estimatedDays: 3,
      shippingZones: ['France', 'Europe']
    },
    returnPolicy: 'Retours acceptés sous 30 jours',
    totalProducts: 0,
    totalSales: 0,
    totalOrders: 0,
    averageRating: 4.5,
    totalReviews: 0,
    isFeatured: true,
    isCompliant: true
  },
  {
    _id: generateId(),
    sellerId: sellerId,
    name: 'Beauté Naturelle',
    slug: 'beaute-naturelle-' + Date.now(),
    description: 'Cosmétiques naturels et bio. Soins du visage, corps et cheveux à base d\'ingrédients naturels.',
    categories: ['Cosmétique'],
    status: 'ACTIVE',
    logo: '/uploads/logos/default-logo.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingConfig: {
      enabled: true,
      estimatedDays: 2,
      shippingZones: ['France', 'Europe', 'Monde']
    },
    returnPolicy: 'Retours acceptés sous 14 jours pour produits non ouverts',
    totalProducts: 0,
    totalSales: 0,
    totalOrders: 0,
    averageRating: 4.8,
    totalReviews: 0,
    isFeatured: false,
    isCompliant: true
  },
  {
    _id: generateId(),
    sellerId: sellerId,
    name: 'Accessoires Créatifs',
    slug: 'accessoires-creatifs-' + Date.now(),
    description: 'Bijoux et accessoires uniques faits main. Créations originales pour sublimer votre style.',
    categories: ['Mode'],
    status: 'ACTIVE',
    logo: '/uploads/logos/default-logo.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingConfig: {
      enabled: true,
      estimatedDays: 5,
      shippingZones: ['France', 'Europe']
    },
    returnPolicy: 'Retours acceptés sous 30 jours',
    totalProducts: 0,
    totalSales: 0,
    totalOrders: 0,
    averageRating: 4.2,
    totalReviews: 0,
    isFeatured: false,
    isCompliant: true
  }
];

// Insérer les boutiques
print('Insertion des boutiques...');
shopsData.forEach(shop => {
  db.shops.insertOne(shop);
  print('Boutique créée:', shop.name);
});

// Produits pour chaque boutique
const productsData = [
  // Produits pour Mode Chic Parisienne
  {
    name: 'Robe d\'été fleurie',
    description: 'Robe légère en coton bio avec motif floral. Coupe évasée, manches courtes. Taille unique.',
    price: 89.99,
    category: 'Mode',
    shop: shopsData[0]._id,
    images: ['/uploads/products/robe-ete.jpg'],
    status: 'ACTIVE',
    stock: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: true,
    tags: ['robe', 'été', 'fleuri', 'coton'],
    variants: [],
    reviews: [],
    averageRating: 4.5,
    totalReviews: 3
  },
  {
    name: 'Blouse en soie naturelle',
    description: 'Blouse élégante en soie sauvage. Col Mao, manches longues. Parfaite pour un look sophistiqué.',
    price: 129.99,
    category: 'Mode',
    shop: shopsData[0]._id,
    images: ['/uploads/products/blouse-soie.jpg'],
    status: 'ACTIVE',
    stock: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: false,
    tags: ['blouse', 'soie', 'élégant', 'manches longues'],
    variants: [],
    reviews: [],
    averageRating: 4.8,
    totalReviews: 5
  },
  {
    name: 'Sac à main en cuir végétal',
    description: 'Sac à main artisanal en cuir végétal. Format moyen, bandoulière réglable. Design intemporel.',
    price: 159.99,
    category: 'Mode',
    shop: shopsData[0]._id,
    images: ['/uploads/products/sac-cuir.jpg'],
    status: 'ACTIVE',
    stock: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: true,
    tags: ['sac', 'cuir', 'artisanal', 'accessoire'],
    variants: [],
    reviews: [],
    averageRating: 4.6,
    totalReviews: 8
  },

  // Produits pour Beauté Naturelle
  {
    name: 'Crème hydratante visage',
    description: 'Crème hydratante bio au calendula et aloe vera. Pour tous types de peau. 50ml.',
    price: 24.99,
    category: 'Cosmétique',
    shop: shopsData[1]._id,
    images: ['/uploads/products/creme-hydratante.jpg'],
    status: 'ACTIVE',
    stock: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: true,
    tags: ['crème', 'hydratant', 'visage', 'bio', 'naturel'],
    variants: [],
    reviews: [],
    averageRating: 4.9,
    totalReviews: 12
  },
  {
    name: 'Huile essentielle lavande',
    description: 'Huile essentielle pure de lavande française. 10ml. Utilisation cutanée diluée.',
    price: 18.99,
    category: 'Cosmétique',
    shop: shopsData[1]._id,
    images: ['/uploads/products/huile-lavande.jpg'],
    status: 'ACTIVE',
    stock: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: false,
    tags: ['huile essentielle', 'lavande', 'aromathérapie', 'naturel'],
    variants: [],
    reviews: [],
    averageRating: 4.7,
    totalReviews: 6
  },
  {
    name: 'Masque purifiant argile',
    description: 'Masque purifiant à l\'argile verte et tea tree. Pour peau mixte à grasse. 100ml.',
    price: 19.99,
    category: 'Cosmétique',
    shop: shopsData[1]._id,
    images: ['/uploads/products/masque-argile.jpg'],
    status: 'ACTIVE',
    stock: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: false,
    tags: ['masque', 'purifiant', 'argile', 'tea tree'],
    variants: [],
    reviews: [],
    averageRating: 4.4,
    totalReviews: 9
  },

  // Produits pour Accessoires Créatifs
  {
    name: 'Collier perles bohème',
    description: 'Collier artisanal avec perles naturelles et pendentif en argent. Longueur ajustable.',
    price: 45.99,
    category: 'Mode',
    shop: shopsData[2]._id,
    images: ['/uploads/products/collier-perles.jpg'],
    status: 'ACTIVE',
    stock: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: true,
    tags: ['collier', 'perles', 'bohème', 'artisanal', 'bijou'],
    variants: [],
    reviews: [],
    averageRating: 4.3,
    totalReviews: 7
  },
  {
    name: 'Boucles d\'oreilles ethniques',
    description: 'Paire de boucles d\'oreilles en laiton avec motifs ethniques. Design unique fait main.',
    price: 32.99,
    category: 'Mode',
    shop: shopsData[2]._id,
    images: ['/uploads/products/boucles-ethniques.jpg'],
    status: 'ACTIVE',
    stock: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: false,
    tags: ['boucles d\'oreilles', 'ethnique', 'laiton', 'fait main'],
    variants: [],
    reviews: [],
    averageRating: 4.5,
    totalReviews: 4
  },
  {
    name: 'Bracelet macramé',
    description: 'Bracelet en macramé avec perles de bois. Ajustable, style bohème chic.',
    price: 28.99,
    category: 'Mode',
    shop: shopsData[2]._id,
    images: ['/uploads/products/bracelet-macrame.jpg'],
    status: 'ACTIVE',
    stock: 22,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: false,
    tags: ['bracelet', 'macramé', 'bohème', 'perles'],
    variants: [],
    reviews: [],
    averageRating: 4.1,
    totalReviews: 5
  }
];

// Insérer les produits
print('Insertion des produits...');
productsData.forEach(product => {
  db.products.insertOne(product);
  print('Produit créé:', product.name, '- Prix:', product.price + '€');
});

// Mettre à jour le compteur de produits pour chaque boutique
print('Mise à jour des compteurs de produits...');
shopsData.forEach(shop => {
  const productCount = db.products.countDocuments({ shop: shop._id });
  db.shops.updateOne(
    { _id: shop._id },
    { $set: { totalProducts: productCount } }
  );
  print('Boutique', shop.name, ':', productCount, 'produits');
});

print('✅ Données fictives ajoutées avec succès !');
print('📊 Résumé:');
print('-', shopsData.length, 'boutiques créées');
print('-', productsData.length, 'produits créés');
print('- Toutes les boutiques ont le statut ACTIVE');
print('- Produits avec prix, stock, et évaluations variés');