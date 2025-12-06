import React from 'react';
export const Button = ({ children, className, isLoading, ...props }: any) => (
  <button className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${className || 'bg-blue-600 hover:bg-blue-500 text-white'}`} disabled={isLoading || props.disabled} {...props}>
    {isLoading && <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>}
    {children}
  </button>
);
