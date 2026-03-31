// Component: Dropdown menu with keyboard navigation
'use client';

import { useState, useRef, useEffect } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'left' | 'right';
}

export function DropdownMenu({
  trigger,
  items,
  align = 'left',
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    
    const enabledItems = items.filter((item) => !item.disabled);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => 
          prev < enabledItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => 
          prev > 0 ? prev - 1 : enabledItems.length - 1
        );
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < enabledItems.length) {
          enabledItems[focusedIndex].onClick();
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };
  
  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="inline-flex items-center"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </button>
      
      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          role="menu"
        >
          <div className="py-1">
            {items.map((item, index) => (
              <div key={item.id}>
                {item.divider && <div className="my-1 border-t border-gray-200" />}
                <button
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  disabled={item.disabled}
                  className={`flex w-full items-center px-4 py-2 text-left text-sm ${
                    item.disabled
                      ? 'cursor-not-allowed text-gray-400'
                      : focusedIndex === index
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  role="menuitem"
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
