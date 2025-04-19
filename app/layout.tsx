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
