import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { playAudio } from '../../services/geminiService';
import { Button } from '../Button';
import { WordVisual } from '../WordVisual';
import { Home, Star, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShadowMatchProps {
  items: VocabularyItem[];
  onExit: () => void;
}

export const ShadowMatch: React.FC<ShadowMatchProps> = ({ items, onExit }) => {
  const [currentItem, setCurrentItem] = useState<VocabularyItem | null>(null);
  const [options, setOptions] = useState<VocabularyItem[]>([]);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    nextRound();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextRound = () => {
    setIsCorrect(false);
    const target = items[Math.floor(Math.random() * items.length)];
    setCurrentItem(target);

    // Create 2 distractors + target
    const distractors = items
        .filter(i => i.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
    
    const roundOptions = [...distractors, target].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);

    setTimeout(() => {
        playAudio(undefined, `Find the... ${target.english}`);
    }, 600);
  };

  const handleChoice = (item: VocabularyItem) => {
    if (!currentItem || isCorrect) return;

    if (item.id === currentItem.id) {
      setIsCorrect(true);
      setScore(s => s + 1);
      playAudio(currentItem.audioBase64, `Yes! ${currentItem.english}`);
      
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#A78BFA']
      });

      setTimeout(nextRound, 2000);
    } else {
      playAudio(undefined, "Try again!");
    }
  };

  if (!currentItem) return null;

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <Button variant="secondary" size="sm" onClick={onExit}>
            <Home size={24} />
            </Button>
            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full text-purple-700 font-bold border-2 border-purple-200">
                <Star fill="currentColor" className="text-yellow-400" /> {score}
            </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8">
            
            <h3 className="text-slate-500 font-bold text-2xl animate-bounce-slow">
                {isCorrect ? "You found it!" : "Which one matches the shadow?"}
            </h3>

            {/* The Shadow Target Container */}
            <div className="relative w-72 h-72 bg-gradient-to-b from-white to-slate-50 rounded-[3rem] shadow-2xl flex items-center justify-center border-[12px] border-slate-200 overflow-hidden">
                {/* Question Mark overlay if not solved yet */}
                {!isCorrect && (
                    <div className="absolute top-4 right-4 text-slate-300">
                        <HelpCircle size={32} />
                    </div>
                )}

                <div className={`transition-all duration-700 flex items-center justify-center w-full h-full
                    ${isCorrect ? 'filter-none scale-110' : 'scale-90'}
                `}>
                    {/* CRITICAL: Ensure WordVisual handles Shadow Mode correctly */}
                    <WordVisual 
                        item={currentItem} 
                        size="huge" 
                        shadowMode={!isCorrect}
                    />
                </div>
                
                {isCorrect && (
                    <div className="absolute -bottom-6 bg-green-500 text-white px-8 py-2 rounded-full font-bold text-xl shadow-lg animate-bounce">
                        {currentItem.english}
                    </div>
                )}
            </div>

            {/* Options Area */}
            <div className="grid grid-cols-3 gap-4 w-full mt-8">
                {options.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => handleChoice(opt)}
                        className={`
                            h-36 rounded-3xl bg-white border-b-[8px] shadow-lg transition-all flex items-center justify-center overflow-hidden p-2
                            hover:-translate-y-2 hover:border-b-[12px] active:translate-y-0 active:border-b-4
                            ${isCorrect && opt.id !== currentItem.id ? 'opacity-20 grayscale border-slate-100 scale-90' : 'border-slate-200 hover:border-purple-300'}
                            ${isCorrect && opt.id === currentItem.id ? 'bg-green-100 border-green-500 ring-4 ring-green-300' : ''}
                        `}
                    >
                        <WordVisual item={opt} size="lg" />
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};