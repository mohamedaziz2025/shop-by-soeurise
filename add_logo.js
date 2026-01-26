// Script pour ajouter un logo par défaut aux boutiques existantes
db = db.getSiblingDB('soeurise2');

// Ajouter un logo par défaut aux boutiques sans logo
db.shops.updateMany(
  { logo: { $exists: false } },
  { $set: { logo: '/uploads/logos/default-logo.png' } }
);

print('Logo ajouté aux boutiques sans logo');