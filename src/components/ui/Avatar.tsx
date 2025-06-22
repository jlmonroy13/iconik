'use client'

import React from 'react'
import Image from 'next/image'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const avatarVariants = cva(
  "relative inline-flex items-center justify-center font-medium select-none shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
        xl: "h-12 w-12 text-lg"
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-lg"
      },
      variant: {
        default: "text-gray-700 dark:text-gray-300 bg-gray-300 dark:bg-gray-600",
        client: "text-pink-700 dark:text-pink-300 bg-pink-200 dark:bg-pink-800/50",
        manicurist: "text-purple-700 dark:text-purple-300 bg-purple-200 dark:bg-purple-800/50"
      }
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
      variant: "default"
    }
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, shape, variant, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)

    const handleImageError = () => {
      setImageError(true)
    }

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, shape, variant, className }))}
        {...props}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt || ''}
            fill
            className="object-cover"
            onError={handleImageError}
            sizes="(max-width: 768px) 48px, 48px"
          />
        ) : (
          <span className="uppercase">
            {fallback || (alt ? alt.charAt(0) : '?')}
          </span>
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar, avatarVariants }
