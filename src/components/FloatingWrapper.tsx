import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { FloatingPosition } from '../types';
import { cn } from '@/lib/utils';

interface FloatingWrapperProps {
  position?: FloatingPosition;
  children: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
}

const positionClasses: Record<FloatingPosition, { button: string; container: string }> = {
  'bottom-right': {
    button: 'bottom-6 right-6',
    container: 'bottom-24 right-6',
  },
  'bottom-left': {
    button: 'bottom-6 left-6',
    container: 'bottom-24 left-6',
  },
  'top-right': {
    button: 'top-6 right-6',
    container: 'top-24 right-6',
  },
  'top-left': {
    button: 'top-6 left-6',
    container: 'top-24 left-6',
  },
};

export const FloatingWrapper: React.FC<FloatingWrapperProps> = ({
  position = 'bottom-right',
  children,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className={cn(
          'fixed z-50 w-14 h-14 rounded-full bg-black text-white',
          'shadow-2xl hover:scale-110 transition-all duration-200',
          'flex items-center justify-center',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black',
          positionClasses[position].button
        )}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <ChevronDown className="w-6 h-6 transition-transform" />
        )}
      </button>

      {/* Chat Container */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={handleToggle}
            aria-hidden="true"
          />

          {/* Chat Window */}
          <div
            className={cn(
              'fixed z-40 shadow-2xl rounded-lg',
              'animate-slide-in',
              // Desktop: positioned based on prop
              'hidden md:block',
              positionClasses[position].container,
              // Mobile: centered
              'md:w-96 md:h-[600px]',
              // Mobile full screen
              'w-full h-full',
              'md:max-w-[384px] md:max-h-[600px]'
            )}
          >
            {children}
          </div>

          {/* Mobile: Full screen chat */}
          <div className="md:hidden fixed inset-4 z-40 animate-slide-in">
            {children}
          </div>
        </>
      )}
    </>
  );
};
