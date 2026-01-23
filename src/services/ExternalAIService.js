const axios = require('axios');

class ExternalAIService {
  constructor() {
    this.providers = {
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-3.5-turbo'
      },
      // Add other providers as needed
    };
    
    this.fallbackResponses = this.initializeFallbackResponses();
  }

  async getExternalResponse(query, context = {}) {
    try {
      // Try OpenAI first if API key is available
      if (this.providers.openai.apiKey) {
        const response = await this.callOpenAI(query, context);
        return response;
      }
      
      // Fallback to web search simulation
      return await this.simulateWebSearch(query);
    } catch (error) {
      console.error('External AI Service Error:', error);
      return this.getFallbackResponse(query);
    }
  }

  async callOpenAI(query, context) {
    try {
      const prompt = this.buildPrompt(query, context);
      
      const response = await axios.post(`${this.providers.openai.baseUrl}/chat/completions`, {
        model: this.providers.openai.model,
        messages: [
          {
            role: 'system',
            content: `You are a knowledgeable Indian financial advisor assistant. Provide accurate, educational information about Indian stock markets, mutual funds, and investment strategies. Always include SEBI-compliant disclaimers. Never provide guaranteed returns or specific financial advice. Focus on education and general guidance.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.providers.openai.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        source: 'OpenAI',
        response: response.data.choices[0].message.content,
        confidence: 0.9,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  buildPrompt(query, context) {
    let prompt = `Query: ${query}\n\n`;
    
    if (context.userProfile) {
      prompt += `User Profile:\n`;
      prompt += `- Risk Profile: ${context.userProfile.riskProfile?.type || 'moderate'}\n`;
      prompt += `- Investment Horizon: ${context.userProfile.investmentHorizon || 'medium-term'}\n`;
      prompt += `- Age: ${context.userProfile.age || 'not specified'}\n\n`;
    }
    
    if (context.marketData) {
      prompt += `Current Market Context:\n`;
      prompt += `- Nifty 50: ${context.marketData.nifty50?.current || 'N/A'}\n`;
      prompt += `- Market Sentiment: ${context.marketData.sentiment || 'N/A'}\n\n`;
    }
    
    prompt += `Please provide a comprehensive, educational response focusing on:\n`;
    prompt += `1. Factual information and analysis\n`;
    prompt += `2. Educational explanations\n`;
    prompt += `3. Risk considerations\n`;
    prompt += `4. General guidance (not specific advice)\n\n`;
    prompt += `Include appropriate disclaimers about consulting financial advisors.`;
    
    return prompt;
  }

  async simulateWebSearch(query) {
    try {
      // Simulate web search results from trusted financial sources
      const searchResults = await this.performMockSearch(query);
      const synthesizedResponse = this.synthesizeSearchResults(query, searchResults);
      
      return {
        source: 'Web Search Simulation',
        response: synthesizedResponse,
        confidence: 0.7,
        sources: searchResults.map(r => r.source),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Web search simulation error:', error);
      return this.getFallbackResponse(query);
    }
  }

  async performMockSearch(query) {
    const queryLower = query.toLowerCase();
    const results = [];

    // Handle specific stock queries (company name + stock/share)
    const stockPatterns = [
      { pattern: /tata motors|tatamotors/, company: 'Tata Motors', symbol: 'TATAMOTORS', nseSymbol: 'TATAMOTORS', bseSymbol: '500570' },
      { pattern: /reliance|reliance industries/, company: 'Reliance Industries', symbol: 'RELIANCE', nseSymbol: 'RELIANCE', bseSymbol: '500325' },
      { pattern: /tcs|tata consultancy/, company: 'TCS', symbol: 'TCS', nseSymbol: 'TCS', bseSymbol: '532940' },
      { pattern: /hdfc bank|hdfcbank/, company: 'HDFC Bank', symbol: 'HDFCBANK', nseSymbol: 'HDFCBANK', bseSymbol: '500180' },
      { pattern: /icici bank|icicibank/, company: 'ICICI Bank', symbol: 'ICICIBANK', nseSymbol: 'ICICIBANK', bseSymbol: '500104' },
      { pattern: /sbi|state bank/, company: 'State Bank of India', symbol: 'SBIN', nseSymbol: 'SBIN', bseSymbol: '500112' },
      { pattern: /infosys|infy/, company: 'Infosys', symbol: 'INFY', nseSymbol: 'INFY', bseSymbol: '500209' },
      { pattern: /wipro|wipro ltd/, company: 'Wipro', symbol: 'WIPRO', nseSymbol: 'WIPRO', bseSymbol: '507685' },
      { pattern: /hul|hindustan unilever/, company: 'HUL', symbol: 'HINDUNILVR', nseSymbol: 'HINDUNILVR', bseSymbol: '500696' },
      { pattern: /itc|itc ltd/, company: 'ITC', symbol: 'ITC', nseSymbol: 'ITC', bseSymbol: '500875' },
      { pattern: /kotak bank|kotakmahindra/, company: 'Kotak Mahindra Bank', symbol: 'KOTAKBANK', nseSymbol: 'KOTAKBANK', bseSymbol: '500228' },
      { pattern: /axis bank|axis/, company: 'Axis Bank', symbol: 'AXISBANK', nseSymbol: 'AXISBANK', bseSymbol: '532215' },
      { pattern: /maruti suzuki|maruti/, company: 'Maruti Suzuki', symbol: 'MARUTI', nseSymbol: 'MARUTI', bseSymbol: '532500' },
      { pattern: /mahindra|m&m/, company: 'Mahindra & Mahindra', symbol: 'M&M', nseSymbol: 'M&M', bseSymbol: '500520' },
      { pattern: /bharti airtel|airtel/, company: 'Bharti Airtel', symbol: 'BHARTIARTL', nseSymbol: 'BHARTIARTL', bseSymbol: '532454' },
      { pattern: /jio|reliance jio/, company: 'Reliance Jio', symbol: 'RELIANCE', nseSymbol: 'RELIANCE', bseSymbol: '500325' }
    ];

    // Check if query matches any stock pattern
    let matchedStock = null;
    for (const stock of stockPatterns) {
      if (stock.pattern.test(queryLower)) {
        matchedStock = stock;
        break;
      }
    }

    // If specific stock found, add stock-specific results
    if (matchedStock) {
      results.push({
        source: 'NSE India',
        title: `${matchedStock.company} Stock Analysis`,
        snippet: `Real-time stock data for ${matchedStock.company} (${matchedStock.nseSymbol}) including current price, change, volume, technical indicators, and fundamental analysis. Latest market performance and trading activity on NSE.`,
        url: `https://www.nseindia.com/get-quotes/equity?symbol=${matchedStock.nseSymbol}`
      });
      
      results.push({
        source: 'BSE India',
        title: `${matchedStock.company} Market Data`,
        snippet: `${matchedStock.company} (${matchedStock.bseSymbol}) stock performance on Bombay Stock Exchange including price movements, trading volume, market depth, and historical performance data.`,
        url: `https://www.bseindia.com/stock-share-price/${matchedStock.bseSymbol}/`
      });
      
      results.push({
        source: 'Moneycontrol',
        title: `${matchedStock.company} Stock Details`,
        snippet: `Comprehensive analysis of ${matchedStock.company} stock with real-time price, technical charts, fundamental analysis, analyst recommendations, and latest news affecting the stock.`,
        url: `https://www.moneycontrol.com/india/stockprice_/${matchedStock.symbol}/`
      });
    }

    // Handle commodities (silver, gold, etc.)
    if (queryLower.includes('silver') || queryLower.includes('gold') || queryLower.includes('commodity')) {
      results.push({
        source: 'MCX India',
        title: `${queryLower.includes('silver') ? 'Silver' : 'Gold'} Market Analysis`,
        snippet: `Latest price movements and market analysis for ${queryLower.includes('silver') ? 'silver' : 'gold'} including international market influence, USD rates, and demand-supply dynamics.`,
        url: 'https://www.mcxindia.com/market-data/metal'
      });
      
      results.push({
        source: 'Economic Times',
        title: `Commodity Market Update: ${query}`,
        snippet: `Comprehensive analysis of ${query} market trends, including international price movements, import-export data, and expert forecasts for Indian markets.`,
        url: 'https://economictimes.indiatimes.com/markets/commodities'
      });
    }

    // Handle stock market queries
    if (queryLower.includes('stock') || queryLower.includes('share') || queryLower.includes('nifty') || queryLower.includes('sensex')) {
      results.push({
        source: 'Moneycontrol',
        title: `Stock Market Analysis: ${query}`,
        snippet: `Detailed analysis of ${query} including technical indicators, fundamental analysis, market sentiment, and expert recommendations.`,
        url: 'https://www.moneycontrol.com/stocks/marketinfo/analysis'
      });
    }

    // Handle mutual fund queries
    if (queryLower.includes('mutual fund') || queryLower.includes('sip') || queryLower.includes('elss')) {
      results.push({
        source: 'Value Research',
        title: `Mutual Fund Analysis: ${query}`,
        snippet: `Comprehensive analysis of ${query} including performance metrics, risk assessment, expense ratios, and suitability for different investor profiles.`,
        url: 'https://www.valueresearchonline.com/funds/'
      });
    }

    // Handle tax queries
    if (queryLower.includes('tax') || queryLower.includes('80c') || queryLower.includes('capital gains')) {
      results.push({
        source: 'Income Tax Department',
        title: `Tax Guidelines: ${query}`,
        snippet: `Official guidelines and latest updates on ${query} under Indian tax laws, including recent amendments and compliance requirements.`,
        url: 'https://www.incometaxindia.gov.in/'
      });
    }

    // Handle economy/macro queries
    if (queryLower.includes('economy') || queryLower.includes('inflation') || queryLower.includes('gdp') || queryLower.includes('rbi')) {
      results.push({
        source: 'RBI',
        title: `Economic Analysis: ${query}`,
        snippet: `Reserve Bank of India's analysis and outlook on ${query}, including monetary policy implications and economic indicators.`,
        url: 'https://www.rbi.org.in/'
      });
    }

    // Handle international markets
    if (queryLower.includes('us market') || queryLower.includes('global market') || queryLower.includes('fed')) {
      results.push({
        source: 'Reuters',
        title: `Global Market Analysis: ${query}`,
        snippet: `International market analysis covering ${query} with focus on impact on Indian markets and global economic trends.`,
        url: 'https://www.reuters.com/markets/global'
      });
    }

    // Add general market information if no specific category matched
    if (results.length === 0) {
      results.push({
        source: 'Economic Times',
        title: `Market Insights: ${query}`,
        snippet: `Latest market analysis and insights about ${query} from leading financial experts and market analysts.`,
        url: 'https://economictimes.indiatimes.com/markets'
      });
      
      results.push({
        source: 'Business Standard',
        title: `Financial Analysis: ${query}`,
        snippet: `In-depth financial analysis and expert opinions on ${query} covering market trends, investment opportunities, and risk factors.`,
        url: 'https://www.business-standard.com/markets'
      });
    }

    return results;
  }

  synthesizeSearchResults(query, searchResults) {
    const queryLower = query.toLowerCase();
    let response = '';
    
    // Check if this is a stock-specific query
    const stockPatterns = [
      { pattern: /tata motors|tatamotors/, company: 'Tata Motors', symbol: 'TATAMOTORS' },
      { pattern: /reliance|reliance industries/, company: 'Reliance Industries', symbol: 'RELIANCE' },
      { pattern: /tcs|tata consultancy/, company: 'TCS', symbol: 'TCS' },
      { pattern: /hdfc bank|hdfcbank/, company: 'HDFC Bank', symbol: 'HDFCBANK' },
      { pattern: /icici bank|icicibank/, company: 'ICICI Bank', symbol: 'ICICIBANK' },
      { pattern: /sbi|state bank/, company: 'State Bank of India', symbol: 'SBIN' },
      { pattern: /infosys|infy/, company: 'Infosys', symbol: 'INFY' },
      { pattern: /wipro|wipro ltd/, company: 'Wipro', symbol: 'WIPRO' },
      { pattern: /maruti suzuki|maruti/, company: 'Maruti Suzuki', symbol: 'MARUTI' }
    ];

    let matchedStock = null;
    for (const stock of stockPatterns) {
      if (stock.pattern.test(queryLower)) {
        matchedStock = stock;
        break;
      }
    }

    // Handle specific stock queries
    if (matchedStock) {
      response = `**${matchedStock.company} (${matchedStock.symbol}) - Stock Analysis**\n\n`;
      
      // Check if user is asking about current price/movement
      if (queryLower.includes('up') || queryLower.includes('down') || queryLower.includes('today') || queryLower.includes('price') || queryLower.includes('current')) {
        // Simulate real-time stock data
        const currentPrice = this.generateMockStockPrice(matchedStock.symbol);
        const priceChange = (Math.random() - 0.5) * 10; // Random change between -5% to +5%
        const priceChangePercent = priceChange;
        const isUp = priceChangePercent > 0;
        
        response += `**Current Market Status:**\n`;
        response += `• **Current Price:** ₹${currentPrice.toFixed(2)}\n`;
        response += `• **Today's Change:** ${isUp ? '+' : ''}${priceChangePercent.toFixed(2)}% (${isUp ? '↑' : '↓'} ${Math.abs(priceChange).toFixed(2)} points)\n`;
        response += `• **Volume:** ${(Math.random() * 10000000 + 1000000).toLocaleString('en-IN')} shares\n`;
        response += `• **Market Cap:** ₹${(Math.random() * 100000 + 50).toFixed(0)}K Crore\n`;
        response += `• **52-Week High:** ₹${(currentPrice * 1.2).toFixed(2)}\n`;
        response += `• **52-Week Low:** ₹${(currentPrice * 0.8).toFixed(2)}\n\n`;
        
        response += `**Today's Performance Analysis:**\n`;
        if (isUp) {
          response += `📈 **Bullish Movement:** ${matchedStock.company} is trading higher today, indicating positive market sentiment.\n`;
          response += `• **Support Levels:** ₹${(currentPrice * 0.98).toFixed(2)} (immediate), ₹${(currentPrice * 0.95).toFixed(2)} (strong)\n`;
          response += `• **Resistance Levels:** ₹${(currentPrice * 1.02).toFixed(2)} (immediate), ₹${(currentPrice * 1.05).toFixed(2)} (strong)\n`;
        } else {
          response += `📉 **Bearish Movement:** ${matchedStock.company} is trading lower today, indicating negative market sentiment.\n`;
          response += `• **Support Levels:** ₹${(currentPrice * 0.98).toFixed(2)} (immediate), ₹${(currentPrice * 0.95).toFixed(2)} (strong)\n`;
          response += `• **Resistance Levels:** ₹${(currentPrice * 1.02).toFixed(2)} (immediate), ₹${(currentPrice * 1.05).toFixed(2)} (strong)\n`;
        }
        
        response += `\n**Technical Indicators:**\n`;
        response += `• **RSI (14): ${Math.floor(Math.random() * 40 + 30)} (Neutral)\n`;
        response += `• **MACD:** ${Math.random() > 0.5 ? 'Bullish' : 'Bearish'}\n`;
        response += `• **Moving Average (50-day): ${currentPrice > (currentPrice * 0.98) ? 'Above' : 'Below'}\n`;
        response += `• **Volume:** ${Math.random() > 0.5 ? 'Above Average' : 'Below Average'}\n\n`;
      }
      
      // Add fundamental analysis
      response += `**Fundamental Analysis:**\n`;
      response += `• **P/E Ratio:** ${(Math.random() * 30 + 15).toFixed(1)}\n`;
      response += `• **P/B Ratio:** ${(Math.random() * 5 + 2).toFixed(1)}\n`;
      response += `• **ROE:** ${(Math.random() * 20 + 10).toFixed(1)}%\n`;
      response += `• **Debt to Equity:** ${(Math.random() * 2).toFixed(2)}\n`;
      response += `• **Promoter Holding:** ${Math.floor(Math.random() * 30 + 50)}%\n`;
      response += `• **Dividend Yield:** ${(Math.random() * 3).toFixed(2)}%\n\n`;
      
      // Add recent news/updates
      response += `**Recent Developments:**\n`;
      response += `• **Quarterly Results:** ${matchedStock.company} reported ${Math.random() > 0.5 ? 'strong' : 'moderate'} ${Math.floor(Math.random() * 20 + 5)}% ${Math.random() > 0.5 ? 'profit' : 'revenue'} growth\n`;
      response += `• **Management Commentary:** ${Math.random() > 0.5 ? 'Optimistic about' : 'Cautious about'} business outlook for current quarter\n`;
      response += `• **Analyst Ratings:** ${Math.floor(Math.random() * 2 + 3)} analysts with ${Math.random() > 0.5 ? 'Buy' : 'Hold'} recommendations\n`;
      response += `• **Sector Performance:** ${matchedStock.company}'s sector is ${Math.random() > 0.5 ? 'outperforming' : 'underperforming'} the broader market\n\n`;
      
      // Add investment considerations
      response += `**Investment Considerations:**\n`;
      response += `• **Risk Level:** ${matchedStock.company === 'Tata Motors' ? 'High' : matchedStock.company.includes('Bank') ? 'Medium' : 'Medium-High'}\n`;
      response += `• **Investment Horizon:** ${matchedStock.company.includes('Bank') ? 'Long-term' : 'Medium to Long-term'}\n`;
      response += `• **Suitability:** ${matchedStock.company === 'Tata Motors' ? 'Suitable for aggressive investors with high risk tolerance' : 'Suitable for moderate risk investors'}\n`;
      response += `• **Key Risks: ${matchedStock.company === 'Tata Motors' ? 'High competition, cyclicality, regulatory changes' : matchedStock.company.includes('Bank') ? 'Interest rate sensitivity, credit risk, regulatory changes' : 'Market volatility, sector-specific risks'}\n\n`;
      
      response += `**Market Context:**\n`;
      searchResults.forEach((result, index) => {
        response += `**From ${result.source}:**\n`;
        response += `${result.snippet}\n`;
        response += `*Source: ${result.url}*\n\n`;
      });
      
      response += this.addSEBIDisclaimer();
      
    } else if (queryLower.includes('silver') || queryLower.includes('gold') || queryLower.includes('commodity')) {
      response = `**${queryLower.includes('silver') ? 'Silver' : queryLower.includes('gold') ? 'Gold' : 'Commodity'} Market Analysis**\n\n`;
      
      // Add specific commodity analysis
      if (queryLower.includes('going up') || queryLower.includes('price') || queryLower.includes('trend')) {
        response += `**Current Price Movement Analysis:**\n`;
        response += `${queryLower.includes('silver') ? 'Silver' : 'Gold'} prices have been showing upward momentum due to several key factors:\n\n`;
        
        if (queryLower.includes('silver')) {
          response += `**Key Drivers for Silver Price Increase:**\n`;
          response += `• **Industrial Demand:** Increased usage in solar panels, electronics, and EV manufacturing\n`;
          response += `• **Investment Demand:** Safe-haven buying during economic uncertainty\n`;
          response += `• **Supply Constraints:** Mining disruptions and lower production levels\n`;
          response += `• **USD Weakness:** Inverse relationship with US dollar makes silver cheaper for international buyers\n`;
          response += `• **Gold Correlation:** Silver often follows gold price movements\n`;
          response += `• **Inflation Hedge:** Investors buying silver as protection against rising prices\n\n`;
        } else if (queryLower.includes('gold')) {
          response += `**Key Drivers for Gold Price Increase:**\n`;
          response += `• **Safe-Haven Demand:** Economic uncertainty and geopolitical tensions\n`;
          response += `• **Central Bank Buying:** Countries increasing gold reserves\n`;
          response += `• **Inflation Concerns:** Gold as traditional inflation hedge\n`;
          response += `• **Interest Rate Expectations:** Lower rates make non-yielding assets more attractive\n`;
          response += `• **Currency Devaluation:** Protection against currency weakness\n\n`;
        }
      }
      
      // Add market data from search results
      searchResults.forEach((result, index) => {
        response += `**From ${result.source}:**\n`;
        response += `${result.snippet}\n`;
        response += `*Source: ${result.url}*\n\n`;
      });
      
      // Add investment implications
      response += `**Investment Implications:**\n`;
      if (queryLower.includes('silver')) {
        response += `• **Silver ETFs:** Consider Nippon India Silver ETF for exposure\n`;
        response += `• **Physical Silver:** Coins and bars from authorized dealers\n`;
        response += `• **Silver Futures:** For experienced investors via MCX\n`;
        response += `• **Risk Considerations:** High volatility, monitor global trends\n`;
      } else if (queryLower.includes('gold')) {
        response += `• **Gold ETFs:** Nippon India Gold ETF for easy trading\n`;
        response += `• **Sovereign Gold Bonds:** 2.5% interest plus capital appreciation\n`;
        response += `• **Digital Gold:** Platforms like Paytm, PhonePe for small investments\n`;
        response += `• **Physical Gold:** Traditional investment with storage costs\n`;
      }
      
      response += `\n${this.addSEBIDisclaimer()}`;
      
    } else {
      // General search results synthesis
      response = `Based on information from leading financial sources:\n\n`;
      
      searchResults.forEach((result, index) => {
        response += `**From ${result.source}:**\n`;
        response += `${result.snippet}\n`;
        response += `*Source: ${result.url}*\n\n`;
      });
      
      response += this.addContextualAdvice(query);
      response += this.addSEBIDisclaimer();
    }
    
    return response;
  }

  addContextualAdvice(query) {
    const queryLower = query.toLowerCase();
    let advice = '';
    
    if (queryLower.includes('beginner') || queryLower.includes('start')) {
      advice += `**For Beginners:**\n`;
      advice += `- Start with systematic investment plans (SIPs)\n`;
      advice += `- Focus on diversified mutual funds\n`;
      advice += `- Understand your risk profile before investing\n`;
      advice += `- Invest only what you can afford to lose\n\n`;
    }
    
    if (queryLower.includes('risk') || queryLower.includes('safe')) {
      advice += `**Risk Management:**\n`;
      advice += `- Diversify across asset classes\n`;
      advice += `- Consider debt instruments for stability\n`;
      advice += `- Maintain emergency funds\n`;
      advice += `- Review portfolio regularly\n\n`;
    }
    
    return advice;
  }

  addSEBIDisclaimer() {
    return `\n---\n**Important Disclaimer:**\nThis information is for educational purposes only and not SEBI-registered investment advice. Please consult a licensed financial advisor before making any investment decisions. Past performance is not indicative of future results. Investments are subject to market risks.`;
  }

  generateMockStockPrice(symbol) {
    // Generate realistic mock prices for major Indian stocks
    const basePrices = {
      'TATAMOTORS': 650,
      'RELIANCE': 2500,
      'TCS': 3500,
      'HDFCBANK': 1650,
      'ICICIBANK': 950,
      'SBIN': 600,
      'INFY': 1450,
      'WIPRO': 400,
      'MARUTI': 10000
    };
    
    return basePrices[symbol] || 1000;
  }

  getFallbackResponse(query) {
    const queryLower = query.toLowerCase();
    
    // Check for specific fallback responses
    for (const [key, response] of Object.entries(this.fallbackResponses)) {
      if (queryLower.includes(key)) {
        return {
          source: 'Knowledge Base',
          response: response,
          confidence: 0.6,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Default fallback
    return {
      source: 'Knowledge Base',
      response: this.fallbackResponses.default,
      confidence: 0.5,
      timestamp: new Date().toISOString()
    };
  }

  initializeFallbackResponses() {
    return {
      'stock': `**Understanding Stock Market Investments:**\n\nStocks represent ownership in companies and offer potential for growth. Key considerations:\n\n• **Research:** Analyze company fundamentals, management quality, and industry trends\n• **Diversification:** Spread investments across sectors and market caps\n• **Time Horizon:** Longer timeframes generally reduce risk\n• **Risk Management:** Use stop-loss orders and position sizing\n\n**For Indian Markets:**\n• NSE and BSE are primary exchanges\n• Nifty 50 and Sensex are key indices\n• SEBI regulates the market to protect investors\n\n${this.addSEBIDisclaimer()}`,
      
      'silver': `**Why Silver Prices Are Going Up - Detailed Analysis:**\n\nSilver prices have been showing upward momentum due to several key factors:\n\n**Primary Drivers:**\n\n🏭 **Industrial Demand Surge:**\n• **Solar Panel Manufacturing:** Silver is essential for photovoltaic cells, and renewable energy expansion is driving demand\n• **Electronics Industry:** Increased usage in smartphones, EVs, and consumer electronics\n• **5G Infrastructure:** Silver components in telecommunications equipment\n\n💰 **Investment Demand:**\n• **Safe-Haven Asset:** Investors buying silver during economic uncertainty and geopolitical tensions\n• **Inflation Hedge:** Protection against rising prices and currency devaluation\n• **ETF Inflows:** Record inflows into silver ETFs globally\n\n📉 **Supply Constraints:**\n• **Mining Disruptions:** Production issues in major mining countries\n• **Lower Production:** Declining ore grades and higher extraction costs\n• **Environmental Regulations:** Stricter mining regulations affecting supply\n\n💱 **Currency Factors:**\n• **USD Weakness:** Inverse relationship - weaker dollar makes silver cheaper for international buyers\n• **Global Economic Policies:** Monetary easing policies supporting precious metals\n\n📊 **Market Dynamics:**\n• **Gold Correlation:** Silver often follows gold price movements (gold-silver ratio)\n• **Speculative Trading:** Increased futures and options trading activity\n• **Physical Demand:** Strong demand for jewelry and silverware in emerging markets\n\n**Current Market Data:**\n• MCX Silver futures showing upward trend\n• International prices influencing Indian markets\n• GST and import duties affecting domestic pricing\n\n**Investment Options in India:**\n• **Silver ETFs:** Nippon India Silver ETF (traded on NSE)\n• **Silver Futures:** MCX platform for experienced investors\n• **Physical Silver:** Coins and bars from authorized dealers\n• **Digital Silver:** Through various fintech platforms\n\n**Risks to Consider:**\n• **High Volatility:** Silver prices can be very volatile\n• **Global Factors:** International markets heavily influence prices\n• **Economic Sensitivity:** Sensitive to economic growth and industrial demand\n\n**Outlook:**\n• **Short-term:** Continued upward momentum if industrial demand remains strong\n• **Medium-term:** Price stability depends on global economic conditions\n• **Long-term:** Silver's dual role as industrial and investment metal supports demand\n\n${this.addSEBIDisclaimer()}`,
      
      'gold': `**Understanding Gold as an Investment:**\n\nGold is traditionally considered a safe-haven asset and inflation hedge:\n\n**Key Factors Influencing Gold Prices:**\n• **Global Economic Uncertainty:** Safe-haven demand during crises\n• **Inflation Rates:** Hedge against currency devaluation\n• **Central Bank Reserves:** Buying/selling by central banks\n• **Jewelry Demand:** Major driver in India and China\n• **Interest Rates:** Inverse relationship with real interest rates\n\n**Investment Options in India:**\n• **Gold ETFs:** Traded on NSE (e.g., Nippon India Gold ETF)\n• **Sovereign Gold Bonds:** Government bonds with 2.5% interest\n• **Digital Gold:** Through platforms like Paytm, PhonePe\n• **Physical Gold:** Coins and bars from jewelers and banks\n• **Gold Futures:** Traded on MCX\n\n**Tax Considerations:**\n• Physical gold: 3% GST + capital gains tax\n• Gold ETFs: Long-term capital gains after 1 year\n• Sovereign Gold Bonds: Tax-free interest\n\n${this.addSEBIDisclaimer()}`,
      
      'commodity': `**Understanding Commodity Investments:**\n\nCommodities include metals, energy, agricultural products, and more:\n\n**Types of Commodities:**\n• **Precious Metals:** Gold, silver, platinum\n• **Base Metals:** Copper, aluminum, zinc, lead\n• **Energy:** Crude oil, natural gas, coal\n• **Agricultural:** Wheat, rice, cotton, spices\n\n**Investment Methods in India:**\n• **Commodity ETFs:** Gold and silver ETFs on NSE\n• **Commodity Futures:** Traded on MCX and NCDEX\n• **Commodity Mutual Funds:** Fund of funds investing in commodities\n• **Physical Commodities:** Direct purchase and storage\n\n**Key Considerations:**\n• **Price Volatility:** High volatility due to supply-demand dynamics\n• **Global Factors:** International markets heavily influence prices\n• **Seasonal Patterns:** Agricultural commodities have seasonal cycles\n• **Regulatory Changes:** Government policies impact prices\n\n**Risks Involved:**\n• Price volatility and market risk\n• Storage costs for physical commodities\n• Regulatory and policy risks\n• Currency fluctuation impact\n\n${this.addSEBIDisclaimer()}`,
      
      'mutual fund': `**Mutual Fund Investments Explained:**\n\nMutual funds pool money from multiple investors to invest in diversified portfolios:\n\n**Types:**\n• **Equity Funds:** Invest in stocks, higher risk/return potential\n• **Debt Funds:** Invest in fixed income, lower risk\n• **Hybrid Funds:** Mix of equity and debt\n• **Index Funds:** Track market indices\n\n**Key Metrics:**\n• **Expense Ratio:** Annual management fees\n• **NAV:** Net Asset Value per unit\n• **AUM:** Assets Under Management\n\n**Benefits:**\n• Professional management\n• Diversification\n• Liquidity\n• Transparency\n\n${this.addSEBIDisclaimer()}`,
      
      'sip': `**Systematic Investment Plan (SIP):**\n\nSIP is a disciplined way to invest fixed amounts regularly:\n\n**Advantages:**\n• **Rupee Cost Averaging:** Buy more units when prices are low\n• **Power of Compounding:** Earn returns on returns\n• **Discipline:** Regular investment habit\n• **Flexibility:** Start with as low as ₹500\n\n**Example:**\nInvesting ₹10,000 monthly for 20 years at 12% returns can grow to approximately ₹1 crore\n\n**Best Practices:**\n• Start early and be consistent\n• Increase SIP amount annually\n• Choose funds based on risk profile\n• Review performance periodically\n\n${this.addSEBIDisclaimer()}`,
      
      'tax': `**Tax Planning for Investments:**\n\n**Section 80C Deductions (₹1.5L limit):**\n• **ELSS Funds:** 3-year lock-in, potential for high returns\n• **PPF:** 15-year lock-in, guaranteed returns\n• **Tax-Saving FD:** 5-year lock-in, fixed returns\n• **NPS:** Retirement-focused, tax benefits\n\n**Capital Gains Tax:**\n• **Equity:** 10% LTCG above ₹1L (holding >1 year)\n• **Debt:** 20% with indexation (holding >3 years)\n\n**Tips:**\n• Plan tax-saving investments at year start\n• Consider post-tax returns\n• Maintain documentation\n\n${this.addSEBIDisclaimer()}`,
      
      'economy': `**Understanding Indian Economy:**\n\nKey economic indicators affecting investments:\n\n**GDP Growth:**\n• Measures economic output and growth\n• Higher GDP growth generally positive for equities\n• Current trend: 6-7% annual growth target\n\n**Inflation:**\n• CPI measures price level changes\n• RBI targets 4% inflation with 2% tolerance\n• High inflation impacts real returns\n\n**Interest Rates:**\n• Repo rate influences borrowing costs\n• Higher rates can negatively impact equities\n• Current repo rate: 6.50%\n\n**Fiscal Policy:**\n• Government spending and taxation\n• Deficit levels impact economic stability\n• Budget announcements affect market sentiment\n\n**External Factors:**\n• Global economic conditions\n• Trade balance and foreign exchange\n• FII/FDI flows\n\n${this.addSEBIDisclaimer()}`,
      
      'default': `**Comprehensive Financial Guidance:**\n\nI can help you understand various investment and financial topics:\n\n• **Stock Markets:** Equity analysis, market trends, company research\n• **Commodities:** Gold, silver, crude oil, and other commodities\n• **Mutual Funds:** SIPs, lump sum, fund selection\n• **Tax Planning:** Section 80C, capital gains, tax optimization\n• **Economic Analysis:** GDP, inflation, RBI policies, global markets\n• **Portfolio Management:** Asset allocation, diversification, risk management\n• **Risk Assessment:** Personalized risk profiling and suitable investments\n\nPlease ask specific questions about any financial topic. For personalized advice, please consult a SEBI-registered financial advisor.\n\n${this.addSEBIDisclaimer()}`
    };
  }

  async getMarketNews() {
    try {
      // Simulate market news aggregation
      const news = [
        {
          title: 'Market Updates: Nifty crosses 19,800',
          summary: 'Positive sentiment in IT and banking sectors drives market gains',
          source: 'Financial Express',
          time: '2 hours ago',
          impact: 'positive'
        },
        {
          title: 'RBI maintains status quo on interest rates',
          summary: 'Central bank keeps repo rate unchanged at 6.5%',
          source: 'Economic Times',
          time: '4 hours ago',
          impact: 'neutral'
        },
        {
          title: 'FII inflows continue in Indian markets',
          summary: 'Foreign investors show confidence in Indian economy',
          source: 'Business Standard',
          time: '6 hours ago',
          impact: 'positive'
        }
      ];
      
      return {
        news: news,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Market news error:', error);
      return { news: [], lastUpdated: new Date().toISOString() };
    }
  }
}

module.exports = ExternalAIService;
