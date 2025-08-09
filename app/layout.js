import "./globals.css"
import "@/styles/terminal.css"
import LayoutClient from "./layout.client"

export const metadata = {
  title: "demo",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0D0D0D] font-mono text-[#D0FFD0] antialiased">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
