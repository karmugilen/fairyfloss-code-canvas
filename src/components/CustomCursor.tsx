
import React, { useState, useEffect } from 'react';

type CursorStyle = 'default' | 'dot' | 'ring' | 'glow';

interface CustomCursorProps {
  cursorStyle?: CursorStyle;
}

const CustomCursor = ({ cursorStyle = 'default' }: CustomCursorProps) => {
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

  const getCursorStyles = () => {
    switch (cursorStyle) {
      case 'dot':
        return {
          outer: 'border-2 border-primary bg-transparent w-8 h-8 rounded-full',
          inner: 'w-4 h-4 bg-primary rounded-full'
        };
      case 'ring':
        return {
          outer: 'border-2 border-accent bg-transparent w-10 h-10 rounded-full',
          inner: 'w-2 h-2 bg-accent rounded-full'
        };
      case 'glow':
        return {
          outer: 'border-none bg-primary/30 backdrop-blur-sm w-12 h-12 rounded-full',
          inner: 'w-3 h-3 bg-white rounded-full'
        };
      default:
        return {
          outer: 'border-2 border-fairy-purple bg-transparent w-8 h-8 rounded-full',
          inner: 'w-2 h-2 bg-fairy-yellow rounded-full'
        };
    }
  };

  const styles = getCursorStyles();

  return (
    <>
      <div 
        className={`pointer-events-none fixed z-50 transition-transform duration-200 ${styles.outer}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1}) ${isClicking ? 'scale(0.8)' : ''}`,
          opacity: 0.6,
          mixBlendMode: 'difference',
        }}
      />
      <div 
        className={`pointer-events-none fixed z-50 ${styles.inner}`}
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
