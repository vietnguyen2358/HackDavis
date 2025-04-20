"use client"

import { Suspense, lazy } from "react"
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { MeshGradient } from "@/components/ui/mesh-gradient"
import { 
  FadeIn, 
  StaggerChildren, 
  ParallaxSection, 
  ScaleOnHover,
  TextReveal,
  GlassCard
} from "@/components/ui/animated"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { StatsSection } from "@/components/stats-section"
import { UpcomingAIJobs } from "@/components/upcoming-ai-jobs"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen mobile-nav-spacing">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden py-20 md:py-28 lg:py-36 xl:py-40">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0">
          <MeshGradient />
        </div>
        
        {/* Floating feature cards in background */}
        <div className="absolute inset-0 z-[1] pointer-events-none hidden md:block">
          {/* Floating feature cards - all positioned on the right side */}
          <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
            {/* Main featured card */}
            <GlassCard className="absolute top-[20%] right-[0%] w-full max-w-md p-6 md:p-8 h-[400px] transform rotate-3 group overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-shimmer animate-shimmer" />
              <div className="relative h-full flex flex-col justify-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="font-tiempos text-center text-xl font-bold text-white mb-2">AI Documentation</h3>
                <div className="space-y-3 text-center">
                  <p className="font-tiempos text-white/80 text-sm">Saves 10+ hours of paperwork weekly</p>
                  <div className="h-px bg-white/20 w-full"></div>
                  <p className="font-tiempos text-white/80 text-sm">Real-time transcription and analysis</p>
                  <div className="h-px bg-white/20 w-full"></div>
                  <p className="font-tiempos text-white/80 text-sm">HIPAA-compliant secure processing</p>
                </div>
              </div>
            </GlassCard>
            
            {/* Smaller feature cards positioned around the right side
            <GlassCard className="absolute top-[10%] right-[55%] w-64 p-4 transform -rotate-6">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.811A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-1.287c-1.718-.493-2.3-2.579-1.067-3.811L5 14.5" />
                  </svg>
                </div>
                <h4 className="font-tiempos text-sm font-semibold text-white">Clinical Insights</h4>
                <p className="text-white/70 text-xs mt-1">AI-powered diagnosis suggestions</p>
              </div>
            </GlassCard>
            
            <GlassCard className="absolute top-[50%] right-[60%] w-56 p-4 transform rotate-12">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <h4 className="font-tiempos text-sm font-semibold text-white">Smart Scheduling</h4>
                <p className="text-white/70 text-xs mt-1">Optimizes your calendar</p>
              </div>
            </GlassCard>
            
            <GlassCard className="absolute bottom-[20%] right-[55%] w-60 p-4 transform rotate-[-3deg]">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <h4 className="font-tiempos text-sm font-semibold text-white">Patient Communication</h4>
                <p className="text-white/70 text-xs mt-1">Automated follow-ups & reminders</p>
              </div>
            </GlassCard>
            
            <GlassCard className="absolute bottom-[35%] right-[15%] w-52 p-4 transform rotate-6">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h4 className="font-tiempos text-sm font-semibold text-white">Voice Transcription</h4>
                <p className="text-white/70 text-xs mt-1">Real-time clinical documentation</p>
              </div>
            </GlassCard>
            
            <GlassCard className="absolute top-[65%] right-[35%] w-56 p-4 transform rotate-[-8deg]">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
                  </svg>
                </div>
                <h4 className="font-tiempos text-sm font-semibold text-white">Seamless Integration</h4>
                <p className="text-white/70 text-xs mt-1">Works with your existing EHR</p>
              </div>
            </GlassCard>
            
            <GlassCard className="absolute top-[30%] right-[30%] w-58 p-4 transform rotate-[4deg]">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h4 className="font-tiempos text-sm font-semibold text-white">Analytics</h4>
                <p className="text-white/70 text-xs mt-1">Data-driven insights</p>
              </div>
            </GlassCard> */}
          </div>
        </div>
        
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-16 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center">
              <FadeIn delay={0.1} className="mb-6">
                <Badge className="inline-flex rounded-md bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors border-white/10">
                  Healthcare AI Revolution
                </Badge>
              </FadeIn>
              
              <div className="mb-6">
                <TextReveal className="font-tiempos text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-sm">
                  Transform Patient Care with AI
                </TextReveal>
                <TextReveal delay={0.1} className="font-tiempos max-w-[600px] text-white/80 md:text-xl">
                  HealthAssist AI streamlines your clinical workflows, reducing administrative burden and giving you more time for what truly matters - your patients.
                </TextReveal>
              </div>
              
              <StaggerChildren className="flex flex-col sm:flex-row gap-4 mt-2">
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    background: "linear-gradient(to right, hsl(164, 80%, 24%), hsl(217, 90%, 58%))"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href="/dashboard" passHref>
                    <Button size="lg" className="font-tiempos text-base font-medium px-8 py-6 bg-primary/90 backdrop-blur-sm border border-primary/20 shadow-xl">
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <Link href="#features" passHref>
                    <Button size="lg" variant="outline" className="font-tiempos text-base font-medium px-8 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-lg">
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </StaggerChildren>
            </div>
            
            <div className="hidden lg:block">
              {/* Empty div to match the grid layout, cards are now in background */}
            </div>
          </div>
      </div>

        {/* Scrolling indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="flex flex-col items-center"
          >
            <span className="text-white/50 text-sm mb-2 font-medium">Scroll to Discover</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6 mx-auto">
          <FadeIn className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge variant="outline" className="mx-auto font-medium">
              Features
            </Badge>
            <h2 className="font-tiempos text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Powerful AI Tools for Healthcare
            </h2>
            <p className="font-tiempos max-w-[800px] text-muted-foreground md:text-xl/relaxed">
              Our platform combines state-of-the-art AI with healthcare expertise to deliver exceptional results.
            </p>
          </FadeIn>
          
          <StaggerChildren className="font-tiempos grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12 relative">
            {features.map((feature, index) => (
              <ScaleOnHover key={index} scale={1.03}>
                <GlassCard className="h-full bg-white/50 dark:bg-slate-900/40 relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-shimmer animate-shimmer transition-opacity duration-700 ease-in-out" />
                  <div className="p-6 lg:p-8 flex flex-col h-full justify-between relative z-10">
                    <div>
                      <div className="p-3 rounded-xl bg-primary/10 w-14 h-14 flex items-center justify-center mb-6">
                        {feature.icon}
                      </div>
                      <h3 className="font-tiempos text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
      </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/20">
                      <motion.span 
                        className="text-primary font-medium text-sm flex items-center"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        Learn more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </motion.span>
                    </div>
                  </div>
                </GlassCard>
              </ScaleOnHover>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full py-20 md:py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container px-4 md:px-6 mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="font-tiempos text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Why Healthcare Providers Choose Us
            </h2>
            <p className="font-tiempos max-w-[800px] mx-auto text-muted-foreground md:text-xl/relaxed">
              Our AI-powered platform delivers measurable results that transform healthcare practices.
            </p>
          </FadeIn>
          
          <StatsSection stats={stats} className="font-tiempos mt-12" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6 mx-auto">
          <FadeIn className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <Badge variant="outline" className="mx-auto">
              Testimonials
            </Badge>
            <h2 className="font-tiempos text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Trusted by Healthcare Professionals
            </h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
              See what medical professionals are saying about our platform.
            </p>
          </FadeIn>
          
          <div className="mx-auto max-w-4xl mt-12">
            <TestimonialCarousel testimonials={testimonialData} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-20 md:py-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/20 z-0" />
        
        {/* Floating elements */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute top-20 left-[10%] w-24 h-24 rounded-full bg-primary/20 backdrop-blur-md"
            animate={{ 
              y: [0, 15, 0],
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
          />
          <motion.div 
            className="absolute bottom-20 left-[15%] w-16 h-16 rounded-full bg-accent/20 backdrop-blur-md"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              rotate: [0, -10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", delay: 1 }}
          />
          <motion.div 
            className="absolute top-40 right-[15%] w-20 h-20 rounded-full bg-accent/20 backdrop-blur-md"
            animate={{ 
              y: [0, 25, 0],
              scale: [1, 1.08, 1],
              rotate: [0, 15, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", delay: 2 }}
          />
          <motion.div 
            className="absolute bottom-32 right-[10%] w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md"
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.15, 1],
              rotate: [0, -8, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, repeatType: "mirror", delay: 3 }}
          />
      </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="font-tiempos text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Ready to Transform Your Practice?
              </h2>
              <p className="font-tiempos text-muted-foreground md:text-xl mb-10 max-w-2xl">
                Join thousands of healthcare providers who are saving time, reducing burnout, and improving patient outcomes with HealthAssist AI.
              </p>
            </FadeIn>
            
            <StaggerChildren className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
              <motion.div
                className="w-full sm:w-auto"
                whileHover={{ 
                  scale: 1.05,
                  background: "linear-gradient(to right, hsl(164, 80%, 24%), hsl(217, 90%, 58%))"
                }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/dashboard" passHref className="w-full block">
                  <Button size="lg" className="w-full sm:w-auto font-tiempos text-base font-medium px-8 py-6 bg-primary/90 backdrop-blur-sm border border-primary/20 shadow-xl">
                    Get Started Today
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-tiempos text-base font-medium px-8 py-6 backdrop-blur-sm">
                  Schedule a Demo
                </Button>
              </motion.div>
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-background border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                  <span className="text-lg font-bold">H</span>
                </div>
                <span className="text-xl font-bold font-tiempos">HealthAssist AI</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-xs">
                AI-powered healthcare solutions to streamline workflows, reduce administrative burden, and improve patient care.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 font-tiempos">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 font-tiempos">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground order-2 md:order-1">
                © 2024 HealthAssist AI. All rights reserved.
              </p>
              <div className="flex items-center gap-4 order-1 md:order-2">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature data
const features = [
  {
    title: "Automated Documentation",
    description: "Save hours of administrative work with AI-generated clinical notes and documentation. Our system learns from your practice patterns.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Smart Scheduling",
    description: "Intelligent calendar management that optimizes your day, predicts appointment durations, and dramatically reduces no-shows.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "Patient Communication",
    description: "Automated follow-ups, appointment reminders, and personalized care instructions that improve patient satisfaction and outcomes.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    title: "Voice Transcription",
    description: "Convert patient conversations into structured clinical documentation in real-time with our advanced voice recognition technology.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    title: "Clinical Insights",
    description: "AI-powered analytics to identify trends, suggest preventative measures, and improve patient outcomes through data-driven decisions.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Seamless Integration",
    description: "Works with your existing EHR and practice management systems with secure, HIPAA-compliant data exchange and minimal setup time.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
      </svg>
    ),
  },
]

// Statistics data
const stats = [
  {
    id: "stat-1",
    label: "Hours saved weekly per provider",
    value: 12,
    suffix: "+",
  },
  {
    id: "stat-2",
    label: "Reduction in no-show rate",
    value: 68,
    suffix: "%",
  },
  {
    id: "stat-3",
    label: "Increase in appointment capacity",
    value: 23,
    suffix: "%",
  },
  {
    id: "stat-4",
    label: "Healthcare providers using our platform",
    value: 5280,
    prefix: "",
  },
]

// Testimonial data
const testimonialData = [
  {
    id: "testimonial-1",
    name: "Dr. Sarah Johnson",
    role: "Family Medicine Physician",
    quote: "HealthAssist AI has completely transformed my practice. I'm saving over 2 hours of administrative work daily, and my patient satisfaction scores have significantly improved. The AI documentation is remarkably accurate and helps me focus on patient care.",
  },
  {
    id: "testimonial-2",
    name: "Dr. Michael Chen",
    role: "Cardiologist",
    quote: "The transcription feature alone is worth its weight in gold. My notes are more accurate, and I can focus on my patients instead of my computer screen. The clinical insights have helped me identify trends I might have otherwise missed.",
  },
  {
    id: "testimonial-3",
    name: "Lisa Taylor, RN",
    role: "Practice Manager",
    quote: "From scheduling to follow-ups, HealthAssist AI has streamlined our entire workflow. Our staff is happier, our patients receive better care, and our practice is more efficient than ever. The ROI was evident within the first month.",
  },
  {
    id: "testimonial-4",
    name: "Dr. James Wilson",
    role: "Orthopedic Surgeon",
    quote: "I was skeptical at first, but the accuracy of the AI documentation is impressive. It's helping us provide better care while reducing our administrative burden. The platform integrates seamlessly with our existing systems.",
  },
]
