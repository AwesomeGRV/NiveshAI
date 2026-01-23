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
  }

  async getResponse(message, userProfile = {}) {
    try {
      // Clean and preprocess message
      const cleanMessage = message.trim().toLowerCase();
      
      // Determine user intent and category
      const intent = this.determineIntent(cleanMessage);
      
      // Get user risk profile if not provided
      if (!userProfile.riskProfile) {
        userProfile.riskProfile = this.riskProfiler.getDefaultProfile();
      }

      // Generate response based on intent
      let response;
      switch (intent.category) {
        case 'STOCK_RECOMMENDATION':
          response = await this.handleStockRecommendation(intent, userProfile);
          break;
        case 'MUTUAL_FUND':
          response = await this.handleMutualFundQuery(intent, userProfile);
          break;
        case 'PORTFOLIO_MANAGEMENT':
          response = await this.handlePortfolioManagement(intent, userProfile);
          break;
        case 'MARKET_ANALYSIS':
          response = await this.handleMarketAnalysis(intent, userProfile);
          break;
        case 'RISK_ASSESSMENT':
          response = await this.handleRiskAssessment(intent, userProfile);
          break;
        case 'TAX_PLANNING':
          response = await this.handleTaxPlanning(intent, userProfile);
          break;
        case 'EDUCATIONAL':
          response = await this.handleEducationalQuery(intent, userProfile);
          break;
        default:
          response = await this.handleGeneralQuery(intent, userProfile);
      }

      // Format response with disclaimer
      return this.responseFormatter.formatResponse(response, userProfile);
    } catch (error) {
      console.error('NiveshAI Error:', error);
      return this.responseFormatter.formatErrorResponse(error.message);
    }
  }

  determineIntent(message) {
    const intents = {
      STOCK_RECOMMENDATION: [
        'which stocks', 'best stocks', 'stock recommendation', 'good stocks',
        'buy stocks', 'invest in stocks', 'stock ideas', 'top stocks'
      ],
      MUTUAL_FUND: [
        'mutual fund', 'sip', 'lump sum', 'fund recommendation', 'best funds',
        'index fund', 'elss', 'debt fund', 'hybrid fund', 'flexi cap'
      ],
      PORTFOLIO_MANAGEMENT: [
        'portfolio', 'allocation', 'rebalance', 'diversify', 'asset allocation',
        'portfolio construction', 'investment strategy'
      ],
      MARKET_ANALYSIS: [
        'market analysis', 'sector rotation', 'market outlook', 'nifty', 'sensex',
        'market trend', 'bull market', 'bear market'
      ],
      RISK_ASSESSMENT: [
        'risk', 'risk appetite', 'risk profile', 'volatility', 'downside',
        'risk management', 'safety', 'conservative', 'aggressive'
      ],
      TAX_PLANNING: [
        'tax', 'tax saving', '80c', 'capital gains', 'tax efficient',
        'tax planning', 'long term capital gains', 'short term capital gains'
      ],
      EDUCATIONAL: [
        'what is', 'explain', 'how to', 'difference between', 'meaning of',
        'tutorial', 'guide', 'learn', 'understand'
      ]
    };

    for (const [category, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return {
          category,
          confidence: 0.8,
          originalMessage: message,
          extractedEntities: this.extractEntities(message)
        };
      }
    }

    return {
      category: 'GENERAL',
      confidence: 0.5,
      originalMessage: message,
      extractedEntities: {}
    };
  }

  extractEntities(message) {
    const entities = {};
    
    // Extract time periods
    if (message.includes('long term') || message.includes('5-10') || message.includes('10 year')) {
      entities.timeHorizon = 'long_term';
    } else if (message.includes('short term') || message.includes('1-2') || message.includes('intraday')) {
      entities.timeHorizon = 'short_term';
    } else if (message.includes('medium term') || message.includes('3-5')) {
      entities.timeHorizon = 'medium_term';
    }

    // Extract market cap preferences
    if (message.includes('large cap') || message.includes('blue chip')) {
      entities.marketCap = 'large_cap';
    } else if (message.includes('mid cap')) {
      entities.marketCap = 'mid_cap';
    } else if (message.includes('small cap')) {
      entities.marketCap = 'small_cap';
    }

    // Extract risk preferences
    if (message.includes('conservative') || message.includes('low risk')) {
      entities.riskPreference = 'conservative';
    } else if (message.includes('aggressive') || message.includes('high risk')) {
      entities.riskPreference = 'aggressive';
    } else if (message.includes('moderate') || message.includes('balanced')) {
      entities.riskPreference = 'moderate';
    }

    return entities;
  }

  async handleStockRecommendation(intent, userProfile) {
    const { timeHorizon, marketCap, riskPreference } = intent.extractedEntities;
    
    // Get market data and analysis
    const marketData = await this.marketDataService.getMarketOverview();
    const stockRecommendations = this.knowledgeBase.getStockRecommendations({
      timeHorizon: timeHorizon || userProfile.riskProfile.timeHorizon,
      marketCap,
      riskPreference: riskPreference || userProfile.riskProfile.type
    });

    return {
      type: 'STOCK_RECOMMENDATION',
      data: {
        marketOverview: marketData,
        recommendations: stockRecommendations,
        analysis: this.generateStockAnalysis(stockRecommendations, userProfile)
      }
    };
  }

  async handleMutualFundQuery(intent, userProfile) {
    const fundType = this.extractFundType(intent.originalMessage);
    const fundData = await this.marketDataService.getMutualFundData(fundType);
    const recommendations = this.knowledgeBase.getMutualFundRecommendations(fundType, userProfile);

    return {
      type: 'MUTUAL_FUND',
      data: {
        fundType,
        topFunds: recommendations,
        marketData: fundData,
        sipVsLumpSum: this.analyzeSipVsLumpSum(userProfile)
      }
    };
  }

  async handlePortfolioManagement(intent, userProfile) {
    const allocation = this.knowledgeBase.getOptimalAllocation(userProfile);
    const rebalancingStrategy = this.knowledgeBase.getRebalancingStrategy(userProfile);

    return {
      type: 'PORTFOLIO_MANAGEMENT',
      data: {
        recommendedAllocation: allocation,
        rebalancingStrategy,
        riskMetrics: this.calculatePortfolioRisk(allocation),
        taxEfficiency: this.analyzeTaxEfficiency(allocation)
      }
    };
  }

  async handleMarketAnalysis(intent, userProfile) {
    const marketData = await this.marketDataService.getDetailedMarketAnalysis();
    const sectorAnalysis = await this.marketDataService.getSectorAnalysis();

    return {
      type: 'MARKET_ANALYSIS',
      data: {
        currentMarketStatus: marketData,
        sectorTrends: sectorAnalysis,
        outlook: this.generateMarketOutlook(marketData, userProfile),
        keyIndicators: this.getKeyMarketIndicators()
      }
    };
  }

  async handleRiskAssessment(intent, userProfile) {
    const riskProfile = this.riskProfiler.assessRiskProfile(intent.originalMessage, userProfile);
    const riskMitigation = this.knowledgeBase.getRiskMitigationStrategies(riskProfile);

    return {
      type: 'RISK_ASSESSMENT',
      data: {
        riskProfile,
        riskCapacity: this.calculateRiskCapacity(userProfile),
        mitigationStrategies: riskMitigation,
        assetAllocation: this.getRiskBasedAllocation(riskProfile)
      }
    };
  }

  async handleTaxPlanning(intent, userProfile) {
    const taxStrategies = this.knowledgeBase.getTaxPlanningStrategies(userProfile);
    const taxEfficientFunds = this.knowledgeBase.getTaxEfficientInvestments();

    return {
      type: 'TAX_PLANNING',
      data: {
        strategies: taxStrategies,
        taxEfficientInvestments: taxEfficientFunds,
        section80cOptions: this.getSection80COptions(),
        capitalGainsTax: this.explainCapitalGainsTax()
      }
    };
  }

  async handleEducationalQuery(intent, userProfile) {
    const topic = this.extractEducationalTopic(intent.originalMessage);
    const explanation = this.knowledgeBase.getEducationalContent(topic);

    return {
      type: 'EDUCATIONAL',
      data: {
        topic,
        explanation,
        examples: this.getExamples(topic),
        relatedTopics: this.getRelatedTopics(topic)
      }
    };
  }

  async handleGeneralQuery(intent, userProfile) {
    return {
      type: 'GENERAL',
      data: {
        message: 'I can help you with Indian stock market investments, mutual funds, portfolio management, and tax planning. Please ask me specific questions about these topics.',
        suggestions: [
          'Which are the best large-cap stocks for long-term investment?',
          'How should I start my SIP investment?',
          'What is the ideal asset allocation for my age?',
          'Which tax-saving investments should I consider?'
        ]
      }
    };
  }

  // Helper methods
  extractFundType(message) {
    if (message.includes('large cap')) return 'large_cap';
    if (message.includes('mid cap')) return 'mid_cap';
    if (message.includes('small cap')) return 'small_cap';
    if (message.includes('index')) return 'index';
    if (message.includes('elss')) return 'elss';
    if (message.includes('debt')) return 'debt';
    if (message.includes('hybrid')) return 'hybrid';
    return 'all';
  }

  extractEducationalTopic(message) {
    if (message.includes('sip')) return 'sip';
    if (message.includes('mutual fund')) return 'mutual_fund';
    if (message.includes('stock market')) return 'stock_market';
    if (message.includes('portfolio')) return 'portfolio';
    if (message.includes('risk')) return 'risk';
    return 'general';
  }

  generateStockAnalysis(recommendations, userProfile) {
    return {
      totalRecommendations: recommendations.length,
      averagePE: this.calculateAveragePE(recommendations),
      riskScore: this.calculateRiskScore(recommendations, userProfile),
      diversificationScore: this.calculateDiversificationScore(recommendations)
    };
  }

  analyzeSipVsLumpSum(userProfile) {
    return {
      recommendation: userProfile.riskProfile.type === 'conservative' ? 'SIP' : 'Hybrid',
      reasoning: 'SIP provides rupee cost averaging and reduces timing risk',
      expectedReturns: {
        sip: '12-15% CAGR over 10 years',
        lumpSum: '15-18% CAGR over 10 years (with higher volatility)'
      }
    };
  }

  calculatePortfolioRisk(allocation) {
    // Simplified risk calculation
    const equityRisk = allocation.equity * 0.15;
    const debtRisk = allocation.debt * 0.05;
    const goldRisk = allocation.gold * 0.10;
    
    return {
      portfolioRisk: equityRisk + debtRisk + goldRisk,
      riskLevel: this.getRiskLevel(equityRisk + debtRisk + goldRisk),
      volatility: 'Medium'
    };
  }

  getRiskLevel(risk) {
    if (risk < 0.05) return 'Low';
    if (risk < 0.10) return 'Medium';
    return 'High';
  }

  getKeyMarketIndicators() {
    return {
      nifty50: 'Current: 19,876 | P/E: 22.5 | Dividend: 1.2%',
      sensex: 'Current: 66,543 | P/E: 24.1 | Dividend: 1.1%',
      vix: 'Current: 14.2 | Trend: Stable',
      bondYield: '10Y G-Sec: 7.1% | Trend: Stable'
    };
  }

  getExamples(topic) {
    const examples = {
      sip: [
        'Invest ₹5,000 monthly in a flexi-cap fund for 10 years',
        'Step-up SIP increasing by 10% annually',
        'Emergency fund SIP in liquid funds'
      ],
      mutual_fund: [
        'Axis Bluechip Fund for large-cap exposure',
        'Parag Parikh Flexi Cap for diversified equity',
        'HDFC Hybrid Equity Fund for balanced approach'
      ]
    };
    return examples[topic] || [];
  }

  getRelatedTopics(topic) {
    const related = {
      sip: ['mutual_fund', 'power_of_compounding', 'rupee_cost_averaging'],
      mutual_fund: ['sip', 'expense_ratio', 'fund_types'],
      stock_market: ['fundamental_analysis', 'technical_analysis', 'market_cycles']
    };
    return related[topic] || [];
  }

  calculateAveragePE(recommendations) {
    // Simplified calculation
    return 22.5; // Placeholder
  }

  calculateRiskScore(recommendations, userProfile) {
    // Simplified risk scoring
    return userProfile.riskProfile.type === 'aggressive' ? 8 : 5;
  }

  calculateDiversificationScore(recommendations) {
    // Simplified diversification scoring
    return 7.5;
  }

  calculateRiskCapacity(userProfile) {
    // Simplified risk capacity calculation
    return {
      capacity: 'Medium',
      factors: ['Age', 'Income Stability', 'Dependents', 'Existing Investments']
    };
  }

  getRiskBasedAllocation(riskProfile) {
    const allocations = {
      conservative: { equity: 30, debt: 60, gold: 5, cash: 5 },
      moderate: { equity: 60, debt: 30, gold: 5, cash: 5 },
      aggressive: { equity: 80, debt: 15, gold: 3, cash: 2 }
    };
    return allocations[riskProfile.type] || allocations.moderate;
  }

  analyzeTaxEfficiency(allocation) {
    return {
      efficiency: 'Good',
      suggestions: [
        'Consider ELSS funds for tax saving under 80C',
        'Hold equity investments for >1 year for LTCG benefits',
        'Use indexation benefits for debt funds'
      ]
    };
  }

  generateMarketOutlook(marketData, userProfile) {
    return {
      shortTerm: 'Cautiously optimistic with volatility expected',
      mediumTerm: 'Positive growth expected in key sectors',
      longTerm: 'Strong fundamentals support growth',
      keyFactors: ['GDP Growth', 'Corporate Earnings', 'Monetary Policy', 'Global Markets']
    };
  }

  getSection80COptions() {
    return {
      totalLimit: '₹1,50,000',
      options: [
        { name: 'ELSS Mutual Funds', limit: '₹1,50,000', lockIn: '3 years', returns: '12-15%' },
        { name: 'PPF', limit: '₹1,50,000', lockIn: '15 years', returns: '7.1%' },
        { name: 'Tax Saving FD', limit: '₹1,50,000', lockIn: '5 years', returns: '6.5-7%' },
        { name: 'NPS', limit: '₹1,50,000', lockIn: 'Till retirement', returns: '10-12%' }
      ]
    };
  }

  explainCapitalGainsTax() {
    return {
      equity: {
        shortTerm: '15% if held <1 year',
        longTerm: '10% on gains >₹1 lakh (held >1 year)'
      },
      debt: {
        shortTerm: 'As per income tax slab',
        longTerm: '20% with indexation benefits'
      },
      mutualFunds: {
        equity: 'Same as direct equity',
        debt: 'Same as debt instruments'
      }
    };
  }
}

module.exports = NiveshAI;
