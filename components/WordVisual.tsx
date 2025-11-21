import React from 'react';
import { VocabularyItem } from '../types';

interface WordVisualProps {
  item: VocabularyItem;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'huge';
  className?: string;
  shadowMode?: boolean; // For Shadow Match game
}

export const WordVisual: React.FC<WordVisualProps> = ({ 
  item, 
  size = 'md', 
  className = '',
  shadowMode = false
}) => {
  
  const getSizeClass = () => {
    switch(size) {
      case 'sm': return 'text-2xl';
      case 'md': return 'text-4xl';
      case 'lg': return 'text-6xl';
      case 'xl': return 'text-7xl';
      case 'huge': return 'text-[6rem] md:text-[9rem]';
      default: return 'text-4xl';
    }
  };

  const baseClass = `select-none transition-all leading-none ${getSizeClass()} ${className}`;
  
  // SHADOW MODE: If true, make it black/blurry. If false, normal full color.
  const style = shadowMode ? { filter: 'brightness(0) blur(0px)', opacity: 0.8 } : {};

  // FALLBACK FOR UNKNOWN EMOJIS (When AI fails or offline dict misses)
  // If emoji is exactly the "Star" placeholder, render a Letter Avatar instead.
  if (item.emoji === "⭐") {
      const letter = item.english.charAt(0).toUpperCase();
      // Determine size in pixels for inline style scaling
      let bubbleSize = 'w-12 h-12 text-2xl';
      if (size === 'huge') bubbleSize = 'w-40 h-40 text-7xl border-8';
      if (size === 'lg') bubbleSize = 'w-20 h-20 text-4xl border-4';
      if (size === 'sm') bubbleSize = 'w-8 h-8 text-sm';

      return (
        <div className={`rounded-full bg-sky-100 border-sky-300 flex items-center justify-center font-black text-sky-600 shadow-sm ${bubbleSize} ${className}`} style={style}>
            {letter}
        </div>
      );
  }

  if (item.isPlural) {
    // PLURAL RENDERING: Cluster of 3 items
    // We use relative positioning to create a tight "pile" look
    if (size === 'huge') {
        return (
            <div className={`flex items-end justify-center gap-2 ${className}`} style={style}>
                <span className="transform -rotate-12 text-[6rem] md:text-[8rem]">{item.emoji}</span>
                <span className="transform translate-y-[-20px] z-10 text-[7rem] md:text-[9rem]">{item.emoji}</span>
                <span className="transform rotate-12 text-[6rem] md:text-[8rem]">{item.emoji}</span>
            </div>
        );
    }

    // Smaller sizes (Memory cards, bubbles, etc)
    return (
      <div className={`grid grid-cols-2 gap-0.5 items-center justify-center ${className}`} style={style}>
        <span className={`${getSizeClass()} transform -rotate-6`}>{item.emoji}</span>
        <span className={`${getSizeClass()} transform rotate-6`}>{item.emoji}</span>
        <span className={`${getSizeClass()} col-span-2 text-center -mt-2`}>{item.emoji}</span>
      </div>
    );
  }

  // SINGULAR RENDERING
  return (
    <div className={baseClass} style={style}>
      {item.emoji}
    </div>
  );
};