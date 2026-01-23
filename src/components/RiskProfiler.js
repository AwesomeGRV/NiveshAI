class RiskProfilerComponent {
  constructor() {
    this.questions = this.initializeQuestions();
    this.weights = this.initializeWeights();
  }

  initializeQuestions() {
    return [
      {
        id: 'age',
        question: 'What is your age group?',
        type: 'radio',
        options: [
          { value: '18-25', score: 10, label: '18-25 years' },
          { value: '26-35', score: 8, label: '26-35 years' },
          { value: '36-45', score: 6, label: '36-45 years' },
          { value: '46-55', score: 4, label: '46-55 years' },
          { value: '56-65', score: 2, label: '56-65 years' },
          { value: '65+', score: 1, label: '65+ years' }
        ],
        required: true,
        weight: 0.20
      },
      {
        id: 'income',
        question: 'What is your annual household income?',
        type: 'radio',
        options: [
          { value: '<3', score: 2, label: 'Less than ₹3 Lakhs' },
          { value: '3-6', score: 4, label: '₹3-6 Lakhs' },
          { value: '6-10', score: 6, label: '₹6-10 Lakhs' },
          { value: '10-20', score: 8, label: '₹10-20 Lakhs' },
          { value: '20-50', score: 9, label: '₹20-50 Lakhs' },
          { value: '>50', score: 10, label: 'More than ₹50 Lakhs' }
        ],
        required: true,
        weight: 0.15
      },
      {
        id: 'investment_experience',
        question: 'How many years of investment experience do you have?',
        type: 'radio',
        options: [
          { value: '0', score: 1, label: 'None (Just starting)' },
          { value: '1-3', score: 4, label: '1-3 years' },
          { value: '3-5', score: 6, label: '3-5 years' },
          { value: '5-10', score: 8, label: '5-10 years' },
          { value: '>10', score: 10, label: 'More than 10 years' }
        ],
        required: true,
        weight: 0.15
      },
      {
        id: 'risk_tolerance',
        question: 'How would you describe your risk tolerance?',
        type: 'radio',
        options: [
          { value: 'conservative', score: 2, label: 'Very Conservative - Cannot tolerate any loss' },
          { value: 'moderately_conservative', score: 4, label: 'Moderately Conservative - Prefer safety over returns' },
          { value: 'moderate', score: 6, label: 'Moderate - Willing to take calculated risks' },
          { value: 'moderately_aggressive', score: 8, label: 'Moderately Aggressive - Comfortable with market volatility' },
          { value: 'aggressive', score: 10, label: 'Very Aggressive - Willing to take high risks for high returns' }
        ],
        required: true,
        weight: 0.20
      },
      {
        id: 'investment_horizon',
        question: 'What is your investment time horizon?',
        type: 'radio',
        options: [
          { value: '<1', score: 2, label: 'Less than 1 year' },
          { value: '1-3', score: 4, label: '1-3 years' },
          { value: '3-5', score: 6, label: '3-5 years' },
          { value: '5-10', score: 8, label: '5-10 years' },
          { value: '>10', score: 10, label: 'More than 10 years' }
        ],
        required: true,
        weight: 0.15
      },
      {
        id: 'dependents',
        question: 'How many financial dependents do you have?',
        type: 'radio',
        options: [
          { value: '0', score: 10, label: 'None' },
          { value: '1-2', score: 7, label: '1-2 dependents' },
          { value: '3-4', score: 4, label: '3-4 dependents' },
          { value: '>4', score: 2, label: 'More than 4 dependents' }
        ],
        required: true,
        weight: 0.10
      },
      {
        id: 'emergency_fund',
        question: 'Do you have an emergency fund covering at least 6 months of expenses?',
        type: 'radio',
        options: [
          { value: 'yes_full', score: 10, label: 'Yes, fully covered' },
          { value: 'yes_partial', score: 6, label: 'Yes, partially covered' },
          { value: 'no', score: 2, label: 'No' }
        ],
        required: true,
        weight: 0.10
      },
      {
        id: 'market_reaction',
        question: 'If your portfolio fell by 20% in a market downturn, what would you do?',
        type: 'radio',
        options: [
          { value: 'sell_all', score: 1, label: 'Sell all investments' },
          { value: 'sell_some', score: 4, label: 'Sell some investments' },
          { value: 'hold_wait', score: 7, label: 'Hold and wait for recovery' },
          { value: 'buy_more', score: 10, label: 'Buy more at lower prices' }
        ],
        required: true,
        weight: 0.15
      },
      {
        id: 'investment_knowledge',
        question: 'How would you rate your knowledge of financial products and markets?',
        type: 'radio',
        options: [
          { value: 'none', score: 2, label: 'No knowledge' },
          { value: 'basic', score: 4, label: 'Basic knowledge' },
          { value: 'intermediate', score: 7, label: 'Intermediate knowledge' },
          { value: 'advanced', score: 10, label: 'Advanced knowledge' }
        ],
        required: true,
        weight: 0.10
      },
      {
        id: 'investment_goals',
        question: 'What are your primary investment goals? (Select all that apply)',
        type: 'checkbox',
        options: [
          { value: 'retirement', score: 8, label: 'Retirement Planning' },
          { value: 'wealth_creation', score: 10, label: 'Wealth Creation' },
          { value: 'children_education', score: 6, label: "Children's Education" },
          { value: 'buy_property', score: 6, label: 'Buy Property' },
          { value: 'emergency_fund', score: 2, label: 'Emergency Fund' },
          { value: 'tax_saving', score: 4, label: 'Tax Saving' },
          { value: 'regular_income', score: 3, label: 'Regular Income' }
        ],
        required: true,
        weight: 0.10
      }
    ];
  }

  initializeWeights() {
    return {
      age: 0.20,
      income: 0.15,
      investment_experience: 0.15,
      risk_tolerance: 0.20,
      investment_horizon: 0.15,
      dependents: 0.10,
      emergency_fund: 0.10,
      market_reaction: 0.15,
      investment_knowledge: 0.10,
      investment_goals: 0.10
    };
  }

  calculateRiskScore(responses) {
    let totalScore = 0;
    let totalWeight = 0;

    this.questions.forEach(question => {
      const response = responses[question.id];
      if (response) {
        if (question.type === 'checkbox') {
          // For checkbox, take average of selected options
          const selectedOptions = Array.isArray(response) ? response : [response];
          const avgScore = selectedOptions.reduce((sum, val) => {
            const option = question.options.find(opt => opt.value === val);
            return sum + (option ? option.score : 0);
          }, 0) / selectedOptions.length;
          
          totalScore += avgScore * question.weight;
        } else {
          const option = question.options.find(opt => opt.value === response);
          if (option) {
            totalScore += option.score * question.weight;
          }
        }
        totalWeight += question.weight;
      }
    });

    // Normalize to 0-100 scale
    const normalizedScore = totalWeight > 0 ? (totalScore / totalWeight) * 10 : 0;
    return Math.min(100, Math.max(0, normalizedScore));
  }

  determineRiskProfile(score) {
    if (score <= 30) {
      return {
        type: 'conservative',
        label: 'Conservative Investor',
        description: 'You prioritize capital preservation over high returns. You prefer stable, low-risk investments.',
        characteristics: [
          'Low risk tolerance',
          'Preference for guaranteed returns',
          'Focus on capital preservation',
          'Short to medium-term investment horizon'
        ],
        suitableInvestments: [
          'Fixed Deposits',
          'PPF',
          'Debt Mutual Funds',
          'Government Bonds',
          'Large-cap Equity Funds (small allocation)'
        ],
        assetAllocation: {
          equity: 10,
          debt: 75,
          gold: 5,
          cash: 10
        }
      };
    } else if (score <= 50) {
      return {
        type: 'moderately_conservative',
        label: 'Moderately Conservative Investor',
        description: 'You seek stable returns with moderate risk. You prefer a balanced approach with emphasis on safety.',
        characteristics: [
          'Low to moderate risk tolerance',
          'Preference for stable returns',
          'Willing to take calculated risks',
          'Medium-term investment horizon'
        ],
        suitableInvestments: [
          'Hybrid Mutual Funds',
          'Large-cap Equity Funds',
          'Corporate Bonds',
          'ELSS Funds',
          'Index Funds'
        ],
        assetAllocation: {
          equity: 30,
          debt: 60,
          gold: 5,
          cash: 5
        }
      };
    } else if (score <= 70) {
      return {
        type: 'moderate',
        label: 'Moderate Investor',
        description: 'You seek balanced growth with manageable risk. You understand market volatility and are willing to take calculated risks.',
        characteristics: [
          'Moderate risk tolerance',
          'Balanced approach to growth and safety',
          'Understanding of market cycles',
          'Medium to long-term investment horizon'
        ],
        suitableInvestments: [
          'Multi-cap Equity Funds',
          'Large & Mid-cap Funds',
          'Hybrid Aggressive Funds',
          'ELSS Funds',
          'Select Blue-chip Stocks'
        ],
        assetAllocation: {
          equity: 60,
          debt: 30,
          gold: 5,
          cash: 5
        }
      };
    } else if (score <= 85) {
      return {
        type: 'moderately_aggressive',
        label: 'Moderately Aggressive Investor',
        description: 'You prioritize growth and are comfortable with market volatility for potentially higher returns.',
        characteristics: [
          'High risk tolerance',
          'Growth-focused approach',
          'Comfortable with market volatility',
          'Long-term investment horizon'
        ],
        suitableInvestments: [
          'Mid-cap Equity Funds',
          'Small-cap Funds',
          'Sector-specific Funds',
          'Direct Stocks',
          'International Funds'
        ],
        assetAllocation: {
          equity: 75,
          debt: 20,
          gold: 3,
          cash: 2
        }
      };
    } else {
      return {
        type: 'aggressive',
        label: 'Aggressive Investor',
        description: 'You prioritize maximum growth and are willing to take high risks for potentially high returns.',
        characteristics: [
          'Very high risk tolerance',
          'High growth expectations',
          'Comfortable with high volatility',
          'Very long-term investment horizon'
        ],
        suitableInvestments: [
          'Small-cap Funds',
          'Micro-cap Funds',
          'Thematic Funds',
          'Direct Stocks (including small-cap)',
          'Alternative Investments'
        ],
        assetAllocation: {
          equity: 85,
          debt: 10,
          gold: 3,
          cash: 2
        }
      };
    }
  }

  generateRecommendations(riskProfile, responses) {
    const recommendations = {
      investmentStrategy: '',
      portfolioRebalancing: '',
      riskManagement: '',
      taxPlanning: '',
      monitoring: ''
    };

    switch (riskProfile.type) {
      case 'conservative':
        recommendations.investmentStrategy = 'Focus on capital preservation with stable returns. Start with debt instruments and gradually add equity exposure.';
        recommendations.portfolioRebalancing = 'Review quarterly. Maintain 70-80% in debt instruments.';
        recommendations.riskManagement = 'Maintain 6-12 months emergency fund. Avoid speculative investments.';
        recommendations.taxPlanning = 'Maximize PPF, tax-saving FDs, and traditional tax-saving options.';
        recommendations.monitoring = 'Monitor interest rate changes and inflation impact on returns.';
        break;

      case 'moderately_conservative':
        recommendations.investmentStrategy = 'Balanced approach with 30% equity exposure. Focus on large-cap funds and hybrid funds.';
        recommendations.portfolioRebalancing = 'Review semi-annually. Maintain 60-70% in debt, 30% in equity.';
        recommendations.riskManagement = 'Maintain 6 months emergency fund. Limit equity to large-cap stocks.';
        recommendations.taxPlanning = 'Combine traditional options with ELSS for equity exposure.';
        recommendations.monitoring = 'Monitor both debt and equity market performance.';
        break;

      case 'moderate':
        recommendations.investmentStrategy = 'Balanced growth approach with 60% equity. Diversify across market caps and sectors.';
        recommendations.portfolioRebalancing = 'Review quarterly. Maintain 60% equity, 30% debt allocation.';
        recommendations.riskManagement = 'Maintain 6 months emergency fund. Use SIP for equity investments.';
        recommendations.taxPlanning = 'Optimize between ELSS, PPF, and other tax-saving instruments.';
        recommendations.monitoring = 'Regular monitoring of portfolio performance and market trends.';
        break;

      case 'moderately_aggressive':
        recommendations.investmentStrategy = 'Growth-focused with 75% equity. Include mid-cap and small-cap exposure.';
        recommendations.portfolioRebalancing = 'Review quarterly. Maintain 75% equity, 20% debt allocation.';
        recommendations.riskManagement = 'Maintain 3-6 months emergency fund. Use systematic transfer plans.';
        recommendations.taxPlanning = 'Focus on ELSS and tax-efficient equity funds.';
        recommendations.monitoring = 'Active monitoring required. Consider professional advice.';
        break;

      case 'aggressive':
        recommendations.investmentStrategy = 'High growth strategy with 85% equity. Include small-cap and sector funds.';
        recommendations.portfolioRebalancing = 'Review monthly. Maintain 85% equity, 10% debt allocation.';
        recommendations.riskManagement = 'Maintain 3 months emergency fund. Be prepared for high volatility.';
        recommendations.taxPlanning = 'Focus on tax-efficient equity investments and long-term gains.';
        recommendations.monitoring = 'Very active monitoring required. Regular portfolio review essential.';
        break;
    }

    return recommendations;
  }

  validateResponses(responses) {
    const errors = [];
    const requiredQuestions = this.questions.filter(q => q.required);

    requiredQuestions.forEach(question => {
      if (!responses[question.id] || 
          (Array.isArray(responses[question.id]) && responses[question.id].length === 0)) {
        errors.push(`${question.question} is required.`);
      }
    });

    return errors;
  }

  getRiskProfileHTML() {
    return `
      <div class="risk-profiler-container">
        <div class="risk-profiler-header">
          <h2>Comprehensive Risk Assessment</h2>
          <p>Please answer all questions to determine your investment risk profile</p>
        </div>
        <form id="riskProfilerForm" class="risk-profiler-form">
          ${this.questions.map(question => this.renderQuestion(question)).join('')}
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Calculate Risk Profile</button>
            <button type="button" class="btn btn-secondary" onclick="resetForm()">Reset</button>
          </div>
        </form>
        <div id="riskProfileResult" class="risk-profile-result" style="display: none;">
          <!-- Results will be displayed here -->
        </div>
      </div>
    `;
  }

  renderQuestion(question) {
    let questionHTML = `
      <div class="question-container" data-question-id="${question.id}">
        <label class="question-label">${question.question} ${question.required ? '<span class="required">*</span>' : ''}</label>
        <div class="options-container">
    `;

    if (question.type === 'radio') {
      question.options.forEach(option => {
        questionHTML += `
          <div class="option-item">
            <input type="radio" 
                   id="${question.id}_${option.value}" 
                   name="${question.id}" 
                   value="${option.value}"
                   data-score="${option.score}"
                   ${question.required ? 'required' : ''}>
            <label for="${question.id}_${option.value}">${option.label}</label>
          </div>
        `;
      });
    } else if (question.type === 'checkbox') {
      question.options.forEach(option => {
        questionHTML += `
          <div class="option-item">
            <input type="checkbox" 
                   id="${question.id}_${option.value}" 
                   name="${question.id}" 
                   value="${option.value}"
                   data-score="${option.score}">
            <label for="${question.id}_${option.value}">${option.label}</label>
          </div>
        `;
      });
    }

    questionHTML += `
        </div>
      </div>
    `;

    return questionHTML;
  }
}

module.exports = RiskProfilerComponent;
