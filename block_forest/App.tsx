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
    stage: GrowthStage.SAPLING, // Start from Sapling as requested
    blocksAdded: 0,
    totalBlocks: 0,
    imageUrl: null,
    name: "나의 첫 나무",
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("걸음을 걸어 블록을 모아보세요!");

  // --- Initialization ---
  // Load initial seed image
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

  const handleWalk = useCallback(() => {
    // Simulate walking
    // Increased simulation speed slightly since we need 2000 steps per level now
    const stepsToAdd = 50; 
    
    setStats(prev => {
      const newSteps = prev.steps + stepsToAdd;
      
      // Calculate if we earned a new block
      const oldBlocksTotal = Math.floor(prev.steps / STEPS_PER_BLOCK);
      const newBlocksTotal = Math.floor(newSteps / STEPS_PER_BLOCK);
      const earnedBlocks = newBlocksTotal - oldBlocksTotal;

      return {
        steps: newSteps,
        availableBlocks: prev.availableBlocks + earnedBlocks
      };
    });
  }, []);

  const handleBuild = useCallback(async () => {
    if (stats.availableBlocks <= 0) return;

    // Use one block
    setStats(prev => ({
      ...prev,
      availableBlocks: prev.availableBlocks - 1
    }));

    // Update Tree logic
    setTree(prevTree => {
      const newBlocksAdded = prevTree.blocksAdded + 1;
      const newTotalBlocks = prevTree.totalBlocks + 1;
      let newStage = prevTree.stage;
      
      // Check for Level Up
      if (newBlocksAdded >= BLOCKS_PER_STAGE) {
        if (prevTree.stage < GrowthStage.FULL_BLOOM_TREE) {
          newStage = prevTree.stage + 1;
          
          // Trigger async image generation for new stage
          triggerLevelUp(newStage, stats.steps, newTotalBlocks);
        }
        return {
            ...prevTree,
            stage: newStage,
            blocksAdded: 0, // Reset progress for next stage
            totalBlocks: newTotalBlocks
        };
      } 

      return {
        ...prevTree,
        blocksAdded: newBlocksAdded,
        totalBlocks: newTotalBlocks
      };
    });
    
  }, [stats.availableBlocks, stats.steps]);

  // Helper to handle side effects of leveling up
  const triggerLevelUp = async (newStage: GrowthStage, currentSteps: number, totalBlocks: number) => {
    setIsGenerating(true);
    
    // Parallel requests for speed
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

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-stone-100">
      <Header />
      
      <main className="flex-1 flex flex-col relative pt-16 pb-4 overflow-y-auto">
        
        {/* Message Area */}
        <div className="px-6 pt-4 text-center">
           <p className="text-stone-600 font-medium bg-white/50 inline-block px-4 py-2 rounded-xl text-sm shadow-sm">
             {message}
           </p>
        </div>

        {/* Tree Visualization */}
        <TreeDisplay 
          imageUrl={tree.imageUrl} 
          isLoading={isGenerating} 
          stage={tree.stage} 
        />
        
        {/* Spacing */}
        <div className="flex-1"></div>

        {/* Controls Area (Sticky Bottom) */}
        <div className="sticky bottom-0 px-4 pb-4 w-full z-10">
           <Controls 
             steps={stats.steps}
             availableBlocks={stats.availableBlocks}
             blocksToNextStage={BLOCKS_PER_STAGE - tree.blocksAdded}
             onWalk={handleWalk}
             onBuild={handleBuild}
             isBuilding={isGenerating}
           />
        </div>
      </main>
    </div>
  );
};

export default App;