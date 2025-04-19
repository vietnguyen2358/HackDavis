import { Inter, Playfair_Display, Montserrat, Merriweather } from 'next/font/google'

// Load Inter for body text with all subsets
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Load Playfair Display as a serif alternative to Tiempos
export const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

// Use Merriweather as an alternative to Tiempos
export const tiempos = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-tiempos',
})

// Use Montserrat as a system font alternative to SF Pro
export const sfPro = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sf',
})

// Helper function to get all font variables
export function getFontVariables() {
  return [
    inter.variable, 
    playfair.variable,
    tiempos.variable,
    sfPro.variable
  ].join(' ')
} 