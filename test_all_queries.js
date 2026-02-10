const NiveshAI = require('./src/niveshai/NiveshAI');

async function testAllQueries() {
  const niveshAI = new NiveshAI();
  
  const testQueries = [
    'is tata motors up today',
    'why is gold price going up',
    'how should I invest 10000 per month',
    'best tax saving options under 80c',
    'what is my risk profile',
    'current market sentiment',
    'should I buy reliance stock',
    'mutual funds vs direct stocks',
    'how to create diversified portfolio',
    'impact of rbi rate hike on banks',
    'retirement planning options in india',
    'difference between nse and bse',
    'how to analyze financial statements',
    'best sectors to invest in 2024',
    'what is systematic investment plan'
  ];
  
  for (const query of testQueries) {
    try {
      console.log(`\n=== Testing: "${query}" ===`);
      const response = await niveshAI.getResponse(query, { riskProfile: { type: 'moderate' } });
      console.log('Response type:', response.data.type);
      console.log('Response preview:', response.data.data.message.substring(0, 200) + '...');
      console.log('---');
    } catch (error) {
      console.error('Error for query:', query, error.message);
    }
  }
}

testAllQueries();
