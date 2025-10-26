import { Inter } from 'next/font/google'
import { AuthProvider } from './contexts/AuthContext'
import { KarmaProvider } from './contexts/KarmaContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Karma Engine',
  description: 'Decentralized Karma System',
  icons: {
    icon: './karma_token_icon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <KarmaProvider>
            {children}
          </KarmaProvider>
        </AuthProvider>
      </body>
    </html>
  )
}