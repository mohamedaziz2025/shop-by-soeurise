// Script de test pour vérifier la connectivité API
const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API connectivity...');
    const response = await axios.get('http://72.62.71.97:3001/api/shops?status=ACTIVE');
    console.log('✅ API Response:', response.status);
    console.log('📊 Shops found:', response.data.shops?.length || 0);
    console.log('🏪 First shop:', response.data.shops?.[0]?.name);
  } catch (error) {
    console.error('❌ API Error:', error.message);
    if (error.code) console.error('Error code:', error.code);
  }
}

testAPI();