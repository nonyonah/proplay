# Pro Play - Esports Farcaster Mini App

![Pro Play Logo](./public/placeholder-logo.svg)

Pro Play is a comprehensive esports Farcaster mini app that brings the excitement of competitive gaming to the Farcaster ecosystem. Follow your favorite teams, tournaments, and players while making predictions and staying up-to-date with live matches.

## 🎮 Features

### Core Functionality
- **Live Scores**: Real-time match updates from PandaScore API
- **Match Predictions**: Stake on matches using Base Sepolia
- **Team Following**: Follow your favorite esports teams across multiple games
- **Notifications**: Get alerts for upcoming matches via Farcaster
- **Predictions**: Make predictions and compete in prize pools
- **Share**: Share matches and predictions as Farcaster casts

## 🛠 Tech Stack

### Frontend
- Next.js 14
- shadcn/ui components
- Farcaster Mini App SDK
- Ethers.js for blockchain interactions

### Backend
- Express.js API server
- PandaScore for esports data
- Base Sepolia for smart contracts
- Supabase for user data
- Neynar SDK for Farcaster integration

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/nonyonah/proplay.git
cd proplay
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

Create a `.env` file in the `/api` directory:
```env
PORT=3001
PANDASCORE_TOKEN=your_pandascore_token
NEYNAR_API_KEY=your_neynar_api_key
BASE_RPC_URL=https://sepolia.base.org
PREDICTION_POOL_ADDRESS=your_contract_address
BASE_USDC_ADDRESS=your_base_usdc_address
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

4. Set up the database:
- Create a new Supabase project
- Run the SQL script in `api/db/init.sql`

5. Deploy the smart contract:
- Deploy `api/contracts/PredictionPool.sol` to Base Sepolia
- Update PREDICTION_POOL_ADDRESS in `.env`

6. Start the development servers:

In one terminal:
```bash
npm run dev
```

In another terminal:
```bash
npm run dev:api
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 Project Structure

```
├── app/                  # Next.js app directory
├── components/           # React components
├── lib/                  # Shared utilities
├── api/                  # Backend server
│   ├── routes/          # API routes
│   ├── contracts/       # Smart contracts
│   ├── config/          # Server config
│   └── utils/           # Helper functions
└── public/              # Static assets
```

## 📚 Documentation

For detailed API documentation and backend setup, see [API Documentation](api/README.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📜 License

ISC License

## 🙏 Acknowledgments

- PandaScore for esports data
- Base for the L2 infrastructure
- Farcaster for the frame platform
- shadcn/ui for the component library
- **Tournament Tracking**: Stay updated on major tournaments and competitions
- **Player Profiles**: Follow individual players and get personalized updates
- **Match Predictions**: Place predictions on upcoming matches
- **Live Match Updates**: Real-time updates on ongoing matches
- **Social Sharing**: Share match results and predictions as Farcaster casts

### Supported Games
- **League of Legends (LoL)** - Follow LEC, LCS, LCK, and international tournaments
- **Counter-Strike 2 (CS2)** - Track major tournaments like IEM Cologne
- **Valorant** - Stay updated with VCT Masters and regional competitions
- **Dota 2** - Follow The International and major tournaments

### User Experience
- **Personalized Onboarding**: Set up your gaming preferences, favorite teams, and players
- **Smart Filtering**: Filter matches by game, date, and tournament
- **Wallet Integration**: Connect your wallet for prediction features
- **Dark/Light Theme**: Customizable theme preferences
- **Mobile-First Design**: Optimized for mobile Farcaster clients

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Farcaster account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nonyonah/proplay.git
cd proplay
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
pnpm build
pnpm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **Farcaster Integration**: @farcaster/miniapp-sdk
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **TypeScript**: Full type safety

## 📱 App Structure

### Main Pages
- **Login Page**: Farcaster authentication
- **Onboarding Flow**: 3-step preference setup
- **Home Page**: Main dashboard with match listings
- **Followed Matches**: Matches from followed teams
- **Predictions Page**: Make and track predictions
- **Live Matches**: Real-time match updates

### Key Components
- **Match Cards**: Interactive match information display
- **Share Cast Modal**: Share matches to Farcaster
- **Wallet Modal**: Wallet connection interface
- **Theme Provider**: Dark/light mode management

## 🎯 User Journey

1. **Authentication**: Users log in with their Farcaster account
2. **Onboarding**: 
   - Select favorite esports games
   - Choose a favorite team
   - Pick a favorite player
3. **Personalization**: App customizes content based on preferences
4. **Engagement**: 
   - Follow matches and tournaments
   - Make predictions on outcomes
   - Share results and predictions
   - Track live match updates

## 🔧 Configuration

The app uses several configuration files:
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui component configuration
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## 🎨 Design System

Pro Play uses a modern, clean design system with:
- **Color Palette**: Purple primary with gray neutrals
- **Typography**: Clean, readable fonts optimized for mobile
- **Components**: Consistent UI components from Radix UI
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

## 🔮 Future Features

- **Push Notifications**: Real-time match alerts
- **Advanced Analytics**: Detailed prediction statistics
- **Tournament Brackets**: Interactive tournament visualization
- **Player Statistics**: Comprehensive player performance data
- **Community Features**: User-generated content and discussions
- **NFT Integration**: Collectible team and player cards

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Farcaster team for the mini app SDK
- Radix UI for accessible components
- The esports community for inspiration
- All contributors and testers

## 📞 Support

For support, please open an issue on GitHub or reach out on Farcaster.

---

**Built with ❤️ for the esports community on Farcaster**