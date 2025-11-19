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