import './globals.css'
import { Inter } from 'next/font/google'
import UserInfo from '@/components/UserInfo'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Busca Cliente.ia',
  description: 'Encontre seus clientes ideais com IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <UserInfo />
      </body>
    </html>
  )
} 