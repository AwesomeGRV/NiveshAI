import React, { useState, useEffect } from 'react';
import { User, TrendingUp, Shield, Target, CheckCircle, AlertCircle } from 'lucide-react';

const RiskProfiler = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/portfolio/risk-profile/questions');
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data.questions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    setErrors([]);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/portfolio/risk-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(responses)
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setErrors(data.details || ['Failed to calculate risk profile']);
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setErrors(['Failed to submit assessment. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setResponses({});
    setCurrentStep(0);
    setResult(null);
    setErrors([]);
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / questions.length) * 100;
  };

  const currentQuestion = questions[currentStep];

  if (questions.length === 0) {
    return (
      <div className="risk-profiler">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading risk assessment questions...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return <RiskProfileResult result={result} onReset={resetAssessment} />;
  }

  return (
    <div className="risk-profiler max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Risk Assessment Profile</h2>
        <p className="text-gray-600">
          Help us understand your investment preferences to provide personalized recommendations
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(getProgressPercentage())}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentQuestion.question}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {currentQuestion.required && (
            <p className="text-sm text-gray-600">This question is required</p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <label
              key={option.value}
              className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                responses[currentQuestion.id] === option.value ||
                (Array.isArray(responses[currentQuestion.id]) && 
                 responses[currentQuestion.id].includes(option.value))
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center">
                <input
                  type={currentQuestion.type}
                  name={currentQuestion.id}
                  value={option.value}
                  checked={
                    currentQuestion.type === 'checkbox'
                      ? Array.isArray(responses[currentQuestion.id]) && 
                        responses[currentQuestion.id].includes(option.value)
                      : responses[currentQuestion.id] === option.value
                  }
                  onChange={(e) => {
                    if (currentQuestion.type === 'checkbox') {
                      const currentValues = Array.isArray(responses[currentQuestion.id]) 
                        ? responses[currentQuestion.id] 
                        : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter(v => v !== option.value);
                      handleResponseChange(currentQuestion.id, newValues);
                    } else {
                      handleResponseChange(currentQuestion.id, option.value);
                    }
                  }}
                  className="mr-3"
                />
                <span className="text-gray-900">{option.label}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Please complete all required questions</p>
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-700">{error}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!responses[currentQuestion.id] || loading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            currentStep === questions.length - 1 ? 'Get Results' : 'Next'
          )}
        </button>
      </div>
    </div>
  );
};

// Risk Profile Result Component
const RiskProfileResult = ({ result, onReset }) => {
  const { riskProfile, score, recommendations } = result;

  const getRiskColor = (type) => {
    switch (type) {
      case 'conservative': return 'text-green-600 bg-green-100';
      case 'moderately_conservative': return 'text-blue-600 bg-blue-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'moderately_aggressive': return 'text-orange-600 bg-orange-100';
      case 'aggressive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (type) => {
    switch (type) {
      case 'conservative': return <Shield className="w-6 h-6" />;
      case 'moderate': return <Target className="w-6 h-6" />;
      case 'aggressive': return <TrendingUp className="w-6 h-6" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  return (
    <div className="risk-profile-result max-w-4xl mx-auto">
      {/* Result Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${getRiskColor(riskProfile.type)}`}>
          {getRiskIcon(riskProfile.type)}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{riskProfile.label}</h2>
        <p className="text-lg text-gray-600 mb-4">Risk Score: {score.toFixed(1)}/100</p>
        <p className="text-gray-700 max-w-2xl mx-auto">{riskProfile.description}</p>
      </div>

      {/* Score Visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Score Analysis</h3>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-4 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
          <div 
            className="absolute top-0 w-4 h-4 bg-white border-2 border-gray-800 rounded-full -mt-0.5 transform -translate-x-1/2"
            style={{ left: `${score}%` }}
          />
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Conservative</span>
            <span>Moderate</span>
            <span>Aggressive</span>
          </div>
        </div>
      </div>

      {/* Characteristics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Risk Characteristics</h3>
        <ul className="space-y-2">
          {riskProfile.characteristics.map((characteristic, index) => (
            <li key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">{characteristic}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Asset Allocation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Asset Allocation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(riskProfile.assetAllocation).map(([asset, percentage]) => (
            <div key={asset} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - percentage / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{percentage}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 capitalize">{asset.replace('_', ' ')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suitable Investments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suitable Investment Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {riskProfile.suitableInvestments.map((investment, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">{investment}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
        <div className="space-y-4">
          {Object.entries(recommendations).map(([key, value]) => (
            <div key={key} className="border-l-4 border-primary-500 pl-4">
              <h4 className="font-medium text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-gray-700 mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Important Disclaimer</h4>
            <p className="text-blue-800 text-sm">
              This risk assessment is for educational purposes only and not SEBI-registered investment advice. 
              The recommendations are based on standard risk profiling methodologies. Please consult with a 
              licensed financial advisor before making any investment decisions. Investment decisions should be 
              based on your individual financial situation, goals, and risk tolerance.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onReset}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Retake Assessment
        </button>
        <button
          onClick={() => window.location.href = '/chat'}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Get Investment Advice
        </button>
      </div>
    </div>
  );
};

export default RiskProfiler;
