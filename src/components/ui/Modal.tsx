'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

// Helper component for footer buttons that need to submit forms
interface ModalFooterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  formId?: string;
}

export function ModalFooterButton({
  formId,
  ...props
}: ModalFooterButtonProps) {
  return <Button {...props} form={formId} type={props.type || 'submit'} />;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  formId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  footer,
  formId,
  size = 'md',
}: ModalProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Close on escape key and disable body scroll
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Disable scroll on body and html, and add class for main content
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Re-enable scroll on body and html, and remove class
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative z-50 w-full rounded-lg bg-white shadow-lg dark:bg-gray-800 h-[90vh] flex flex-col',
          {
            'max-w-sm': size === 'sm',
            'max-w-lg': size === 'md',
            'max-w-2xl': size === 'lg',
            'max-w-4xl': size === 'xl',
            'max-w-6xl': size === '2xl',
          },
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
      >
        {/* Fixed Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 ml-4 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - no scroll, scroll is handled by children */}
        <div className="flex-1 overflow-hidden p-6 pt-4">{children}</div>

        {/* Fixed Footer */}
        {footer && (
          <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {formId ? <div data-form-id={formId}>{footer}</div> : footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
