const axios = require('axios');
const cheerio = require('cheerio');

class MarketDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async getMarketOverview() {
    const cacheKey = 'market_overview';
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      // Simulate market data (in production, integrate with real APIs)
      const marketData = {
        nifty50: {
          current: 19876.45,
          change: +125.30,
          changePercent: +0.63,
          pe: 22.5,
          pb: 3.2,
          dividend: 1.2
        },
        sensex: {
          current: 66543.21,
          change: +234.56,
          changePercent: +0.35,
          pe: 24.1,
          pb: 3.8,
          dividend: 1.1
        },
        marketSentiment: 'Positive',
          vix: 14.2,
          topGainers: [
            { symbol: 'RELIANCE', price: 2543.20, change: +2.3 },
            { symbol: 'TCS', price: 3456.70, change: +1.8 },
            { symbol: 'HDFCBANK', price: 1678.90, change: +1.5 }
          ],
          topLosers: [
            { symbol: 'YESBANK', price: 23.45, change: -3.2 },
            { symbol: 'IDEA', price: 12.34, change: -2.1 }
          ]
      };

      this.cache.set(cacheKey, {
        data: marketData,
        timestamp: Date.now()
      });

      return marketData;
    } catch (error) {
      console.error('Error fetching market overview:', error);
      return this.getFallbackMarketData();
    }
  }

  async getDetailedMarketAnalysis() {
    try {
      const analysis = {
        technicalIndicators: {
          rsi: 58.5,
          macd: 'Bullish',
          movingAverages: {
            sma20: 19650,
            sma50: 19400,
            sma200: 18800
          }
        },
        marketBreadth: {
          advanceDecline: 1456 - 876,
          newHighsLows: { highs: 156, lows: 23 }
        },
        sectorPerformance: {
          topPerformers: ['IT', 'Pharma', 'FMCG'],
          underPerformers: ['Metal', 'Real Estate', 'PSU Banks']
        },
        fiiDiiActivity: {
          fii: { net: -1250, trend: 'Selling' },
          dii: { net: +980, trend: 'Buying' }
        }
      };

      return analysis;
    } catch (error) {
      console.error('Error fetching detailed analysis:', error);
      return null;
    }
  }

  async getSectorAnalysis() {
    try {
      const sectors = [
        {
          name: 'Information Technology',
          pe: 28.5,
          pb: 6.2,
          dividend: 1.8,
          performance: '+2.3%',
          outlook: 'Positive',
          keyStocks: ['TCS', 'INFY', 'WIPRO', 'HCLTECH']
        },
        {
          name: 'Banking & Financial Services',
          pe: 18.2,
          pb: 2.1,
          dividend: 2.5,
          performance: '+1.2%',
          outlook: 'Neutral',
          keyStocks: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK']
        },
        {
          name: 'Pharmaceuticals',
          pe: 32.1,
          pb: 4.8,
          dividend: 1.2,
          performance: '+1.8%',
          outlook: 'Positive',
          keyStocks: ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'LUPIN']
        },
        {
          name: 'FMCG',
          pe: 45.6,
          pb: 8.9,
          dividend: 1.5,
          performance: '+0.8%',
          outlook: 'Neutral',
          keyStocks: ['HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA']
        },
        {
          name: 'Automobile',
          pe: 22.3,
          pb: 3.4,
          dividend: 2.1,
          performance: '-0.5%',
          outlook: 'Cautious',
          keyStocks: ['MARUTI', 'TATAMOTORS', 'M&M', 'BAJAJ-AUTO']
        },
        {
          name: 'Oil & Gas',
          pe: 12.8,
          pb: 1.8,
          dividend: 3.2,
          performance: '+0.3%',
          outlook: 'Neutral',
          keyStocks: ['RELIANCE', 'ONGC', 'BPCL', 'IOC']
        }
      ];

      return sectors;
    } catch (error) {
      console.error('Error fetching sector analysis:', error);
      return [];
    }
  }

  async getMutualFundData(fundType = 'all') {
    try {
      const fundData = {
        largeCap: {
          category: 'Large Cap',
          avgReturns: { '1Y': 18.5, '3Y': 14.2, '5Y': 12.8 },
          avgPE: 22.1,
          topFunds: [
            { name: 'Axis Bluechip Fund', returns: { '1Y': 19.2, '3Y': 15.1 }, aum: 28543, expense: 0.49 },
            { name: 'Mirae Asset Large Cap Fund', returns: { '1Y': 18.8, '3Y': 14.8 }, aum: 19876, expense: 0.54 },
            { name: 'Canara Robeco Equity Fund', returns: { '1Y': 17.9, '3Y': 13.9 }, aum: 12345, expense: 0.62 }
          ]
        },
        midCap: {
          category: 'Mid Cap',
          avgReturns: { '1Y': 24.3, '3Y': 18.7, '5Y': 16.2 },
          avgPE: 28.5,
          topFunds: [
            { name: 'Axis Midcap Fund', returns: { '1Y': 25.1, '3Y': 19.3 }, aum: 15432, expense: 0.67 },
            { name: 'HDFC Mid-Cap Opportunities', returns: { '1Y': 23.8, '3Y': 18.1 }, aum: 22198, expense: 0.72 }
          ]
        },
        smallCap: {
          category: 'Small Cap',
          avgReturns: { '1Y': 28.7, '3Y': 22.1, '5Y': 19.3 },
          avgPE: 35.2,
          topFunds: [
            { name: 'Nippon India Small Cap Fund', returns: { '1Y': 29.3, '3Y': 22.8 }, aum: 18765, expense: 0.78 },
            { name: 'SBI Small Cap Fund', returns: { '1Y': 28.1, '3Y': 21.4 }, aum: 12345, expense: 0.85 }
          ]
        },
        elss: {
          category: 'ELSS (Tax Saving)',
          avgReturns: { '1Y': 20.3, '3Y': 15.7, '5Y': 13.9 },
          avgPE: 24.8,
          topFunds: [
            { name: 'Axis Long Term Equity Fund', returns: { '1Y': 21.2, '3Y': 16.3 }, aum: 28765, expense: 0.82 },
            { name: 'Parag Parikh Tax Saver Fund', returns: { '1Y': 19.8, '3Y': 15.1 }, aum: 9876, expense: 0.75 }
          ]
        }
      };

      return fundType === 'all' ? fundData : fundData[fundType] || null;
    } catch (error) {
      console.error('Error fetching mutual fund data:', error);
      return null;
    }
  }

  async getStockData(symbol) {
    try {
      // Simulate stock data (in production, integrate with NSE/BSE APIs)
      const stockData = {
        symbol,
        price: 1234.56,
        change: +12.34,
        changePercent: +1.01,
        volume: 1234567,
        marketCap: 123456.78,
        pe: 22.5,
        pb: 3.2,
        dividend: 1.8,
        roe: 15.2,
        debtToEquity: 0.3,
        promoterHolding: 65.5,
        technical: {
          rsi: 58.5,
          macd: 'Bullish',
          support: 1180,
          resistance: 1280
        },
        fundamentals: {
          revenue: 45678,
          profit: 5678,
          eps: 45.6,
          bookValue: 385.5
        }
      };

      return stockData;
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      return null;
    }
  }

  getFallbackMarketData() {
    return {
      nifty50: { current: 19800, change: 0, changePercent: 0, pe: 22, pb: 3.2 },
      sensex: { current: 66200, change: 0, changePercent: 0, pe: 24, pb: 3.8 },
      marketSentiment: 'Neutral',
      vix: 15,
      topGainers: [],
      topLosers: []
    };
  }

  async getHistoricalData(symbol, period = '1Y') {
    try {
      // Simulate historical data
      const data = [];
      const basePrice = 1000;
      const days = period === '1M' ? 30 : period === '3M' ? 90 : period === '6M' ? 180 : 365;
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const randomChange = (Math.random() - 0.5) * 50;
        data.push({
          date: date.toISOString().split('T')[0],
          price: basePrice + randomChange + (days - i) * 2,
          volume: Math.floor(Math.random() * 1000000) + 500000
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return [];
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = MarketDataService;
