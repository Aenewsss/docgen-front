import type { Metadata } from 'next'
import './globals.css'
import { HelpCircle } from 'lucide-react'
import Link from 'next/link'
import Tooltip from '@/components/tooltip'

export const metadata: Metadata = {
  title: 'DocumentAI',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="shortcut icon" href="favicon.svg" />
      </head>
      <body>
        {children}
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 50,
        }}>
          <Link
            href="mailto:contato@documentai.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className='flex gap-2'
          >
            <Tooltip message='Ajuda'>
              <HelpCircle className='w-8 h-8' />
            </Tooltip>
          </Link>
        </div>
      </body>
    </html>
  )
}
