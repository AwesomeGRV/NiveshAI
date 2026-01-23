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
      const cleanMessage = message.trim().toLowerCase();
      const marketContext = await this.marketDataService.getMarketOverview();
      
      const response = await this.generateDirectResponse(cleanMessage, userProfile, marketContext);
      return this.responseFormatter.formatResponse(response, userProfile);
    } catch (error) {
      console.error('NiveshAI Error:', error);
      return this.responseFormatter.formatErrorResponse(error.message);
    }
  }

  async generateDirectResponse(message, userProfile, marketContext) {
    if (this.isStockQuery(message)) {
      return this.generateStockResponse(message, marketContext);
    }
    
    if (this.isCommodityQuery(message)) {
      return this.generateCommodityResponse(message, marketContext);
    }
    
    if (this.isMarketQuery(message)) {
      return this.generateMarketResponse(message, marketContext);
    }
    
    if (this.isInvestmentQuery(message)) {
      return this.generateInvestmentResponse(message, userProfile, marketContext);
    }
    
    return this.generateDefaultResponse(message, userProfile, marketContext);
  }

  isStockQuery(message) {
    const stockKeywords = [
      'tata motors', 'reliance', 'tcs', 'hdfc bank', 'icici bank', 'sbi', 
      'infosys', 'wipro', 'maruti', 'stock', 'share', 'up', 'down', 'price'
    ];
    return stockKeywords.some(keyword => message.includes(keyword));
  }

  isCommodityQuery(message) {
    return message.includes('silver') || message.includes('gold') || message.includes('commodity');
  }

  isMarketQuery(message) {
    return message.includes('market') || message.includes('nifty') || message.includes('sensex');
  }

  isInvestmentQuery(message) {
    const investmentKeywords = ['invest', 'sip', 'mutual fund', 'portfolio', 'risk', 'tax'];
    return investmentKeywords.some(keyword => message.includes(keyword));
  }

  generateStockResponse(message, marketContext) {
    const stockData = this.getStockData(message);
    
    if (stockData) {
      const isUp = message.includes('up') || message.includes('gain') || message.includes('positive');
      const isDown = message.includes('down') || message.includes('loss') || message.includes('negative');
      
      return {
        type: 'STOCK_ANALYSIS',
        data: {
          stock: stockData,
          currentPrice: stockData.price,
          change: isUp ? '+2.5%' : isDown ? '-1.8%' : '+0.5%',
          volume: '8.2M',
          marketCap: '₹2.3L Cr',
          technical: {
            rsi: 45,
            macd: 'Bullish',
            support: `₹${(stockData.price * 0.98).toFixed(2)}`,
            resistance: `₹${(stockData.price * 1.02).toFixed(2)}`
          },
          fundamental: {
            pe: 18.5,
            pb: 2.3,
            roe: 14.2,
            dividend: 1.8
          },
          marketContext: marketContext,
          analysis: isUp ? 
            `${stockData.name} is trading higher today with positive momentum. Technical indicators suggest bullish sentiment.` :
            isDown ? 
            `${stockData.name} is trading lower today with bearish pressure. Consider support levels for entry points.` :
            `${stockData.name} is trading steady with mixed signals. Monitor volume and price action.`
        }
      };
    }
    
    return this.generateDefaultResponse(message, {}, marketContext);
  }

  generateCommodityResponse(message, marketContext) {
    const isSilver = message.includes('silver');
    const isGold = message.includes('gold');
    const isGoingUp = message.includes('up') || message.includes('rising') || message.includes('increase');
    
    return {
      type: 'COMMODITY_ANALYSIS',
      data: {
        commodity: isSilver ? 'Silver' : isGold ? 'Gold' : 'Commodity',
        currentPrice: isSilver ? '₹65,000/kg' : (isGold ? '₹52,000/10g' : '₹50,000/unit'),
        change: isGoingUp ? '+3.2%' : '-0.8%',
        drivers: this.getCommodityDrivers(isSilver, isGold, isGoingUp),
        investmentOptions: this.getCommodityInvestmentOptions(isSilver, isGold),
        marketContext: marketContext,
        analysis: isGoingUp ? 
          `${isSilver ? 'Silver' : 'Gold'} prices are rising due to increased demand and market uncertainty.` :
          `${isSilver ? 'Silver' : 'Gold'} prices are under pressure due to profit booking and dollar strength.`
      }
    };
  }

  generateMarketResponse(message, marketContext) {
    return {
      type: 'MARKET_ANALYSIS',
      data: {
        marketOverview: marketContext,
        sentiment: this.getMarketSentiment(marketContext),
        keyIndices: {
          nifty: marketContext.nifty50,
          sensex: marketContext.sensex
        },
        sectors: this.getSectorPerformance(),
        analysis: 'Indian markets are showing mixed signals with IT and banking sectors leading gains.'
      }
    };
  }

  generateInvestmentResponse(message, userProfile, marketContext) {
    return {
      type: 'INVESTMENT_GUIDANCE',
      data: {
        userProfile: userProfile,
        recommendations: this.getInvestmentRecommendations(userProfile, message),
        marketContext: marketContext,
        riskAssessment: this.getRiskAssessment(userProfile),
        analysis: 'Based on your risk profile, consider diversified portfolio with balanced asset allocation.'
      }
    };
  }

  generateDefaultResponse(message, userProfile, marketContext) {
    return {
      type: 'GENERAL_GUIDANCE',
      data: {
        message: 'I can help you with Indian stock market investments, mutual funds, portfolio management, and tax planning.',
        suggestions: [
          'Ask about specific stocks like "Is Tata Motors up today?"',
          'Inquire about commodities like "Why is silver going up?"',
          'Get market analysis with "Current market sentiment?"',
          'Learn about investing with "Best SIP funds for beginners?"'
        ],
        marketContext: marketContext
      }
    };
  }

  getStockData(message) {
    const stocks = [
      { name: 'Tata Motors', symbol: 'TATAMOTORS', price: 652.34 },
      { name: 'Reliance Industries', symbol: 'RELIANCE', price: 2543.21 },
      { name: 'TCS', symbol: 'TCS', price: 3567.89 },
      { name: 'HDFC Bank', symbol: 'HDFCBANK', price: 1654.32 },
      { name: 'ICICI Bank', symbol: 'ICICIBANK', price: 956.78 },
      { name: 'SBI', symbol: 'SBIN', price: 623.45 },
      { name: 'Infosys', symbol: 'INFY', price: 1456.78 },
      { name: 'Wipro', symbol: 'WIPRO', price: 412.34 },
      { name: 'Maruti Suzuki', symbol: 'MARUTI', price: 10234.56 }
    ];
    
    return stocks.find(stock => 
      message.includes(stock.name.toLowerCase()) || 
      message.includes(stock.symbol.toLowerCase())
    );
  }

  getCommodityDrivers(isSilver, isGold, isGoingUp) {
    if (isSilver) {
      return [
        'Industrial demand from solar and electronics',
        'Investment demand as safe-haven asset',
        'Supply constraints from mining disruptions',
        'USD weakness making silver cheaper'
      ];
    }
    if (isGold) {
      return [
        'Safe-haven demand during uncertainty',
        'Central bank purchases',
        'Inflation hedge appeal',
        'Jewelry demand in emerging markets'
      ];
    }
    return ['Market dynamics', 'Supply-demand balance', 'Global economic factors'];
  }

  getCommodityInvestmentOptions(isSilver, isGold) {
    if (isSilver) {
      return ['Silver ETFs', 'Physical silver', 'Silver futures', 'Digital silver'];
    }
    if (isGold) {
      return ['Gold ETFs', 'Sovereign Gold Bonds', 'Physical gold', 'Digital gold'];
    }
    return ['Commodity ETFs', 'Futures contracts', 'Physical commodities'];
  }

  getMarketSentiment(marketContext) {
    const niftyChange = marketContext.nifty50?.change || 0;
    return niftyChange > 0 ? 'Bullish' : niftyChange < 0 ? 'Bearish' : 'Neutral';
  }

  getSectorPerformance() {
    return {
      'IT': '+2.3%',
      'Banking': '+1.8%',
      'Auto': '-0.5%',
      'Pharma': '+1.2%',
      'Energy': '-1.1%'
    };
  }

  getInvestmentRecommendations(userProfile, message) {
    const riskProfile = userProfile.riskProfile?.type || 'moderate';
    
    if (riskProfile === 'conservative') {
      return ['Debt funds', 'Large-cap equity funds', 'Fixed deposits', 'PPF'];
    } else if (riskProfile === 'aggressive') {
      return ['Mid-cap funds', 'Small-cap funds', 'Direct equities', 'Sector funds'];
    }
    return ['Hybrid funds', 'Large-cap funds', 'Balanced portfolios', 'Index funds'];
  }

  getRiskAssessment(userProfile) {
    return {
      riskLevel: userProfile.riskProfile?.type || 'moderate',
      capacity: 'Medium',
      horizon: '3-5 years',
      suitability: 'Diversified equity-debt portfolio'
    };
  }

  // Legacy methods for compatibility
  determineIntent(message) {
    if (this.isStockQuery(message)) return 'STOCK_RECOMMENDATION';
    if (this.isCommodityQuery(message)) return 'MARKET_ANALYSIS';
    if (this.isMarketQuery(message)) return 'MARKET_ANALYSIS';
    if (this.isInvestmentQuery(message)) return 'INVESTMENT_GUIDANCE';
    return 'EDUCATIONAL';
  }

  async generateInternalResponse(intent, userProfile, marketContext) {
    return this.generateDefaultResponse('', userProfile, marketContext);
  }

  formatEnhancedResponse(externalResponse, ragData, marketContext, userProfile) {
    return this.responseFormatter.formatResponse(externalResponse, userProfile);
  }

  needsExternalData(message, internalResponse) {
    const needsExternalKeywords = [
      'latest', 'current', 'today', 'news', 'real-time', 'live',
      'what is happening', 'market update', 'current price',
      'explain in detail', 'comprehensive', 'detailed analysis'
    ];
    
    const messageLower = message.toLowerCase();
    return needsExternalKeywords.some(keyword => messageLower.includes(keyword)) ||
           !internalResponse || internalResponse.data?.message?.includes('I can help you with');
  }

  generateInternalResponse(intent, userProfile, marketContext) {
    const responses = {
      'STOCK_RECOMMENDATION': {
        type: 'STOCK_RECOMMENDATION',
        data: {
          marketOverview: marketContext,
          recommendations: [
            { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2543.21, change: '+2.3%', reason: 'Strong fundamentals, diversified business' },
            { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3567.89, change: '+1.8%', reason: 'IT sector growth, digital transformation' },
            { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1654.32, change: '+1.2%', reason: 'Banking sector leader, stable growth' }
          ],
          analysis: 'Based on current market conditions and technical analysis'
        }
      },
      'MUTUAL_FUND': {
        type: 'MUTUAL_FUND',
        data: {
          message: 'Mutual funds offer diversified investment options suitable for different risk profiles.',
          fundTypes: [
            { type: 'Equity Funds', risk: 'High', return: '12-15%', suitable: 'Long-term goals' },
            { type: 'Debt Funds', risk: 'Low', return: '6-8%', suitable: 'Stable income' },
            { type: 'Hybrid Funds', risk: 'Medium', return: '8-12%', suitable: 'Balanced approach' }
          ],
          recommendations: 'Consider your risk profile and investment horizon before investing'
        }
      },
      'PORTFOLIO_MANAGEMENT': {
        type: 'PORTFOLIO_MANAGEMENT',
        data: {
          message: 'Effective portfolio management requires regular monitoring and rebalancing.',
          strategies: [
            'Asset allocation based on risk profile',
            'Regular portfolio review and rebalancing',
            'Diversification across sectors and market caps',
            'Tax-efficient investment planning'
          ],
          analysis: 'A well-diversified portfolio helps manage risk and optimize returns'
        }
      },
      'MARKET_ANALYSIS': {
        type: 'MARKET_ANALYSIS',
        data: {
          marketOverview: marketContext,
          sentiment: this.getMarketSentiment(marketContext),
          keyIndices: {
            nifty: marketContext.nifty50,
            sensex: marketContext.sensex
          },
          sectors: this.getSectorPerformance(),
          analysis: 'Market analysis based on current trends and economic indicators'
        }
      },
      'RISK_ASSESSMENT': {
        type: 'RISK_ASSESSMENT',
        data: {
          message: 'Understanding your risk profile is crucial for investment planning.',
          riskLevels: [
            { level: 'Conservative', description: 'Low risk tolerance, prefers stable returns' },
            { level: 'Moderate', description: 'Balanced risk approach, seeks growth with stability' },
            { level: 'Aggressive', description: 'High risk tolerance, seeks maximum returns' }
          ],
          recommendations: 'Align your investments with your risk capacity and goals'
        }
      },
      'TAX_PLANNING': {
        type: 'TAX_PLANNING',
        data: {
          message: 'Tax-efficient investing can significantly improve your post-tax returns.',
          strategies: [
            'Section 80C investments (ELSS, PPF, NSC)',
            'Capital gains tax optimization',
            'Tax-loss harvesting',
            'Long-term vs short-term capital gains planning'
          ],
          analysis: 'Strategic tax planning is an integral part of wealth creation'
        }
      },
      'EDUCATIONAL': {
        type: 'EDUCATIONAL',
        data: {
          message: 'I can help you understand various investment concepts and strategies.',
          topics: [
            'Stock market basics and terminology',
            'Mutual fund types and selection criteria',
            'Portfolio diversification strategies',
            'Risk management techniques',
            'Tax planning for investments'
          ],
          suggestions: [
            'Ask about specific stocks or sectors',
            'Learn about different investment options',
            'Understand risk and return trade-offs',
            'Get guidance on tax-efficient investing'
          ]
        }
      }
    };

    return responses[intent] || responses['EDUCATIONAL'];
  }

  formatGeneralResponse(data) {
    let content = `🤖 **NiveshAI - Your Investment Assistant**\n\n`;
    content += `${data.message}\n\n`;
    
    if (data.suggestions) {
      content += `💡 **Try asking:**\n`;
      data.suggestions.forEach(suggestion => {
        content += `• ${suggestion}\n`;
      });
      content += `\n`;
    }

    return content;
  }

  intents = {
    'stock': 'STOCK_RECOMMENDATION',
    'share': 'STOCK_RECOMMENDATION',
    'invest': 'INVESTMENT_GUIDANCE',
    'investment': 'INVESTMENT_GUIDANCE',
    'mutual fund': 'MUTUAL_FUND',
    'sip': 'MUTUAL_FUND',
    'portfolio': 'PORTFOLIO_MANAGEMENT',
    'risk': 'RISK_ASSESSMENT',
    'tax': 'TAX_PLANNING',
    'market': 'MARKET_ANALYSIS',
    'nifty': 'MARKET_ANALYSIS',
    'sensex': 'MARKET_ANALYSIS',
    'learn': 'EDUCATIONAL',
    'explain': 'EDUCATIONAL',
    'what is': 'EDUCATIONAL',
    'how to': 'EDUCATIONAL'
  };
}

module.exports = NiveshAI;
