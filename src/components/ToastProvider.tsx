import React, { createContext, useContext } from 'react';
const ToastContext = createContext<any>(null);
export const ToastProvider = ({ children }: any) => (
  <ToastContext.Provider value={{ showToast: () => console.log('Toast') }}>
    {children}
  </ToastContext.Provider>
);
export const useToast = () => useContext(ToastContext);
