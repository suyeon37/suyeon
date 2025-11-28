import React from 'react';
import { STEPS_PER_BLOCK } from '../types';

interface ControlsProps {
  steps: number;
  availableBlocks: number;
  blocksToNextStage: number;
  onWalk: () => void;
  onBuild: () => void;
  isBuilding: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
  steps, 
  availableBlocks, 
  blocksToNextStage, 
  onWalk, 
  onBuild,
  isBuilding 
}) => {
  const progressToNextBlock = (steps % STEPS_PER_BLOCK) / STEPS_PER_BLOCK * 100;

  return (
    <div className="w-full max-w-md mx-auto px-6 pt-6 pb-8 safe-area-bottom">
      
      {/* Stats Row */}
      <div className="flex justify-between items-end mb-5 px-1">
        <div className="flex flex-col">
          <span className="text-[10px] text-stone-400 uppercase font-extrabold tracking-widest mb-1">Total Steps</span>
          <span className="text-3xl font-black text-stone-800 tracking-tight font-mono">{steps.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-stone-400 uppercase font-extrabold tracking-widest mb-1">Blocks</span>
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
            <div className="w-3 h-3 bg-yellow-400 rounded-[1px]"></div>
            <span className="text-2xl font-black text-yellow-600 font-mono">{availableBlocks}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold text-stone-400 mb-2">
          <span>다음 블록까지</span>
          <span>{steps % STEPS_PER_BLOCK} / {STEPS_PER_BLOCK}</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden shadow-inner border border-stone-50">
          <div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-300 ease-out shadow-[0_2px_10px_rgba(52,211,153,0.3)]"
            style={{ width: `${progressToNextBlock}%` }}
          ></div>
        </div>
      </div>

      {/* Big Action Buttons */}
      <div className="flex gap-4 h-20">
        {/* Walk Button - Primary Action */}
        <button
          onClick={onWalk}
          className="flex-1 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 active:scale-[0.98] transition-all rounded-2xl flex items-center justify-center gap-3 group shadow-lg shadow-stone-200/50 relative"
        >
          <div className="bg-stone-800 p-2.5 rounded-full group-hover:bg-stone-700 transition-colors">
            <span className="text-2xl block group-hover:scale-110 transition-transform">👣</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-white text-lg">걷기</span>
            <span className="text-stone-400 text-[10px] font-medium">+50 Steps</span>
          </div>
          {/* Desktop Hint */}
          <span className="hidden md:block absolute top-2 right-2 text-[10px] text-stone-600 font-bold bg-stone-800 px-1.5 py-0.5 rounded border border-stone-700">Space</span>
        </button>

        {/* Build Button - Secondary Action */}
        <button
          onClick={onBuild}
          disabled={availableBlocks === 0 || isBuilding}
          className={`
            flex-[0.7] relative overflow-hidden rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] border-b-4
            ${availableBlocks > 0 
              ? 'bg-yellow-400 hover:bg-yellow-300 border-yellow-600 shadow-lg shadow-yellow-200 text-yellow-900' 
              : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed'}
          `}
        >
          <span className={`text-2xl ${availableBlocks > 0 && !isBuilding ? 'animate-bounce-short' : ''}`}>
            🧱
          </span>
          <span className="font-black text-lg">
            {isBuilding ? '...' : '쌓기'}
          </span>
          
          {/* Notification Dot */}
          {availableBlocks > 0 && (
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
           {/* Desktop Hint */}
           <span className={`hidden md:block absolute bottom-1 right-1 text-[9px] font-bold px-1 rounded ${availableBlocks > 0 ? 'text-yellow-800/60' : 'text-stone-300'}`}>Enter</span>
        </button>
      </div>
      
      <div className="mt-4 text-center">
         <p className="text-[10px] text-stone-400 font-medium">
            Lv UP까지 블록 {blocksToNextStage}개 남음
         </p>
      </div>
    </div>
  );
};