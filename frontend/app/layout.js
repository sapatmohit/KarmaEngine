import './globals.css'
import { Inter } from 'next/font/google'
import { KarmaProvider } from './contexts/KarmaContext'
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Karma Engine',
  description: 'Decentralized Karma System',
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