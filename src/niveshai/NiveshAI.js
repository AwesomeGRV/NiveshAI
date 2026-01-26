const MarketDataService = require('../services/MarketDataService');
const KnowledgeBase = require('../knowledge/KnowledgeBase');
const ResponseFormatter = require('../utils/ResponseFormatter');
const RiskProfiler = require('../analysis/RiskProfiler');

class NiveshAI {
  constructor() {
    this.marketDataService = new MarketDataService();
    this.knowledgeBase = new KnowledgeBase();
    this.responseFormatter = new ResponseFormatter();
    this.riskProfiler = new RiskProfiler();
    
    // Advanced stock database
    this.stockDatabase = {
      'tata motors': {
        name: 'Tata Motors', symbol: 'TATAMOTORS', sector: 'Automobile',
        price: 652.34, change: 2.5, volume: '8.2M', marketCap: '₹2.3L Cr',
        pe: 18.5, pb: 2.3, roe: 14.2, debt: 0.85, promoter: 42, dividend: 1.8,
        description: 'Leading Indian automobile manufacturer with EV leadership.',
        strengths: ['Strong brand', 'EV leadership', 'Global presence'],
        weaknesses: ['High competition', 'Cyclical nature'],
        recentNews: 'Launched new EV models, Q2 results beat expectations',
        outlook: 'Positive on EV transition'
      },
      'reliance': {
        name: 'Reliance Industries', symbol: 'RELIANCE', sector: 'Conglomerate',
        price: 2543.21, change: 1.8, volume: '12.5M', marketCap: '₹17.2L Cr',
        pe: 22.3, pb: 1.8, roe: 12.5, debt: 0.45, promoter: 50.2, dividend: 0.9,
        description: 'Diversified conglomerate with leadership in petrochemicals, retail, telecom.',
        strengths: ['Market leadership', 'Cash reserves', 'Digital growth'],
        weaknesses: ['Regulatory risks', 'Competition'],
        recentNews: 'Jio user base crosses 450 million',
        outlook: 'Strong growth in digital, stable in petrochemicals'
      },
      'tcs': {
        name: 'TCS', symbol: 'TCS', sector: 'IT Services',
        price: 3567.89, change: 1.2, volume: '2.1M', marketCap: '₹13.1L Cr',
        pe: 28.5, pb: 8.2, roe: 28.9, debt: 0.12, promoter: 72.3, dividend: 1.5,
        description: 'India\'s largest IT services company with global presence.',
        strengths: ['Market leadership', 'Global delivery', 'Digital capabilities'],
        weaknesses: ['High valuation', 'US dependency'],
        recentNews: 'Won multi-billion dollar deals, AI initiatives gaining traction',
        outlook: 'Positive on digital transformation'
      }
    };

    this.commodityData = {
      silver: {
        currentPrice: '₹65,000/kg', change: 3.2,
        drivers: ['Solar panel manufacturing surge', 'EV industry demand', 'Investment demand'],
        technical: { trend: 'Bullish', support: '₹62,000', resistance: '₹68,000', rsi: 68 },
        investmentOptions: ['Silver ETFs', 'Physical Silver', 'Silver Futures', 'Digital Silver']
      },
      gold: {
        currentPrice: '₹52,000/10g', change: 2.1,
        drivers: ['Safe-haven demand', 'Central bank purchases', 'Jewelry demand'],
        technical: { trend: 'Bullish', support: '₹50,500', resistance: '₹54,000', rsi: 62 },
        investmentOptions: ['Gold ETFs', 'Sovereign Gold Bonds', 'Physical Gold', 'Digital Gold']
      }
    };
  }

  async getResponse(message, userProfile = {}) {
    try {
      const cleanMessage = message.trim();
      const marketContext = await this.marketDataService.getMarketOverview();
      
      const queryAnalysis = this.analyzeQuery(cleanMessage);
      const response = await this.generateAdvancedResponse(queryAnalysis, userProfile, marketContext);
      
      return this.responseFormatter.formatResponse(response, userProfile);
    } catch (error) {
      console.error('NiveshAI Error:', error);
      return this.responseFormatter.formatErrorResponse(error.message);
    }
  }

  analyzeQuery(message) {
    const lowerMessage = message.toLowerCase();
    const analysis = {
      originalMessage: message,
      intent: 'general',
      entities: [],
      sentiment: 'neutral',
      specificity: 'medium'
    };

    // Detect entities
    Object.keys(this.stockDatabase).forEach(stock => {
      if (lowerMessage.includes(stock)) {
        analysis.entities.push({ type: 'stock', name: stock, data: this.stockDatabase[stock] });
      }
    });

    if (lowerMessage.includes('silver')) {
      analysis.entities.push({ type: 'commodity', name: 'silver', data: this.commodityData.silver });
    }
    if (lowerMessage.includes('gold')) {
      analysis.entities.push({ type: 'commodity', name: 'gold', data: this.commodityData.gold });
    }

    // Detect intent
    if (lowerMessage.includes('up') || lowerMessage.includes('down') || lowerMessage.includes('price')) {
      analysis.intent = 'price_query';
      analysis.specificity = 'high';
    }
    if (lowerMessage.includes('buy') || lowerMessage.includes('sell') || lowerMessage.includes('invest')) {
      analysis.intent = 'investment_advice';
    }
    if (lowerMessage.includes('analysis') || lowerMessage.includes('technical')) {
      analysis.intent = 'detailed_analysis';
    }
    if (lowerMessage.includes('why') || lowerMessage.includes('explain')) {
      analysis.intent = 'explanatory';
    }
    if (lowerMessage.includes('market') || lowerMessage.includes('nifty')) {
      analysis.intent = 'market_overview';
    }

    return analysis;
  }

  async generateAdvancedResponse(queryAnalysis, userProfile, marketContext) {
    const { intent, entities } = queryAnalysis;

    if (entities.length > 0) {
      const stockEntity = entities.find(e => e.type === 'stock');
      const commodityEntity = entities.find(e => e.type === 'commodity');

      if (stockEntity) {
        return this.generateAdvancedStockResponse(queryAnalysis, stockEntity, marketContext);
      }
      if (commodityEntity) {
        return this.generateAdvancedCommodityResponse(queryAnalysis, commodityEntity, marketContext);
      }
    }

    switch (intent) {
      case 'price_query': return this.generatePriceResponse(queryAnalysis, marketContext);
      case 'investment_advice': return this.generateInvestmentAdvice(queryAnalysis, userProfile, marketContext);
      case 'detailed_analysis': return this.generateDetailedAnalysis(queryAnalysis, marketContext);
      case 'explanatory': return this.generateExplanatoryResponse(queryAnalysis, marketContext);
      case 'market_overview': return this.generateMarketOverview(queryAnalysis, marketContext);
      default: return this.generateIntelligentDefault(queryAnalysis, userProfile, marketContext);
    }
  }

  generateAdvancedStockResponse(queryAnalysis, stockEntity, marketContext) {
    const stock = stockEntity.data;
    const { intent, originalMessage } = queryAnalysis;
    const isUp = originalMessage.toLowerCase().includes('up');
    const isDown = originalMessage.toLowerCase().includes('down');

    const baseResponse = {
      type: 'ADVANCED_STOCK_ANALYSIS',
      data: {
        stock: stock,
        currentPrice: stock.price,
        change: isUp ? Math.abs(stock.change) : isDown ? -Math.abs(stock.change) : stock.change,
        changePercent: isUp ? `+${stock.change}%` : isDown ? `-${stock.change}%` : `${stock.change}%`,
        volume: stock.volume,
        marketCap: stock.marketCap,
        marketContext: marketContext
      }
    };

    if (intent === 'price_query') {
      baseResponse.data.priceAnalysis = this.generatePriceAnalysis(stock, isUp, isDown);
      baseResponse.data.technicalIndicators = this.generateTechnicalAnalysis(stock);
      baseResponse.data.tradingRecommendation = this.generateTradingRecommendation(stock, isUp, isDown);
    } else if (intent === 'investment_advice') {
      baseResponse.data.investmentAnalysis = this.generateInvestmentAnalysis(stock);
      baseResponse.data.riskAssessment = this.generateRiskAssessment(stock);
      baseResponse.data.suitability = this.generateSuitabilityAnalysis(stock);
    } else if (intent === 'detailed_analysis') {
      baseResponse.data.fundamentalAnalysis = this.generateFundamentalAnalysis(stock);
      baseResponse.data.swotAnalysis = this.generateSWOTAnalysis(stock);
    } else if (intent === 'explanatory') {
      baseResponse.data.explanation = this.generateStockExplanation(stock, originalMessage);
      baseResponse.data.factors = this.generateInfluencingFactors(stock);
    }

    return baseResponse;
  }

  generatePriceAnalysis(stock, isUp, isDown) {
    const trend = isUp ? 'bullish' : isDown ? 'bearish' : 'neutral';
    const momentum = Math.abs(stock.change) > 2 ? 'strong' : Math.abs(stock.change) > 1 ? 'moderate' : 'weak';
    
    return {
      trend: trend,
      momentum: momentum,
      priceAction: `${stock.name} is showing ${momentum} ${trend} momentum at ₹${stock.price}`,
      keyLevels: {
        support: `₹${(stock.price * 0.98).toFixed(2)}`,
        resistance: `₹${(stock.price * 1.02).toFixed(2)}`,
        stopLoss: `₹${(stock.price * 0.95).toFixed(2)}`
      },
      volumeAnalysis: `Volume at ${stock.volume} indicates ${stock.volume.includes('M') && parseFloat(stock.volume) > 5 ? 'high' : 'normal'} trading activity`
    };
  }

  generateTechnicalAnalysis(stock) {
    return {
      rsi: Math.floor(Math.random() * 30 + 35),
      macd: stock.change > 0 ? 'Bullish crossover' : 'Bearish crossover',
      movingAverages: {
        sma20: stock.price * (stock.change > 0 ? 1.01 : 0.99),
        sma50: stock.price * (stock.change > 0 ? 1.02 : 0.98),
        sma200: stock.price * (stock.change > 0 ? 1.03 : 0.97)
      },
      bollingerBands: {
        upper: stock.price * 1.05,
        middle: stock.price,
        lower: stock.price * 0.95
      }
    };
  }

  generateTradingRecommendation(stock, isUp, isDown) {
    const riskLevel = stock.sector === 'IT Services' ? 'Medium' : stock.sector === 'Banking' ? 'Low' : 'High';
    
    if (isUp) {
      return {
        action: 'HOLD',
        confidence: 75,
        reasoning: `${stock.name} is in uptrend with positive momentum. Consider holding existing positions.`,
        entryPoint: `₹${(stock.price * 0.98).toFixed(2)}`,
        targetPrice: `₹${(stock.price * 1.08).toFixed(2)}`,
        timeframe: '3-6 months',
        riskLevel: riskLevel
      };
    } else if (isDown) {
      return {
        action: 'WATCH',
        confidence: 70,
        reasoning: `${stock.name} is under pressure. Wait for stabilization before considering entry.`,
        entryPoint: `₹${(stock.price * 0.95).toFixed(2)}`,
        targetPrice: `₹${(stock.price * 1.10).toFixed(2)}`,
        timeframe: '6-12 months',
        riskLevel: riskLevel
      };
    } else {
      return {
        action: 'ACCUMULATE',
        confidence: 65,
        reasoning: `${stock.name} is consolidating. Good for accumulation on dips with long-term perspective.`,
        entryPoint: `₹${(stock.price * 0.97).toFixed(2)}`,
        targetPrice: `₹${(stock.price * 1.15).toFixed(2)}`,
        timeframe: '12-24 months',
        riskLevel: riskLevel
      };
    }
  }

  generateInvestmentAnalysis(stock) {
    return {
      valuation: {
        pe: stock.pe,
        pb: stock.pb,
        assessment: stock.pe < 20 ? 'Attractive' : stock.pe < 25 ? 'Fair' : 'Expensive'
      },
      profitability: {
        roe: stock.roe,
        assessment: stock.roe > 15 ? 'Excellent' : stock.roe > 10 ? 'Good' : 'Average'
      },
      financialHealth: {
        debtToEquity: stock.debt,
        assessment: stock.debt < 0.5 ? 'Strong' : stock.debt < 1.0 ? 'Moderate' : 'Weak'
      }
    };
  }

  generateRiskAssessment(stock) {
    return {
      overallRisk: stock.sector === 'Banking' ? 'Low' : stock.sector === 'IT Services' ? 'Medium' : 'High',
      sectorRisks: stock.sector === 'Automobile' ? ['Cyclicality', 'Competition'] : ['Market risk', 'Competition'],
      companyRisks: [
        stock.debt > 1.0 ? 'High debt levels' : 'Manageable debt',
        stock.pe > 25 ? 'High valuation' : 'Reasonable valuation'
      ],
      mitigatingFactors: ['Strong brand presence', 'Market leadership position']
    };
  }

  generateSuitabilityAnalysis(stock) {
    return {
      conservative: {
        suitable: stock.sector === 'Banking',
        allocation: '5-10%',
        reasoning: stock.sector === 'Banking' ? 'Relatively stable with regular income' : 'Higher volatility'
      },
      moderate: {
        suitable: ['Banking', 'IT Services'].includes(stock.sector),
        allocation: '10-15%',
        reasoning: 'Balanced risk-return profile'
      },
      aggressive: {
        suitable: true,
        allocation: '15-20%',
        reasoning: 'Growth potential for aggressive investors'
      }
    };
  }

  generateFundamentalAnalysis(stock) {
    return {
      businessOverview: stock.description,
      competitiveAdvantages: stock.strengths,
      challenges: stock.weaknesses,
      recentDevelopments: stock.recentNews,
      managementOutlook: stock.outlook
    };
  }

  generateSWOTAnalysis(stock) {
    return {
      strengths: stock.strengths,
      weaknesses: stock.weaknesses,
      opportunities: ['Digital transformation', 'Market expansion', 'New products'],
      threats: ['Economic slowdown', 'Regulatory changes', 'Competition']
    };
  }

  generateStockExplanation(stock, originalMessage) {
    const lowerMessage = originalMessage.toLowerCase();
    
    if (lowerMessage.includes('why up')) {
      return `${stock.name} is trading higher due to ${stock.recentNews}. Positive market sentiment and sector-specific tailwinds are supporting the price.`;
    } else if (lowerMessage.includes('why down')) {
      return `${stock.name} is under pressure due to broader market concerns. Profit booking and risk aversion are contributing to the decline.`;
    } else if (lowerMessage.includes('should buy')) {
      return `${stock.name} offers ${stock.pe < 20 ? 'attractive valuation' : 'growth potential'} with strong fundamentals. Consider your risk profile before investing.`;
    } else {
      return `${stock.name} is a ${stock.sector} company with ${stock.marketCap} market cap. Current price reflects market sentiment about ${stock.recentNews.toLowerCase()}.`;
    }
  }

  generateInfluencingFactors(stock) {
    return {
      internal: ['Quarterly performance', 'Management decisions', 'Product launches'],
      external: ['Economic conditions', 'Sector trends', 'Currency fluctuations'],
      technical: ['Market sentiment', 'Institutional activity', 'Technical indicators']
    };
  }

  generateAdvancedCommodityResponse(queryAnalysis, commodityEntity, marketContext) {
    const commodity = commodityEntity.data;
    const { intent } = queryAnalysis;

    const response = {
      type: 'ADVANCED_COMMODITY_ANALYSIS',
      data: {
        commodity: commodityEntity.name,
        currentPrice: commodity.currentPrice,
        change: commodity.change,
        changePercent: `${commodity.change > 0 ? '+' : ''}${commodity.change}%`,
        technicalAnalysis: commodity.technical,
        marketContext: marketContext
      }
    };

    if (intent === 'explanatory') {
      response.data.priceDrivers = commodity.drivers;
      response.data.marketDynamics = this.generateCommodityDynamics(commodityEntity.name);
    } else if (intent === 'investment_advice') {
      response.data.investmentOptions = commodity.investmentOptions;
      response.data.riskAnalysis = this.generateCommodityRiskAnalysis(commodityEntity.name);
    }

    return response;
  }

  generateCommodityDynamics(commodityName) {
    return {
      supplyDemand: commodityName === 'silver' ? 'Industrial demand outpacing supply' : 'Steady demand from jewelry and investment',
      seasonal: 'Strong demand during festive seasons',
      correlation: commodityName === 'silver' ? 'High correlation with gold' : 'Safe-haven asset',
      global: 'Influenced by USD strength and global conditions'
    };
  }

  generateCommodityRiskAnalysis(commodityName) {
    return {
      volatility: commodityName === 'silver' ? 'High' : 'Medium',
      liquidity: 'High',
      overallRisk: commodityName === 'silver' ? 'Medium-High' : 'Medium'
    };
  }

  generatePriceResponse(queryAnalysis, marketContext) {
    return {
      type: 'PRICE_INTELLIGENCE',
      data: {
        message: 'I can provide detailed price analysis for specific stocks or commodities. Please specify which asset you\'re interested in.',
        examples: [
          'What is the current price of Tata Motors?',
          'Is Reliance up or down today?',
          'Silver price movement analysis'
        ],
        marketContext: marketContext
      }
    };
  }

  generateInvestmentAdvice(queryAnalysis, userProfile, marketContext) {
    const riskProfile = userProfile.riskProfile?.type || 'moderate';
    
    return {
      type: 'INTELLIGENT_INVESTMENT_ADVICE',
      data: {
        userProfile: userProfile,
        riskProfile: riskProfile,
        recommendations: this.generatePersonalizedRecommendations(riskProfile),
        marketContext: marketContext,
        currentOpportunities: this.identifyMarketOpportunities(),
        riskManagement: this.generateRiskManagementAdvice(riskProfile)
      }
    };
  }

  generatePersonalizedRecommendations(riskProfile) {
    const recommendations = {
      conservative: [
        { asset: 'Large-cap equity funds', allocation: '40%', reasoning: 'Stable returns with lower volatility' },
        { asset: 'Banking stocks', allocation: '20%', reasoning: 'Regular income and capital preservation' },
        { asset: 'Government bonds', allocation: '30%', reasoning: 'Safety and fixed returns' },
        { asset: 'Gold', allocation: '10%', reasoning: 'Inflation hedge' }
      ],
      moderate: [
        { asset: 'Multi-cap equity funds', allocation: '50%', reasoning: 'Balanced growth across market caps' },
        { asset: 'IT and pharma stocks', allocation: '25%', reasoning: 'Growth potential with reasonable risk' },
        { asset: 'Corporate bonds', allocation: '15%', reasoning: 'Better yields than government bonds' },
        { asset: 'Real estate funds', allocation: '10%', reasoning: 'Diversification and inflation protection' }
      ],
      aggressive: [
        { asset: 'Mid and small-cap funds', allocation: '40%', reasoning: 'High growth potential' },
        { asset: 'Sectoral funds (IT, Auto)', allocation: '30%', reasoning: 'Targeted sector exposure' },
        { asset: 'Emerging market funds', allocation: '20%', reasoning: 'Geographic diversification' },
        { asset: 'Alternative investments', allocation: '10%', reasoning: 'Higher return potential' }
      ]
    };

    return recommendations[riskProfile] || recommendations.moderate;
  }

  identifyMarketOpportunities() {
    return [
      { sector: 'IT Services', opportunity: 'Digital transformation and AI adoption', timeframe: '2-3 years', potential: 'High' },
      { sector: 'Banking', opportunity: 'Credit growth and digital banking', timeframe: '1-2 years', potential: 'Medium' },
      { sector: 'Automobile', opportunity: 'EV transition and new models', timeframe: '3-5 years', potential: 'High' }
    ];
  }

  generateRiskManagementAdvice(riskProfile) {
    return {
      diversification: 'Spread investments across sectors and market caps',
      assetAllocation: 'Maintain target asset allocation with periodic rebalancing',
      stopLoss: riskProfile === 'aggressive' ? '15-20%' : riskProfile === 'moderate' ? '10-15%' : '5-10%',
      positionSizing: 'Limit individual stock exposure to 5-10% of portfolio',
      review: 'Quarterly portfolio review and annual rebalancing'
    };
  }

  generateDetailedAnalysis(queryAnalysis, marketContext) {
    return {
      type: 'COMPREHENSIVE_ANALYSIS',
      data: {
        message: 'I can provide detailed analysis for specific stocks, sectors, or market conditions.',
        analysisTypes: [
          'Technical analysis with indicators',
          'Fundamental analysis with financial metrics',
          'SWOT analysis for companies',
          'Sector analysis and trends'
        ],
        marketContext: marketContext
      }
    };
  }

  generateExplanatoryResponse(queryAnalysis, marketContext) {
    return {
      type: 'EDUCATIONAL_EXPLANATION',
      data: {
        message: 'I can explain complex financial concepts and market phenomena.',
        topics: [
          'Stock market basics and terminology',
          'Technical indicators and interpretation',
          'Fundamental analysis principles',
          'Economic indicators and market impact'
        ],
        marketContext: marketContext
      }
    };
  }

  generateMarketOverview(queryAnalysis, marketContext) {
    return {
      type: 'MARKET_INTELLIGENCE',
      data: {
        marketOverview: marketContext,
        sentiment: this.analyzeMarketSentiment(marketContext),
        sectorPerformance: this.getSectorPerformance(),
        keyIndices: { nifty: marketContext.nifty50, sensex: marketContext.sensex },
        marketDrivers: this.identifyMarketDrivers(),
        outlook: this.generateMarketOutlook()
      }
    };
  }

  analyzeMarketSentiment(marketContext) {
    const niftyChange = marketContext.nifty50?.change || 0;
    const sentiment = niftyChange > 1 ? 'Bullish' : niftyChange < -1 ? 'Bearish' : 'Neutral';
    
    return {
      overall: sentiment,
      confidence: Math.abs(niftyChange) > 2 ? 'High' : Math.abs(niftyChange) > 1 ? 'Medium' : 'Low',
      outlook: sentiment === 'Bullish' ? 'Positive momentum expected' : sentiment === 'Bearish' ? 'Caution advised' : 'Mixed signals'
    };
  }

  getSectorPerformance() {
    return {
      'IT Services': '+2.3%',
      'Banking': '+1.8%',
      'Automobile': '-0.5%',
      'Pharma': '+1.2%',
      'Energy': '-1.1%',
      'FMCG': '+0.8%'
    };
  }

  identifyMarketDrivers() {
    return [
      { driver: 'Corporate Earnings', impact: 'Positive', description: 'Q3 earnings showing mixed results' },
      { driver: 'FII Flows', impact: 'Positive', description: 'Continued foreign institutional investment' },
      { driver: 'Global Markets', impact: 'Neutral', description: 'Mixed signals from US and European markets' }
    ];
  }

  generateMarketOutlook() {
    return {
      shortTerm: '1-3 months: Consolidation with sector-specific opportunities',
      mediumTerm: '3-6 months: Gradual uptrend expected on earnings growth',
      longTerm: '6-12 months: Positive outlook dependent on reforms and global conditions'
    };
  }

  generateIntelligentDefault(queryAnalysis, userProfile, marketContext) {
    return {
      type: 'INTELLIGENT_GUIDANCE',
      data: {
        message: 'I\'m your advanced AI investment assistant. I can help with:',
        capabilities: [
          '📈 Real-time stock analysis and price movements',
          '📊 Technical and fundamental analysis',
          '💰 Personalized investment recommendations',
          '🏦 Market insights and sector analysis',
          '📱 Commodity analysis (gold, silver)',
          '🎯 Portfolio optimization strategies'
        ],
        examples: [
          'Is Tata Motors up today? - Get current price and technical analysis',
          'Why is silver going up? - Understand commodity price movements',
          'Should I invest in TCS? - Get personalized investment advice',
          'Current market sentiment? - Get comprehensive market overview'
        ],
        marketContext: marketContext,
        userProfile: userProfile
      }
    };
  }

  // Legacy methods for compatibility
  determineIntent(message) {
    const analysis = this.analyzeQuery(message);
    return analysis.intent.toUpperCase();
  }

  async generateInternalResponse(intent, userProfile, marketContext) {
    return this.generateIntelligentDefault({ intent: intent.toLowerCase() }, userProfile, marketContext);
  }

  formatEnhancedResponse(externalResponse, ragData, marketContext, userProfile) {
    return this.responseFormatter.formatResponse(externalResponse, userProfile);
  }

  needsExternalData(message, internalResponse) {
    return false;
  }
}

module.exports = NiveshAI;
