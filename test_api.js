const NiveshAI = require('./src/niveshai/NiveshAI');

async function testAPI() {
  const niveshAI = new NiveshAI();
  
  try {
    console.log('Testing NiveshAI with stock question...');
    const response = await niveshAI.getResponse('is tata motors up today', { riskProfile: { type: 'moderate' } });
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
