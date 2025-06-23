import Link from 'next/link'
import React from 'react'

interface NavLinkProps {
  href: string
  icon: React.ElementType
  label: string
  onClick: () => void
  isActive?: boolean
}

export function NavLink({ href, icon: Icon, label, onClick, isActive = false }: NavLinkProps) {
  const baseClasses = "flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors"
  const activeClasses = isActive
    ? "bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300"
    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"

  return (
    <Link
      href={href}
      className={`${baseClasses} ${activeClasses}`}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  )
}
