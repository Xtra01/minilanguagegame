import React, { useState, useRef, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { playAudio } from '../../services/geminiService';
import { Button } from '../Button';
import { WordVisual } from '../WordVisual';
import { Home, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedMonsterProps {
  items: VocabularyItem[];
  onExit: () => void;
}

interface FoodItem {
  id: number;
  vocabItem: VocabularyItem;
  x: number;
  y: number;
}

export const FeedMonster: React.FC<FeedMonsterProps> = ({ items, onExit }) => {
  const [target, setTarget] = useState<VocabularyItem | null>(null);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [score, setScore] = useState(0);
  const [isEating, setIsEating] = useState(false);
  
  // Dragging
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const monsterRef = useRef<HTMLDivElement>(null);

  // Initialize Round
  const startRound = () => {
    setIsEating(false);
    
    // Pick a target
    const newTarget = items[Math.floor(Math.random() * items.length)];
    setTarget(newTarget);

    // Create options (1 correct + 2 distractors)
    const distractors = items.filter(i => i.id !== newTarget.id).sort(() => Math.random() - 0.5).slice(0, 2);
    const roundItems = [...distractors, newTarget].sort(() => Math.random() - 0.5);

    // Layout foods on the left side/shelf
    const newFoods = roundItems.map((item, index) => ({
        id: Date.now() + index,
        vocabItem: item,
        x: 20 + (index * 30), // Spaced out horizontally
        y: 70 // Near bottom
    }));
    
    setFoods(newFoods);

    setTimeout(() => {
        playAudio(newTarget.audioBase64, `I am hungry! I want... ${newTarget.english}!`);
    }, 500);
  };

  useEffect(() => {
    startRound();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drag Handlers (Simplified for brevity, similar to StickerWorld)
  const handleDragStart = (id: number) => setDraggingId(id);
  
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    // Update position (convert to %)
    const xPercent = ((clientX - rect.left) / rect.width) * 100;
    const yPercent = ((clientY - rect.top) / rect.height) * 100;

    setFoods(prev => prev.map(f => f.id === draggingId ? { ...f, x: xPercent, y: yPercent } : f));
  };

  const handleDragEnd = () => {
    if (!draggingId || !monsterRef.current || !target) {
        setDraggingId(null);
        return;
    }

    // Check collision with Monster Mouth
    const draggedFood = foods.find(f => f.id === draggingId);
    const monsterRect = monsterRef.current.getBoundingClientRect();
    // We need current mouse pos, but dragEnd event doesn't give it easily on touch. 
    // Instead we check the dragged element's last known position relative to container
    // Approximation: Monster is usually at Top Right or Center Right.
    
    // Let's use a simpler logic: Is the food > 60% X and < 50% Y? (Top Right Quadrant)
    if (draggedFood && draggedFood.x > 50 && draggedFood.y < 50) {
        if (draggedFood.vocabItem.id === target.id) {
            // Correct Feed!
            handleEat();
        } else {
            // Wrong Feed
            playAudio(undefined, "Yuck! No!");
            // Reset position
            setFoods(prev => prev.map(f => f.id === draggingId ? { ...f, y: 70 } : f));
        }
    } else {
        // Dropped into void, reset
        setFoods(prev => prev.map(f => f.id === draggingId ? { ...f, y: 70 } : f));
    }

    setDraggingId(null);
  };

  const handleEat = () => {
      setIsEating(true);
      playAudio(undefined, "Yummy!");
      setScore(s => s + 1);
      setFoods([]); // Clear food

      confetti({
          particleCount: 50,
          spread: 60,
          origin: { x: 0.8, y: 0.3 }
      });

      setTimeout(() => {
          startRound();
      }, 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-amber-50 rounded-xl overflow-hidden border-4 border-amber-200">
       <div className="p-4 flex justify-between items-center">
          <Button variant="secondary" size="sm" onClick={onExit}><Home size={20}/></Button>
          <div className="bg-white px-4 py-2 rounded-full font-bold text-amber-600 shadow-sm">
            Score: {score}
          </div>
       </div>

       <div 
         ref={containerRef}
         className="flex-1 relative w-full h-full touch-none"
         onMouseMove={handleDragMove}
         onMouseUp={handleDragEnd}
         onTouchMove={handleDragMove}
         onTouchEnd={handleDragEnd}
       >
           {/* MONSTER AREA */}
           <div 
             ref={monsterRef}
             className="absolute top-10 right-4 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center transition-transform duration-300"
             style={{ transform: isEating ? 'scale(1.2)' : 'scale(1)' }}
           >
               <div className="relative w-full h-full">
                   {/* Simple CSS Monster */}
                   <div className="absolute inset-0 bg-purple-500 rounded-[3rem] shadow-2xl border-b-8 border-purple-700 flex flex-col items-center justify-center p-4">
                       {/* Eyes */}
                       <div className="flex gap-4 mb-4">
                           <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                               <div className="w-3 h-3 bg-black rounded-full animate-bounce"></div>
                           </div>
                           <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                               <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{animationDelay: '100ms'}}></div>
                           </div>
                       </div>
                       {/* Mouth */}
                       <div className={`w-20 h-10 md:w-32 md:h-16 bg-black rounded-full transition-all duration-200 ${isEating ? 'h-20 rounded-[50%]' : ''} overflow-hidden border-4 border-purple-400`}>
                           {/* Teeth */}
                           <div className="flex justify-center gap-1">
                               <div className="w-4 h-4 bg-white rounded-b-full"></div>
                               <div className="w-4 h-4 bg-white rounded-b-full"></div>
                               <div className="w-4 h-4 bg-white rounded-b-full"></div>
                           </div>
                           {/* Tongue */}
                            <div className="w-10 h-6 bg-red-500 rounded-full mx-auto mt-2 animate-pulse"></div>
                       </div>
                   </div>
                   
                   {/* Speech Bubble */}
                   {!isEating && target && (
                       <div className="absolute -top-8 -left-12 bg-white p-3 rounded-xl rounded-br-none shadow-lg border-2 border-slate-100 animate-bounce-slow">
                           <p className="text-sm font-bold text-slate-400 uppercase">I want...</p>
                           <p className="text-2xl font-black text-purple-600">{target.english}</p>
                       </div>
                   )}
               </div>
           </div>

           {/* DRAGGABLE FOODS */}
           {foods.map(food => (
               <div
                 key={food.id}
                 onMouseDown={() => handleDragStart(food.id)}
                 onTouchStart={() => handleDragStart(food.id)}
                 className={`absolute w-24 h-24 flex items-center justify-center cursor-grab active:cursor-grabbing active:scale-125 transition-transform
                    ${draggingId === food.id ? 'z-50' : 'z-10'}
                 `}
                 style={{
                     left: `${food.x}%`,
                     top: `${food.y}%`,
                     transform: 'translate(-50%, -50%)' // Center pivot
                 }}
               >
                   <div className="bg-white p-2 rounded-full shadow-lg border-4 border-amber-100">
                        <WordVisual item={food.vocabItem} size="lg" />
                   </div>
               </div>
           ))}

           {/* Shelf Graphic */}
           <div className="absolute bottom-10 left-0 right-0 h-4 bg-amber-800/20 rounded-full mx-8 blur-sm z-0 pointer-events-none"></div>
       </div>
    </div>
  );
};