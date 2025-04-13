
import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLink = target.tagName === 'A' || 
                      target.tagName === 'BUTTON' || 
                      target.closest('a') || 
                      target.closest('button');
      setIsHovering(isLink ? true : false);
    };

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Arrow cursor body */}
      <div 
        className="pointer-events-none fixed z-50 transition-transform duration-200"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) rotate(-45deg) scale(${isHovering ? 1.2 : 1}) ${isClicking ? 'scale(0.8)' : ''}`,
        }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200"
        >
          <path 
            d="M2 2L10 18L13 13L19 16L22 2L2 2Z" 
            fill="#FEF7CD" 
            stroke="#9b87f5" 
            strokeWidth="1.5" 
            className="animate-pulse-slow"
          />
        </svg>
      </div>
      
      {/* Arrow point dot */}
      <div 
        className="pointer-events-none fixed z-50 w-2 h-2 bg-primary rounded-full"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: 0.8,
        }}
      />
    </>
  );
};

export default CustomCursor;
