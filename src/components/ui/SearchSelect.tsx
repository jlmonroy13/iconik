'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  name: string;
}

interface SearchSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onCreateNew?: () => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function SearchSelect({
  options,
  value,
  onChange,
  onCreateNew,
  label,
  placeholder = 'Buscar...',
  error,
  disabled = false,
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected option
  const selectedOption = options.find(option => option.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const handleOptionSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFocus = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className='space-y-2' ref={containerRef}>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          {label}
        </label>
      )}

      <div className='relative'>
        {/* Trigger Button */}
        <button
          type='button'
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2 text-sm border rounded-md transition-colors',
            'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-800',
            'flex items-center justify-between',
            error
              ? 'border-red-500 dark:border-red-400 focus:ring-red-500'
              : '',
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'
          )}
        >
          <span
            className={cn(
              'truncate',
              selectedOption
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className='absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 shadow-lg'>
            {/* Search Input */}
            <div className='p-2 border-b border-gray-200 dark:border-gray-600'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <input
                  ref={searchInputRef}
                  type='text'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  placeholder='Buscar cliente...'
                  className='w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-800'
                />
              </div>
            </div>

            {/* Options List */}
            <div className='max-h-60 overflow-auto py-1'>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <button
                    key={option.id}
                    type='button'
                    onClick={() => handleOptionSelect(option.id)}
                    className={cn(
                      'w-full px-3 py-2 text-sm text-left cursor-pointer',
                      'hover:bg-gray-100 dark:hover:bg-gray-800',
                      'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800',
                      value === option.id &&
                        'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                    )}
                  >
                    {option.name}
                  </button>
                ))
              ) : (
                <div className='px-3 py-2 text-sm text-gray-500 dark:text-gray-400'>
                  {searchTerm ? (
                    <div className='flex flex-col gap-2'>
                      <span>No se encontró &quot;{searchTerm}&quot;</span>
                      {onCreateNew && (
                        <button
                          type='button'
                          onClick={handleCreateNew}
                          className='flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300'
                        >
                          <Plus className='h-4 w-4' />
                          Crear &quot;{searchTerm}&quot;
                        </button>
                      )}
                    </div>
                  ) : (
                    'No hay opciones disponibles'
                  )}
                </div>
              )}
            </div>

            {/* Create New Button (if no search term and onCreateNew provided) */}
            {!searchTerm && onCreateNew && (
              <div className='p-2 border-t border-gray-200 dark:border-gray-600'>
                <button
                  type='button'
                  onClick={handleCreateNew}
                  className='w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-md transition-colors'
                >
                  <Plus className='h-4 w-4' />
                  Crear nuevo cliente
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className='text-sm text-red-500 dark:text-red-400'>{error}</p>
      )}
    </div>
  );
}
