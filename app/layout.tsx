import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AppStateProvider } from "@/lib/context/app-state"
import { inter, tiempos, playfair, sfPro, getFontVariables } from "@/lib/fonts"

export const metadata: Metadata = {
  title: "HealthAssist AI",
  description: "AI-powered healthcare dashboard for automating routine support workflows",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${getFontVariables()}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/hero-pattern.svg" as="image" type="image/svg+xml" />
        
        {/* Add DNS prefetch for third-party resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Add meta viewport for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body suppressHydrationWarning className="w-full h-full font-inter">
        <AppStateProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <SidebarProvider defaultOpen={false} open={false}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto w-full bg-background">
                  {children}
                </main>
              </div>
              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        </AppStateProvider>
      </body>
    </html>
  )
}
