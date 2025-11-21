
import React, { useState, useEffect } from 'react';
import { VocabularyItem, GameMode } from './types';
import { TeacherPanel } from './components/TeacherPanel';
import { StudentHub } from './components/StudentHub';
import { Flashcards } from './components/games/Flashcards';
import { Quiz } from './components/games/Quiz';
import { Memory } from './components/games/Memory';
import { BubblePop } from './components/games/BubblePop';
import { ShadowMatch } from './components/games/ShadowMatch';
import { StickerWorld } from './components/games/StickerWorld';
import { FeedMonster } from './components/games/FeedMonster';
import { Maximize2, Minimize2, Download, X, Lock } from 'lucide-react';
import { Button } from './components/Button';

const APP_VERSION = '1.3.0';

export default function App() {
  const [mode, setMode] = useState<GameMode>('DASHBOARD');
  const [lessonItems, setLessonItems] = useState<VocabularyItem[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supportsFullscreenAPI, setSupportsFullscreenAPI] = useState(true);
  
  // Download/Admin States
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Check browser capabilities on mount
  useEffect(() => {
    // iOS Safari often doesn't support standard requestFullscreen on elements
    if (typeof document.documentElement.requestFullscreen !== 'function') {
        setSupportsFullscreenAPI(false);
    }
  }, []);

  // Helper to determine if we are in a "Game" mode (fixed viewport) or "UI" mode (scrollable)
  const isGameMode = mode !== 'DASHBOARD' && mode !== 'MENU';

  const toggleFullscreen = () => {
    if (!supportsFullscreenAPI) return;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleLessonCreated = (items: VocabularyItem[]) => {
    setLessonItems(items);
    setMode('MENU');
  };

  const handleExitGame = () => {
    setMode('MENU');
  };

  const handleBackToTeacher = () => {
    setMode('DASHBOARD');
    setLessonItems([]);
  };

  // Password Logic
  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true);
    setPasswordInput('');
    setPasswordError(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '9090') {
      // Password Correct
      setIsDownloadModalOpen(false);
      triggerFakeDownload();
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  const triggerFakeDownload = () => {
    const element = document.createElement("a");
    const fileContent = `
MINILINGO OFFLINE PACKAGE
================================
Version: ${APP_VERSION}

Great! You have authorized the download.

OFFLINE CAPABILITIES ENABLED:
1. Local Dictionary: The app now contains a database of common words.
2. Offline TTS: When offline, the app uses the Windows/SmartBoard native voice.
3. Fallback Mode: If the internet disconnects, the app will not crash.

To turn this into a standalone EXE:
1. Use 'Electron' or 'Tauri' to wrap this build.
2. Ensure the 'Offline Dictionary' in geminiService.ts is updated with your curriculum.

This text file confirms your password '9090' was correct.
    `;
    const file = new Blob([fileContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "MiniLingo_Offline_Instructions.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    // FIX: Use h-[100dvh] for mobile browsers and CSS radial gradient for offline reliability
    // FIX: overflow-hidden on root ensures no double scrollbars, we scroll inside <main>
    <div className="h-[100dvh] w-full flex flex-col bg-sky-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] overflow-hidden fixed inset-0">
      
      {/* Header / App Bar */}
      <header className="flex-none p-3 md:p-4 flex items-center justify-between max-w-7xl mx-auto w-full z-10 relative">
         <div className="bg-white px-4 md:px-6 py-2 rounded-full shadow-md border-b-4 border-slate-200 flex items-center gap-2 select-none">
            <span className="text-xl md:text-2xl">🦁</span>
            <div className="flex flex-col justify-center">
                <span className="font-black text-slate-700 text-lg md:text-xl tracking-wider leading-none">MiniLingo</span>
                <span className="text-[10px] font-bold text-slate-400 leading-none mt-0.5">v{APP_VERSION}</span>
            </div>
         </div>

         <div className="flex gap-3">
             <button 
                onClick={handleDownloadClick}
                className="opacity-0 hover:opacity-100 bg-sky-500 text-white px-4 py-2 rounded-full shadow-sm hover:bg-sky-600 transition-all flex items-center gap-2 font-bold text-sm border-b-4 border-sky-700 active:border-b-0 active:translate-y-1"
                title="Download App"
             >
                <Download size={18} /> <span className="hidden sm:inline">Download EXE</span>
             </button>

             {/* Only show Fullscreen button if supported (Hides on iOS Safari to prevent confusion) */}
             {supportsFullscreenAPI && (
                 <button 
                    onClick={toggleFullscreen}
                    className="bg-white p-3 rounded-full shadow-sm text-slate-500 hover:text-sky-500 hover:bg-sky-50 transition-all"
                    title="Toggle Fullscreen"
                 >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                 </button>
             )}
         </div>
      </header>

      {/* Main Content Area */}
      {/* DYNAMIC SCROLL LOGIC:
          - If Game Mode: overflow-hidden (game manages its own viewport/canvas)
          - If UI Mode (Dashboard/Menu): overflow-y-auto (allow vertical scrolling)
      */}
      <main 
        className={`flex-1 relative flex flex-col z-0 ${isGameMode ? 'overflow-hidden' : 'overflow-y-auto scroll-container touch-pan-y'}`}
      >
        <div 
          className={`w-full max-w-6xl mx-auto p-3 md:p-6 flex-1 flex flex-col ${isGameMode ? 'h-full' : 'min-h-full'}`}
        >
          {mode === 'DASHBOARD' && (
            <div className="flex-1 flex items-center justify-center">
                <TeacherPanel onLessonCreated={handleLessonCreated} />
            </div>
          )}

          {mode === 'MENU' && (
            <div className="flex-1 flex items-center justify-center">
                <StudentHub 
                    items={lessonItems} 
                    onSelectGame={setMode} 
                    onBack={handleBackToTeacher}
                />
            </div>
          )}

          {mode === 'FLASHCARDS' && (
            <Flashcards items={lessonItems} onExit={handleExitGame} />
          )}

          {mode === 'QUIZ' && (
            <Quiz items={lessonItems} onExit={handleExitGame} />
          )}

          {mode === 'MEMORY' && (
            <Memory items={lessonItems} onExit={handleExitGame} />
          )}

          {mode === 'BUBBLE_POP' && (
            <BubblePop items={lessonItems} onExit={handleExitGame} />
          )}

          {mode === 'SHADOW_MATCH' && (
            <ShadowMatch items={lessonItems} onExit={handleExitGame} />
          )}

          {mode === 'STICKER_WORLD' && (
            <StickerWorld items={lessonItems} onExit={handleExitGame} />
          )}
          
          {mode === 'FEED_MONSTER' && (
            <FeedMonster items={lessonItems} onExit={handleExitGame} />
          )}
        </div>
      </main>
      
      {/* Footer for Kiosk Status */}
      <footer className="flex-none py-2 text-center text-slate-400 text-xs select-none opacity-60 bg-sky-50/80 backdrop-blur-sm">
        MiniLingo Education Suite • Interactive Learning System
      </footer>

      {/* Password Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-bounce-slow" style={{animationDuration: '0.5s', animationIterationCount: 1}}>
              <button 
                onClick={() => setIsDownloadModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-600">
                    <Lock size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800 mb-2">Admin Access</h3>
                 <p className="text-slate-500 mb-6">Please enter the admin password to download the executable.</p>
                 
                 <form onSubmit={handlePasswordSubmit} className="w-full">
                    <input 
                      type="password" 
                      autoFocus
                      placeholder="Enter Password" 
                      className="w-full text-center text-2xl tracking-widest p-4 rounded-xl border-2 border-slate-200 focus:border-sky-500 outline-none mb-4 transition-colors"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    
                    {passwordError && (
                      <p className="text-red-500 font-bold mb-4">Incorrect Password!</p>
                    )}

                    <Button type="submit" className="w-full py-4">
                        Unlock Download
                    </Button>
                 </form>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
