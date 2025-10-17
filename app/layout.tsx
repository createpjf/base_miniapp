import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Base记账 - 区块链智能记账助手',
  description: '支持多币种记账、AI智能识别、预算管理的区块链记账应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Smiley+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-smiley-sans">
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}
