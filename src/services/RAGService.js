const axios = require('axios');
const cheerio = require('cheerio');

class RAGService {
  constructor() {
    this.trustedSources = [
      {
        name: 'Moneycontrol',
        baseUrl: 'https://www.moneycontrol.com',
        searchUrl: 'https://www.moneycontrol.com/news/tags/markets.html',
        selectors: {
          article: '.news_list',
          title: '.news_title a',
          content: '.news_desc',
          date: '.news_date'
        }
      },
      {
        name: 'Economic Times',
        baseUrl: 'https://economictimes.indiatimes.com',
        searchUrl: 'https://economictimes.indiatimes.com/markets',
        selectors: {
          article: '.eachStory',
          title: 'h3 a',
          content: '.desc',
          date: '.date-format'
        }
      },
      {
        name: 'NSE India',
        baseUrl: 'https://www.nseindia.com',
        searchUrl: 'https://www.nseindia.com/market-data/live-equity-market',
        selectors: {
          table: '.table',
          row: 'tr',
          symbol: '.symbol',
          price: '.price',
          change: '.change'
        }
      }
    ];
    
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
  }

  async searchInformation(query) {
    const cacheKey = `rag_${query.toLowerCase()}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const results = await Promise.allSettled([
        this.searchMoneycontrol(query),
        this.searchEconomicTimes(query),
        this.searchNSEData(query)
      ]);

      const combinedResults = this.combineResults(results);
      
      this.cache.set(cacheKey, {
        data: combinedResults,
        timestamp: Date.now()
      });

      return combinedResults;
    } catch (error) {
      console.error('RAG Service Error:', error);
      return this.getFallbackData(query);
    }
  }

  async searchMoneycontrol(query) {
    try {
      // Simulate Moneycontrol search (in production, implement actual scraping)
      const mockData = {
        source: 'Moneycontrol',
        articles: [
          {
            title: `Market Analysis: ${query}`,
            content: `Latest market insights on ${query}. Current trends show positive momentum with institutional interest increasing.`,
            url: 'https://www.moneycontrol.com/market-analysis',
            date: new Date().toISOString(),
            relevance: 0.9
          }
        ]
      };
      return mockData;
    } catch (error) {
      console.error('Moneycontrol search error:', error);
      return null;
    }
  }

  async searchEconomicTimes(query) {
    try {
      // Simulate Economic Times search
      const mockData = {
        source: 'Economic Times',
        articles: [
          {
            title: `Economic Impact of ${query}`,
            content: `Economic analysis of ${query} shows strong fundamentals. Market experts recommend long-term investment approach.`,
            url: 'https://economictimes.indiatimes.com/markets',
            date: new Date().toISOString(),
            relevance: 0.85
          }
        ]
      };
      return mockData;
    } catch (error) {
      console.error('Economic Times search error:', error);
      return null;
    }
  }

  async searchNSEData(query) {
    try {
      // Simulate NSE data search
      const mockData = {
        source: 'NSE India',
        data: {
          marketStatus: 'Open',
          indices: {
            nifty50: { value: 19876.45, change: +125.30, changePercent: +0.63 },
            sensex: { value: 66543.21, change: +234.56, changePercent: +0.35 }
          },
          topGainers: [
            { symbol: 'RELIANCE', price: 2543.20, change: +2.3 },
            { symbol: 'TCS', price: 3456.70, change: +1.8 }
          ],
          topLosers: [
            { symbol: 'YESBANK', price: 23.45, change: -3.2 }
          ]
        }
      };
      return mockData;
    } catch (error) {
      console.error('NSE data search error:', error);
      return null;
    }
  }

  combineResults(results) {
    const combined = {
      sources: [],
      articles: [],
      marketData: null,
      summary: ''
    };

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const data = result.value;
        combined.sources.push(data.source);
        
        if (data.articles) {
          combined.articles.push(...data.articles);
        }
        
        if (data.data) {
          combined.marketData = data.data;
        }
      }
    });

    // Sort articles by relevance
    combined.articles.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
    
    // Generate summary
    combined.summary = this.generateSummary(combined);
    
    return combined;
  }

  generateSummary(data) {
    let summary = `Based on information from ${data.sources.join(', ')}:\n\n`;
    
    if (data.marketData) {
      summary += `**Market Status:** ${data.marketData.marketStatus}\n`;
      summary += `Nifty 50: ${data.marketData.indices.nifty50.value} (${data.marketData.indices.nifty50.changePercent}%)\n`;
      summary += `Sensex: ${data.marketData.indices.sensex.value} (${data.marketData.indices.sensex.changePercent}%)\n\n`;
    }
    
    if (data.articles.length > 0) {
      summary += `**Key Insights:**\n`;
      data.articles.slice(0, 3).forEach((article, index) => {
        summary += `${index + 1}. ${article.title}\n`;
        summary += `   ${article.content}\n\n`;
      });
    }
    
    return summary;
  }

  getFallbackData(query) {
    return {
      sources: ['Cached Data'],
      articles: [
        {
          title: `Information about ${query}`,
          content: `Based on available market data, ${query} is an important topic in Indian financial markets. Please consult with a financial advisor for personalized advice.`,
          url: '#',
          date: new Date().toISOString(),
          relevance: 0.5
        }
      ],
      marketData: null,
      summary: `Limited information available for ${query}. Please provide more specific details or consult with a financial advisor.`
    };
  }

  async getRealTimeData(symbol) {
    try {
      // Simulate real-time data fetching
      const mockData = {
        symbol: symbol,
        price: Math.random() * 2000 + 1000,
        change: (Math.random() - 0.5) * 100,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        marketCap: Math.random() * 100000 + 10000,
        pe: Math.random() * 30 + 10,
        pb: Math.random() * 5 + 1,
        dividend: Math.random() * 3,
        roe: Math.random() * 20 + 5,
        debtToEquity: Math.random() * 2,
        promoterHolding: Math.random() * 70 + 30,
        timestamp: new Date().toISOString()
      };
      
      return mockData;
    } catch (error) {
      console.error('Real-time data error:', error);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = RAGService;
