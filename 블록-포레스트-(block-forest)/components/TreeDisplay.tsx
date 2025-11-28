import React from 'react';
import { GrowthStage } from '../types';

interface TreeDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  stage: GrowthStage;
}

export const TreeDisplay: React.FC<TreeDisplayProps> = ({ imageUrl, isLoading, stage }) => {
  const stageName = [
    "묘목",           // SAPLING
    "작은 나무",       // SMALL_TREE
    "중간 나무",       // MEDIUM_TREE
    "큰 나무",         // LARGE_TREE
    "거대한 나무",      // GIANT_TREE
    "꽃망울 맺힌 나무",  // BUDDING_TREE
    "활짝 핀 나무"      // FULL_BLOOM_TREE
  ][stage] || "알 수 없는 나무";

  return (
    <div className="relative w-full px-6 py-2">
      {/* Aspect ratio container that fits well on mobile */}
      <div className="relative w-full aspect-square max-w-[360px] mx-auto">
        {/* Background Blob/Gradient */}
        <div className="absolute inset-4 bg-gradient-to-tr from-blue-100/50 via-purple-50/30 to-orange-50/40 rounded-full blur-2xl -z-10 animate-pulse"></div>
        
        <div className="w-full h-full flex items-center justify-center relative p-4">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 animate-pulse bg-white/40 backdrop-blur-sm p-8 rounded-3xl border border-white/50">
              <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-stone-500 font-bold text-sm tracking-wide">나무 조립 중...</p>
            </div>
          ) : imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`Lego Tree Stage ${stage}`} 
              className="w-full h-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-700 transform scale-100 hover:scale-105 will-change-transform"
            />
          ) : (
            <div className="text-center text-stone-400 bg-stone-100 p-6 rounded-2xl">
               <p>나무 이미지를<br/>불러올 수 없습니다.</p>
            </div>
          )}
          
          {/* Stage Badge */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-stone-100 flex items-center gap-2 whitespace-nowrap">
            <div className={`w-2 h-2 rounded-full ${stage === GrowthStage.FULL_BLOOM_TREE ? 'bg-pink-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm font-bold text-stone-700">Lv.{stage + 1} {stageName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};