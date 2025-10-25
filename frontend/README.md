# KarmaChain Frontend

A beautiful, glass-morphism themed frontend for the KarmaChain dApp built with Next.js 13+ (App Router).

## Features

- Dark theme with glass UI effects similar to Uniswap
- Responsive design for all device sizes
- Dashboard with karma metrics and staking progress
- Activity tracking and recording interface
- Staking interface with tier visualization
- Leaderboard display
- Context-based state management

## Tech Stack

- [Next.js 13+](https://nextjs.org/) with App Router
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Ethers.js](https://docs.ethers.io/)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── components/        # Reusable UI components
├── contexts/          # React context providers
├── utils/             # Utility functions
├── page.js            # Dashboard page
├── activities/        # Activities page
├── staking/           # Staking page
└── leaderboard/       # Leaderboard page
```

## Environment Variables

Create a `.env.local` file in the root of the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Available Scripts

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run start` - Runs the built app in production mode
- `npm run lint` - Runs the linter

## Design Elements

### Glass UI Components
- GlassCard: Frosted glass effect cards
- GlassButton: Interactive glass buttons
- KarmaBadge: Color-coded karma indicators
- TierIndicator: Visual staking progress bar

### Color Scheme
- Primary: Blue (#0ea5e9)
- Secondary: Pink (#ec4899)
- Background: Dark blue gradient (#0f172a to #1e293b)
- Text: White/Gray (#f8fafc to #64748b)

### Animations
- Smooth page transitions with Framer Motion
- Hover effects on interactive elements
- Loading states with pulse animations

## Integration Points

The frontend is designed to integrate with:
1. Backend API (Node.js + Express)
2. Smart Contract (Rust + Soroban)
3. Wallet Connection (Stellar Wallet)

Currently using mock data for demonstration purposes.