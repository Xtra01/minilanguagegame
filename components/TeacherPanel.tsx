
import React, { useState, useEffect } from 'react';
import { generateLessonContent, generateWordAudio } from '../services/geminiService';
import { VocabularyItem, LoadingState } from '../types';
import { PRESET_CURRICULUM, Level } from '../services/curriculumData'; // Import Curriculum
import { Button } from './Button';
import { Sparkles, BookOpen, Loader2, PlayCircle, Wifi, WifiOff, LayoutGrid, ChevronRight } from 'lucide-react';

interface TeacherPanelProps {
  onLessonCreated: (items: VocabularyItem[]) => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({ onLessonCreated }) => {
  const [inputWords, setInputWords] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [progress, setProgress] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const handlePresetClick = (level: Level) => {
    setInputWords(level.words);
  };

  const handleGenerate = async () => {
    if (!inputWords.trim()) return;

    try {
      setStatus(LoadingState.GENERATING_PLAN);
      setProgress(isOnline ? "AI Creating word world..." : "Accessing Offline Dictionary...");
      
      // 1. Generate Structure
      const items = await generateLessonContent(inputWords);
      
      setStatus(LoadingState.GENERATING_AUDIO);
      
      if (isOnline && process.env.API_KEY) {
        setProgress(`Generating Audio... (Please wait)`);
        
        // 2. Generate Audio in Parallel (Much Faster)
        const itemPromises = items.map(async (item) => {
            try {
                const audio = await generateWordAudio(item.english);
                return { ...item, audioBase64: audio };
            } catch (e) {
                console.warn(`Failed to gen audio for ${item.english}`, e);
                return item; // Fallback to no audio (native TTS will handle it)
            }
        });

        const itemsWithAudio = await Promise.all(itemPromises);
        onLessonCreated(itemsWithAudio);
      } else {
        // Offline: Skip audio generation, we will use TTS on the fly
        setProgress("Finalizing Offline Lesson...");
        setTimeout(() => {
            onLessonCreated(items); // Pass items without base64 audio
        }, 500);
      }

      setStatus(LoadingState.READY);

    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
      setProgress("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-[2rem] shadow-xl border-4 border-sky-100">
      <div className="flex justify-end mb-2">
        {isOnline ? (
            <span className="text-xs font-bold text-green-500 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <Wifi size={12} /> Online AI Active
            </span>
        ) : (
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                <WifiOff size={12} /> Offline Mode
            </span>
        )}
      </div>

      <div className="text-center mb-8">
        <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-sky-600 shadow-inner">
          <BookOpen size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Teacher Panel</h2>
        <p className="text-slate-500">Design the learning journey for today.</p>
      </div>

      {/* QUICK CURRICULUM SELECTOR */}
      <div className="mb-8">
         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <LayoutGrid size={16} /> Quick Start Curriculum (Ages 4-5)
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRESET_CURRICULUM.map((level) => (
                <button
                    key={level.id}
                    onClick={() => handlePresetClick(level)}
                    className={`p-4 rounded-2xl border-b-4 text-left transition-all hover:-translate-y-1 active:translate-y-0 active:border-b-0 flex items-start gap-4 group ${level.color}`}
                >
                    <span className="text-3xl bg-white/50 w-12 h-12 flex items-center justify-center rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        {level.icon}
                    </span>
                    <div>
                        <div className="font-bold text-lg flex items-center gap-2">
                            {level.title}
                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-sm opacity-80 font-medium">{level.description}</div>
                    </div>
                </button>
            ))}
         </div>
      </div>

      <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
            Custom Word List
          </label>
          <textarea
            className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-sky-400 focus:ring-0 transition-colors text-lg shadow-inner min-h-[120px]"
            rows={3}
            placeholder={isOnline ? "Select a level above OR type words here: Apple, Red, Cat..." : "Offline Mode: Use simple words like 'Cat', 'Dog', 'Red', 'One'..."}
            value={inputWords}
            onChange={(e) => setInputWords(e.target.value)}
            disabled={status !== LoadingState.IDLE && status !== LoadingState.ERROR}
          />
        </div>

        {status === LoadingState.ERROR && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
            {progress}
          </div>
        )}

        <Button 
          onClick={handleGenerate} 
          disabled={!inputWords || (status !== LoadingState.IDLE && status !== LoadingState.ERROR)}
          size="lg"
          className="w-full py-5 text-xl shadow-lg shadow-sky-200"
        >
          {status !== LoadingState.IDLE && status !== LoadingState.ERROR ? (
            <>
              <Loader2 className="animate-spin" />
              {progress}
            </>
          ) : (
            <>
              <Sparkles size={24} />
              {isOnline ? 'Generate AI Lesson' : 'Create Offline Lesson'}
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-8 text-center">
         <p className="text-xs text-slate-400 font-medium">
            MiniLingo Educational Engine v1.1 • Powered by Gemini 2.5 Flash
         </p>
      </div>
    </div>
  );
};
