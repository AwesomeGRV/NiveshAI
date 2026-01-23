class KnowledgeBase {
  constructor() {
    this.stockRecommendations = this.initializeStockRecommendations();
    this.mutualFundData = this.initializeMutualFundData();
    this.portfolioStrategies = this.initializePortfolioStrategies();
    this.riskMitigationStrategies = this.initializeRiskMitigationStrategies();
    this.taxPlanningStrategies = this.initializeTaxPlanningStrategies();
    this.educationalContent = this.initializeEducationalContent();
  }

  initializeStockRecommendations() {
    return {
      large_cap: [
        {
          symbol: 'RELIANCE',
          name: 'Reliance Industries Ltd.',
          sector: 'Oil & Gas',
          pe: 22.5,
          pb: 3.2,
          roe: 15.2,
          dividend: 1.8,
          marketCap: 'Large Cap',
          recommendation: 'BUY',
          targetPrice: 2850,
          upside: 12.1,
          reasons: [
            'Strong retail business growth',
            '5G rollout driving telecom growth',
            'Green energy initiatives',
            'Consistent dividend payout'
          ],
          risks: [
            'Oil price volatility',
            'Regulatory challenges',
            'Competition in telecom'
          ]
        },
        {
          symbol: 'TCS',
          name: 'Tata Consultancy Services',
          sector: 'Information Technology',
          pe: 28.3,
          pb: 8.9,
          roe: 42.1,
          dividend: 2.1,
          marketCap: 'Large Cap',
          recommendation: 'BUY',
          targetPrice: 3800,
          upside: 9.9,
          reasons: [
            'Strong deal pipeline',
            'Digital transformation demand',
            'Consistent margin expansion',
            'Global expansion'
          ],
          risks: [
            'US recession concerns',
            'Currency fluctuation',
            'Talent attrition'
          ]
        },
        {
          symbol: 'HDFCBANK',
          name: 'HDFC Bank Ltd.',
          sector: 'Banking',
          pe: 18.7,
          pb: 3.8,
          roe: 16.8,
          dividend: 1.5,
          marketCap: 'Large Cap',
          recommendation: 'HOLD',
          targetPrice: 1850,
          upside: 10.2,
          reasons: [
            'Strong loan growth',
            'Improving asset quality',
            'Digital banking initiatives',
            'Merger synergies'
          ],
          risks: [
            'NPA concerns',
            'Interest rate volatility',
            'Competition from fintech'
          ]
        }
      ],
      mid_cap: [
        {
          symbol: 'AUBANK',
          name: 'AU Small Finance Bank',
          sector: 'Banking',
          pe: 15.2,
          pb: 2.1,
          roe: 14.3,
          dividend: 0.8,
          marketCap: 'Mid Cap',
          recommendation: 'BUY',
          targetPrice: 750,
          upside: 18.5,
          reasons: [
            'Strong retail focus',
            'Digital banking leadership',
            'Expanding branch network',
            'Improving asset quality'
          ],
          risks: [
            'Liquidity risk',
            'Concentration risk',
            'Regulatory changes'
          ]
        },
        {
          symbol: 'POLYMED',
          name: 'Poly Medicure Ltd.',
          sector: 'Medical Devices',
          pe: 32.1,
          pb: 6.8,
          roe: 21.2,
          dividend: 0.5,
          marketCap: 'Mid Cap',
          recommendation: 'BUY',
          targetPrice: 2100,
          upside: 22.3,
          reasons: [
            'Growing medical devices market',
            'Export opportunities',
            'New product launches',
            'Strong R&D pipeline'
          ],
          risks: [
            'Competition from MNCs',
            'Regulatory approvals',
            'Raw material costs'
          ]
        }
      ],
      small_cap: [
        {
          symbol: 'SARVESHWAR',
          name: 'Sarveshwar Foods Ltd.',
          sector: 'Food Processing',
          pe: 18.5,
          pb: 2.8,
          roe: 15.1,
          dividend: 1.2,
          marketCap: 'Small Cap',
          recommendation: 'BUY',
          targetPrice: 180,
          upside: 28.6,
          reasons: [
            'Basmati rice market leader',
            'Export growth potential',
            'Organic product expansion',
            'Strong brand value'
          ],
          risks: [
            'Commodity price volatility',
            'Weather dependency',
            'Export regulations'
          ]
        }
      ]
    };
  }

  initializeMutualFundData() {
    return {
      large_cap: [
        {
          name: 'Axis Bluechip Fund',
          category: 'Large Cap',
          aum: 28543,
          expenseRatio: 0.49,
          returns: { '1Y': 19.2, '3Y': 15.1, '5Y': 12.8 },
          risk: 'Moderate',
          starRating: 4,
          fundManager: 'Jinesh Gopani',
          inception: '2010',
          topHoldings: ['HDFCBANK', 'ICICIBANK', 'RELIANCE', 'TCS', 'INFY']
        },
        {
          name: 'Mirae Asset Large Cap Fund',
          category: 'Large Cap',
          aum: 19876,
          expenseRatio: 0.54,
          returns: { '1Y': 18.8, '3Y': 14.8, '5Y': 13.1 },
          risk: 'Moderate',
          starRating: 4,
          fundManager: 'Gaurav Misra',
          inception: '2008',
          topHoldings: ['RELIANCE', 'HDFCBANK', 'TCS', 'ICICIBANK', 'KOTAKBANK']
        }
      ],
      flexi_cap: [
        {
          name: 'Parag Parikh Flexi Cap Fund',
          category: 'Flexi Cap',
          aum: 22198,
          expenseRatio: 0.62,
          returns: { '1Y': 21.3, '3Y': 16.8, '5Y': 14.2 },
          risk: 'Moderately High',
          starRating: 5,
          fundManager: 'Rajeev Thakkar',
          inception: '2013',
          topHoldings: ['HDFCBANK', 'RELIANCE', 'TCS', 'ICICIBANK', 'BAJFINANCE']
        }
      ],
      elss: [
        {
          name: 'Axis Long Term Equity Fund',
          category: 'ELSS',
          aum: 28765,
          expenseRatio: 0.82,
          returns: { '1Y': 21.2, '3Y': 16.3, '5Y': 13.9 },
          risk: 'Moderately High',
          starRating: 4,
          fundManager: 'Jinesh Gopani',
          inception: '2009',
          lockIn: '3 years',
          taxBenefit: 'Section 80C',
          topHoldings: ['RELIANCE', 'TCS', 'HDFCBANK', 'ICICIBANK', 'KOTAKBANK']
        }
      ]
    };
  }

  initializePortfolioStrategies() {
    return {
      conservative: {
        allocation: { equity: 30, debt: 60, gold: 5, cash: 5 },
        description: 'Focus on capital preservation with steady returns',
        suitableFor: 'Retirees, low-risk investors',
        expectedReturns: '8-10% CAGR',
        riskLevel: 'Low'
      },
      moderate: {
        allocation: { equity: 60, debt: 30, gold: 5, cash: 5 },
        description: 'Balanced approach with growth and stability',
        suitableFor: 'Working professionals, medium-term goals',
        expectedReturns: '12-15% CAGR',
        riskLevel: 'Medium'
      },
      aggressive: {
        allocation: { equity: 80, debt: 15, gold: 3, cash: 2 },
        description: 'High growth focus with higher risk tolerance',
        suitableFor: 'Young investors, high-risk appetite',
        expectedReturns: '15-18% CAGR',
        riskLevel: 'High'
      }
    };
  }

  initializeRiskMitigationStrategies() {
    return {
      diversification: {
        title: 'Portfolio Diversification',
        description: 'Spread investments across different asset classes and sectors',
        strategies: [
          'Invest in multiple sectors (IT, Banking, Pharma, FMCG)',
          'Include different market caps (Large, Mid, Small)',
          'Add international exposure through international funds',
          'Maintain asset allocation balance'
        ]
      },
      systematicInvesting: {
        title: 'Systematic Investment Plan (SIP)',
        description: 'Regular investments to reduce timing risk',
        strategies: [
          'Monthly SIP in equity funds',
          'Step-up SIP increasing annually',
          'SIP in debt funds for stability',
          'Emergency fund in liquid funds'
        ]
      },
      stopLoss: {
        title: 'Stop-Loss Strategy',
        description: 'Limit downside risk in direct stocks',
        strategies: [
          'Set 15-20% stop-loss for individual stocks',
          'Review portfolio quarterly',
          'Book profits at target levels',
          'Avoid averaging losing positions'
        ]
      }
    };
  }

  initializeTaxPlanningStrategies() {
    return {
      section80c: {
        title: 'Section 80C Investments',
        limit: '₹1,50,000',
        options: [
          { name: 'ELSS Mutual Funds', returns: '12-15%', lockIn: '3 years', risk: 'High' },
          { name: 'PPF', returns: '7.1%', lockIn: '15 years', risk: 'Low' },
          { name: 'Tax Saving FD', returns: '6.5-7%', lockIn: '5 years', risk: 'Low' },
          { name: 'NPS', returns: '10-12%', lockIn: 'Till retirement', risk: 'Medium' }
        ]
      },
      capitalGains: {
        title: 'Capital Gains Tax Optimization',
        strategies: [
          'Hold equity investments >1 year for 10% LTCG',
          'Use indexation benefits for debt funds',
          'Harvest losses to offset gains',
          'Consider tax-loss harvesting at year-end'
        ]
      }
    };
  }

  initializeEducationalContent() {
    return {
      sip: {
        title: 'Systematic Investment Plan (SIP)',
        content: 'SIP is a method of investing a fixed amount regularly in mutual funds. It helps in rupee cost averaging and power of compounding.',
        benefits: [
          'Rupee cost averaging - buy more units when price is low',
          'Power of compounding - earn returns on returns',
          'Disciplined investing - regular investment habit',
          'Flexibility - start with as low as ₹500'
        ],
        example: 'Investing ₹10,000 monthly for 20 years at 12% returns can grow to ₹1 crore',
        calculation: 'Future Value = P × [{(1 + r)^n - 1} / r] × (1 + r)'
      },
      mutual_fund: {
        title: 'Mutual Funds',
        content: 'Mutual funds pool money from multiple investors to invest in diversified portfolios of stocks, bonds, or other securities.',
        types: [
          'Equity Funds - Invest primarily in stocks',
          'Debt Funds - Invest in fixed income securities',
          'Hybrid Funds - Mix of equity and debt',
          'Index Funds - Track market indices'
        ],
        factors: [
          'Expense Ratio - Annual management fee',
          'Exit Load - Charges on early withdrawal',
          'Fund Manager - Expertise and track record',
          'AUM - Assets under management'
        ]
      },
      stock_market: {
        title: 'Indian Stock Market',
        content: 'The Indian stock market consists of two major exchanges: NSE (National Stock Exchange) and BSE (Bombay Stock Exchange).',
        indices: [
          'Nifty 50 - Top 50 companies on NSE',
          'Sensex - Top 30 companies on BSE',
          'Nifty Bank - Banking sector index',
          'Nifty Next 50 - Next 50 large companies'
        ],
        basics: [
          'Market Cap = Share Price × Total Shares',
          'P/E Ratio = Share Price / Earnings per Share',
          'Dividend Yield = Annual Dividend / Share Price',
          'Book Value = Total Assets - Total Liabilities'
        ]
      }
    };
  }

  getStockRecommendations(criteria) {
    const { timeHorizon = 'long_term', marketCap, riskPreference = 'moderate' } = criteria;
    
    let recommendations = [];
    
    if (marketCap === 'large_cap' || !marketCap) {
      recommendations = [...recommendations, ...this.stockRecommendations.large_cap];
    }
    if (marketCap === 'mid_cap' || (!marketCap && riskPreference !== 'conservative')) {
      recommendations = [...recommendations, ...this.stockRecommendations.mid_cap];
    }
    if (marketCap === 'small_cap' || (!marketCap && riskPreference === 'aggressive')) {
      recommendations = [...recommendations, ...this.stockRecommendations.small_cap];
    }

    // Filter based on risk preference
    if (riskPreference === 'conservative') {
      recommendations = recommendations.filter(stock => stock.pe < 25 && stock.dividend > 1);
    } else if (riskPreference === 'aggressive') {
      recommendations = recommendations.filter(stock => stock.upside > 15);
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  getMutualFundRecommendations(fundType, userProfile) {
    const riskProfile = userProfile.riskProfile || { type: 'moderate' };
    
    let funds = [];
    
    switch (fundType) {
      case 'large_cap':
        funds = this.mutualFundData.large_cap;
        break;
      case 'flexi_cap':
        funds = this.mutualFundData.flexi_cap;
        break;
      case 'elss':
        funds = this.mutualFundData.elss;
        break;
      default:
        funds = [...this.mutualFundData.large_cap, ...this.mutualFundData.flexi_cap];
    }

    // Filter based on risk profile
    if (riskProfile.type === 'conservative') {
      funds = funds.filter(fund => fund.risk === 'Moderate' || fund.risk === 'Low');
    }

    return funds.slice(0, 3);
  }

  getOptimalAllocation(userProfile) {
    const riskProfile = userProfile.riskProfile || { type: 'moderate' };
    const age = userProfile.age || 30;
    
    // Age-based allocation adjustment
    let equityAllocation = 100 - age;
    if (riskProfile.type === 'conservative') equityAllocation -= 10;
    if (riskProfile.type === 'aggressive') equityAllocation += 10;
    
    equityAllocation = Math.max(20, Math.min(80, equityAllocation));
    
    return {
      equity: equityAllocation,
      debt: 90 - equityAllocation,
      gold: 5,
      cash: 5,
      reasoning: `Based on age ${age} and ${riskProfile.type} risk profile`
    };
  }

  getRebalancingStrategy(userProfile) {
    return {
      frequency: 'Quarterly review, Annual rebalancing',
      triggers: [
        'Asset allocation deviates by >5%',
        'Major life events (marriage, children, retirement)',
        'Significant market movements (>20%)'
      ],
      method: 'Sell winners, buy losers to maintain target allocation',
      taxConsiderations: 'Consider tax implications before rebalancing'
    };
  }

  getRiskMitigationStrategies(riskProfile) {
    const strategies = { ...this.riskMitigationStrategies };
    
    if (riskProfile.type === 'conservative') {
      strategies.stopLoss.strategies.push('Maintain higher cash allocation (10-15%)');
    } else if (riskProfile.type === 'aggressive') {
      strategies.diversification.strategies.push('Consider sector-specific bets (max 10% per sector)');
    }
    
    return strategies;
  }

  getTaxPlanningStrategies(userProfile) {
    return this.taxPlanningStrategies;
  }

  getTaxEfficientInvestments() {
    return [
      {
        name: 'ELSS Funds',
        taxBenefit: 'Section 80C deduction',
        returns: '12-15% CAGR',
        lockIn: '3 years',
        risk: 'High'
      },
      {
        name: 'PPF',
        taxBenefit: 'Section 80C deduction, Tax-free returns',
        returns: '7.1% compounded annually',
        lockIn: '15 years',
        risk: 'Low'
      },
      {
        name: 'NPS',
        taxBenefit: 'Section 80C deduction + additional ₹50,000',
        returns: '10-12% CAGR',
        lockIn: 'Till retirement',
        risk: 'Medium'
      }
    ];
  }

  getEducationalContent(topic) {
    return this.educationalContent[topic] || this.educationalContent.stock_market;
  }
}

module.exports = KnowledgeBase;
