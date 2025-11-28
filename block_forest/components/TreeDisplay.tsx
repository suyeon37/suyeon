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
    <div className="relative w-full aspect-square max-w-md mx-auto mt-8 mb-4 p-6">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-stone-50 rounded-3xl -z-10"></div>
      
      <div className="w-full h-full flex items-center justify-center relative">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-stone-500 font-medium text-sm">새로운 레고 나무를 조립 중...</p>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt={`Lego Tree Stage ${stage}`} 
            className="w-full h-full object-contain drop-shadow-xl transition-all duration-500 transform hover:scale-105"
          />
        ) : (
          <div className="text-center text-stone-400">
             <p>나무 이미지를 불러올 수 없습니다.</p>
          </div>
        )}
        
        {/* Stage Badge */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-sm border border-stone-100">
          <span className="text-sm font-bold text-green-700">Lv.{stage + 1} {stageName}</span>
        </div>
      </div>
    </div>
  );
};