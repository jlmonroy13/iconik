import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export const formatDateTime = (date: Date): string => {
  const formattedDate = formatDate(date)
  const formattedTime = formatTime(date)
  return `${formattedDate}, ${formattedTime}`
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount)
}
