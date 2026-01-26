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
    
    // OpenAI configuration
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiModel = 'gpt-3.5-turbo';
  }

  async getResponse(message, userProfile = {}) {
    try {
      const cleanMessage = message.trim();
      const marketContext = await this.marketDataService.getMarketOverview();
      
      // Use OpenAI for intelligent responses
      const aiResponse = await this.getOpenAIResponse(cleanMessage, userProfile, marketContext);
      
      return this.responseFormatter.formatResponse(aiResponse, userProfile);
    } catch (error) {
      console.error('NiveshAI Error:', error);
      return this.responseFormatter.formatErrorResponse(error.message);
    }
  }

  async getOpenAIResponse(message, userProfile, marketContext) {
    try {
      // If OpenAI API key is available, use it
      if (this.openaiApiKey) {
        return await this.callOpenAI(message, userProfile, marketContext);
      } else {
        // Fallback to intelligent simulation
        return await this.simulateAIResponse(message, userProfile, marketContext);
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Fallback to simulation
      return await this.simulateAIResponse(message, userProfile, marketContext);
    }
  }

  async callOpenAI(message, userProfile, marketContext) {
    const axios = require('axios');
    
    const systemPrompt = `You are NiveshAI, an advanced Indian financial AI assistant. You are knowledgeable about:

- Indian stock market (NSE, BSE, individual stocks)
- Commodities (gold, silver, crude oil)
- Mutual funds and SIPs
- Investment strategies and portfolio management
- Tax planning in India
- Economic indicators and RBI policies
- Risk management and financial planning

Guidelines:
1. Provide specific, actionable answers
2. Include current market context when relevant
3. Add SEBI-compliant disclaimers for investment advice
4. Be educational and professional
5. If you don't have real-time data, mention it clearly
6. For specific stock prices, mention that data may be delayed

Current Market Context:
- Nifty 50: ${marketContext.nifty50?.current || 'N/A'} (${marketContext.nifty50?.changePercent || 'N/A'}%)
- Sensex: ${marketContext.sensex?.current || 'N/A'} (${marketContext.sensex?.changePercent || 'N/A'}%)
- Market Sentiment: ${marketContext.marketSentiment || 'N/A'}

User Profile: ${JSON.stringify(userProfile)}`;

    const userPrompt = `Question: ${message}

Please provide a comprehensive, helpful response. If this is about specific investments, include relevant analysis and considerations. Always include appropriate disclaimers for financial advice.`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: this.openaiModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      type: 'AI_RESPONSE',
      data: {
        message: response.data.choices[0].message.content,
        source: 'OpenAI GPT-3.5-turbo',
        marketContext: marketContext,
        timestamp: new Date().toISOString()
      }
    };
  }

  async simulateAIResponse(message, userProfile, marketContext) {
    const lowerMessage = message.toLowerCase();
    
    // Detect question type and generate appropriate response
    let response = {
      type: 'AI_RESPONSE',
      data: {
        message: '',
        source: 'NiveshAI Intelligence Engine',
        marketContext: marketContext,
        timestamp: new Date().toISOString()
      }
    };

    // Generate intelligent response based on question type
    if (this.isFinancialQuestion(lowerMessage)) {
      response.data.message = this.generateFinancialResponse(message, userProfile, marketContext);
    } else {
      response.data.message = this.generateGeneralResponse(message, userProfile, marketContext);
    }

    return response;
  }

  isFinancialQuestion(message) {
    const keywords = [
      'stock', 'share', 'invest', 'investment', 'market', 'nifty', 'sensex', 'tata', 'reliance', 'tcs',
      'gold', 'silver', 'commodity', 'mutual fund', 'sip', 'tax', 'economy', 'banking', 'loan', 'insurance',
      'retirement', 'portfolio', 'dividend', 'price', 'buy', 'sell', 'trading', 'analysis'
    ];
    return keywords.some(keyword => message.includes(keyword));
  }

  generateFinancialResponse(message, userProfile, marketContext) {
    const lowerMessage = message.toLowerCase();
    
    // Stock-related questions
    if (lowerMessage.includes('stock') || lowerMessage.includes('share') || 
        lowerMessage.includes('tata') || lowerMessage.includes('reliance') || lowerMessage.includes('tcs')) {
      return this.generateStockResponse(message, marketContext);
    }
    
    // Commodity questions
    if (lowerMessage.includes('gold') || lowerMessage.includes('silver') || lowerMessage.includes('commodity')) {
      return this.generateCommodityResponse(message, marketContext);
    }
    
    // Investment questions
    if (lowerMessage.includes('invest') || lowerMessage.includes('mutual fund') || lowerMessage.includes('sip')) {
      return this.generateInvestmentResponse(message, userProfile, marketContext);
    }
    
    // Market questions
    if (lowerMessage.includes('market') || lowerMessage.includes('nifty') || lowerMessage.includes('sensex')) {
      return this.generateMarketResponse(message, marketContext);
    }
    
    // Tax questions
    if (lowerMessage.includes('tax') || lowerMessage.includes('80c')) {
      return this.generateTaxResponse(message, userProfile);
    }
    
    // Default financial response
    return this.generateGeneralFinancialResponse(message, userProfile, marketContext);
  }

  generateStockResponse(message, marketContext) {
    let response = `**Stock Market Analysis**\n\n`;
    response += `**Current Market Context:**\n`;
    response += `• **Nifty 50:** ${marketContext.nifty50?.current || 'N/A'} (${marketContext.nifty50?.changePercent || 'N/A'}%)\n`;
    response += `• **Sensex:** ${marketContext.sensex?.current || 'N/A'} (${marketContext.sensex?.changePercent || 'N/A'}%)\n`;
    response += `• **Market Sentiment:** ${marketContext.marketSentiment || 'N/A'}\n\n`;
    
    response += `**Note:** I don't have access to real-time stock prices. For current prices, please check:\n`;
    response += `• NSE India (www.nseindia.com)\n`;
    response += `• BSE India (www.bseindia.com)\n`;
    response += `• Your broker's trading platform\n\n`;
    
    response += `**Investment Considerations:**\n`;
    response += `• **Valuation:** Check P/E ratio vs sector average\n`;
    response += `• **Financial Health:** Debt levels, profit margins\n`;
    response += `• **Growth Prospects:** Industry outlook\n`;
    response += `• **Management Quality:** Track record\n`;
    response += `• **Technical Analysis:** Support/resistance levels\n\n`;
    
    response += `**Risk Factors:**\n`;
    response += `• Market volatility\n`;
    response += `• Sector-specific risks\n`;
    response += `• Company-specific challenges\n`;
    response += `• Regulatory changes\n\n`;
    
    response += `**Disclaimer:** This is not investment advice. Please consult a SEBI-registered financial advisor before investing.`;
    
    return response;
  }

  generateCommodityResponse(message, marketContext) {
    const isGold = message.toLowerCase().includes('gold');
    const isSilver = message.toLowerCase().includes('silver');
    
    let response = `**${isGold ? 'Gold' : isSilver ? 'Silver' : 'Commodity'} Market Analysis**\n\n`;
    
    response += `**Current Market Context:**\n`;
    response += `• **Market Sentiment:** ${marketContext.marketSentiment || 'N/A'}\n`;
    response += `• **Nifty 50:** ${marketContext.nifty50?.current || 'N/A'} (${marketContext.nifty50?.changePercent || 'N/A'}%)\n\n`;
    
    if (isGold) {
      response += `**Gold Market Factors:**\n`;
      response += `• **Safe-Haven Demand:** Increases during uncertainty\n`;
      response += `• **Inflation Hedge:** Protection against currency depreciation\n`;
      response += `• **Interest Rates:** Inverse relationship with real rates\n`;
      response += `• **Central Bank Actions:** Buying/selling by central banks\n`;
      response += `• **Jewelry Demand:** Seasonal demand from India/China\n\n`;
      
      response += `**Investment Options:**\n`;
      response += `• **Gold ETFs:** Traded on NSE\n`;
      response += `• **Sovereign Gold Bonds:** 2.5% interest + appreciation\n`;
      response += `• **Digital Gold:** Through Paytm, PhonePe\n`;
      response += `• **Physical Gold:** Coins and bars\n\n`;
    } else if (isSilver) {
      response += `**Silver Market Factors:**\n`;
      response += `• **Industrial Demand:** Solar panels, electronics, EVs\n`;
      response += `• **Investment Demand:** Safe-haven asset like gold\n`;
      response += `• **Gold-Silver Ratio:** Historical relationship\n`;
      response += `• **Supply Constraints:** Mining disruptions\n\n`;
      
      response += `**Investment Options:**\n`;
      response += `• **Silver ETFs:** Traded on NSE\n`;
      response += `• **Silver Futures:** MCX for experienced investors\n`;
      response += `• **Physical Silver:** Coins and bars\n\n`;
    }
    
    response += `**Current Price Information:**\n`;
    response += `For real-time prices, check MCX India or your broker's platform.\n\n`;
    
    response += `**Disclaimer:** Commodity trading involves high risk. This is for educational purposes only.`;
    
    return response;
  }

  generateInvestmentResponse(message, userProfile, marketContext) {
    const riskProfile = userProfile.riskProfile?.type || 'moderate';
    
    let response = `**Investment Guidance**\n\n`;
    response += `**Your Risk Profile:** ${riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}\n\n`;
    
    response += `**Current Market Context:**\n`;
    response += `• **Market Sentiment:** ${marketContext.marketSentiment || 'N/A'}\n`;
    response += `• **Nifty 50:** ${marketContext.nifty50?.current || 'N/A'} (${marketContext.nifty50?.changePercent || 'N/A'}%)\n\n`;
    
    if (riskProfile === 'conservative') {
      response += `**Recommended Allocation:**\n`;
      response += `• **Debt Instruments:** 60-70% (PPF, FDs, Government bonds)\n`;
      response += `• **Large-cap Equity:** 20-30% (Blue-chip stocks, large-cap funds)\n`;
      response += `• **Gold:** 5-10% (Gold ETFs, Sovereign Gold Bonds)\n`;
      response += `• **Cash:** 5-10% (Emergency fund)\n\n`;
      
      response += `**Suitable Investments:**\n`;
      response += `• **PPF:** Tax-free returns, government backing\n`;
      response += `• **Large-cap Mutual Funds:** Stable growth\n`;
      response += `• **Bank FDs:** Capital protection\n\n`;
    } else if (riskProfile === 'moderate') {
      response += `**Recommended Allocation:**\n`;
      response += `• **Equity:** 50-60% (Large-cap, mid-cap funds)\n`;
      response += `• **Debt:** 30-40% (Corporate bonds, debt funds)\n`;
      response += `• **Gold:** 5-10% (Diversification)\n`;
      response += `• **Real Estate:** 5-10% (REITs)\n\n`;
      
      response += `**Suitable Investments:**\n`;
      response += `• **Multi-cap Mutual Funds:** Diversified equity\n`;
      response += `• **Hybrid Funds:** Balanced risk-return\n`;
      response += `• **Index Funds:** Low-cost market exposure\n\n`;
    } else if (riskProfile === 'aggressive') {
      response += `**Recommended Allocation:**\n`;
      response += `• **Equity:** 70-80% (Mid-cap, small-cap, sectoral)\n`;
      response += `• **Debt:** 10-20% (High-yield debt)\n`;
      response += `• **Alternatives:** 5-10% (Real estate, commodities)\n`;
      response += `• **International:** 5-10% (Global diversification)\n\n`;
      
      response += `**Suitable Investments:**\n`;
      response += `• **Mid-cap/Small-cap Funds:** High growth\n`;
      response += `• **Sectoral Funds:** Targeted exposure\n`;
      response += `• **Thematic Funds:** Emerging themes\n\n`;
    }
    
    response += `**General Principles:**\n`;
    response += `• **Start Early:** Power of compounding\n`;
    response += `• **Invest Regularly:** SIP approach\n`;
    response += `• **Diversify:** Spread risk\n`;
    response += `• **Review Periodically:** Rebalance annually\n`;
    response += `• **Stay Invested:** Avoid timing market\n\n`;
    
    response += `**Disclaimer:** This is educational guidance. Please consult a SEBI-registered financial advisor.`;
    
    return response;
  }

  generateMarketResponse(message, marketContext) {
    let response = `**Indian Market Analysis**\n\n`;
    
    response += `**Current Market Status:**\n`;
    response += `• **Nifty 50:** ${marketContext.nifty50?.current || 'N/A'} (${marketContext.nifty50?.changePercent || 'N/A'}%)\n`;
    response += `• **Sensex:** ${marketContext.sensex?.current || 'N/A'} (${marketContext.sensex?.changePercent || 'N/A'}%)\n`;
    response += `• **Market Sentiment:** ${marketContext.marketSentiment || 'N/A'}\n\n`;
    
    response += `**Market Drivers:**\n`;
    response += `• **Corporate Earnings:** Quarterly results impact\n`;
    response += `• **FII/FDI Flows:** Foreign investment\n`;
    response += `• **Economic Data:** GDP, inflation, IIP\n`;
    response += `• **Global Cues:** US, European markets\n`;
    response += `• **Oil Prices:** Impact on inflation/currency\n`;
    response += `• **RBI Policies:** Interest rates, liquidity\n\n`;
    
    response += `**Sector Performance:**\n`;
    response += `• **IT Services:** Global demand, currency impact\n`;
    response += `• **Banking:** Interest rates, credit growth\n`;
    response += `• **Automobile:** Economic growth sensitivity\n`;
    response += `• **Pharma:** Defensive sector\n`;
    response += `• **FMCG:** Stable demand, inflation-protected\n`;
    response += `• **Energy:** Oil price linked\n\n`;
    
    response += `**Investment Strategy:**\n`;
    response += `• **Diversify:** Across sectors and market caps\n`;
    response += `• **Quality Focus:** Strong fundamentals\n`;
    response += `• **Long-term View:** Avoid speculation\n`;
    response += `• **Regular Review:** Monitor performance\n\n`;
    
    response += `**Disclaimer:** This analysis is educational. Markets are subject to risks. Consult financial advisor.`;
    
    return response;
  }

  generateTaxResponse(message, userProfile) {
    let response = `**Tax Planning Guide**\n\n`;
    
    response += `**Section 80C Deductions (Max ₹1.5L):**\n`;
    response += `• **ELSS Mutual Funds:** 3-year lock-in, high returns\n`;
    response += `• **PPF:** 15-year lock-in, tax-free interest\n`;
    response += `• **Tax-Saving FD:** 5-year lock-in, fixed returns\n`;
    response += `• **NSC:** 5-year lock-in, taxable interest\n`;
    response += `• **Life Insurance:** Policy term > 10 years\n`;
    response += `• **Home Loan Principal:** Max ₹1.5L/year\n`;
    response += `• **Tuition Fees:** Children's education\n\n`;
    
    response += `**Other Deductions:**\n`;
    response += `• **Section 80D:** Health insurance (₹25K self, ₹50K parents)\n`;
    response += `• **Section 80E:** Education loan interest (8 years)\n`;
    response += `• **Section 80EE:** Home loan interest (₹50K)\n`;
    response += `• **Section 80G:** Donations to approved charities\n\n`;
    
    response += `**Capital Gains Tax:**\n`;
    response += `• **Equity/LTCG:** 10% above ₹1L (>1 year)\n`;
    response += `• **Equity/STCG:** 15% (≤1 year)\n`;
    response += `• **Debt/LTCG:** 20% with indexation (>3 years)\n`;
    response += `• **Debt/STCG:** Slab rates (≤3 years)\n\n`;
    
    response += `**Tax-Saving Tips:**\n`;
    response += `• **Start Early:** Begin at FY start\n`;
    response += `• **Diversify:** Use multiple 80C options\n`;
    response += `• **Review Annually:** Adjust for law changes\n`;
    response += `• **Keep Documents:** Proper records\n`;
    response += `• **Consult Expert:** Professional advice\n\n`;
    
    response += `**Deadlines:**\n`;
    response += `• **Tax Filing:** July 31st (unless extended)\n`;
    response += `• **Tax Saving:** March 31st (FY end)\n\n`;
    
    response += `**Disclaimer:** Tax laws change. Consult qualified tax advisor for personalized planning.`;
    
    return response;
  }

  generateGeneralFinancialResponse(message, userProfile, marketContext) {
    let response = `**Financial Intelligence Assistant**\n\n`;
    
    response += `I can help you with:\n\n`;
    
    response += `**📈 Stock Market:**\n`;
    response += `• Individual stock analysis\n`;
    response += `• Market trends and sentiment\n`;
    response += `• Technical and fundamental analysis\n`;
    response += `• Investment recommendations\n\n`;
    
    response += `**💰 Investment Planning:**\n`;
    response += `• Personalized strategies\n`;
    response += `• Mutual fund recommendations\n`;
    response += `• SIP and lump sum planning\n`;
    response += `• Portfolio diversification\n\n`;
    
    response += `**🏦 Banking & Finance:**\n`;
    response += `• Banking products\n`;
    response += `• Loan planning\n`;
    response += `• Insurance recommendations\n`;
    response += `• Retirement planning\n\n`;
    
    response += `**📊 Market Analysis:**\n`;
    response += `• Indian market overview\n`;
    response += `• Economic indicators\n`;
    response += `• RBI policies\n`;
    response += `• Global market impact\n\n`;
    
    response += `**💎 Commodities:**\n`;
    response += `• Gold and silver analysis\n`;
    response += `• Commodity trading\n`;
    response += `• Investment options\n`;
    response += `• Market dynamics\n\n`;
    
    response += `**📋 Tax Planning:**\n`;
    response += `• Tax-saving options\n`;
    response += `• Section 80C deductions\n`;
    response += `• Capital gains optimization\n`;
    response += `• Tax strategies\n\n`;
    
    response += `**Current Market:**\n`;
    response += `• **Nifty 50:** ${marketContext.nifty50?.current || 'N/A'} (${marketContext.nifty50?.changePercent || 'N/A'}%)\n`;
    response += `• **Sensex:** ${marketContext.sensex?.current || 'N/A'} (${marketContext.sensex?.changePercent || 'N/A'}%)\n`;
    response += `• **Sentiment:** ${marketContext.marketSentiment || 'N/A'}\n\n`;
    
    response += `**Example Questions:**\n`;
    response += `• "Is Tata Motors a good investment?"\n`;
    response += `• "Why is gold price going up?"\n`;
    response += `• "How should I invest ₹10,000/month?"\n`;
    response += `• "Best tax-saving options?"\n`;
    response += `• "Current market sentiment?"\n\n`;
    
    response += `**Disclaimer:** Educational purposes only. Not SEBI-registered investment advice. Consult licensed advisor.`;
    
    return response;
  }

  generateGeneralResponse(message, userProfile, marketContext) {
    let response = `**NiveshAI - Your Financial Assistant**\n\n`;
    
    response += `I specialize in Indian financial markets and can help with:\n\n`;
    
    response += `• **Stock Market:** Individual stocks, market analysis, trading strategies\n`;
    response += `• **Investments:** Mutual funds, SIPs, portfolio management\n`;
    response += `• **Commodities:** Gold, silver, commodity trading\n`;
    response += `• **Tax Planning:** Tax-saving options, deductions, strategies\n`;
    response += `• **Banking:** Loans, insurance, retirement planning\n`;
    response += `• **Economy:** Economic indicators, RBI policies, market analysis\n\n`;
    
    response += `**Current Market Context:**\n`;
    response += `• **Nifty 50:** ${marketContext.nifty50?.current || 'N/A'} (${marketContext.nifty50?.changePercent || 'N/A'}%)\n`;
    response += `• **Sensex:** ${marketContext.sensex?.current || 'N/A'} (${marketContext.sensex?.changePercent || 'N/A'}%)\n`;
    response += `• **Market Sentiment:** ${marketContext.marketSentiment || 'N/A'}\n\n`;
    
    response += `**Ask me anything about Indian finance!**\n\n`;
    
    response += `**Disclaimer:** Educational purposes only. Not SEBI-registered investment advice.`;
    
    return response;
  }

  // Legacy methods for compatibility
  determineIntent(message) {
    return 'AI_RESPONSE';
  }

  async generateInternalResponse(intent, userProfile, marketContext) {
    return {
      type: 'AI_RESPONSE',
      data: {
        message: 'I can help with various financial topics. Please ask your specific question.',
        source: 'NiveshAI',
        marketContext: marketContext
      }
    };
  }

  formatEnhancedResponse(externalResponse, ragData, marketContext, userProfile) {
    return this.responseFormatter.formatResponse(externalResponse, userProfile);
  }

  needsExternalData(message, internalResponse) {
    return true;
  }
}

module.exports = NiveshAI;
