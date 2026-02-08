# Deriverse Trading Analytics Dashboard

A comprehensive trading analytics solution for [Deriverse](https://deriverse.io) - the next-gen, fully on-chain Solana trading ecosystem.

![Dashboard Preview](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)

### 🔗 [Live Demo → deriverse-trading-dashboard-virid.vercel.app](https://deriverse-trading-dashboard-virid.vercel.app/)

## ✨ Features

### 📊 Core Analytics
- **Total PnL Tracking** - Real-time profit/loss with visual trend indicators
- **Win Rate Analysis** - Win/loss ratio with detailed breakdowns
- **Volume & Fee Analysis** - Track trading costs and volume over time
- **Long/Short Ratio** - Position type distribution visualization
- **Average Trade Duration** - Time-based performance metrics

### 📈 Advanced Metrics
- **Risk Analysis** - Sharpe Ratio, Sortino Ratio, Calmar Ratio
- **Risk of Ruin Calculator** - Statistical probability of account blowup
- **Drawdown Tracking** - Current and maximum drawdown monitoring
- **Consecutive Loss Tracking** - Streak analysis for risk management

### 🤖 AI-Powered Innovation
- **GPT-4 Pattern Recognition** - Analyzes your last 50 trades to identify psychological weaknesses
- Detects revenge trading, overleverage tendencies, timing issues
- Provides actionable 3-bullet-point insights

### 🔗 Real Solana Integration
- **Phantom Wallet Connection** - Connect your wallet directly in the browser
- **On-Chain Transaction History** - Fetches real transactions from Solana mainnet
- **Live SOL Balance** - Displays actual wallet balance
- **Data Source Toggle** - Switch between mock data and real wallet data

### 📱 User Experience
- **Fully Responsive** - Mobile-first design with hamburger menu
- **Interactive Filtering** - Date range (7d/30d/90d/All) + Symbol dropdown
- **Performance Calendar** - Daily PnL heatmap visualization
- **Trade Annotations** - Add notes to trades (persisted in localStorage)
- **Dark Cyberpunk Theme** - Professional trading aesthetic

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type-safe development |
| Tailwind CSS v4 | Utility-first styling |
| Recharts | Interactive chart visualizations |
| Zustand | State management with persistence |
| TanStack Table v8 | Advanced data tables |
| Radix UI | Accessible UI primitives |
| OpenAI GPT-4 | AI pattern analysis |
| Solana Web3.js | Real wallet & on-chain data |
| Phantom Wallet | Native browser wallet integration |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/filipvijo/deriverse-trading-dashboard.git
cd deriverse-trading-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Environment Variables

Create a `.env.local` file for AI pattern recognition:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

> Note: The dashboard works without an API key - AI analysis will show mock data.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (AI analysis)
│   ├── analytics/         # Analytics page
│   ├── calendar/          # Performance calendar
│   ├── journal/           # Trade journal
│   ├── risk/              # Risk analysis
│   └── ...
├── components/
│   ├── charts/            # Recharts visualizations
│   ├── dashboard/         # Dashboard components
│   ├── journal/           # Trade table
│   ├── layout/            # Sidebar, Header, MainLayout
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities & mock data generator
├── store/                 # Zustand state management
└── types/                 # TypeScript interfaces
```

## 🔒 Security

- API keys stored in environment variables (never committed)
- `.env.local` excluded via `.gitignore`
- No sensitive data exposed in client-side code

## 👤 Author

**Filip Vijo**
- GitHub: [@filipvijo](https://github.com/filipvijo)

## 📄 License

This project is built for the Deriverse Hackathon.

---

Built with ❤️ for the Solana ecosystem
