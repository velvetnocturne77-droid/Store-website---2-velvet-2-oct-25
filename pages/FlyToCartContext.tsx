import React, { createContext, useState, ReactNode, useRef } from 'react';

interface FlyToCartContextType {
  fly: (startElement: HTMLElement) => void;
}

export const FlyToCartContext = createContext<FlyToCartContextType | undefined>(undefined);

const BirdIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-gold" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);


export const FlyToCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const birdRef = useRef<HTMLDivElement>(null);

  const fly = (startElement: HTMLElement) => {
    const cartIcon = document.getElementById('cart-icon');
    if (!cartIcon || !birdRef.current) return;

    const startRect = startElement.getBoundingClientRect();
    const endRect = cartIcon.getBoundingClientRect();

    const startPos = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2,
    };
    
    const endPos = {
      x: endRect.left + endRect.width / 2,
      y: endRect.top + endRect.height / 2,
    };

    const bird = birdRef.current;
    bird.style.setProperty('--start-x', `${startPos.x}px`);
    bird.style.setProperty('--start-y', `${startPos.y}px`);
    bird.style.setProperty('--end-x', `${endPos.x}px`);
    bird.style.setProperty('--end-y', `${endPos.y}px`);

    bird.classList.remove('fly-animation');
    // void bird.offsetWidth; // trigger reflow
    setTimeout(() => {
        bird.classList.add('fly-animation');
    }, 10);
  };
  
  return (
    <FlyToCartContext.Provider value={{ fly }}>
      {children}
       <div 
        ref={birdRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none opacity-0" 
        style={{ transform: 'translate(var(--start-x), var(--start-y))' }}
       >
         <BirdIcon />
       </div>
    </FlyToCartContext.Provider>
  );
};