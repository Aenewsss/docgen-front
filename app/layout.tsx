import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
