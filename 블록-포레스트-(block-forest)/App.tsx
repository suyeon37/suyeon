import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TreeDisplay } from './components/TreeDisplay';
import { Controls } from './components/Controls';
import { generateLegoTreeImage, generateEncouragement } from './services/geminiService';
import { TreeData, UserStats, GrowthStage, STEPS_PER_BLOCK, BLOCKS_PER_STAGE } from './types';

const App: React.FC = () => {
  // --- State ---
  const [stats, setStats] = useState<UserStats>({
    steps: 0,
    availableBlocks: 0,
  });

  const [tree, setTree] = useState<TreeData>({
    stage: GrowthStage.SAPLING, // Start from Sapling (Level 1)
    blocksAdded: 0,
    totalBlocks: 0,
    imageUrl: null,
    name: "나의 첫 나무",
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("걸음을 걸어 블록을 모아보세요!");

  // --- Initialization ---
  useEffect(() => {
    const initTree = async () => {
      setIsGenerating(true);
      const url = await generateLegoTreeImage(GrowthStage.SAPLING);
      setTree(prev => ({ ...prev, imageUrl: url }));
      setIsGenerating(false);
    };
    initTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Handlers ---

  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const handleWalk = useCallback(() => {
    triggerHaptic(5);
    const stepsToAdd = 50; 
    
    setStats(prev => {
      const newSteps = prev.steps + stepsToAdd;
      const oldBlocksTotal = Math.floor(prev.steps / STEPS_PER_BLOCK);
      const newBlocksTotal = Math.floor(newSteps / STEPS_PER_BLOCK);
      const earnedBlocks = newBlocksTotal - oldBlocksTotal;

      if (earnedBlocks > 0) {
        triggerHaptic([10, 30, 10]); 
      }

      return {
        steps: newSteps,
        availableBlocks: prev.availableBlocks + earnedBlocks
      };
    });
  }, []);

  const handleBuild = useCallback(async () => {
    if (stats.availableBlocks <= 0 || isGenerating) return;
    
    triggerHaptic(15);

    setStats(prev => ({
      ...prev,
      availableBlocks: prev.availableBlocks - 1
    }));

    setTree(prevTree => {
      const newBlocksAdded = prevTree.blocksAdded + 1;
      const newTotalBlocks = prevTree.totalBlocks + 1;
      let newStage = prevTree.stage;
      
      if (newBlocksAdded >= BLOCKS_PER_STAGE) {
        if (prevTree.stage < GrowthStage.FULL_BLOOM_TREE) {
          newStage = prevTree.stage + 1;
          triggerLevelUp(newStage, stats.steps, newTotalBlocks);
        }
        return {
            ...prevTree,
            stage: newStage,
            blocksAdded: 0,
            totalBlocks: newTotalBlocks
        };
      } 

      return {
        ...prevTree,
        blocksAdded: newBlocksAdded,
        totalBlocks: newTotalBlocks
      };
    });
  }, [stats.availableBlocks, stats.steps, isGenerating]);

  // Helper to handle side effects of leveling up
  const triggerLevelUp = async (newStage: GrowthStage, currentSteps: number, totalBlocks: number) => {
    setIsGenerating(true);
    triggerHaptic([50, 50, 50]);
    
    const [imageUrl, motivation] = await Promise.all([
      generateLegoTreeImage(newStage),
      generateEncouragement(currentSteps, totalBlocks)
    ]);

    if (imageUrl) {
      setTree(prev => ({ ...prev, imageUrl }));
    }
    if (motivation) {
        setMessage(motivation);
    }
    
    setIsGenerating(false);
  };

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        handleWalk();
      } else if (e.code === 'Enter') {
        e.preventDefault();
        handleBuild();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleWalk, handleBuild]);

  return (
    // Outer Container: Handles background for Desktop
    <div className="min-h-[100dvh] w-full bg-stone-200 md:flex md:items-center md:justify-center font-sans">
      
      {/* App Container: Mimics mobile size on Desktop */}
      <div className="relative w-full h-[100dvh] md:h-[850px] md:max-h-[95vh] md:max-w-[420px] bg-stone-50 md:rounded-[2.5rem] md:shadow-2xl md:border-[8px] md:border-stone-900 overflow-hidden flex flex-col">
        
        <Header />
        
        {/* Main Scrollable Area */}
        <main className="flex-1 flex flex-col relative pt-16 pb-0 overflow-y-auto no-scrollbar items-center w-full">
          
          {/* Encouragement Message */}
          <div className="px-6 pt-6 w-full max-w-md text-center z-10">
            <div className="bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm border border-stone-100 inline-block transition-all hover:scale-105">
              <p className="text-stone-600 font-medium text-sm leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Tree Visualization */}
          <div className="flex-1 flex flex-col justify-center w-full">
            <TreeDisplay 
              imageUrl={tree.imageUrl} 
              isLoading={isGenerating} 
              stage={tree.stage} 
            />
          </div>
          
          <div className="h-4"></div>
        </main>

        {/* Controls Area */}
        <div className="w-full z-20 bg-white rounded-t-[2rem] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] relative">
          <Controls 
            steps={stats.steps}
            availableBlocks={stats.availableBlocks}
            blocksToNextStage={BLOCKS_PER_STAGE - tree.blocksAdded}
            onWalk={handleWalk}
            onBuild={handleBuild}
            isBuilding={isGenerating}
          />
        </div>

      </div>

      {/* Desktop Keyboard Hints (Visible only on MD screens outside the app container) */}
      <div className="hidden md:block fixed bottom-8 right-8 text-stone-500 text-sm font-medium bg-white/80 backdrop-blur px-6 py-4 rounded-2xl shadow-lg border border-stone-200">
        <p className="mb-2 font-bold text-stone-800">⌨️ 키보드 단축키</p>
        <div className="flex flex-col gap-1">
           <span className="flex items-center gap-2"><kbd className="bg-stone-100 border border-stone-300 rounded px-2 py-0.5 text-xs font-bold">Space</kbd> 걷기</span>
           <span className="flex items-center gap-2"><kbd className="bg-stone-100 border border-stone-300 rounded px-2 py-0.5 text-xs font-bold">Enter</kbd> 쌓기</span>
        </div>
      </div>

    </div>
  );
};

export default App;