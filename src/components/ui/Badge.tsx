import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        primary: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200",
        secondary: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
        destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
        outline: "border border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50",
        rating: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// Special Rating Badge component
interface RatingBadgeProps {
  rating: number
  className?: string
}

function RatingBadge({ rating, className }: RatingBadgeProps) {
  const fullStars = Math.floor(rating)
  const emptyStars = 5 - fullStars

  return (
    <Badge variant="rating" className={cn("flex items-center gap-1", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-3 h-3 text-yellow-500 fill-current" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3 h-3 text-yellow-500/40" />
      ))}
      <span className="ml-1 font-semibold">{rating.toFixed(1)}/5</span>
    </Badge>
  )
}

export { Badge, RatingBadge, badgeVariants }
