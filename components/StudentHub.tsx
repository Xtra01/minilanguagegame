import React from 'react';
import { GameMode, VocabularyItem } from '../types';
import { Button } from './Button';
import { GraduationCap, HelpCircle, Grid, ArrowLeft, Zap, Palette, Moon, Utensils } from 'lucide-react';

interface StudentHubProps {
  items: VocabularyItem[];
  onSelectGame: (mode: GameMode) => void;
  onBack: () => void;
}

export const StudentHub: React.FC<StudentHubProps> = ({ items, onSelectGame, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto text-center pb-8">
      <div className="mb-6 relative">
         <Button variant="secondary" size="sm" onClick={onBack} className="absolute left-0 top-2">
            <ArrowLeft size={20} /> Teacher
         </Button>
         <h1 className="text-4xl md:text-5xl font-bold text-sky-600 mb-2 pt-2">Game Time!</h1>
         <p className="text-xl text-slate-500">Total {items.length} new words</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 p-4">
        {/* Card 1: Flashcards */}
        <button 
          onClick={() => onSelectGame('FLASHCARDS')}
          className="group bg-white p-6 rounded-[2rem] shadow-lg hover:shadow-xl transition-all border-b-8 border-orange-400 hover:translate-y-[-5px] active:translate-y-0 active:border-b-0"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <GraduationCap size={32} className="text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-1">Learn Cards</h3>
          <p className="text-sm text-slate-400">Start here</p>
        </button>

        {/* Card 2: Quiz */}
        <button 
          onClick={() => onSelectGame('QUIZ')}
          className="group bg-white p-6 rounded-[2rem] shadow-lg hover:shadow-xl transition-all border-b-8 border-purple-400 hover:translate-y-[-5px] active:translate-y-0 active:border-b-0"
        >
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <HelpCircle size={32} className="text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-1">Listen & Find</h3>
          <p className="text-sm text-slate-400">Test yourself</p>
        </button>

        {/* Card 3: Memory */}
        <button 
          onClick={() => onSelectGame('MEMORY')}
          className="group bg-white p-6 rounded-[2rem] shadow-lg hover:shadow-xl transition-all border-b-8 border-green-400 hover:translate-y-[-5px] active:translate-y-0 active:border-b-0"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Grid size={32} className="text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-1">Memory</h3>
          <p className="text-sm text-slate-400">Match pairs</p>
        </button>

        {/* Card 4: Bubble Pop */}
        <button 
          onClick={() => onSelectGame('BUBBLE_POP')}
          className="group bg-white p-6 rounded-[2rem] shadow-lg hover:shadow-xl transition-all border-b-8 border-sky-400 hover:translate-y-[-5px] active:translate-y-0 active:border-b-0"
        >
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Zap size={32} className="text-sky-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-1">Bubble Pop</h3>
          <p className="text-sm text-slate-400">Be fast!</p>
        </button>

        {/* Card 5: Shadow Match */}
        <button 
          onClick={() => onSelectGame('SHADOW_MATCH')}
          className="group bg-white p-6 rounded-[2rem] shadow-lg hover:shadow-xl transition-all border-b-8 border-slate-600 hover:translate-y-[-5px] active:translate-y-0 active:border-b-0"
        >
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Moon size={32} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-1">Shadow Match</h3>
          <p className="text-sm text-slate-400">Find the shape</p>
        </button>

        {/* Card 6: Feed The Monster (NEW) */}
        <button 
          onClick={() => onSelectGame('FEED_MONSTER')}
          className="group bg-white p-6 rounded-[2rem] shadow-lg hover:shadow-xl transition-all border-b-8 border-amber-400 hover:translate-y-[-5px] active:translate-y-0 active:border-b-0"
        >
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Utensils size={32} className="text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-1">Feed Monster</h3>
          <p className="text-sm text-slate-400">Drag & Eat</p>
        </button>

        {/* Card 7: Sticker World */}
        <button 
          onClick={() => onSelectGame('STICKER_WORLD')}
          className="group bg-white p-6 rounded-[2rem] shadow-lg hover:shadow-xl transition-all border-b-8 border-pink-400 hover:translate-y-[-5px] active:translate-y-0 active:border-b-0"
        >
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Palette size={32} className="text-pink-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-1">Sticker World</h3>
          <p className="text-sm text-slate-400">Create stories</p>
        </button>
      </div>
    </div>
  );
};