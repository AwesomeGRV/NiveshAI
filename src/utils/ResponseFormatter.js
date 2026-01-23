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
