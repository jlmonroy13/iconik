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
}: ModalProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
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
          'relative z-50 w-full max-w-lg rounded-lg bg-white shadow-lg dark:bg-gray-800 max-h-[90vh] flex flex-col',
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">{children}</div>

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
