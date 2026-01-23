const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const { RateLimiterMemory } = require('rate-limiter-flexible');
const NiveshAI = require('./src/niveshai/NiveshAI');

// Import routes
const portfolioRoutes = require('./src/routes/portfolio');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900, // 15 minutes
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'client/build')));

// Rate limiting middleware
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1,
    });
  }
});

// Initialize NiveshAI
const niveshAI = new NiveshAI();

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userProfile = {} } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }

    const response = await niveshAI.getResponse(message, userProfile);
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      error: 'Internal server error. Please try again.',
      success: false
    });
  }
});

// Portfolio management routes
app.use('/api/portfolio', portfolioRoutes);

// Market data routes
app.get('/api/market/overview', async (req, res) => {
  try {
    const marketData = await niveshAI.marketDataService.getMarketOverview();
    res.json({
      success: true,
      data: marketData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market overview error:', error);
    res.status(500).json({
      error: 'Failed to fetch market data',
      success: false
    });
  }
});

app.get('/api/market/news', async (req, res) => {
  try {
    const news = await niveshAI.externalAI.getMarketNews();
    res.json({
      success: true,
      data: news,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market news error:', error);
    res.status(500).json({
      error: 'Failed to fetch market news',
      success: false
    });
  }
});

app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockData = await niveshAI.marketDataService.getStockData(symbol);
    
    if (!stockData) {
      return res.status(404).json({
        error: 'Stock data not found',
        success: false
      });
    }
    
    res.json({
      success: true,
      data: stockData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stock data error:', error);
    res.status(500).json({
      error: 'Failed to fetch stock data',
      success: false
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    success: false
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NiveshAI Server running on port ${PORT}`);
  console.log(`📊 Indian Share Market AI Chatbot is ready!`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
