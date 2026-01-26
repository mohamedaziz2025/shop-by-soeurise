// Script pour créer deux boutiques pour l'utilisateur azizbenhassine270@gmail.com
db = db.getSiblingDB('soeurise2');

// Trouver l'utilisateur par email
const user = db.users.findOne({ email: 'azizbenhassine270@gmail.com' });

if (!user) {
  print('Utilisateur non trouvé');
  quit();
}

print('Utilisateur trouvé:', user._id);

// Créer la boutique Mode
const shopMode = {
  sellerId: user._id,
  name: 'Mode by Aziz',
  slug: 'mode-by-aziz-' + Date.now(),
  description: 'Boutique de mode élégante et tendance',
  categories: ['Mode'],
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date()
};

const resultMode = db.shops.insertOne(shopMode);
print('Boutique Mode créée:', resultMode.insertedId);

// Créer la boutique Cosmétique
const shopCosmetique = {
  sellerId: user._id,
  name: 'Cosmétiques by Aziz',
  slug: 'cosmetiques-by-aziz-' + Date.now(),
  description: 'Produits cosmétiques naturels et de qualité',
  categories: ['Cosmétique'],
  status: 'ACTIVE',
  createdAt: new Date(),
  updatedAt: new Date()
};

const resultCosmetique = db.shops.insertOne(shopCosmetique);
print('Boutique Cosmétique créée:', resultCosmetique.insertedId);

print('Opération terminée avec succès');