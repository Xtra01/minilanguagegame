import React, { useState, useRef } from 'react';
import { VocabularyItem } from '../../types';
import { playAudio } from '../../services/geminiService';
import { Button } from '../Button';
import { WordVisual } from '../WordVisual';
import { Home, Trash2, Camera, Image as ImageIcon, Plus, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StickerWorldProps {
  items: VocabularyItem[];
  onExit: () => void;
}

interface Sticker {
  uniqueId: number;
  vocabItem: VocabularyItem;
  x: number; // percent
  y: number; // percent
  scale: number;
}

const BACKGROUNDS = [
  { id: 'park', name: 'Park', color: 'from-sky-300 to-green-400', emoji: '🌳' },
  { id: 'beach', name: 'Beach', color: 'from-sky-300 to-yellow-200', emoji: '🏖️' },
  { id: 'space', name: 'Space', color: 'from-indigo-900 to-purple-800', emoji: '🚀' },
  { id: 'room', name: 'Room', color: 'from-amber-50 to-amber-100', emoji: '🏠' },
];

export const StickerWorld: React.FC<StickerWorldProps> = ({ items, onExit }) => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Pointer Tracking
  const canvasRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{ id: number; startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  // --- ACTIONS ---

  const addSticker = (item: VocabularyItem) => {
    const newSticker: Sticker = {
      uniqueId: Date.now(),
      vocabItem: item,
      x: 50, // Center
      y: 50, // Center
      scale: 1,
    };
    setStickers(prev => [...prev, newSticker]);
    setSelectedId(newSticker.uniqueId);
    playAudio(item.audioBase64, item.english);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setStickers(prev => prev.filter(s => s.uniqueId !== selectedId));
      setSelectedId(null);
      playAudio(undefined, "Pop!");
    }
  };

  const scaleSelected = (delta: number) => {
    if (selectedId) {
      setStickers(prev => prev.map(s => {
        if (s.uniqueId === selectedId) {
          const newScale = Math.max(0.5, Math.min(3, s.scale + delta));
          return { ...s, scale: newScale };
        }
        return s;
      }));
    }
  };

  const takeSnapshot = () => {
    // Visual effect only
    const flash = document.createElement('div');
    flash.className = 'fixed inset-0 bg-white z-[100] transition-opacity duration-500 pointer-events-none';
    document.body.appendChild(flash);
    
    playAudio(undefined, "Click!");
    
    setTimeout(() => {
        flash.style.opacity = '0';
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        setTimeout(() => document.body.removeChild(flash), 500);
    }, 50);
  };

  const changeBackground = () => {
    setBgIndex(prev => (prev + 1) % BACKGROUNDS.length);
  };

  // --- POINTER EVENTS (Touch & Mouse unified) ---

  const handlePointerDown = (e: React.PointerEvent, stickerId: number) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent scrolling on touch
    const sticker = stickers.find(s => s.uniqueId === stickerId);
    if (!sticker) return;

    setSelectedId(stickerId);
    playAudio(sticker.vocabItem.audioBase64, sticker.vocabItem.english);

    draggingRef.current = {
      id: stickerId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: sticker.x,
      initialY: sticker.y
    };
    
    // Capture pointer to track outside element bounds
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !canvasRef.current) return;
    e.preventDefault();

    // CRITICAL FIX: Destructure ID here. draggingRef.current might be null inside the setState callback later.
    const { id, startX, startY, initialX, initialY } = draggingRef.current;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Calculate delta in percentage relative to canvas size
    const deltaX = ((e.clientX - startX) / canvasRect.width) * 100;
    const deltaY = ((e.clientY - startY) / canvasRect.height) * 100;

    const newX = initialX + deltaX;
    const newY = initialY + deltaY;

    // Update state (using functional update for performance)
    setStickers(prev => prev.map(s => 
      s.uniqueId === id // Use captured 'id' variable
        ? { ...s, x: newX, y: newY } 
        : s
    ));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    draggingRef.current = null;
  };

  const handleCanvasClick = () => {
    // Deselect if clicking empty space (but not if dragging ended)
    if (!draggingRef.current) {
        setSelectedId(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-100">
      
      {/* TOP BAR */}
      <div className="flex-none h-16 bg-white shadow-sm flex items-center justify-between px-4 z-20">
        <Button variant="secondary" size="sm" onClick={onExit}>
          <Home size={20} />
        </Button>

        <div className="flex gap-2">
           <button 
             onClick={changeBackground}
             className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold hover:bg-indigo-200 transition-colors"
           >
             <ImageIcon size={18} />
             <span className="hidden sm:inline">{BACKGROUNDS[bgIndex].name}</span>
           </button>
           
           <button 
             onClick={takeSnapshot}
             className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition-colors"
             title="Save Picture"
           >
             <Camera size={24} />
           </button>
        </div>
      </div>

      {/* MAIN STAGE */}
      <div className="flex-1 relative overflow-hidden p-4">
        <div 
            ref={canvasRef}
            onClick={handleCanvasClick}
            className={`w-full h-full rounded-[2rem] shadow-inner relative overflow-hidden bg-gradient-to-b ${BACKGROUNDS[bgIndex].color} transition-colors duration-700 touch-none`}
        >
            {/* Background Decorative Icon */}
            <div className="absolute bottom-4 right-4 text-[8rem] opacity-20 pointer-events-none select-none">
                {BACKGROUNDS[bgIndex].emoji}
            </div>

            {/* Instructions if empty */}
            {stickers.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 pointer-events-none select-none">
                    <p className="text-3xl font-bold uppercase tracking-widest">Create your world</p>
                    <p className="text-lg">👇 Tap stickers below 👇</p>
                </div>
            )}

            {/* STICKERS RENDER */}
            {stickers.map(sticker => {
               const isSelected = sticker.uniqueId === selectedId;
               return (
                 <div
                    key={sticker.uniqueId}
                    onPointerDown={(e) => handlePointerDown(e, sticker.uniqueId)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className={`absolute flex flex-col items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing
                        ${isSelected ? 'z-50' : 'z-10'}
                    `}
                    style={{
                        left: `${sticker.x}%`,
                        top: `${sticker.y}%`,
                        transform: `translate(-50%, -50%) scale(${sticker.scale})`,
                    }}
                 >
                    {/* Selection UI */}
                    {isSelected && (
                        <div className="absolute -top-12 flex gap-2 animate-bounce-slow pointer-events-auto">
                             <button 
                                onPointerDown={(e) => { e.stopPropagation(); deleteSelected(); }}
                                className="bg-red-500 text-white p-1 rounded-full shadow-lg hover:scale-110"
                             >
                                <Trash2 size={20} />
                             </button>
                             <div className="flex bg-white rounded-full shadow-lg overflow-hidden">
                                <button 
                                   onPointerDown={(e) => { e.stopPropagation(); scaleSelected(-0.2); }}
                                   className="p-1 hover:bg-slate-100 border-r"
                                >
                                   <Minus size={20} className="text-slate-600"/>
                                </button>
                                <button 
                                   onPointerDown={(e) => { e.stopPropagation(); scaleSelected(0.2); }}
                                   className="p-1 hover:bg-slate-100"
                                >
                                   <Plus size={20} className="text-slate-600"/>
                                </button>
                             </div>
                        </div>
                    )}

                    {/* The Visual */}
                    <div className={`transition-all ${isSelected ? 'drop-shadow-2xl filter brightness-110' : 'drop-shadow-md'}`}>
                        <WordVisual item={sticker.vocabItem} size="huge" />
                    </div>
                    
                    {/* Selection Ring */}
                    {isSelected && (
                        <div className="absolute inset-[-10px] border-4 border-dashed border-sky-400/50 rounded-full animate-pulse pointer-events-none"></div>
                    )}
                 </div>
               );
            })}
        </div>
      </div>

      {/* BOTTOM PALETTE */}
      <div className="flex-none h-28 bg-white border-t-4 border-slate-100 z-20 flex flex-col">
         <div className="flex-1 overflow-x-auto overflow-y-hidden scroll-container px-4 flex items-center gap-4">
            {items.map(item => (
                <button
                   key={item.id}
                   onClick={() => addSticker(item)}
                   className="relative shrink-0 w-20 h-20 bg-slate-50 rounded-2xl border-2 border-slate-200 flex items-center justify-center hover:bg-sky-50 hover:border-sky-300 hover:-translate-y-1 transition-all group"
                >
                    <span className="text-4xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                    <span className="absolute bottom-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate w-full px-1">
                        {item.english}
                    </span>
                    {/* Plural Badge */}
                    {item.isPlural && (
                        <div className="absolute -top-2 -right-2 bg-sky-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                            Many
                        </div>
                    )}
                </button>
            ))}
            {/* Spacer for scroll */}
            <div className="w-4"></div>
         </div>
      </div>

    </div>
  );
};