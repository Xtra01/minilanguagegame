import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { playAudio } from '../../services/geminiService';
import { Button } from '../Button';
import { WordVisual } from '../WordVisual';
import { Home, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemoryProps {
  items: VocabularyItem[];
  onExit: () => void;
}

interface Card {
  id: string; 
  vocabId: string;
  isFlipped: boolean;
  isMatched: boolean;
  vocabItem: VocabularyItem;
}

export const Memory: React.FC<MemoryProps> = ({ items, onExit }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);

  const initializeGame = () => {
    // Use 6 pairs (12 cards) max to fit nicely on screens
    const gameItems = items.slice(0, 6); 
    
    const pair1 = gameItems.map((item, i) => ({
      id: `p1-${i}`,
      vocabId: item.id,
      isFlipped: false,
      isMatched: false,
      vocabItem: item
    }));
    
    const pair2 = gameItems.map((item, i) => ({
      id: `p2-${i}`,
      vocabId: item.id,
      isFlipped: false,
      isMatched: false,
      vocabItem: item
    }));

    const shuffled = [...pair1, ...pair2].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCount(0);
  };

  useEffect(() => {
    initializeGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = (clickedCard: Card) => {
    if (clickedCard.isMatched || clickedCard.isFlipped || flippedCards.length >= 2) return;

    const newCards = cards.map(c => c.id === clickedCard.id ? { ...c, isFlipped: true } : c);
    setCards(newCards);
    
    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (first.vocabId === second.vocabId) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.vocabId === first.vocabId ? { ...c, isMatched: true } : c
          ));
          setFlippedCards([]);
          setMatchedCount(prev => prev + 1);
          
          playAudio(first.vocabItem.audioBase64, first.vocabItem.english);

          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.5 },
            colors: ['#f472b6', '#60a5fa']
          });

        }, 500);
      } else {
        // No Match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  if (matchedCount === Math.min(items.length, 6) && matchedCount > 0) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-7xl mb-6 animate-bounce">🏆</div>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">You Won!</h2>
            <div className="flex gap-4 mt-8">
                <Button onClick={initializeGame} variant="primary" size="lg">
                    <RotateCcw /> Restart
                </Button>
                <Button onClick={onExit} variant="secondary" size="lg">
                    <Home /> Exit
                </Button>
            </div>
        </div>
     )
  }

  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto pb-2">
       <div className="flex justify-between items-center mb-4 px-2">
        <Button variant="secondary" size="sm" onClick={onExit}>
          <Home size={20} />
        </Button>
        <Button variant="secondary" size="sm" onClick={initializeGame}>
          <RotateCcw size={20} />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 w-full max-h-full auto-rows-fr aspect-[3/4] md:aspect-[4/3] max-w-[600px] md:max-w-full">
            {cards.map(card => (
                <div 
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className="relative w-full h-full min-h-[80px] cursor-pointer perspective-1000 group"
                >
                    <div className={`relative w-full h-full duration-300 preserve-3d transition-all ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                        
                        {/* BACK (Hidden) */}
                        <div className="absolute inset-0 w-full h-full bg-sky-400 rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center backface-hidden border-b-4 border-sky-600 active:border-b-0 active:translate-y-1 transition-all">
                            <span className="text-sky-100 text-3xl md:text-4xl font-bold">?</span>
                        </div>

                        {/* FRONT (Visible) */}
                        <div className={`absolute inset-0 w-full h-full bg-white rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center rotate-y-180 backface-hidden border-b-4 overflow-hidden p-1 ${card.isMatched ? 'border-green-400 bg-green-50' : 'border-slate-200'}`}>
                            <div className={card.isMatched ? 'animate-bounce' : ''}>
                                {/* Use WordVisual for consistent singular/plural rendering */}
                                <WordVisual item={card.vocabItem} size="lg" />
                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};