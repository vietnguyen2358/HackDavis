"use client"

import { ReactNode, useRef, useState, useEffect } from "react"
import { motion, useInView, Variants } from "framer-motion"

// Fade in animation
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.45, 0.27, 0.99],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animations
export function StaggerChildren({
  children,
  staggerAmount = 0.1,
  className = "",
}: {
  children: ReactNode
  staggerAmount?: number
  className?: string
}) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerAmount,
      },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 15 } },
  }

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={item}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  )
}

// Parallax effect on scroll
export function ParallaxSection({
  children,
  speed = 0.2,
  className = "",
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: "some" })

  return (
    <motion.div
      ref={ref}
      style={{
        translateY: isInView
          ? speed < 0
            ? `${speed * -100}%`
            : `${speed * 100}%`
          : 0,
      }}
      transition={{ ease: "easeOut", duration: 1 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale on hover
export function ScaleOnHover({
  children,
  scale = 1.05,
  className = "",
}: {
  children: ReactNode
  scale?: number
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Text reveal animation
export function TextReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      y: "100%" 
    },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * delay,
        duration: 0.8,
        ease: [0.17, 0.55, 0.55, 1],
      },
    }),
  }

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={1}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Counting number animation
export function CountNumber({
  value = 0,
  prefix = "",
  suffix = "",
  duration = 2,
  className = "",
}: {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  useEffect(() => {
    if (!isInView) return
    
    let start = 0
    const end = Math.min(value, 9999) // Prevent extremely large numbers
    
    // Get animation duration based on value size (larger numbers take longer)
    const animationDuration = Math.min(duration, 5) // Cap at 5 seconds
    const stepTime = animationDuration * 1000 / end
    
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) {
        clearInterval(timer)
        setCount(end)
      }
    }, stepTime)
    
    return () => clearInterval(timer)
  }, [isInView, value, duration])
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      className={className}
    >
      {prefix}{count}{suffix}
    </motion.div>
  )
}

// Glass card component
export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className={`relative backdrop-blur-md bg-white/10 dark:bg-gray-900/30 
        border border-white/20 dark:border-gray-800/30 rounded-xl 
        shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  )
} 