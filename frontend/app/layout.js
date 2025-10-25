import './globals.css'
import { Inter } from 'next/font/google'
import { KarmaProvider } from './contexts/KarmaContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KarmaChain - Decentralized Reputation Protocol',
  description: 'Track your on-chain reputation and karma score',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="karma">
      <body className={inter.className}>
        <KarmaProvider>
          {children}
        </KarmaProvider>
      </body>
    </html>
  )
}