class PortfolioService {
  constructor() {
    this.portfolios = new Map(); // In-memory storage (use database in production)
    this.marketDataService = require('./MarketDataService');
  }

  createPortfolio(userId, portfolioData) {
    try {
      const portfolio = {
        id: this.generateId(),
        userId: userId,
        name: portfolioData.name || 'My Portfolio',
        description: portfolioData.description || '',
        investments: [],
        totalInvested: 0,
        currentValue: 0,
        totalReturns: 0,
        returnPercentage: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        riskProfile: portfolioData.riskProfile || 'moderate',
        targetAllocation: portfolioData.targetAllocation || {
          equity: 60,
          debt: 30,
          gold: 5,
          cash: 5
        }
      };

      this.portfolios.set(portfolio.id, portfolio);
      return portfolio;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw new Error('Failed to create portfolio');
    }
  }

  addInvestment(portfolioId, investmentData) {
    try {
      const portfolio = this.portfolios.get(portfolioId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const investment = {
        id: this.generateId(),
        type: investmentData.type, // 'stock', 'mutual_fund', 'etf', 'bond'
        symbol: investmentData.symbol,
        name: investmentData.name,
        quantity: investmentData.quantity,
        averageCost: investmentData.averageCost,
        currentPrice: investmentData.currentPrice || investmentData.averageCost,
        investedAmount: investmentData.quantity * investmentData.averageCost,
        currentValue: investmentData.quantity * (investmentData.currentPrice || investmentData.averageCost),
        returns: 0,
        returnPercentage: 0,
        purchaseDate: investmentData.purchaseDate || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        sector: investmentData.sector || '',
        marketCap: investmentData.marketCap || '',
        isin: investmentData.isin || '',
        nav: investmentData.nav || null, // For mutual funds
        expenseRatio: investmentData.expenseRatio || null
      };

      // Calculate returns
      investment.returns = investment.currentValue - investment.investedAmount;
      investment.returnPercentage = (investment.returns / investment.investedAmount) * 100;

      portfolio.investments.push(investment);
      this.updatePortfolioMetrics(portfolio);

      this.portfolios.set(portfolioId, portfolio);
      return investment;
    } catch (error) {
      console.error('Error adding investment:', error);
      throw new Error('Failed to add investment');
    }
  }

  updateInvestment(portfolioId, investmentId, updateData) {
    try {
      const portfolio = this.portfolios.get(portfolioId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const investmentIndex = portfolio.investments.findIndex(inv => inv.id === investmentId);
      if (investmentIndex === -1) {
        throw new Error('Investment not found');
      }

      const investment = portfolio.investments[investmentIndex];
      
      // Update allowed fields
      if (updateData.quantity !== undefined) investment.quantity = updateData.quantity;
      if (updateData.currentPrice !== undefined) investment.currentPrice = updateData.currentPrice;
      if (updateData.averageCost !== undefined) investment.averageCost = updateData.averageCost;
      if (updateData.sector !== undefined) investment.sector = updateData.sector;

      // Recalculate values
      investment.investedAmount = investment.quantity * investment.averageCost;
      investment.currentValue = investment.quantity * investment.currentPrice;
      investment.returns = investment.currentValue - investment.investedAmount;
      investment.returnPercentage = (investment.returns / investment.investedAmount) * 100;
      investment.lastUpdated = new Date().toISOString();

      this.updatePortfolioMetrics(portfolio);
      this.portfolios.set(portfolioId, portfolio);

      return investment;
    } catch (error) {
      console.error('Error updating investment:', error);
      throw new Error('Failed to update investment');
    }
  }

  removeInvestment(portfolioId, investmentId) {
    try {
      const portfolio = this.portfolios.get(portfolioId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const investmentIndex = portfolio.investments.findIndex(inv => inv.id === investmentId);
      if (investmentIndex === -1) {
        throw new Error('Investment not found');
      }

      portfolio.investments.splice(investmentIndex, 1);
      this.updatePortfolioMetrics(portfolio);
      this.portfolios.set(portfolioId, portfolio);

      return true;
    } catch (error) {
      console.error('Error removing investment:', error);
      throw new Error('Failed to remove investment');
    }
  }

  async updatePortfolioPrices(portfolioId) {
    try {
      const portfolio = this.portfolios.get(portfolioId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // Update current prices for all investments
      for (const investment of portfolio.investments) {
        try {
          const marketData = await this.marketDataService.getStockData(investment.symbol);
          if (marketData) {
            investment.currentPrice = marketData.price;
            investment.currentValue = investment.quantity * investment.currentPrice;
            investment.returns = investment.currentValue - investment.investedAmount;
            investment.returnPercentage = (investment.returns / investment.investedAmount) * 100;
            investment.lastUpdated = new Date().toISOString();
          }
        } catch (error) {
          console.error(`Error updating price for ${investment.symbol}:`, error);
        }
      }

      this.updatePortfolioMetrics(portfolio);
      this.portfolios.set(portfolioId, portfolio);

      return portfolio;
    } catch (error) {
      console.error('Error updating portfolio prices:', error);
      throw new Error('Failed to update portfolio prices');
    }
  }

  updatePortfolioMetrics(portfolio) {
    portfolio.totalInvested = portfolio.investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    portfolio.currentValue = portfolio.investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    portfolio.totalReturns = portfolio.currentValue - portfolio.totalInvested;
    portfolio.returnPercentage = portfolio.totalInvested > 0 ? 
      (portfolio.totalReturns / portfolio.totalInvested) * 100 : 0;
    portfolio.updatedAt = new Date().toISOString();
  }

  getPortfolio(portfolioId) {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }
    return portfolio;
  }

  getUserPortfolios(userId) {
    return Array.from(this.portfolios.values()).filter(p => p.userId === userId);
  }

  deletePortfolio(portfolioId) {
    const deleted = this.portfolios.delete(portfolioId);
    if (!deleted) {
      throw new Error('Portfolio not found');
    }
    return true;
  }

  getPortfolioAnalysis(portfolioId) {
    try {
      const portfolio = this.getPortfolio(portfolioId);
      
      const analysis = {
        basicMetrics: this.getBasicMetrics(portfolio),
        assetAllocation: this.getAssetAllocation(portfolio),
        sectorAllocation: this.getSectorAllocation(portfolio),
        performanceAnalysis: this.getPerformanceAnalysis(portfolio),
        riskAnalysis: this.getRiskAnalysis(portfolio),
        recommendations: this.getRecommendations(portfolio),
        diversificationScore: this.calculateDiversificationScore(portfolio)
      };

      return analysis;
    } catch (error) {
      console.error('Error analyzing portfolio:', error);
      throw new Error('Failed to analyze portfolio');
    }
  }

  getBasicMetrics(portfolio) {
    return {
      totalInvested: portfolio.totalInvested,
      currentValue: portfolio.currentValue,
      totalReturns: portfolio.totalReturns,
      returnPercentage: portfolio.returnPercentage,
      totalInvestments: portfolio.investments.length,
      bestPerformer: this.getBestPerformer(portfolio),
      worstPerformer: this.getWorstPerformer(portfolio),
      averageReturn: this.getAverageReturn(portfolio)
    };
  }

  getAssetAllocation(portfolio) {
    const allocation = {
      equity: { value: 0, percentage: 0, investments: [] },
      debt: { value: 0, percentage: 0, investments: [] },
      gold: { value: 0, percentage: 0, investments: [] },
      cash: { value: 0, percentage: 0, investments: [] },
      others: { value: 0, percentage: 0, investments: [] }
    };

    portfolio.investments.forEach(investment => {
      let category = 'others';
      
      if (investment.type === 'stock' || investment.type === 'equity_fund') {
        category = 'equity';
      } else if (investment.type === 'mutual_fund' || investment.type === 'bond') {
        category = 'debt';
      } else if (investment.type === 'gold_etf' || investment.type === 'gold_fund') {
        category = 'gold';
      } else if (investment.type === 'liquid_fund') {
        category = 'cash';
      }

      allocation[category].value += investment.currentValue;
      allocation[category].investments.push(investment);
    });

    // Calculate percentages
    const total = portfolio.currentValue;
    Object.keys(allocation).forEach(key => {
      allocation[key].percentage = total > 0 ? (allocation[key].value / total) * 100 : 0;
    });

    return allocation;
  }

  getSectorAllocation(portfolio) {
    const sectorMap = new Map();

    portfolio.investments.forEach(investment => {
      const sector = investment.sector || 'Others';
      if (!sectorMap.has(sector)) {
        sectorMap.set(sector, { value: 0, percentage: 0, investments: [] });
      }
      sectorMap.get(sector).value += investment.currentValue;
      sectorMap.get(sector).investments.push(investment);
    });

    // Convert to object and calculate percentages
    const sectorAllocation = {};
    const total = portfolio.currentValue;

    sectorMap.forEach((data, sector) => {
      sectorAllocation[sector] = {
        value: data.value,
        percentage: total > 0 ? (data.value / total) * 100 : 0,
        investments: data.investments
      };
    });

    return sectorAllocation;
  }

  getPerformanceAnalysis(portfolio) {
    const investments = portfolio.investments;
    
    const returns = investments.map(inv => inv.returnPercentage);
    const positiveReturns = investments.filter(inv => inv.returnPercentage > 0);
    const negativeReturns = investments.filter(inv => inv.returnPercentage < 0);

    return {
      averageReturn: this.getAverageReturn(portfolio),
      medianReturn: this.calculateMedian(returns),
      standardDeviation: this.calculateStandardDeviation(returns),
      positiveInvestments: positiveReturns.length,
      negativeInvestments: negativeReturns.length,
      positiveReturnsPercentage: (positiveReturns.length / investments.length) * 100,
      bestPerformer: this.getBestPerformer(portfolio),
      worstPerformer: this.getWorstPerformer(portfolio),
      volatility: this.calculateVolatility(portfolio)
    };
  }

  getRiskAnalysis(portfolio) {
    const assetAllocation = this.getAssetAllocation(portfolio);
    const sectorAllocation = this.getSectorAllocation(portfolio);
    
    // Calculate concentration risk
    const maxSectorConcentration = Math.max(...Object.values(sectorAllocation).map(s => s.percentage));
    const maxAssetConcentration = Math.max(...Object.values(assetAllocation).map(a => a.percentage));
    
    return {
      concentrationRisk: {
        sector: maxSectorConcentration,
        asset: maxAssetConcentration,
        overall: (maxSectorConcentration + maxAssetConcentration) / 2
      },
      diversificationScore: this.calculateDiversificationScore(portfolio),
      riskLevel: this.assessRiskLevel(portfolio),
      recommendations: this.getRiskRecommendations(portfolio)
    };
  }

  getRecommendations(portfolio) {
    const recommendations = [];
    const assetAllocation = this.getAssetAllocation(portfolio);
    const targetAllocation = portfolio.targetAllocation;

    // Asset allocation recommendations
    Object.keys(targetAllocation).forEach(asset => {
      const current = assetAllocation[asset]?.percentage || 0;
      const target = targetAllocation[asset];
      const difference = target - current;

      if (Math.abs(difference) > 5) { // Only recommend if difference is significant
        if (difference > 0) {
          recommendations.push({
            type: 'rebalance',
            priority: 'medium',
            message: `Consider increasing ${asset} allocation by ${difference.toFixed(1)}% to reach target of ${target}%`,
            action: 'buy',
            asset: asset
          });
        } else {
          recommendations.push({
            type: 'rebalance',
            priority: 'medium',
            message: `Consider reducing ${asset} allocation by ${Math.abs(difference).toFixed(1)}% to reach target of ${target}%`,
            action: 'sell',
            asset: asset
          });
        }
      }
    });

    // Performance-based recommendations
    const worstPerformer = this.getWorstPerformer(portfolio);
    if (worstPerformer && worstPerformer.returnPercentage < -20) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: `${worstPerformer.name} has underperformed with ${worstPerformer.returnPercentage.toFixed(2)}% returns. Consider reviewing this investment.`,
        action: 'review',
        investment: worstPerformer
      });
    }

    // Diversification recommendations
    const diversificationScore = this.calculateDiversificationScore(portfolio);
    if (diversificationScore < 5) {
      recommendations.push({
        type: 'diversification',
        priority: 'high',
        message: 'Your portfolio needs better diversification. Consider adding investments across different sectors and asset classes.',
        action: 'diversify'
      });
    }

    return recommendations;
  }

  calculateDiversificationScore(portfolio) {
    let score = 0;
    const assetAllocation = this.getAssetAllocation(portfolio);
    const sectorAllocation = this.getSectorAllocation(portfolio);

    // Asset allocation diversity (max 5 points)
    const assetTypes = Object.values(assetAllocation).filter(a => a.percentage > 0).length;
    score += Math.min(assetTypes, 5);

    // Sector diversity (max 5 points)
    const sectorTypes = Object.keys(sectorAllocation).length;
    score += Math.min(sectorTypes, 5);

    // Concentration penalty
    const maxSectorConcentration = Math.max(...Object.values(sectorAllocation).map(s => s.percentage));
    if (maxSectorConcentration > 40) score -= 2;
    else if (maxSectorConcentration > 30) score -= 1;

    return Math.max(0, Math.min(10, score));
  }

  // Helper methods
  getBestPerformer(portfolio) {
    if (portfolio.investments.length === 0) return null;
    return portfolio.investments.reduce((best, current) => 
      current.returnPercentage > best.returnPercentage ? current : best
    );
  }

  getWorstPerformer(portfolio) {
    if (portfolio.investments.length === 0) return null;
    return portfolio.investments.reduce((worst, current) => 
      current.returnPercentage < worst.returnPercentage ? current : worst
    );
  }

  getAverageReturn(portfolio) {
    if (portfolio.investments.length === 0) return 0;
    const totalReturns = portfolio.investments.reduce((sum, inv) => sum + inv.returnPercentage, 0);
    return totalReturns / portfolio.investments.length;
  }

  calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? 
      (sorted[mid - 1] + sorted[mid]) / 2 : 
      sorted[mid];
  }

  calculateStandardDeviation(values) {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(val => Math.pow(val - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
  }

  calculateVolatility(portfolio) {
    const returns = portfolio.investments.map(inv => inv.returnPercentage);
    return this.calculateStandardDeviation(returns);
  }

  assessRiskLevel(portfolio) {
    const volatility = this.calculateVolatility(portfolio);
    const diversificationScore = this.calculateDiversificationScore(portfolio);
    
    if (volatility > 20 || diversificationScore < 3) return 'High';
    if (volatility > 15 || diversificationScore < 6) return 'Medium';
    return 'Low';
  }

  getRiskRecommendations(portfolio) {
    const riskLevel = this.assessRiskLevel(portfolio);
    const recommendations = [];

    if (riskLevel === 'High') {
      recommendations.push('Consider reducing exposure to volatile investments');
      recommendations.push('Increase diversification across sectors');
      recommendations.push('Review stop-loss levels for high-risk investments');
    } else if (riskLevel === 'Medium') {
      recommendations.push('Monitor portfolio regularly');
      recommendations.push('Consider rebalancing if allocation deviates significantly');
    } else {
      recommendations.push('Portfolio appears well-balanced');
      recommendations.push('Continue regular monitoring');
    }

    return recommendations;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = PortfolioService;
