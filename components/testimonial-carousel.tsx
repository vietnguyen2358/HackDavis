"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/animated"
import { cn } from "@/lib/utils"

type Testimonial = {
  id: string
  name: string
  role: string
  quote: string
  avatar?: string
}

const testimonialVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 500 : -500,
    opacity: 0,
    scale: 0.95,
  }),
}

export function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  interval = 5000,
  className = "",
}: {
  testimonials: Testimonial[]
  autoPlay?: boolean
  interval?: number
  className?: string
}) {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  const paginate = useCallback((newDirection: number) => {
    const newPage = (page + newDirection + testimonials.length) % testimonials.length
    setPage([newPage, newDirection])
  }, [page, testimonials.length])
  
  useEffect(() => {
    if (autoPlay) {
      timerRef.current = setInterval(() => {
        paginate(1)
      }, interval)
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoPlay, interval, paginate])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="relative overflow-hidden h-[300px] md:h-[320px] lg:h-[340px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={testimonialVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.3 },
            }}
            className="absolute w-full"
          >
            <TestimonialItem testimonial={testimonials[page]} />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center space-x-2 my-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const newDirection = index > page ? 1 : -1
              setPage([index, newDirection])
            }}
            className="p-1 focus:outline-none"
            aria-label={`Go to testimonial ${index + 1}`}
          >
            <motion.div
              className={`w-2.5 h-2.5 rounded-full bg-primary/20 transition-colors`}
              animate={{
                scale: page === index ? 1.2 : 1,
                backgroundColor: page === index ? "var(--primary)" : "var(--primary-20)",
              }}
            />
          </button>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <div className="w-full flex justify-between absolute top-1/2 transform -translate-y-1/2 pointer-events-none">
        <motion.button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-background/30 backdrop-blur-sm border border-white/10 dark:border-gray-800/30 shadow-md ml-2 pointer-events-auto focus:outline-none"
          onClick={() => paginate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          aria-label="Previous testimonial"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
        
        <motion.button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-background/30 backdrop-blur-sm border border-white/10 dark:border-gray-800/30 shadow-md mr-2 pointer-events-auto focus:outline-none"
          onClick={() => paginate(1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          aria-label="Next testimonial"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </div>
    </div>
  )
}

function TestimonialItem({ testimonial }: { testimonial: Testimonial }) {
  return (
    <GlassCard className="p-6 md:p-8 h-full flex flex-col justify-between">
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex-1 mb-6">
            <svg className="w-10 h-10 text-primary/40 mb-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
              <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
            </svg>
            <p className="font-tiempos text-lg md:text-xl italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
          </div>
        </div>
        
        <div className="flex items-center mt-auto">
          <div className="flex-shrink-0 mr-4">
            {testimonial.avatar ? (
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/10"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary/80 text-lg font-semibold">
                {testimonial.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-sf text-base font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </GlassCard>
  )
} 