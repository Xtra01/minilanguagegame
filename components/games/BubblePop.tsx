import React, { useState, useEffect, useRef } from 'react';
import { VocabularyItem } from '../../types';
import { playAudio } from '../../services/geminiService';
import { Button } from '../Button';
import { WordVisual } from '../WordVisual';
import { Home, Play, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BubblePopProps {
  items: VocabularyItem[];
  onExit: () => void;
}

interface Bubble {
  id: number;
  vocabItem: VocabularyItem;
  x: number; // percent 0-100
  y: number; // percent 0-100
  speed: number;
  scale: number;
  isPopped: boolean;
}

export const BubblePop: React.FC<BubblePopProps> = ({ items, onExit }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetItem, setTargetItem] = useState<VocabularyItem | null>(null);
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  
  // Refs for game loop
  const requestRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);
  const bubblesRef = useRef<Bubble[]>([]); // Mutable ref for smooth loop updates
  const targetItemRef = useRef<VocabularyItem | null>(null); // Fix for stale closure

  const startGame = () => {
    if (!items || items.length === 0) {
        console.warn("No items to play with!");
        return;
    }
    setIsPlaying(true);
    setScore(0);
    bubblesRef.current = [];
    setBubbles([]);
    
    // Start Loop
    lastSpawnRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);

    // Pick first target after a slight delay so bubbles can spawn
    setTimeout(() => pickNewTarget(), 1500);
  };

  const stopGame = () => {
    setIsPlaying(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const pickNewTarget = () => {
    if (items.length === 0) return;
    // Pick random
    const randomTarget = items[Math.floor(Math.random() * items.length)];
    setTargetItem(randomTarget);
    targetItemRef.current = randomTarget; // Sync Ref
    playAudio(randomTarget.audioBase64, `Pop the... ${randomTarget.english}!`);
  };

  const spawnBubble = (forceItem?: VocabularyItem) => {
    if (items.length === 0) return;
    const item = forceItem || items[Math.floor(Math.random() * items.length)];
    
    if (!item) return; // Safety

    const size = Math.random() * 0.3 + 0.8; // 0.8 to 1.1
    
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      vocabItem: item,
      x: Math.random() * 80 + 10, // 10% to 90% width
      y: 110, // Start below screen
      speed: (Math.random() * 0.1 + 0.1), // Slow float up
      scale: size,
      isPopped: false
    };

    bubblesRef.current.push(newBubble);
  };

  const gameLoop = (time: number) => {
    // 1. Spawn Logic
    if (time - lastSpawnRef.current > 1000) { // Spawn every second
       // Ensure the target is on screen periodically
       const currentTarget = targetItemRef.current;
       if (currentTarget && Math.random() > 0.7) {
          // 30% chance to spawn the target specifically if it's missing
          const targetExists = bubblesRef.current.some(b => b.vocabItem.id === currentTarget.id && !b.isPopped && b.y > 0 && b.y < 100);
          if (!targetExists) {
              spawnBubble(currentTarget);
          } else {
              spawnBubble();
          }
       } else {
          spawnBubble();
       }
       lastSpawnRef.current = time;
    }

    // 2. Move Bubbles
    bubblesRef.current.forEach(b => {
        if (!b.isPopped) {
            b.y -= b.speed;
        }
    });

    // 3. Cleanup
    bubblesRef.current = bubblesRef.current.filter(b => b.y > -20); // Keep until fully off top

    // 4. Sync State (throttled slightly if needed, but for < 50 items React is fine)
    setBubbles([...bubblesRef.current]);

    if (isPlaying) { // Only continue if playing (Ref is not enough if stopGame sets playing false but loop runs once more)
        requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    // Update Ref if target changes externally (though we set it in pickNewTarget)
    targetItemRef.current = targetItem;
  }, [targetItem]);

  useEffect(() => {
    return () => stopGame();
  }, []);

  const handlePop = (bubble: Bubble) => {
    if (bubble.isPopped || !targetItem) return;

    if (bubble.vocabItem.id === targetItem.id) {
        // Correct
        playAudio(undefined, "Pop!");
        setScore(s => s + 1);
        
        // Mark popped
        const index = bubblesRef.current.findIndex(b => b.id === bubble.id);
        if (index !== -1) {
            bubblesRef.current[index].isPopped = true;
        }

        // Confetti at click position (approximated center of screen if specific coords hard)
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { x: bubble.x / 100, y: Math.max(0.1, bubble.y / 100) }
        });

        // New Target
        setTimeout(pickNewTarget, 1000);
    } else {
        // Wrong
        playAudio(undefined, "Oh no!");
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gradient-to-b from-cyan-200 to-blue-400 overflow-hidden rounded-xl shadow-2xl border-4 border-cyan-500">
      
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20 pointer-events-none">
        <div className="pointer-events-auto">
            <Button variant="secondary" size="sm" onClick={onExit}><Home size={20}/></Button>
        </div>

        {isPlaying && targetItem && (
            <div className="bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg flex flex-col items-center animate-bounce-slow pointer-events-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pop This:</span>
                <div className="flex items-center gap-3">
                    <button onClick={() => playAudio(targetItem.audioBase64, targetItem.english)}>
                        <Volume2 className="text-cyan-600 w-6 h-6" />
                    </button>
                    <span className="text-2xl font-black text-slate-800">{targetItem.english}</span>
                    {/* Small hint visual */}
                    <WordVisual item={targetItem} size="sm" className="ml-2 opacity-50" />
                </div>
            </div>
        )}

        <div className="bg-yellow-400 text-white font-black text-2xl px-4 py-2 rounded-2xl shadow-lg border-2 border-yellow-500">
            {score}
        </div>
      </div>

      {/* START SCREEN */}
      {!isPlaying && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full animate-bounce-slow border-8 border-cyan-200">
                <div className="text-7xl mb-4">🫧</div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Bubble Pop</h2>
                <p className="text-slate-500 mb-6">Find the correct bubble!</p>
                <Button onClick={startGame} size="lg" className="w-full text-xl py-4">
                    <Play fill="currentColor" /> Start Game
                </Button>
            </div>
        </div>
      )}

      {/* GAME LAYER */}
      <div className="flex-1 relative w-full h-full">
         {bubbles.map(bubble => (
             !bubble.isPopped && (
                 <div
                    key={bubble.id}
                    onClick={(e) => { e.stopPropagation(); handlePop(bubble); }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer active:scale-90 transition-transform touch-manipulation"
                    style={{
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        width: '120px',
                        height: '120px',
                        transform: `scale(${bubble.scale})`,
                        zIndex: 10
                    }}
                 >
                    <div className="w-full h-full rounded-full bg-cyan-100/40 border-2 border-white/60 shadow-[inset_0_0_20px_rgba(255,255,255,0.8)] backdrop-blur-sm flex items-center justify-center relative overflow-hidden group">
                        {/* Shine */}
                        <div className="absolute top-4 left-4 w-8 h-4 bg-white/80 rounded-full rotate-[-45deg] blur-[2px]"></div>
                        
                        {/* Content */}
                        <div className="pointer-events-none drop-shadow-md">
                            <WordVisual item={bubble.vocabItem} size="lg" />
                        </div>
                    </div>
                 </div>
             )
         ))}
      </div>

    </div>
  );
};