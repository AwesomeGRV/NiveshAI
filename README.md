# NiveshAI - Indian Share Market AI Chatbot

**Production-Ready Indian Share Market AI Chatbot** built with Node.js and React

## Features

### Core Capabilities
- **Stock Market Analysis** - Real-time Indian stock recommendations and analysis
- **Mutual Fund Guidance** - SIP vs Lump Sum, fund comparisons, ELSS recommendations
- **Portfolio Management** - Asset allocation, rebalancing strategies, risk management
- **Risk Assessment** - Personalized risk profiling and capacity analysis
- **Tax Planning** - Section 80C strategies, capital gains tax optimization
- **Investment Education** - Learn about SIPs, mutual funds, stock market basics

### Technical Features
- **Real-time Responses** - Instant AI-powered investment advice
- **Security & Compliance** - Rate limiting, data validation, SEBI-compliant disclaimers
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Beautiful, intuitive interface with Tailwind CSS
- **Smart Intent Recognition** - Understands user queries and provides relevant responses
- **Market Data Integration** - Simulated real-time market data (ready for live API integration)

## Architecture

```
NiveshAI/
├── server.js                 # Main server file
├── src/
│   ├── niveshai/
│   │   └── NiveshAI.js       # Core AI engine
│   ├── services/
│   │   └── MarketDataService.js # Market data handling
│   ├── knowledge/
│   │   └── KnowledgeBase.js  # Investment knowledge base
│   ├── analysis/
│   │   └── RiskProfiler.js   # Risk assessment engine
│   └── utils/
│       └── ResponseFormatter.js # Response formatting
├── client/                   # React frontend
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   └── index.css        # Tailwind CSS styles
│   └── package.json
└── package.json
```

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd NiveshAI
```

2. **Install server dependencies**
```bash
npm install
```

3. **Install client dependencies**
```bash
npm run install:client
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Start the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

6. **Access the application**
- Open http://localhost:3000 in your browser

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# API Keys (Optional - for enhanced features)
NSE_API_KEY=your_nse_api_key
BSE_API_KEY=your_bse_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
JWT_SECRET=your_jwt_secret_key_here
```

## UI Features

### Chat Interface
- Clean, modern chat interface with message history
- Typing indicators and real-time responses
- Markdown support for formatted responses
- Quick suggestion buttons
- Mobile-responsive sidebar navigation

### User Experience
- Intuitive onboarding with welcome message
- Context-aware suggestions
- Risk profile display
- Real-time typing indicators
- Smooth animations and transitions

## AI Capabilities

### Intent Recognition
The AI can understand and respond to queries about:
- Stock recommendations (large-cap, mid-cap, small-cap)
- Mutual fund analysis (ELSS, index funds, hybrid funds)
- Portfolio construction and rebalancing
- Risk assessment and profiling
- Tax planning strategies
- Investment education and concepts

### Response Features
- Structured, data-driven responses
- Risk-appropriate recommendations
- Educational explanations
- Market analysis and outlook
- Compliance disclaimers

## Security & Compliance

### Safety Features
- Rate limiting to prevent abuse
- Input validation and sanitization
- SEBI-compliant disclaimers
- No guaranteed return promises
- Risk warnings and disclosures

### Data Protection
- Helmet.js for security headers
- CORS configuration
- Input validation with Joi
- Error handling and logging

## Market Data Integration

### Current Implementation
- Simulated market data for demonstration
- Realistic stock and mutual fund data
- Market indicators and sentiment analysis

### Ready for Live Integration
- NSE India API integration points
- BSE API integration ready
- Third-party data source support
- Caching mechanisms for performance

## Sample Queries

Try these sample queries to test the system:

```
Which are the best large-cap stocks for long-term investment?
How should I start my SIP investment?
What is the ideal asset allocation for my age?
Which tax-saving investments should I consider?
Explain what is SIP and how it works?
Current market analysis and outlook?
```

## Development

### Project Structure
- **Backend**: Node.js with Express
- **Frontend**: React with Tailwind CSS
- **AI Engine**: Custom JavaScript implementation
- **Data**: Simulated market data (ready for live APIs)

### Key Components
- `NiveshAI.js` - Main AI engine with intent recognition
- `MarketDataService.js` - Market data handling and caching
- `KnowledgeBase.js` - Investment knowledge and recommendations
- `RiskProfiler.js` - Risk assessment and profiling
- `ResponseFormatter.js` - Response formatting and disclaimers

## Production Deployment

### Build for Production
```bash
# Build client
npm run build

# Start production server
npm start
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure proper API keys
- Set up monitoring and logging
- Configure SSL certificates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

**This is for educational purposes only and not SEBI-registered investment advice. Please consult a licensed financial advisor before investing.**

The application provides simulated data and AI-generated responses for demonstration purposes. Always consult with qualified financial professionals for actual investment decisions.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the sample queries

---

**Built with ❤️ for Indian Investors**
