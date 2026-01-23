const express = require('express');
const PortfolioService = require('../services/PortfolioService');
const RiskProfiler = require('../analysis/RiskProfiler');

const router = express.Router();
const portfolioService = new PortfolioService();
const riskProfiler = new RiskProfiler();

// Create new portfolio
router.post('/', async (req, res) => {
  try {
    const { userId, portfolioData } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required',
        success: false
      });
    }

    const portfolio = portfolioService.createPortfolio(userId, portfolioData);
    
    res.json({
      success: true,
      data: portfolio,
      message: 'Portfolio created successfully'
    });
  } catch (error) {
    console.error('Create portfolio error:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

// Get all portfolios for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const portfolios = portfolioService.getUserPortfolios(userId);
    
    res.json({
      success: true,
      data: portfolios,
      count: portfolios.length
    });
  } catch (error) {
    console.error('Get portfolios error:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

// Get specific portfolio
router.get('/:portfolioId', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const portfolio = portfolioService.getPortfolio(portfolioId);
    
    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(404).json({
      error: error.message,
      success: false
    });
  }
});

// Add investment to portfolio
router.post('/:portfolioId/investments', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const investmentData = req.body;
    
    const investment = portfolioService.addInvestment(portfolioId, investmentData);
    
    res.json({
      success: true,
      data: investment,
      message: 'Investment added successfully'
    });
  } catch (error) {
    console.error('Add investment error:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

// Update investment
router.put('/:portfolioId/investments/:investmentId', async (req, res) => {
  try {
    const { portfolioId, investmentId } = req.params;
    const updateData = req.body;
    
    const investment = portfolioService.updateInvestment(portfolioId, investmentId, updateData);
    
    res.json({
      success: true,
      data: investment,
      message: 'Investment updated successfully'
    });
  } catch (error) {
    console.error('Update investment error:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

// Remove investment from portfolio
router.delete('/:portfolioId/investments/:investmentId', async (req, res) => {
  try {
    const { portfolioId, investmentId } = req.params;
    
    portfolioService.removeInvestment(portfolioId, investmentId);
    
    res.json({
      success: true,
      message: 'Investment removed successfully'
    });
  } catch (error) {
    console.error('Remove investment error:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

// Update portfolio prices (refresh market data)
router.post('/:portfolioId/refresh', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const portfolio = await portfolioService.updatePortfolioPrices(portfolioId);
    
    res.json({
      success: true,
      data: portfolio,
      message: 'Portfolio prices updated successfully'
    });
  } catch (error) {
    console.error('Refresh portfolio error:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

// Get portfolio analysis
router.get('/:portfolioId/analysis', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const analysis = portfolioService.getPortfolioAnalysis(portfolioId);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Portfolio analysis error:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

// Delete portfolio
router.delete('/:portfolioId', async (req, res) => {
  try {
    const { portfolioId } = req.params;
    
    portfolioService.deletePortfolio(portfolioId);
    
    res.json({
      success: true,
      message: 'Portfolio deleted successfully'
    });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

// Risk profiling endpoint
router.post('/risk-profile', async (req, res) => {
  try {
    const responses = req.body;
    
    // Validate responses
    const riskProfilerComponent = require('../components/RiskProfiler');
    const profiler = new riskProfilerComponent();
    
    const errors = profiler.validateResponses(responses);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation errors',
        details: errors,
        success: false
      });
    }
    
    // Calculate risk score and profile
    const score = profiler.calculateRiskScore(responses);
    const riskProfile = profiler.determineRiskProfile(score);
    const recommendations = profiler.generateRecommendations(riskProfile, responses);
    
    res.json({
      success: true,
      data: {
        score,
        riskProfile,
        recommendations,
        responses
      }
    });
  } catch (error) {
    console.error('Risk profiling error:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

// Get risk profiler questions
router.get('/risk-profile/questions', async (req, res) => {
  try {
    const riskProfilerComponent = require('../components/RiskProfiler');
    const profiler = new riskProfilerComponent();
    
    res.json({
      success: true,
      data: {
        questions: profiler.questions,
        weights: profiler.weights
      }
    });
  } catch (error) {
    console.error('Get risk profiler questions error:', error);
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

module.exports = router;
