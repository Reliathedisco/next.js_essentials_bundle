// Hook: Copy to clipboard with feedback
'use client';

import { useState } from 'react';

export function useClipboard(timeout: number = 2000) {
  const [isCopied, setIsCopied] = useState(false);
  
  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not available');
      return false;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      
      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
      
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      setIsCopied(false);
      return false;
    }
  };
  
  return { isCopied, copyToClipboard };
}
