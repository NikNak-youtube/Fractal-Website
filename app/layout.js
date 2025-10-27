import './globals.css'

export const metadata = {
  title: 'Fractal Generator',
  description: 'Generate and explore beautiful mathematical fractals',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
