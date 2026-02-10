const axios = require('axios');

async function debugResponse() {
  try {
    const response = await axios.post('http://localhost:3000/api/chat', {
      message: 'is tata motors up today',
      userProfile: { riskProfile: { type: 'moderate' } }
    });
    
    console.log('=== FULL API RESPONSE ===');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\n=== RESPONSE STRUCTURE ANALYSIS ===');
    console.log('response.data.response exists:', !!response.data.response);
    console.log('response.data.response.formatted exists:', !!response.data.response?.formatted);
    console.log('response.data.formatted exists:', !!response.data.formatted);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Error response:', error.response.data);
    }
  }
}

debugResponse();
