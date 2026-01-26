class ResponseFormatter {
  constructor() {
    this.disclaimer = "This is for educational purposes only and not SEBI-registered investment advice. Please consult a licensed financial advisor before investing.";
    this.maxResponseLength = 2000;
  }

  formatResponse(response, userProfile) {
    let formattedResponse = {
      success: true,
      data: response,
      disclaimer: this.disclaimer,
      timestamp: new Date().toISOString(),
      userProfile: userProfile,
      formatted: this.formatContent(response)
    };

    return formattedResponse;
  }

  formatContent(response) {
    switch (response.type) {
      case 'AI_RESPONSE':
        return this.formatAIResponse(response.data);
      case 'ADVANCED_STOCK_ANALYSIS':
        return this.formatAdvancedStockAnalysis(response.data);
      case 'ADVANCED_COMMODITY_ANALYSIS':
        return this.formatAdvancedCommodityAnalysis(response.data);
      case 'INTELLIGENT_INVESTMENT_ADVICE':
        return this.formatIntelligentInvestmentAdvice(response.data);
      case 'PRICE_INTELLIGENCE':
        return this.formatPriceIntelligence(response.data);
      case 'COMPREHENSIVE_ANALYSIS':
        return this.formatComprehensiveAnalysis(response.data);
      case 'EDUCATIONAL_EXPLANATION':
        return this.formatEducationalExplanation(response.data);
      case 'MARKET_INTELLIGENCE':
        return this.formatMarketIntelligence(response.data);
      case 'INTELLIGENT_GUIDANCE':
        return this.formatIntelligentGuidance(response.data);
      case 'STOCK_RECOMMENDATION':
        return this.formatStockRecommendation(response.data);
      case 'MUTUAL_FUND':
        return this.formatMutualFundResponse(response.data);
      case 'PORTFOLIO_MANAGEMENT':
        return this.formatPortfolioResponse(response.data);
      case 'MARKET_ANALYSIS':
        return this.formatMarketAnalysis(response.data);
      case 'RISK_ASSESSMENT':
        return this.formatRiskAssessment(response.data);
      case 'TAX_PLANNING':
        return this.formatTaxPlanning(response.data);
      case 'EDUCATIONAL':
        return this.formatEducationalContent(response.data);
      case 'ENHANCED_AI_RESPONSE':
        return this.formatEnhancedAIResponse(response.data);
      default:
        return this.formatGeneralResponse(response.data);
    }
  }

  formatStockRecommendation(data) {
    let content = `📈 **Stock Market Recommendations**\n\n`;
    
    // Market Overview
    content += `📊 **Market Overview**\n`;
    content += `Nifty 50: ${data.marketOverview.nifty50.current} (${data.marketOverview.nifty50.change > 0 ? '+' : ''}${data.marketOverview.nifty50.changePercent}%)\n`;
    content += `Market Sentiment: ${data.marketOverview.marketSentiment}\n\n`;

    // Recommendations
    content += `🎯 **Top Stock Recommendations**\n\n`;
    data.recommendations.forEach((stock, index) => {
      content += `${index + 1}. **${stock.symbol} - ${stock.name}**\n`;
      content += `   Sector: ${stock.sector} | Market Cap: ${stock.marketCap}\n`;
      content += `   Current P/E: ${stock.pe} | Dividend: ${stock.dividend}%\n`;
      content += `   Recommendation: ${stock.recommendation} | Target: ₹${stock.targetPrice}\n`;
      content += `   Upside Potential: ${stock.upside}%\n`;
      content += `   **Why Invest:**\n`;
      stock.reasons.forEach(reason => {
        content += `   • ${reason}\n`;
      });
      content += `   **Risks:**\n`;
      stock.risks.forEach(risk => {
        content += `   • ${risk}\n`;
      });
      content += `\n`;
    });

    // Analysis Summary
    content += `📋 **Analysis Summary**\n`;
    content += `Total Recommendations: ${data.analysis.totalRecommendations}\n`;
    content += `Average P/E Ratio: ${data.analysis.averagePE}\n`;
    content += `Risk Score: ${data.analysis.riskScore}/10\n`;
    content += `Diversification Score: ${data.analysis.diversificationScore}/10\n\n`;

    return content;
  }

  formatMutualFundResponse(data) {
    let content = `💰 **Mutual Fund Recommendations**\n\n`;
    
    if (data.fundType && data.fundType !== 'all') {
      content += `📊 **${data.fundType.replace('_', ' ').toUpperCase()} Funds**\n\n`;
    }

    // Top Funds
    if (data.topFunds && data.topFunds.length > 0) {
      content += `🏆 **Top Performing Funds**\n\n`;
      data.topFunds.forEach((fund, index) => {
        content += `${index + 1}. **${fund.name}**\n`;
        content += `   Category: ${fund.category}\n`;
        content += `   AUM: ₹${(fund.aum/1000).toFixed(0)}K Cr | Expense Ratio: ${fund.expenseRatio}%\n`;
        content += `   Returns: 1Y: ${fund.returns['1Y']}% | 3Y: ${fund.returns['3Y']}% | 5Y: ${fund.returns['5Y']}%\n`;
        content += `   Risk Level: ${fund.risk}\n`;
        if (fund.fundManager) {
          content += `   Fund Manager: ${fund.fundManager}\n`;
        }
        content += `\n`;
      });
    }

    // SIP vs Lump Sum Analysis
    if (data.sipVsLumpSum) {
      content += `💡 **SIP vs Lump Sum Analysis**\n`;
      content += `Recommendation: ${data.sipVsLumpSum.recommendation}\n`;
      content += `Reasoning: ${data.sipVsLumpSum.reasoning}\n`;
      content += `Expected Returns:\n`;
      content += `• SIP: ${data.sipVsLumpSum.expectedReturns.sip}\n`;
      content += `• Lump Sum: ${data.sipVsLumpSum.expectedReturns.lumpSum}\n\n`;
    }

    return content;
  }

  formatPortfolioResponse(data) {
    let content = `🎯 **Portfolio Management Strategy**\n\n`;

    // Recommended Allocation
    content += `📊 **Recommended Asset Allocation**\n`;
    const allocation = data.recommendedAllocation;
    content += `• Equity: ${allocation.equity}%\n`;
    content += `• Debt: ${allocation.debt}%\n`;
    content += `• Gold: ${allocation.gold}%\n`;
    content += `• Cash: ${allocation.cash}%\n`;
    content += `Reasoning: ${allocation.reasoning}\n\n`;

    // Risk Metrics
    content += `⚠️ **Risk Metrics**\n`;
    content += `Portfolio Risk Score: ${data.riskMetrics.portfolioRisk.toFixed(2)}\n`;
    content += `Risk Level: ${data.riskMetrics.riskLevel}\n`;
    content += `Expected Volatility: ${data.riskMetrics.volatility}\n\n`;

    // Rebalancing Strategy
    content += `🔄 **Rebalancing Strategy**\n`;
    content += `Frequency: ${data.rebalancingStrategy.frequency}\n`;
    content += `Key Triggers:\n`;
    data.rebalancingStrategy.triggers.forEach(trigger => {
      content += `• ${trigger}\n`;
    });
    content += `Method: ${data.rebalancingStrategy.method}\n\n`;

    // Tax Efficiency
    content += `💰 **Tax Efficiency Analysis**\n`;
    content += `Efficiency Rating: ${data.taxEfficiency.efficiency}\n`;
    content += `Suggestions:\n`;
    data.taxEfficiency.suggestions.forEach(suggestion => {
      content += `• ${suggestion}\n`;
    });
    content += `\n`;

    return content;
  }

  formatMarketAnalysis(data) {
    let content = `📈 **Market Analysis & Outlook**\n\n`;

    // Current Market Status
    content += `📊 **Current Market Status**\n`;
    content += `Nifty 50: ${data.currentMarketStatus.nifty50.current} (${data.currentMarketStatus.nifty50.change > 0 ? '+' : ''}${data.currentMarketStatus.nifty50.changePercent}%)\n`;
    content += `VIX: ${data.currentMarketStatus.vix}\n`;
    content += `Market Sentiment: ${data.currentMarketStatus.marketSentiment}\n\n`;

    // Sector Trends
    content += `🏭 **Sector Performance**\n`;
    content += `Top Performers: ${data.sectorTrends.topPerformers.join(', ')}\n`;
    content += `Underperformers: ${data.sectorTrends.underPerformers.join(', ')}\n\n`;

    // Market Outlook
    content += `🔮 **Market Outlook**\n`;
    content += `Short-term: ${data.outlook.shortTerm}\n`;
    content += `Medium-term: ${data.outlook.mediumTerm}\n`;
    content += `Long-term: ${data.outlook.longTerm}\n\n`;

    // Key Indicators
    content += `📋 **Key Market Indicators**\n`;
    content += `Nifty 50: ${data.keyIndicators.nifty50}\n`;
    content += `Sensex: ${data.keyIndicators.sensex}\n`;
    content += `VIX: ${data.keyIndicators.vix}\n`;
    content += `Bond Yield: ${data.keyIndicators.bondYield}\n\n`;

    return content;
  }

  formatRiskAssessment(data) {
    let content = `⚠️ **Risk Assessment & Profile**\n\n`;

    // Risk Profile
    content += `👤 **Your Risk Profile**\n`;
    content += `Type: ${data.riskProfile.type.charAt(0).toUpperCase() + data.riskProfile.type.slice(1)}\n`;
    content += `Risk Score: ${data.riskProfile.score}/100\n`;
    content += `Description: ${data.riskProfile.description}\n\n`;

    // Characteristics
    content += `🎯 **Risk Characteristics**\n`;
    data.riskProfile.characteristics.forEach(char => {
      content += `• ${char}\n`;
    });
    content += `\n`;

    // Risk Capacity
    content += `💪 **Risk Capacity**\n`;
    content += `Level: ${data.riskCapacity.level}\n`;
    content += `Factors:\n`;
    data.riskCapacity.factors.forEach(factor => {
      content += `• ${factor}\n`;
    });
    content += `\n`;

    // Asset Allocation
    content += `📊 **Recommended Asset Allocation**\n`;
    const allocation = data.assetAllocation;
    content += `• Equity: ${allocation.equity}%\n`;
    content += `• Debt: ${allocation.debt}%\n`;
    content += `• Gold: ${allocation.gold}%\n`;
    content += `• Cash: ${allocation.cash}%\n\n`;

    // Mitigation Strategies
    content += `🛡️ **Risk Mitigation Strategies**\n`;
    Object.keys(data.mitigationStrategies).forEach(key => {
      const strategy = data.mitigationStrategies[key];
      content += `**${strategy.title}**\n`;
      content += `${strategy.description}\n`;
      strategy.strategies.forEach(s => {
        content += `• ${s}\n`;
      });
      content += `\n`;
    });

    return content;
  }

  formatTaxPlanning(data) {
    let content = `💰 **Tax Planning Strategies**\n\n`;

    // Strategies
    content += `📋 **Tax Planning Strategies**\n`;
    data.strategies.section80c.options.forEach(option => {
      content += `**${option.name}**\n`;
      content += `Returns: ${option.returns} | Lock-in: ${option.lockIn} | Risk: ${option.risk}\n`;
      content += `Tax Benefit: Section 80C (₹1.5L limit)\n\n`;
    });

    // Tax Efficient Investments
    content += `🏆 **Tax-Efficient Investment Options**\n`;
    data.taxEfficientInvestments.forEach(inv => {
      content += `• ${inv.name}: ${inv.returns} returns, ${inv.lockIn} lock-in\n`;
    });
    content += `\n`;

    // Capital Gains Tax
    content += `📈 **Capital Gains Tax**\n`;
    content += `**Equity Investments:**\n`;
    content += `• Short-term (<1 year): ${data.capitalGainsTax.equity.shortTerm}\n`;
    content += `• Long-term (>1 year): ${data.capitalGainsTax.equity.longTerm}\n\n`;
    content += `**Debt Investments:**\n`;
    content += `• Short-term: ${data.capitalGainsTax.debt.shortTerm}\n`;
    content += `• Long-term: ${data.capitalGainsTax.debt.longTerm}\n\n`;

    return content;
  }

  formatEducationalContent(data) {
    let content = `📚 **${data.topic.toUpperCase()} Guide**\n\n`;

    content += `📖 **What is ${data.topic.replace('_', ' ')}?**\n`;
    content += `${data.content}\n\n`;

    if (data.benefits) {
      content += `✅ **Key Benefits**\n`;
      data.benefits.forEach(benefit => {
        content += `• ${benefit}\n`;
      });
      content += `\n`;
    }

    if (data.types) {
      content += `🏷️ **Types**\n`;
      data.types.forEach(type => {
        content += `• ${type}\n`;
      });
      content += `\n`;
    }

    if (data.factors) {
      content += `🔍 **Important Factors**\n`;
      data.factors.forEach(factor => {
        content += `• ${factor}\n`;
      });
      content += `\n`;
    }

    if (data.example) {
      content += `💡 **Example**\n`;
      content += `${data.example}\n\n`;
    }

    if (data.relatedTopics && data.relatedTopics.length > 0) {
      content += `🔗 **Related Topics**\n`;
      data.relatedTopics.forEach(topic => {
        content += `• ${topic.replace('_', ' ')}\n`;
      });
      content += `\n`;
    }

    return content;
  }

  formatEnhancedAIResponse(data) {
    let content = '';
    
    // Add the main content FIRST (most important)
    if (data.content) {
      content += data.content;
    }
    
    // Add market data if available (after main content)
    if (data.marketData) {
      content += `\n\n---\n\n**Live Market Context:**\n`;
      content += `• Nifty 50: ${data.marketData.nifty50?.current || 'N/A'} (${data.marketData.nifty50?.changePercent || 'N/A'}%)\n`;
      content += `• Sensex: ${data.marketData.sensex?.current || 'N/A'} (${data.marketData.sensex?.changePercent || 'N/A'}%)\n`;
      content += `• Market Sentiment: ${data.marketData.marketSentiment || 'N/A'}\n`;
    }
    
    // Add RAG data summary if available
    if (data.ragData && data.ragData.summary) {
      content += `\n\n**Market Research:**\n${data.ragData.summary}`;
    }
    
    // Add source attribution at the bottom
    if (data.externalSource) {
      content += `\n\n---\n\n**Sources:** ${data.externalSource}`;
      if (data.sources && data.sources.length > 0) {
        content += `, ${data.sources.join(', ')}`;
      }
    }
    
    // Add confidence indicator at the very bottom
    if (data.confidence) {
      const confidenceLevel = data.confidence > 0.8 ? 'High' : data.confidence > 0.6 ? 'Medium' : 'Low';
      content += `\n\n**Response Confidence:** ${confidenceLevel} (${(data.confidence * 100).toFixed(0)}%)`;
    }
    
    return content;
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

  formatAIResponse(data) {
    let content = '';
    
    // If the message already contains markdown formatting, use it as-is
    if (data.message.includes('**') || data.message.includes('#') || data.message.includes('*')) {
      content = data.message;
    } else {
      // Otherwise, format it nicely
      content = `🤖 **NiveshAI Response**\n\n${data.message}`;
    }
    
    // Add source information
    if (data.source && data.source !== 'NiveshAI') {
      content += `\n\n---\n*Source: ${data.source}*`;
    }
    
    // Add market context if available
    if (data.marketContext) {
      content += `\n\n**Market Context:**\n`;
      content += `• Nifty 50: ${data.marketContext.nifty50?.current || 'N/A'} (${data.marketContext.nifty50?.changePercent || 'N/A'}%)\n`;
      content += `• Sensex: ${data.marketContext.sensex?.current || 'N/A'} (${data.marketContext.sensex?.changePercent || 'N/A'}%)\n`;
      content += `• Sentiment: ${data.marketContext.marketSentiment || 'N/A'}`;
    }
    
    return content;
  }

  formatAdvancedStockAnalysis(data) {
    
    content += `**Current Market Status:**\n`;
    content += `• **Current Price:** ₹${data.currentPrice}\n`;
    content += `• **Today's Change:** ${data.changePercent} (${data.change > 0 ? '↑' : '↓'} ${Math.abs(data.change)} points)\n`;
    content += `• **Volume:** ${data.volume}\n`;
    content += `• **Market Cap:** ${data.marketCap}\n\n`;

    if (data.priceAnalysis) {
      content += `**Price Analysis:**\n`;
      content += `• **Trend:** ${data.priceAnalysis.trend}\n`;
      content += `• **Momentum:** ${data.priceAnalysis.momentum}\n`;
      content += `• **Support:** ${data.priceAnalysis.keyLevels.support}\n`;
      content += `• **Resistance:** ${data.priceAnalysis.keyLevels.resistance}\n`;
      content += `• **Stop Loss:** ${data.priceAnalysis.keyLevels.stopLoss}\n\n`;
    }

    if (data.technicalIndicators) {
      content += `**Technical Indicators:**\n`;
      content += `• **RSI:** ${data.technicalIndicators.rsi}\n`;
      content += `• **MACD:** ${data.technicalIndicators.macd}\n`;
      content += `• **20 SMA:** ₹${data.technicalIndicators.movingAverages.sma20.toFixed(2)}\n`;
      content += `• **50 SMA:** ₹${data.technicalIndicators.movingAverages.sma50.toFixed(2)}\n\n`;
    }

    if (data.tradingRecommendation) {
      content += `**Trading Recommendation:**\n`;
      content += `• **Action:** ${data.tradingRecommendation.action}\n`;
      content += `• **Confidence:** ${data.tradingRecommendation.confidence}%\n`;
      content += `• **Entry Point:** ${data.tradingRecommendation.entryPoint}\n`;
      content += `• **Target Price:** ${data.tradingRecommendation.targetPrice}\n`;
      content += `• **Timeframe:** ${data.tradingRecommendation.timeframe}\n`;
      content += `• **Risk Level:** ${data.tradingRecommendation.riskLevel}\n\n`;
    }

    if (data.investmentAnalysis) {
      content += `**Investment Analysis:**\n`;
      content += `• **P/E Ratio:** ${data.investmentAnalysis.valuation.pe}\n`;
      content += `• **P/B Ratio:** ${data.investmentAnalysis.valuation.pb}\n`;
      content += `• **ROE:** ${data.investmentAnalysis.valuation.roe}%\n`;
      content += `• **Debt/Equity:** ${data.investmentAnalysis.valuation.debtToEquity}\n`;
      content += `• **Valuation:** ${data.investmentAnalysis.valuation.assessment}\n\n`;
    }

    if (data.fundamentalAnalysis) {
      content += `**Business Overview:**\n`;
      content += `${data.fundamentalAnalysis.businessOverview}\n\n`;
      content += `**Strengths:**\n`;
      data.fundamentalAnalysis.competitiveAdvantages.forEach(strength => {
        content += `• ${strength}\n`;
      });
      content += `\n**Recent Developments:**\n`;
      content += `${data.fundamentalAnalysis.recentDevelopments}\n\n`;
    }

    return content;
  }

  formatAdvancedCommodityAnalysis(data) {
    let content = `💰 **${data.commodity.charAt(0).toUpperCase() + data.commodity.slice(1)} - Advanced Analysis**\n\n`;
    
    content += `**Current Market Status:**\n`;
    content += `• **Current Price:** ${data.currentPrice}\n`;
    content += `• **Today's Change:** ${data.changePercent}\n\n`;

    if (data.technicalAnalysis) {
      content += `**Technical Analysis:**\n`;
      content += `• **Trend:** ${data.technicalAnalysis.trend}\n`;
      content += `• **Support:** ${data.technicalAnalysis.support}\n`;
      content += `• **Resistance:** ${data.technicalAnalysis.resistance}\n`;
      content += `• **RSI:** ${data.technicalAnalysis.rsi}\n\n`;
    }

    if (data.priceDrivers) {
      content += `**Price Drivers:**\n`;
      data.priceDrivers.forEach(driver => {
        content += `• ${driver}\n`;
      });
      content += `\n`;
    }

    if (data.investmentOptions) {
      content += `**Investment Options:**\n`;
      data.investmentOptions.forEach(option => {
        content += `• ${option}\n`;
      });
      content += `\n`;
    }

    if (data.marketDynamics) {
      content += `**Market Dynamics:**\n`;
      content += `• **Supply-Demand:** ${data.marketDynamics.supplyDemand}\n`;
      content += `• **Seasonal:** ${data.marketDynamics.seasonal}\n`;
      content += `• **Correlation:** ${data.marketDynamics.correlation}\n`;
      content += `• **Global:** ${data.marketDynamics.global}\n\n`;
    }

    return content;
  }

  formatIntelligentInvestmentAdvice(data) {
    let content = `🎯 **Intelligent Investment Advice**\n\n`;
    
    content += `**Risk Profile:** ${data.riskProfile.charAt(0).toUpperCase() + data.riskProfile.slice(1)}\n\n`;

    if (data.recommendations) {
      content += `**Personalized Recommendations:**\n`;
      data.recommendations.forEach(rec => {
        content += `• **${rec.asset}** (${rec.allocation}): ${rec.reasoning}\n`;
      });
      content += `\n`;
    }

    if (data.currentOpportunities) {
      content += `**Current Market Opportunities:**\n`;
      data.currentOpportunities.forEach(opp => {
        content += `• **${opp.sector}**: ${opp.opportunity} (${opp.timeframe}, ${opp.potential} potential)\n`;
      });
      content += `\n`;
    }

    if (data.riskManagement) {
      content += `**Risk Management:**\n`;
      content += `• **Diversification:** ${data.riskManagement.diversification}\n`;
      content += `• **Stop Loss:** ${data.riskManagement.stopLoss}\n`;
      content += `• **Position Sizing:** ${data.riskManagement.positionSizing}\n`;
      content += `• **Review:** ${data.riskManagement.review}\n\n`;
    }

    return content;
  }

  formatPriceIntelligence(data) {
    let content = `💡 **Price Intelligence**\n\n`;
    content += `${data.message}\n\n`;
    
    if (data.examples) {
      content += `**Examples:**\n`;
      data.examples.forEach(example => {
        content += `• ${example}\n`;
      });
      content += `\n`;
    }

    return content;
  }

  formatComprehensiveAnalysis(data) {
    let content = `📊 **Comprehensive Analysis**\n\n`;
    content += `${data.message}\n\n`;
    
    if (data.analysisTypes) {
      content += `**Available Analysis Types:**\n`;
      data.analysisTypes.forEach(type => {
        content += `• ${type}\n`;
      });
      content += `\n`;
    }

    return content;
  }

  formatEducationalExplanation(data) {
    let content = `📚 **Educational Explanation**\n\n`;
    content += `${data.message}\n\n`;
    
    if (data.topics) {
      content += `**Topics I can explain:**\n`;
      data.topics.forEach(topic => {
        content += `• ${topic}\n`;
      });
      content += `\n`;
    }

    return content;
  }

  formatMarketIntelligence(data) {
    let content = `🌐 **Market Intelligence**\n\n`;
    
    if (data.sentiment) {
      content += `**Market Sentiment:** ${data.sentiment.overall} (Confidence: ${data.sentiment.confidence})\n`;
      content += `**Outlook:** ${data.sentiment.outlook}\n\n`;
    }

    if (data.sectorPerformance) {
      content += `**Sector Performance:**\n`;
      Object.entries(data.sectorPerformance).forEach(([sector, performance]) => {
        content += `• **${sector}**: ${performance}\n`;
      });
      content += `\n`;
    }

    if (data.marketDrivers) {
      content += `**Market Drivers:**\n`;
      data.marketDrivers.forEach(driver => {
        content += `• **${driver.driver}**: ${driver.impact} - ${driver.description}\n`;
      });
      content += `\n`;
    }

    if (data.outlook) {
      content += `**Market Outlook:**\n`;
      content += `• **Short-term:** ${data.outlook.shortTerm}\n`;
      content += `• **Medium-term:** ${data.outlook.mediumTerm}\n`;
      content += `• **Long-term:** ${data.outlook.longTerm}\n\n`;
    }

    return content;
  }

  formatIntelligentGuidance(data) {
    let content = `🤖 **Advanced AI Investment Assistant**\n\n`;
    content += `${data.message}\n\n`;
    
    if (data.capabilities) {
      content += `**My Capabilities:**\n`;
      data.capabilities.forEach(capability => {
        content += `${capability}\n`;
      });
      content += `\n`;
    }

    if (data.examples) {
      content += `**Try these examples:**\n`;
      data.examples.forEach(example => {
        content += `• ${example}\n`;
      });
      content += `\n`;
    }

    return content;
  }

  formatErrorResponse(errorMessage) {
    return {
      success: false,
      error: errorMessage,
      message: "I apologize, but I encountered an error. Please try again or rephrase your question.",
      disclaimer: this.disclaimer,
      timestamp: new Date().toISOString()
    };
  }

  truncateResponse(content) {
    if (content.length <= this.maxResponseLength) {
      return content;
    }
    
    return content.substring(0, this.maxResponseLength - 100) + 
           "\n\n...[Response truncated for brevity. Ask for more specific details.]";
  }

  addDisclaimer(content) {
    return content + `\n\n---\n⚠️ **Disclaimer:** ${this.disclaimer}`;
  }
}

module.exports = ResponseFormatter;
