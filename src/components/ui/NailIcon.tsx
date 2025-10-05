import React from 'react';

interface NailIconProps {
  className?: string;
  size?: number;
}

export function NailIcon({ className = '', size = 24 }: NailIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hand outline */}
      <path
        d="M8 2C8 1.44772 8.44772 1 9 1H15C15.5523 1 16 1.44772 16 2V4C16 4.55228 15.5523 5 15 5H9C8.44772 5 8 4.55228 8 4V2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Fingers */}
      <path
        d="M8 5V8C8 8.55228 8.44772 9 9 9H10C10.5523 9 11 8.55228 11 8V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 5V9C11 9.55228 11.4477 10 12 10H12.5C13.0523 10 13.5 9.55228 13.5 9V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 5V10C13.5 10.5523 13.9477 11 14.5 11H15C15.5523 11 16 10.5523 16 10V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Nails */}
      <ellipse
        cx="9.5"
        cy="7.5"
        rx="0.8"
        ry="1.2"
        fill="currentColor"
        opacity="0.6"
      />
      <ellipse
        cx="12.5"
        cy="7.5"
        rx="0.8"
        ry="1.2"
        fill="currentColor"
        opacity="0.6"
      />
      <ellipse
        cx="15.5"
        cy="7.5"
        rx="0.8"
        ry="1.2"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Hand base */}
      <path
        d="M8 8C8 8 8 12 8 14C8 16 10 18 12 18C14 18 16 16 16 14V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
