import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { playAudio } from '../../services/geminiService';
import { Button } from '../Button';
import { WordVisual } from '../WordVisual';
import { ArrowLeft, ArrowRight, Volume2, CheckCircle, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardsProps {
  items: VocabularyItem[];
  onExit: () => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ items, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const currentItem = items[currentIndex];

  const playCurrentAudio = () => {
    playAudio(currentItem.audioBase64, currentItem.english);
  };

  useEffect(() => {
    setFlipped(false);
    const timer = setTimeout(() => {
        playCurrentAudio();
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const nextCard = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="w-full h-full max-w-3xl mx-auto flex flex-col pb-2 md:pb-4">
      <div className="flex justify-between items-center mb-2 px-2">
        <Button variant="secondary" size="sm" onClick={onExit}>
          <Home size={24} />
        </Button>
        <span className="font-bold text-slate-400 text-lg md:text-2xl">
          {currentIndex + 1} / {items.length}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center perspective-1000 my-2 z-10 min-h-0">
        <div 
          className="relative w-full h-full max-h-[550px] cursor-pointer group preserve-3d transition-all duration-500"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          onClick={() => setFlipped(!flipped)}
        >
            {/* Front Side */}
            <div className="absolute inset-0 w-full h-full backface-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl bg-white border-4 md:border-8 border-sky-200 flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden">
                
                <div className="flex-1 flex items-center justify-center animate-bounce-slow">
                    <WordVisual item={currentItem} size="huge" />
                </div>
                
                <div className="flex flex-col items-center w-full">
                    <h2 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight text-center break-words w-full leading-tight">
                        {currentItem.english}
                    </h2>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); playCurrentAudio(); }}
                      className="mt-4 p-4 md:p-6 bg-sky-100 rounded-full text-sky-600 hover:bg-sky-200 transition-colors active:scale-95"
                    >
                      <Volume2 size={32} className="md:w-12 md:h-12" />
                    </button>
                </div>
                
                <p className="text-slate-300 mt-4 text-sm md:text-lg font-bold uppercase tracking-widest">Tap to flip</p>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[2rem] md:rounded-[3rem] shadow-2xl bg-yellow-50 border-4 md:border-8 border-yellow-200 flex flex-col items-center justify-center p-4 md:p-8">
                <div className="flex-1 flex flex-col items-center justify-center w-full overflow-y-auto scrollbar-hide">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-700 mb-6 md:mb-10 text-center leading-tight">
                        {currentItem.definition}
                    </h2>
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm w-full border-2 border-yellow-100">
                        <p className="text-2xl md:text-4xl text-slate-600 text-center italic font-medium">
                            "{currentItem.simpleSentence}"
                        </p>
                    </div>
                </div>
                <p className="text-slate-300 mt-4 text-sm md:text-lg font-bold uppercase tracking-widest">Tap to return</p>
            </div>
        </div>
      </div>

      <div className="flex justify-between mt-2 gap-4 z-20 px-2">
        <Button 
          onClick={prevCard} 
          disabled={currentIndex === 0}
          variant="secondary"
          size="lg"
          className="flex-1 py-4 md:py-6 text-lg md:text-xl"
        >
          <ArrowLeft size={24} className="md:w-8 md:h-8" /> Prev
        </Button>
        
        {currentIndex === items.length - 1 ? (
             <Button onClick={onExit} variant="success" size="lg" className="flex-1 py-4 md:py-6 text-lg md:text-xl">
                Finish <CheckCircle size={24} className="md:w-8 md:h-8" />
             </Button>
        ) : (
            <Button onClick={nextCard} size="lg" className="flex-1 py-4 md:py-6 text-lg md:text-xl">
                Next <ArrowRight size={24} className="md:w-8 md:h-8" />
            </Button>
        )}
      </div>
    </div>
  );
};