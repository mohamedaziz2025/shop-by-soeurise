// Script de test pour vérifier l'affichage des produits
const axios = require('axios');

async function testProductsDisplay() {
  try {
    console.log('🔍 Vérification de l\'affichage des produits...\n');

    // 1. Test des boutiques actives
    console.log('1️⃣  Test des boutiques ACTIVE...');
    const shopsResponse = await axios.get('http://72.62.71.97:3001/api/shops?status=ACTIVE,APPROVED');
    console.log(`✅ Boutiques trouvées: ${shopsResponse.data?.length || shopsResponse.data?.shops?.length || 0}`);
    
    if (shopsResponse.data && shopsResponse.data.length > 0) {
      const firstShop = shopsResponse.data[0];
      console.log(`   Première boutique: ${firstShop.name} (slug: ${firstShop.slug})`);
      console.log(`   Logo: ${firstShop.logo ? '✅ Présent' : '❌ Absent'}`);

      // 2. Test des produits pour cette boutique
      console.log('\n2️⃣  Test des produits de cette boutique...');
      const productsResponse = await axios.get(`http://72.62.71.97:3001/api/products?shopSlug=${firstShop.slug}&status=ACTIVE`);
      const products = productsResponse.data?.products || productsResponse.data || [];
      console.log(`✅ Produits trouvés: ${Array.isArray(products) ? products.length : 0}`);
      
      if (Array.isArray(products) && products.length > 0) {
        products.slice(0, 3).forEach((p, i) => {
          console.log(`   Produit ${i + 1}: ${p.name}`);
          console.log(`     - Prix: ${p.price}`);
          console.log(`     - Stock: ${p.stock}`);
          console.log(`     - Images: ${p.images?.length || 0} image(s)`);
          if (p.images && p.images[0]) {
            console.log(`     - URL: ${p.images[0].startsWith('http') ? '✅ URL complète' : '⚠️  Chemin relatif: ' + p.images[0]}`);
          }
        });
      } else {
        console.log('❌ Aucun produit trouvé');
      }
    } else {
      console.log('❌ Aucune boutique trouvée');
    }

    // 3. Test direct d'un endpoint produits
    console.log('\n3️⃣  Test endpoint /api/products...');
    const allProducts = await axios.get('http://72.62.71.97:3001/api/products?status=ACTIVE&limit=5');
    const prods = allProducts.data?.products || allProducts.data || [];
    console.log(`✅ Produits globaux trouvés: ${Array.isArray(prods) ? prods.length : 0}`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testProductsDisplay();
