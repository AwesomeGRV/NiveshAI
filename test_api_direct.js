const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API directly...');
    
    const response = await axios.post('http://localhost:3000/api/chat', {
      message: 'is tata motors up today',
      userProfile: { riskProfile: { type: 'moderate' } }
    });
    
    console.log('✅ API Response Success!');
    console.log('Response type:', response.data.response.type);
    console.log('Response source:', response.data.response.data.source);
    console.log('Message preview:', response.data.response.formatted.substring(0, 200) + '...');
    
  } catch (error) {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAPI();
