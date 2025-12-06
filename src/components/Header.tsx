import React from 'react';
export const Header = ({ onOpenAbout, onOpenHowItWorks }: any) => (
  <div className="p-4 bg-gray-900 text-white border-b border-gray-800 flex justify-between">
    <h1 className="font-bold">Kimetsu Forge</h1>
    <div className="flex gap-2">
      <button onClick={onOpenAbout}>Sobre</button>
      <button onClick={onOpenHowItWorks}>Ajuda</button>
    </div>
  </div>
);
