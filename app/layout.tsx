import type { Metadata } from 'next'
import { Providers } from './providers'

const URL = process.env.NEXT_PUBLIC_URL || 'https://basepump.vercel.app'

export const metadata: Metadata = {
  title: 'BasePump',
  description: 'ETH Price Prediction Game on Base',
  other: {
    'fc:frame': JSON.stringify({
      version: '1',
      imageUrl: `${URL}/og.png`,
      button: {
        title: 'Play BasePump',
        action: {
          type: 'launch_frame',
          name: 'BasePump',
          url: `${URL}`,
          splashImageUrl: `${URL}/og.png`,
          splashBackgroundColor: '#1a0533',
        },
      },
    }),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
