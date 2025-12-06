import React, { useState } from 'react';
import { ChevronDownIcon } from '../icons';
export const CollapsibleSection = ({ title, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10 py-2">
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full justify-between items-center py-2 text-white font-medium">
        {title} <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="pb-4 pt-2">{children}</div>}
    </div>
  );
};
