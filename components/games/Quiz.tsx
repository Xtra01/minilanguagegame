import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { playAudio } from '../../services/geminiService';
import { Button } from '../Button';
import { Home, Volume2, Star, Frown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizProps {
  items: VocabularyItem[];
  onExit: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ items, onExit }) => {
  const [round, setRound] = useState(0);
  const [options, setOptions] = useState<VocabularyItem[]>([]);
  const [target, setTarget] = useState<VocabularyItem | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);

  useEffect(() => {
    startRound(round);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const startRound = (currentRound: number) => {
    if (currentRound >= items.length) {
      return;
    }

    setFeedback('idle');
    const correctItem = items[currentRound];
    setTarget(correctItem);

    // Pick 2 distractors
    const distractors = items
      .filter(i => i.id !== correctItem.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const roundOptions = [...distractors, correctItem].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);

    // Play audio after a short delay
    setTimeout(() => {
        playAudio(correctItem.audioBase64, correctItem.english);
    }, 600);
  };

  const handleOptionClick = (item: VocabularyItem) => {
    if (feedback !== 'idle' || !target) return;

    if (item.id === target.id) {
      setFeedback('correct');
      setScore(s => s + 1);
      playAudio(target.audioBase64, target.english);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#fbbf24']
      });

      setTimeout(() => {
        setRound(r => r + 1);
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback('idle'), 1000);
    }
  };

  const replayAudio = () => {
    if (target) playAudio(target.audioBase64, target.english);
  };

  const renderEmojiContent = (item: VocabularyItem) => {
     if (item.isPlural) {
         return (
             <div className="flex gap-1 justify-center">
                 <span>{item.emoji}</span>
                 <span>{item.emoji}</span>
             </div>
         )
     }
     return <span>{item.emoji}</span>;
  }

  // End Screen
  if (round >= items.length) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-8xl mb-8">🏆</div>
            <h2 className="text-5xl font-bold text-slate-800 mb-6">Great Job!</h2>
            <p className="text-3xl text-slate-600 mb-12">
                Score: {score} / {items.length}
            </p>
            <Button onClick={onExit} size="lg" variant="success">
                Play Again
            </Button>
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <Button variant="secondary" size="md" onClick={onExit}>
          <Home size={24} />
        </Button>
        <div className="flex items-center gap-2 bg-yellow-100 px-6 py-3 rounded-full text-yellow-700 font-bold text-xl">
            <Star fill="currentColor" size={24}/> {score}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
         <div className="mb-12 text-center">
            <p className="text-slate-500 mb-6 text-2xl font-bold">Listen & Touch</p>
            <button 
                onClick={replayAudio}
                className="w-40 h-40 bg-sky-400 rounded-full flex items-center justify-center text-white shadow-xl border-b-8 border-sky-600 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all animate-pulse"
            >
                <Volume2 size={64} />
            </button>
         </div>

         <div className="grid grid-cols-3 gap-6 w-full">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => handleOptionClick(opt)}
                    className={`
                        h-48 rounded-3xl text-7xl flex items-center justify-center shadow-lg border-b-8 transition-all
                        ${feedback === 'correct' && opt.id === target?.id ? 'bg-green-500 border-green-700 text-white scale-105' : ''}
                        ${feedback === 'wrong' && opt.id !== target?.id ? 'opacity-40 scale-95' : ''}
                        ${feedback === 'idle' ? 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:-translate-y-2' : ''}
                    `}
                >
                    {feedback === 'correct' && opt.id === target?.id ? '🎉' : renderEmojiContent(opt)}
                </button>
            ))}
         </div>

         <div className="h-20 mt-10 flex items-center justify-center">
            {feedback === 'correct' && <span className="text-green-500 font-bold text-4xl animate-bounce">Awesome! Correct!</span>}
            {feedback === 'wrong' && <span className="text-red-400 font-bold text-3xl flex items-center gap-2">Try again <Frown size={32} /></span>}
         </div>
      </div>
    </div>
  );
};