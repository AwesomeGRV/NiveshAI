class RiskProfiler {
  constructor() {
    this.questions = {
      age: 'What is your age?',
      income: 'What is your annual income range?',
      dependents: 'How many financial dependents do you have?',
      investmentExperience: 'How many years of investment experience do you have?',
      riskTolerance: 'How would you describe your risk tolerance?',
      investmentHorizon: 'What is your investment time horizon?',
      emergencyFund: 'Do you have an emergency fund covering 6 months of expenses?',
      marketReaction: 'How do you react when markets fall by 20%?'
    };
  }

  assessRiskProfile(message, userProfile = {}) {
    // Extract risk indicators from message
    const riskIndicators = this.extractRiskIndicators(message);
    
    // Calculate risk score
    let riskScore = this.calculateRiskScore(riskIndicators, userProfile);
    
    // Determine risk profile
    const riskProfile = this.determineRiskProfile(riskScore);
    
    return {
      type: riskProfile.type,
      score: riskScore,
      description: riskProfile.description,
      characteristics: riskProfile.characteristics,
      suitableInvestments: riskProfile.suitableInvestments,
      recommendations: riskProfile.recommendations
    };
  }

  extractRiskIndicators(message) {
    const indicators = {
      conservative: ['conservative', 'low risk', 'safe', 'guaranteed', 'fixed income', 'stable'],
      moderate: ['moderate', 'balanced', 'medium risk', 'some risk', 'reasonable'],
      aggressive: ['aggressive', 'high risk', 'high returns', 'growth', 'speculative', 'volatile']
    };

    const messageLower = message.toLowerCase();
    let riskPreference = 'moderate'; // default
    let confidence = 0;

    for (const [level, keywords] of Object.entries(indicators)) {
      const matches = keywords.filter(keyword => messageLower.includes(keyword));
      if (matches.length > confidence) {
        riskPreference = level;
        confidence = matches.length;
      }
    }

    return {
      riskPreference,
      confidence,
      timeHorizon: this.extractTimeHorizon(message),
      investmentAmount: this.extractInvestmentAmount(message)
    };
  }

  extractTimeHorizon(message) {
    const timePatterns = {
      'short_term': ['short term', '1 year', '6 months', 'intraday', 'trading'],
      'medium_term': ['medium term', '3 years', '5 years', '2-5 years'],
      'long_term': ['long term', '10 years', '15 years', '20 years', 'retirement']
    };

    const messageLower = message.toLowerCase();
    for (const [horizon, patterns] of Object.entries(timePatterns)) {
      if (patterns.some(pattern => messageLower.includes(pattern))) {
        return horizon;
      }
    }
    return 'medium_term'; // default
  }

  extractInvestmentAmount(message) {
    const amountPatterns = [
      { pattern: /(\d+)\s*lakh/i, multiplier: 100000 },
      { pattern: /(\d+)\s*crore/i, multiplier: 10000000 },
      { pattern: /₹?(\d+)\s*k/i, multiplier: 1000 },
      { pattern: /₹?(\d+)/i, multiplier: 1 }
    ];

    for (const { pattern, multiplier } of amountPatterns) {
      const match = message.match(pattern);
      if (match) {
        return parseInt(match[1]) * multiplier;
      }
    }
    return null;
  }

  calculateRiskScore(riskIndicators, userProfile) {
    let score = 50; // Base score (moderate)

    // Adjust based on explicit risk preference
    switch (riskIndicators.riskPreference) {
      case 'conservative':
        score -= 20;
        break;
      case 'aggressive':
        score += 20;
        break;
    }

    // Adjust based on time horizon
    switch (riskIndicators.timeHorizon) {
      case 'long_term':
        score += 15;
        break;
      case 'short_term':
        score -= 15;
        break;
    }

    // Adjust based on age (if provided)
    if (userProfile.age) {
      if (userProfile.age < 30) score += 10;
      else if (userProfile.age > 50) score -= 10;
    }

    // Adjust based on income (if provided)
    if (userProfile.income) {
      if (userProfile.income > 1000000) score += 5; // >10 lakh annually
      else if (userProfile.income < 300000) score -= 5; // <3 lakh annually
    }

    return Math.max(0, Math.min(100, score));
  }

  determineRiskProfile(score) {
    if (score < 35) {
      return {
        type: 'conservative',
        description: 'You prefer capital preservation over high returns',
        characteristics: [
          'Low risk tolerance',
          'Preference for fixed income',
          'Focus on capital preservation',
          'Long-term wealth preservation'
        ],
        suitableInvestments: [
          'Fixed deposits',
          'PPF',
          'Debt mutual funds',
          'Large-cap equity funds (small allocation)',
          'Government bonds'
        ],
        recommendations: [
          'Maintain 70-80% in debt instruments',
          'Keep 20-30% in equity for long-term growth',
          'Build emergency fund first',
          'Avoid speculative investments'
        ]
      };
    } else if (score < 65) {
      return {
        type: 'moderate',
        description: 'You seek balanced growth with manageable risk',
        characteristics: [
          'Medium risk tolerance',
          'Balanced approach',
          'Willing to take calculated risks',
          'Focus on steady growth'
        ],
        suitableInvestments: [
          'Large-cap equity funds',
          'Hybrid funds',
          'ELSS funds',
          'Corporate bonds',
          'Blue-chip stocks'
        ],
        recommendations: [
          'Maintain 60-70% in equity',
          'Keep 25-35% in debt',
          'Consider 5-10% in gold',
          'Regular portfolio rebalancing'
        ]
      };
    } else {
      return {
        type: 'aggressive',
        description: 'You prioritize high returns and are comfortable with volatility',
        characteristics: [
          'High risk tolerance',
          'Growth-focused',
          'Comfortable with volatility',
          'Long-term wealth creation'
        ],
        suitableInvestments: [
          'Mid-cap and small-cap funds',
          'Sector-specific funds',
          'Direct stocks',
          'International funds',
          'Alternative investments'
        ],
        recommendations: [
          'Maintain 75-85% in equity',
          'Keep 10-15% in debt',
          'Consider 5% in alternative investments',
          'Regular monitoring and rebalancing'
        ]
      };
    }
  }

  getDefaultProfile() {
    return {
      type: 'moderate',
      score: 50,
      description: 'Balanced approach to risk and returns',
      characteristics: [
        'Medium risk tolerance',
        'Balanced investment approach',
        'Focus on steady growth'
      ],
      suitableInvestments: [
        'Large-cap equity funds',
        'Hybrid funds',
        'Blue-chip stocks'
      ],
      recommendations: [
        'Maintain balanced asset allocation',
        'Regular SIP investing',
        'Periodic portfolio review'
      ]
    };
  }

  getRiskQuestionnaire() {
    return {
      questions: [
        {
          id: 'age',
          question: 'What is your age group?',
          options: [
            { value: '18-25', score: 10 },
            { value: '26-35', score: 8 },
            { value: '36-45', score: 5 },
            { value: '46-55', score: 2 },
            { value: '55+', score: 0 }
          ]
        },
        {
          id: 'income',
          question: 'What is your annual income?',
          options: [
            { value: '<3 lakhs', score: 2 },
            { value: '3-6 lakhs', score: 4 },
            { value: '6-10 lakhs', score: 6 },
            { value: '10-20 lakhs', score: 8 },
            { value: '>20 lakhs', score: 10 }
          ]
        },
        {
          id: 'experience',
          question: 'How many years of investment experience do you have?',
          options: [
            { value: 'None', score: 0 },
            { value: '1-3 years', score: 3 },
            { value: '3-5 years', score: 6 },
            { value: '5-10 years', score: 8 },
            { value: '>10 years', score: 10 }
          ]
        },
        {
          id: 'risk_tolerance',
          question: 'How would you react if your portfolio fell by 20%?',
          options: [
            { value: 'Sell everything', score: 0 },
            { value: 'Sell some investments', score: 3 },
            { value: 'Hold and wait', score: 6 },
            { value: 'Buy more', score: 10 }
          ]
        },
        {
          id: 'horizon',
          question: 'What is your investment time horizon?',
          options: [
            { value: '<1 year', score: 0 },
            { value: '1-3 years', score: 3 },
            { value: '3-5 years', score: 6 },
            { value: '5-10 years', score: 8 },
            { value: '>10 years', score: 10 }
          ]
        }
      ],
      scoring: {
        '0-20': 'conservative',
        '21-40': 'moderate',
        '41-50': 'moderate',
        '51-60': 'aggressive',
        '61-100': 'aggressive'
      }
    };
  }

  calculateRiskCapacity(userProfile) {
    let capacity = {
      score: 50,
      level: 'Medium',
      factors: []
    };

    // Age factor
    if (userProfile.age) {
      if (userProfile.age < 30) {
        capacity.score += 15;
        capacity.factors.push('Young age allows for higher risk');
      } else if (userProfile.age > 50) {
        capacity.score -= 15;
        capacity.factors.push('Age suggests conservative approach');
      }
    }

    // Income factor
    if (userProfile.income) {
      if (userProfile.income > 1000000) {
        capacity.score += 10;
        capacity.factors.push('High income provides risk buffer');
      } else if (userProfile.income < 300000) {
        capacity.score -= 10;
        capacity.factors.push('Limited income requires caution');
      }
    }

    // Dependents factor
    if (userProfile.dependents) {
      if (userProfile.dependents > 2) {
        capacity.score -= 10;
        capacity.factors.push('Multiple dependents require stability');
      } else if (userProfile.dependents === 0) {
        capacity.score += 5;
        capacity.factors.push('No dependents increase risk capacity');
      }
    }

    // Emergency fund factor
    if (userProfile.hasEmergencyFund) {
      capacity.score += 10;
      capacity.factors.push('Emergency fund provides security');
    } else {
      capacity.score -= 10;
      capacity.factors.push('Lack of emergency fund reduces capacity');
    }

    capacity.score = Math.max(0, Math.min(100, capacity.score));
    
    if (capacity.score < 35) {
      capacity.level = 'Low';
    } else if (capacity.score > 65) {
      capacity.level = 'High';
    }

    return capacity;
  }
}

module.exports = RiskProfiler;
