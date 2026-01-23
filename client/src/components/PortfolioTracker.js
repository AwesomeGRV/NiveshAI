import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, RefreshCw, Trash2, Edit, PieChart, BarChart3, Target } from 'lucide-react';

const PortfolioTracker = ({ userId }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);

  useEffect(() => {
    fetchPortfolios();
  }, [userId]);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch(`/api/portfolio/user/${userId}`);
      const data = await response.json();
      if (data.success) {
        setPortfolios(data.data);
        if (data.data.length > 0 && !selectedPortfolio) {
          setSelectedPortfolio(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  const fetchPortfolioAnalysis = async (portfolioId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/portfolio/${portfolioId}/analysis`);
      const data = await response.json();
      if (data.success) {
        setAnalysis(data.data);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPortfolio = async (portfolioId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/portfolio/${portfolioId}/refresh`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setSelectedPortfolio(data.data);
        await fetchPortfolioAnalysis(portfolioId);
      }
    } catch (error) {
      console.error('Error refreshing portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async (portfolioData) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          portfolioData
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchPortfolios();
        setShowCreatePortfolio(false);
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
    }
  };

  const addInvestment = async (portfolioId, investmentData) => {
    try {
      const response = await fetch(`/api/portfolio/${portfolioId}/investments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(investmentData)
      });
      const data = await response.json();
      if (data.success) {
        await refreshPortfolio(portfolioId);
        setShowAddInvestment(false);
      }
    } catch (error) {
      console.error('Error adding investment:', error);
    }
  };

  const deleteInvestment = async (portfolioId, investmentId) => {
    if (!window.confirm('Are you sure you want to remove this investment?')) return;
    
    try {
      const response = await fetch(`/api/portfolio/${portfolioId}/investments/${investmentId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await refreshPortfolio(portfolioId);
      }
    } catch (error) {
      console.error('Error deleting investment:', error);
    }
  };

  useEffect(() => {
    if (selectedPortfolio) {
      fetchPortfolioAnalysis(selectedPortfolio.id);
    }
  }, [selectedPortfolio]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (!selectedPortfolio) {
    return (
      <div className="portfolio-tracker">
        <div className="text-center py-12">
          <PieChart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Portfolios Yet</h3>
          <p className="text-gray-600 mb-6">Create your first portfolio to start tracking your investments</p>
          <button
            onClick={() => setShowCreatePortfolio(true)}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-tracker space-y-6">
      {/* Portfolio Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedPortfolio.name}</h2>
            <p className="text-gray-600 mt-1">{selectedPortfolio.description}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => refreshPortfolio(selectedPortfolio.id)}
              disabled={loading}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowAddInvestment(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Investment</span>
            </button>
          </div>
        </div>

        {/* Portfolio Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Invested</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(selectedPortfolio.totalInvested)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Current Value</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(selectedPortfolio.currentValue)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Returns</p>
            <p className={`text-xl font-bold flex items-center space-x-1 ${
              selectedPortfolio.totalReturns >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{formatCurrency(selectedPortfolio.totalReturns)}</span>
              {selectedPortfolio.totalReturns >= 0 ? 
                <TrendingUp className="w-5 h-5" /> : 
                <TrendingDown className="w-5 h-5" />
              }
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Return %</p>
            <p className={`text-xl font-bold ${
              selectedPortfolio.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercentage(selectedPortfolio.returnPercentage)}
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Allocation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Asset Allocation</span>
            </h3>
            <div className="space-y-3">
              {Object.entries(analysis.assetAllocation).map(([asset, data]) => (
                <div key={asset} className="flex items-center justify-between">
                  <span className="capitalize text-gray-700">{asset.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {data.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Performance Analysis</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Average Return</span>
                <span className="font-medium text-gray-900">
                  {formatPercentage(analysis.performanceAnalysis.averageReturn)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Volatility</span>
                <span className="font-medium text-gray-900">
                  {analysis.performanceAnalysis.volatility?.toFixed(2) || 'N/A'}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Risk Level</span>
                <span className={`font-medium ${
                  analysis.riskAnalysis.riskLevel === 'High' ? 'text-red-600' :
                  analysis.riskAnalysis.riskLevel === 'Medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {analysis.riskAnalysis.riskLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Diversification Score</span>
                <span className="font-medium text-gray-900">
                  {analysis.diversificationScore}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Quantity</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Avg Cost</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Current Price</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Returns</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Return %</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedPortfolio.investments.map((investment) => (
                <tr key={investment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{investment.name}</p>
                      <p className="text-sm text-gray-600">{investment.symbol}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700 capitalize">
                      {investment.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-900">
                    {investment.quantity}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-900">
                    {formatCurrency(investment.averageCost)}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-900">
                    {formatCurrency(investment.currentPrice)}
                  </td>
                  <td className={`py-3 px-4 text-right text-sm font-medium ${
                    investment.returns >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(investment.returns)}
                  </td>
                  <td className={`py-3 px-4 text-right text-sm font-medium ${
                    investment.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(investment.returnPercentage)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <button className="p-1 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteInvestment(selectedPortfolio.id, investment.id)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      {analysis && analysis.recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Recommendations</span>
          </h3>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                rec.priority === 'high' ? 'border-red-200 bg-red-50' :
                rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    rec.priority === 'high' ? 'bg-red-600' :
                    rec.priority === 'medium' ? 'bg-yellow-600' :
                    'bg-blue-600'
                  }`} />
                  <div className="flex-1">
                    <p className="text-gray-900">{rec.message}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Type: {rec.type} | Priority: {rec.priority}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddInvestment && (
        <AddInvestmentModal
          portfolioId={selectedPortfolio.id}
          onClose={() => setShowAddInvestment(false)}
          onSubmit={(data) => addInvestment(selectedPortfolio.id, data)}
        />
      )}

      {showCreatePortfolio && (
        <CreatePortfolioModal
          onClose={() => setShowCreatePortfolio(false)}
          onSubmit={createPortfolio}
        />
      )}
    </div>
  );
};

// Add Investment Modal Component
const AddInvestmentModal = ({ portfolioId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'stock',
    symbol: '',
    name: '',
    quantity: '',
    averageCost: '',
    sector: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: parseFloat(formData.quantity),
      averageCost: parseFloat(formData.averageCost)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Investment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="stock">Stock</option>
              <option value="mutual_fund">Mutual Fund</option>
              <option value="etf">ETF</option>
              <option value="bond">Bond</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({...formData, symbol: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              step="0.001"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Average Cost (₹)</label>
            <input
              type="number"
              step="0.01"
              value={formData.averageCost}
              onChange={(e) => setFormData({...formData, averageCost: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
            <input
              type="text"
              value={formData.sector}
              onChange={(e) => setFormData({...formData, sector: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Investment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Portfolio Modal Component
const CreatePortfolioModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    riskProfile: 'moderate'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Portfolio</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Profile</label>
            <select
              value={formData.riskProfile}
              onChange={(e) => setFormData({...formData, riskProfile: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioTracker;
