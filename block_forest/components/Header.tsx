import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full p-4 bg-white/80 backdrop-blur-md border-b border-stone-200 flex justify-between items-center fixed top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-500 rounded-md shadow-inner flex items-center justify-center">
          <div className="w-4 h-4 bg-green-400 rounded-full"></div>
        </div>
        <h1 className="text-xl font-bold text-stone-800 tracking-tight">블록 포레스트</h1>
      </div>
      <div className="text-xs font-medium text-stone-500 px-2 py-1 bg-stone-100 rounded-full">
        Beta
      </div>
    </header>
  );
};
