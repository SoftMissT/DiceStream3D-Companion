import React from 'react';
export const PlaceholderView = ({ title }: { title: string }) => (
  <div className="p-10 text-center text-white">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-gray-500">Módulo carregado com sucesso.</p>
  </div>
);
