import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles - common to all buttons
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95",
  {
    variants: {
      variant: {
        // Primary button (pink theme)
        primary: "bg-pink-600 text-white hover:bg-pink-700 hover:shadow-lg hover:shadow-pink-500/25 shadow-md",
        // Secondary button (gray theme)
        secondary: "bg-gray-800 text-white hover:bg-gray-900 hover:shadow-lg shadow-md dark:bg-gray-700 dark:hover:bg-gray-600",
        // Outlined button
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-500",
        // Ghost button (minimal)
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
        // Link style button
        link: "text-pink-600 hover:text-pink-800 hover:underline dark:text-pink-400 dark:hover:text-pink-200",
        // Destructive button
        destructive: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25 shadow-md"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-8 py-3 text-lg font-semibold",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
