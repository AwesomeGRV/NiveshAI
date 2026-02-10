const MarketDataService = require('../services/MarketDataService');
const ResponseFormatter = require('../utils/ResponseFormatter');

class NiveshAI {
  constructor() {
    this.marketDataService = new MarketDataService();
    this.responseFormatter = new ResponseFormatter();
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  async getResponse(message, userProfile = {}) {
    try {
      const marketContext = await this.marketDataService.getMarketOverview();
      const response = await this.generateResponse(message, userProfile, marketContext);
      return this.responseFormatter.formatResponse(response, userProfile);
    } catch (error) {
      console.error('NiveshAI Error:', error);
      return this.responseFormatter.formatErrorResponse(error.message);
    }
  }

  async generateResponse(message, userProfile, marketContext) {
    const msg = message.toLowerCase();
    
    // Stock queries
    if (this.containsAny(msg, ['stock', 'share', 'tata', 'reliance', 'tcs', 'hdfc', 'icici', 'sbi', 'infosys', 'up', 'down', 'price', 'buy', 'sell'])) {
      return this.createStockResponse(message, marketContext);
    }
    
    // Investment queries
    if (this.containsAny(msg, ['invest', 'investment', 'sip', 'mutual fund', 'portfolio', 'diversified'])) {
      return this.createInvestmentResponse(message, userProfile, marketContext);
    }
    
    // Commodity queries
    if (this.containsAny(msg, ['gold', 'silver', 'commodity', 'crude', 'oil'])) {
      return this.createCommodityResponse(message, marketContext);
    }
    
    // Tax queries
    if (this.containsAny(msg, ['tax', '80c', 'saving', 'capital gains'])) {
      return this.createTaxResponse(message, userProfile);
    }
    
    // Market queries
    if (this.containsAny(msg, ['market', 'nifty', 'sensex', 'sentiment', 'rbi', 'economy'])) {
      return this.createMarketResponse(message, marketContext);
    }
    
    // Risk queries
    if (this.containsAny(msg, ['risk', 'profile', 'conservative', 'moderate', 'aggressive'])) {
      return this.createRiskResponse(message, userProfile);
    }
    
    // Banking queries
    if (this.containsAny(msg, ['bank', 'loan', 'fd', 'rd', 'nps', 'retirement'])) {
      return this.createBankingResponse(message, userProfile);
    }
    
    // Educational queries
    if (this.containsAny(msg, ['what is', 'how to', 'difference', 'explain', 'meaning', 'vs'])) {
      return this.createEducationalResponse(message, userProfile, marketContext);
    }
    
    // Default response
    return this.createGeneralResponse(message, userProfile, marketContext);
  }

  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  createStockResponse(message, marketContext) {
    const stockName = this.extractStockName(message);
    let content = `**Stock Market Analysis**\n\n`;
    
    content += `**Current Market:**\n`;
    content += `• Nifty 50: ${marketContext.nifty50?.current || 'N/A'} (${marketContext.nifty50?.changePercent || 'N/A'}%)\n`;
    content += `• Sensex: ${marketContext.sensex?.current || 'N/A'} (${marketContext.sensex?.changePercent || 'N/A'}%)\n`;
    content += `• Sentiment: ${marketContext.marketSentiment || 'N/A'}\n\n`;

    if (stockName) {
      content += `**${stockName.toUpperCase()} Analysis:**\n\n`;
      content += `**Key Factors to Consider:**\n`;
      content += `• P/E ratio vs sector average\n`;
      content += `• Debt levels and profit margins\n`;
      content += `• Industry growth prospects\n`;
      content += `• Management track record\n`;
      content += `• Technical support/resistance levels\n\n`;
      
      content += `**Risks:**\n`;
      content += `• Market volatility\n`;
      content += `• Sector-specific challenges\n`;
      content += `• Regulatory changes\n`;
      content += `• Competition risks\n\n`;
    } else {
      content += `**General Stock Guidance:**\n\n`;
      content += `**Analysis Methods:**\n`;
      content += `• Fundamental: Financial statements, management\n`;
      content += `• Technical: Charts, patterns, indicators\n`;
      content += `• Valuation: P/E, P/B, EV/EBITDA ratios\n`;
      content += `• Quality: ROE, debt ratios, margins\n\n`;
    }

    content += `**Data Sources:** NSE, BSE, your broker's platform\n\n`;
    content += `**Disclaimer:** Educational purposes only. Consult SEBI advisor.`;
    
    return {
      type: 'AI_RESPONSE',
      data: {
        message: content,
        source: 'NiveshAI Stock Analysis',
        marketContext: marketContext,
        timestamp: new Date().toISOString()
      }
    };
  }

  createInvestmentResponse(message, userProfile, marketContext) {
    const riskProfile = userProfile.riskProfile?.type || 'moderate';
    const amount = this.extractAmount(message);
    
    let content = `**Investment Guidance**\n\n`;
    content += `**Risk Profile:** ${riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}\n\n`;
    content += `**Market Context:** ${marketContext.marketSentiment || 'N/A'}\n\n`;

    if (amount) {
      content += `**Monthly Investment: ₹${amount.toLocaleString()}**\n\n`;
      
      if (riskProfile === 'conservative') {
        content += `**Allocation:**\n`;
        content += `• PPF: ₹${Math.floor(amount * 0.3)}\n`;
        content += `• Debt Funds: ₹${Math.floor(amount * 0.3)}\n`;
        content += `• Large-cap Equity: ₹${Math.floor(amount * 0.25)}\n`;
        content += `• Gold: ₹${Math.floor(amount * 0.1)}\n`;
        content += `• Emergency: ₹${Math.floor(amount * 0.05)}\n\n`;
      } else if (riskProfile === 'moderate') {
        content += `**Allocation:**\n`;
        content += `• Multi-cap Funds: ₹${Math.floor(amount * 0.4)}\n`;
        content += `• Hybrid Funds: ₹${Math.floor(amount * 0.3)}\n`;
        content += `• Debt: ₹${Math.floor(amount * 0.2)}\n`;
        content += `• Gold: ₹${Math.floor(amount * 0.1)}\n\n`;
      } else {
        content += `**Allocation:**\n`;
        content += `• Mid/Small-cap: ₹${Math.floor(amount * 0.5)}\n`;
        content += `• Sectoral Funds: ₹${Math.floor(amount * 0.2)}\n`;
        content += `• Large-cap: ₹${Math.floor(amount * 0.2)}\n`;
        content += `• International: ₹${Math.floor(amount * 0.1)}\n\n`;
      }
    } else {
      content += `**General Principles:**\n\n`;
      
      if (riskProfile === 'conservative') {
        content += `• Debt: 60-70%\n`;
        content += `• Equity: 20-30%\n`;
        content += `• Gold: 5-10%\n\n`;
      } else if (riskProfile === 'moderate') {
        content += `• Equity: 50-60%\n`;
        content += `• Debt: 30-40%\n`;
        content += `• Gold: 5-10%\n\n`;
      } else {
        content += `• Equity: 70-80%\n`;
        content += `• Debt: 10-20%\n`;
        content += `• Alternatives: 5-10%\n\n`;
      }
      
      content += `**Investment Options:**\n`;
      content += `• Mutual Funds (SIP)\n`;
      content += `• Direct Stocks\n`;
      content += `• ETFs\n`;
      content += `• Government Schemes\n\n`;
    }

    content += `**Current Opportunities:**\n`;
    content += `• Digital Transformation\n`;
    content += `• Manufacturing Growth\n`;
    content += `• Healthcare Sector\n`;
    content += `• Renewable Energy\n\n`;
    
    content += `**Disclaimer:** Educational guidance. Consult SEBI advisor.`;
    
    return {
      type: 'AI_RESPONSE',
      data: {
        message: content,
        source: 'NiveshAI Investment Advisor',
        marketContext: marketContext,
        timestamp: new Date().toISOString()
      }
    };
  }

  createCommodityResponse(message, marketContext) {
    const commodity = this.extractCommodity(message);
    
    let content = `**${commodity.charAt(0).toUpperCase() + commodity.slice(1)} Market Analysis**\n\n`;
    content += `**Market Context:** ${marketContext.marketSentiment || 'N/A'}\n\n`;

    if (commodity === 'gold') {
      content += `**Gold Factors:**\n`;
      content += `• Safe-haven demand\n`;
      content += `• Inflation hedge\n`;
      content += `• Interest rate impact\n`;
      content += `• Central bank actions\n`;
      content += `• Jewelry demand\n`;
      content += `• USD strength\n\n`;
      
      content += `**Investment Options:**\n`;
      content += `• Sovereign Gold Bonds (2.5% interest)\n`;
      content += `• Gold ETFs (NSE)\n`;
      content += `• Digital Gold (Paytm, PhonePe)\n`;
      content += `• Physical Gold\n\n`;
    } else if (commodity === 'silver') {
      content += `**Silver Factors:**\n`;
      content += `• Industrial demand (solar, EVs)\n`;
      content += `• Investment demand\n`;
      content += `• Gold-silver ratio\n`;
      content += `• Supply constraints\n\n`;
      
      content += `**Investment Options:**\n`;
      content += `• Silver ETFs\n`;
      content += `• Silver Futures (MCX)\n`;
      content += `• Physical Silver\n\n`;
    } else {
      content += `**General Commodity Factors:**\n`;
      content += `• Supply-demand dynamics\n`;
      content += `• Economic conditions\n`;
      content += `• Currency movements\n`;
      content += `• Geopolitical events\n\n`;
      
      content += `**Investment Options:**\n`;
      content += `• Commodity ETFs\n`;
      content += `• Futures (MCX/NCDEX)\n`;
      content += `• Commodity Mutual Funds\n\n`;
    }

    content += `**Price Data:** Check MCX India, NCDEX\n\n`;
    content += `**Disclaimer:** High risk. Educational purposes only.`;
    
    return {
      type: 'AI_RESPONSE',
      data: {
        message: content,
        source: 'NiveshAI Commodity Analysis',
        marketContext: marketContext,
        timestamp: new Date().toISOString()
      }
    };
  }

  createTaxResponse(message, userProfile) {
    let content = `**Tax Planning Guide**\n\n`;
    
    content += `**Section 80C (Max ₹1.5L):**\n`;
    content += `• ELSS Mutual Funds (3-year lock)\n`;
    content += `• PPF (15-year lock, tax-free)\n`;
    content += `• Tax-Saving FD (5-year lock)\n`;
    content += `• NSC (5-year lock)\n`;
    content += `• Life Insurance\n`;
    content += `• Home Loan Principal\n`;
    content += `• Tuition Fees\n\n`;
    
    content += `**Other Deductions:**\n`;
    content += `• 80D: Health Insurance (₹25K self, ₹50K parents)\n`;
    content += `• 80E: Education Loan Interest\n`;
    content += `• 80EE: Home Loan Interest (₹50K)\n`;
    content += `• 80G: Donations\n\n`;
    
    content += `**Capital Gains Tax:**\n`;
    content += `• Equity LTCG: 10% above ₹1L (>1 year)\n`;
    content += `• Equity STCG: 15% (≤1 year)\n`;
    content += `• Debt LTCG: 20% with indexation (>3 years)\n`;
    content += `• Debt STCG: Slab rates (≤3 years)\n\n`;
    
    content += `**Deadlines:**\n`;
    content += `• Tax Filing: July 31st\n`;
    content += `• Tax Saving: March 31st\n\n`;
    
    content += `**Disclaimer:** Tax laws change. Consult tax advisor.`;
    
    return {
      type: 'AI_RESPONSE',
      data: {
        message: content,
        source: 'NiveshAI Tax Planning',
        marketContext: null,
        timestamp: new Date().toISOString()
      }
    };
  }

  createMarketResponse(message, marketContext) {
    let content = `**Indian Market Analysis**\n\n`;
    
    content += `**Current Status:**\n`;
    content += `• Nifty 50: ${marketContext.nifty50?.current || 'N/A'} (${marketContext.nifty50?.changePercent || 'N/A'}%)\n`;
    content += `• Sensex: ${marketContext.sensex?.current || 'N/A'} (${marketContext.sensex?.changePercent || 'N/A'}%)\n`;
    content += `• Sentiment: ${marketContext.marketSentiment || 'N/A'}\n`;
    content += `• VIX: ${marketContext.vix || 'N/A'}\n\n`;
    
    content += `**Market Drivers:**\n`;
    content += `• Corporate earnings\n`;
    content += `• FII/FDI flows\n`;
    content += `• Economic data (GDP, inflation)\n`;
    content += `• Global market cues\n`;
    content += `• Oil prices\n`;
    content += `• RBI policies\n\n`;
    
    content += `**Sector Performance:**\n`;
    content += `• IT: Global demand, currency impact\n`;
    content += `• Banking: Interest rate sensitive\n`;
    content += `• Auto: Economic growth dependent\n`;
    content += `• Pharma: Defensive sector\n`;
    content += `• FMCG: Stable demand\n`;
    content += `• Energy: Oil price linked\n\n`;
    
    content += `**Investment Strategy:**\n`;
    content += `• Diversify across sectors\n`;
    content += `• Focus on quality companies\n`;
    content += `• Long-term perspective\n`;
    content += `• Regular portfolio review\n\n`;
    
    content += `**Disclaimer:** Educational analysis. Consult financial advisor.`;
    
    return {
      type: 'AI_RESPONSE',
      data: {
        message: content,
        source: 'NiveshAI Market Analysis',
        marketContext: marketContext,
        timestamp: new Date().toISOString()
      }
    };
  }

  createRiskResponse(message, userProfile) {
    const currentRisk = userProfile.riskProfile?.type || 'moderate';
    
    let content = `**Risk Profiling**\n\n`;
    content += `**Your Profile:** ${currentRisk.charAt(0).toUpperCase() + currentRisk.slice(1)}\n\n`;
    
    content += `**Risk Types:**\n\n`;
    
    content += `**🟢 Conservative:**\n`;
    content += `• Low risk tolerance\n`;
    content += `• 3-5 year horizon\n`;
    content += `• 70% Debt, 20% Equity, 10% Gold\n`;
    content += `• 6-8% expected returns\n\n`;
    
    content += `**🟡 Moderate:**\n`;
    content += `• Medium risk tolerance\n`;
    content += `• 5-10 year horizon\n`;
    content += `• 50% Equity, 40% Debt, 10% Gold\n`;
    content += `• 10-12% expected returns\n\n`;
    
    content += `**🔴 Aggressive:**\n`;
    content += `• High risk tolerance\n`;
    content += `• 10+ year horizon\n`;
    content += `• 80% Equity, 15% Debt, 5% Alternatives\n`;
    content += `• 14-18% expected returns\n\n`;
    
    content += `**Risk Management:**\n`;
    content += `• Asset allocation\n`;
    content += `• Diversification\n`;
    content += `• Stop loss\n`;
    content += `• Regular rebalancing\n`;
    content += `• Emergency fund\n\n`;
    
    content += `**Disclaimer:** Educational guidance. Consult financial advisor.`;
    
    return {
      type: 'AI_RESPONSE',
      data: {
        message: content,
        source: 'NiveshAI Risk Assessment',
        marketContext: null,
        timestamp: new Date().toISOString()
      }
    };
  }

  createBankingResponse(message, userProfile) {
    let content = `**Banking & Financial Products**\n\n`;
    
    content += `**Savings & Deposits:**\n`;
    content += `• Savings Account: 2.5-4% interest\n`;
    content += `• Fixed Deposit: 6-7.5% interest\n`;
    content += `• Recurring Deposit: 6-7% interest\n`;
    content += `• Senior Citizen FD: Extra 0.5%\n\n`;
    
    content += `**Loans:**\n`;
    content += `• Home Loan: 8.5-9.5% (tax benefits)\n`;
    content += `• Personal Loan: 10-18%\n`;
    content += `• Education Loan: 8-12% (80E benefit)\n`;
    content += `• Car Loan: 9-11%\n\n`;
    
    content += `**Insurance:**\n`;
    content += `• Term Insurance: Pure risk cover\n`;
    content += `• Health Insurance: Medical expenses\n`;
    content += `• Motor Insurance: Mandatory for vehicles\n`;
    content += `• Home Insurance: Property protection\n\n`;
    
    content += `**Government Schemes:**\n`;
    content += `• PPF: 7.1% interest, tax-free\n`;
    content += `• Senior Citizen Scheme: 8.2% interest\n`;
    content += `• NSC: 7.7% interest, 5-year lock\n`;
    content += `• Post Office MIS: 7.4% interest\n\n`;
    
    content += `**Digital Banking:**\n`;
    content += `• UPI: Instant transfers\n`;
    content += `• Mobile Banking: 24/7 access\n`;
    content += `• Credit Cards: Rewards, cashback\n\n`;
    
    content += `**Disclaimer:** Rates vary by bank. Check current rates.`;
    
    return {
      type: 'AI_RESPONSE',
      data: {
        message: content,
        source: 'NiveshAI Banking Guide',
        marketContext: null,
        timestamp: new Date().toISOString()
      }
    };
  }

  createEducationalResponse(message, userProfile, marketContext) {
    const msg = message.toLowerCase();
    
    let content = `**Financial Education**\n\n`;
    
    if (msg.includes('sip') || msg.includes('systematic investment plan')) {
      content += `**Systematic Investment Plan (SIP)**\n\n`;
      content += `**What is SIP?**\n`;
      content += `Regular fixed investment in mutual funds, like a recurring deposit.\n\n`;
      
      content += `**Benefits:**\n`;
      content += `• Rupee cost averaging\n`;
      content += `• Power of compounding\n`;
      content += `• Disciplined investing\n`;
      content += `• Start with ₹500/month\n\n`;
      
      content += `**Example:**\n`;
      content += `₹10,000/month for 20 years at 12%:\n`;
      content += `• Investment: ₹24 lakhs\n`;
      content += `• Final Value: ₹99.9 lakhs\n`;
      content += `• Wealth Gained: ₹75.9 lakhs\n\n`;
      
      content += `**Best SIP Types:**\n`;
      content += `• Large-cap Funds (Stable)\n`;
      content += `• Multi-cap Funds (Diversified)\n`;
      content += `• Index Funds (Low cost)\n`;
      content += `• ELSS Funds (Tax saving)\n\n`;
    }
    else if (msg.includes('nse') && msg.includes('bse')) {
      content += `**NSE vs BSE Comparison**\n\n`;
      
      content += `**NSE (National Stock Exchange):**\n`;
      content += `• Founded: 1992\n`;
      content += `• Index: Nifty 50\n`;
      content += `• Largest by turnover\n`;
      content += `• Advanced technology\n`;
      content += `• Most large companies listed\n\n`;
      
      content += `**BSE (Bombay Stock Exchange):**\n`;
      content += `• Founded: 1875 (Oldest in Asia)\n`;
      content += `• Index: Sensex\n`;
      content += `• Historical significance\n`;
      content += `• Modern trading system\n`;
      content += `• Many companies dual-listed\n\n`;
      
      content += `**Similarities:**\n`;
      content += `• SEBI regulated\n`;
      content += `• Same trading hours (9:15-3:30)\n`;
      content += `• T+1 settlement\n`;
      content += `• Demat required\n\n`;
      
      content += `**Practical:** Most stocks trade on both, minimal price difference.\n\n`;
    }
    else if (msg.includes('financial statements')) {
      content += `**Financial Statement Analysis**\n\n`;
      
      content += `**Three Key Statements:**\n\n`;
      
      content += `**1. Balance Sheet:**\n`;
      content += `• Assets (What company owns)\n`;
      content += `• Liabilities (What company owes)\n`;
      content += `• Equity (Owner's stake)\n`;
      content += `• Key Ratios: Debt/Equity, Current Ratio\n\n`;
      
      content += `**2. Income Statement:**\n`;
      content += `• Revenue (Sales)\n`;
      content += `• Expenses (Costs)\n`;
      content += `• Profit (Bottom line)\n`;
      content += `• Key Ratios: P/E, Profit Margins, ROE\n\n`;
      
      content += `**3. Cash Flow Statement:**\n`;
      content += `• Operating Activities (Core business)\n`;
      content += `• Investing Activities (Investments)\n`;
      content += `• Financing Activities (Debt/Equity)\n`;
      content += `• Key Metrics: Free Cash Flow\n\n`;
      
      content += `**Analysis Framework:**\n`;
      content += `• Liquidity (Can pay bills?)\n`;
      content += `• Profitability (Making money?)\n`;
      content += `• Efficiency (Using assets well?)\n`;
      content += `• Solvency (Long-term viability?)\n`;
      content += `• Growth (Expanding sustainably?)\n\n`;
      
      content += `**Where to Find:**\n`;
      content += `• Company website (Investor relations)\n`;
      content += `• NSE/BSE (Annual reports)\n`;
      content += `• Moneycontrol, Economic Times\n\n`;
    }
    else {
      content += `**Financial Concepts Explained**\n\n`;
      
      content += `**Investment Terms:**\n`;
      content += `• SIP: Systematic Investment Plan\n`;
      content += `• Mutual Funds: Professional fund management\n`;
      content += `• ETFs: Exchange Traded Funds\n`;
      content += `• Diversification: Spreading risk\n`;
      content += `• Asset Allocation: Investment mix\n\n`;
      
      content += `**Market Terms:**\n`;
      content += `• Bull Market: Rising prices\n`;
      content += `• Bear Market: Falling prices\n`;
      content += `• Volatility: Price fluctuations\n`;
      content += `• Market Cap: Company value\n`;
      content += `• Dividend: Profit sharing\n\n`;
      
      content += `**Banking Terms:**\n`;
      content += `• FD/RD: Fixed/Recurring Deposits\n`;
      content += `• EMI: Equated Monthly Installment\n`;
      content += `• Collateral: Loan security\n`;
      content += `• Credit Score: Borrowing rating\n`;
      content += `• KYC: Customer verification\n\n`;
      
      content += `**Ask specifically about any concept for detailed explanation!**\n\n`;
    }
    
    content += `**Disclaimer:** Educational content. Consult professionals for advice.`;
    
    return {
      type: 'AI_RESPONSE',
      data: {
        message: content,
        source: 'NiveshAI Education',
        marketContext: marketContext,
        timestamp: new Date().toISOString()
      }
    };
  }

  createGeneralResponse(message, userProfile, marketContext) {
    let content = `**NiveshAI - Your Financial Assistant**\n\n`;
    
    content += `I can help you with:\n\n`;
    
    content += `**📈 Stock Market:**\n`;
    content += `• Individual stock analysis\n`;
    content += `• Market trends and sentiment\n`;
    content += `• Investment recommendations\n`;
    content += `• Technical and fundamental analysis\n\n`;
    
    content += `**💰 Investment Planning:**\n`;
    content += `• Personalized strategies\n`;
    content += `• Mutual fund recommendations\n`;
    content += `• SIP and lump sum planning\n`;
    content += `• Portfolio diversification\n\n`;
    
    content += `**🏦 Banking & Finance:**\n`;
    content += `• Banking products and services\n`;
    content += `• Loan planning and management\n`;
    content += `• Insurance recommendations\n`;
    content += `• Retirement planning\n\n`;
    
    content += `**📊 Market Analysis:**\n`;
    content += `• Indian market overview\n`;
    content += `• Economic indicators\n`;
    content += `• RBI policies\n`;
    content += `• Global market impact\n\n`;
    
    content += `**💎 Commodities:**\n`;
    content += `• Gold and silver analysis\n`;
    content += `• Commodity trading\n`;
    content += `• Investment options\n\n`;
    
    content += `**📋 Tax Planning:**\n`;
    content += `• Tax-saving options\n`;
    content += `• Section 80C deductions\n`;
    content += `• Capital gains optimization\n\n`;
    
    content += `**Current Market:**\n`;
    content += `• Nifty 50: ${marketContext.nifty50?.current || 'N/A'} (${marketContext.nifty50?.changePercent || 'N/A'}%)\n`;
    content += `• Sensex: ${marketContext.sensex?.current || 'N/A'} (${marketContext.sensex?.changePercent || 'N/A'}%)\n`;
    content += `• Sentiment: ${marketContext.marketSentiment || 'N/A'}\n\n`;
    
    content += `**Example Questions:**\n`;
    content += `• "Is Tata Motors a good investment?"\n`;
    content += `• "How should I invest ₹10,000/month?"\n`;
    content += `• "Best tax-saving options?"\n`;
    content += `• "Current market sentiment?"\n`;
    content += `• "What is SIP and how does it work?"\n\n`;
    
    content += `**Disclaimer:** Educational purposes only. Not SEBI-registered advice.`;
    
    return {
      type: 'AI_RESPONSE',
      data: {
        message: content,
        source: 'NiveshAI General Assistant',
        marketContext: marketContext,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Helper methods
  extractStockName(message) {
    const stocks = {
      'tata motors': 'Tata Motors',
      'reliance': 'Reliance Industries',
      'tcs': 'TCS',
      'hdfc bank': 'HDFC Bank',
      'icici bank': 'ICICI Bank',
      'sbi': 'State Bank of India',
      'infosys': 'Infosys',
      'wipro': 'Wipro',
      'maruti': 'Maruti Suzuki',
      'mahindra': 'Mahindra & Mahindra',
      'bharti airtel': 'Bharti Airtel',
      'kotak': 'Kotak Mahindra Bank',
      'axis': 'Axis Bank',
      'itc': 'ITC',
      'hul': 'Hindustan Unilever',
      'lt': 'Larsen & Toubro',
      'sun pharma': 'Sun Pharma',
      'drreddy': 'Dr. Reddy\'s Laboratories'
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [key, value] of Object.entries(stocks)) {
      if (lowerMessage.includes(key)) {
        return value;
      }
    }
    return null;
  }

  extractCommodity(message) {
    const commodities = {
      'gold': 'gold',
      'silver': 'silver',
      'crude': 'crude oil',
      'oil': 'crude oil',
      'natural gas': 'natural gas',
      'copper': 'copper',
      'aluminum': 'aluminum',
      'zinc': 'zinc'
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [key, value] of Object.entries(commodities)) {
      if (lowerMessage.includes(key)) {
        return value;
      }
    }
    return 'commodity';
  }

  extractAmount(message) {
    const match = message.match(/(\d+(?:,\d+)*)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : null;
  }
}

module.exports = NiveshAI;
