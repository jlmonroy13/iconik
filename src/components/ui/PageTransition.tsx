'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Small delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4',
        className
      )}
    >
      {children}
    </div>
  )
}

// Fade in animation for individual elements
interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6',
        className
      )}
    >
      {children}
    </div>
  )
}

// Staggered animation for lists
interface StaggeredListProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
}

export function StaggeredList({
  children,
  className,
  staggerDelay = 100
}: StaggeredListProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  )
}
