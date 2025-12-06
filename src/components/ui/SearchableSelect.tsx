import React from 'react';
export const SearchableSelect = ({ label, options, value, onChange }: any) => (
  <div className="space-y-1">
    {label && <label className="text-xs text-gray-400 uppercase">{label}</label>}
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded p-2 text-white">
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
