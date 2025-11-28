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
    <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-6 pb-10 border border-stone-100">
      
      {/* Status Bar */}
      <div className="flex justify-between mb-6">
        <div className="flex flex-col">
          <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Steps</span>
          <span className="text-2xl font-black text-stone-800">{steps.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">My Bricks</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-400 rounded-sm border-b-2 border-r-2 border-yellow-600"></div>
            <span className="text-2xl font-black text-yellow-600">{availableBlocks}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar for Next Block */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-stone-500 mb-1">
          <span>다음 블록까지</span>
          <span>{steps % STEPS_PER_BLOCK} / {STEPS_PER_BLOCK}</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-green-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressToNextBlock}%` }}
          ></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onWalk}
          className="bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all rounded-2xl p-4 flex flex-col items-center justify-center gap-2 group"
        >
          <div className="bg-white p-3 rounded-full shadow-sm group-hover:rotate-12 transition-transform">
            👣
          </div>
          <span className="font-bold text-stone-600">걷기 (시뮬레이션)</span>
        </button>

        <button
          onClick={onBuild}
          disabled={availableBlocks === 0 || isBuilding}
          className={`
            relative overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-95
            ${availableBlocks > 0 
              ? 'bg-yellow-400 hover:bg-yellow-300 shadow-lg shadow-yellow-200 text-yellow-900' 
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'}
          `}
        >
          <div className={`bg-white/30 p-3 rounded-full ${availableBlocks > 0 ? 'animate-bounce-short' : ''}`}>
            🧱
          </div>
          <span className="font-bold">
            {isBuilding ? '조립 중...' : '쌓기'}
          </span>
          {availableBlocks > 0 && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          )}
        </button>
      </div>

      <div className="mt-4 text-center">
         <p className="text-xs text-stone-400">
            다음 성장까지 블록 {blocksToNextStage}개 필요
         </p>
      </div>
    </div>
  );
};
