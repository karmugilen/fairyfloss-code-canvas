import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

// --- Configuration ---
const CURSOR_SIZE = 16; // Base size of the arrow's longest dimension (height)
const BORDER_WIDTH = CURSOR_SIZE / 1; // Width based on height for shape

const BASE_COLOR = 'rgba(255, 255, 255, 0.85)'; // Tailwind gray-800 with some transparency
const HOVER_ARROW_COLOR = 'rgba(255, 255, 255, 0.95)'; // Tailwind gray-900 more opaque
const OUTLINE_COLOR = 'rgba(255, 255, 255, 0.6)'; // Semi-transparent white outline

// --- Hover Ring Configuration ---
const HOVER_RING_COLOR = 'rgba(255, 255, 255, 0.3)'; // Lighter, subtle ring color
const HOVER_RING_SIZE = CURSOR_SIZE * 2.5; // Size of the ring when expanded
const HOVER_RING_BORDER_WIDTH = '1.5px'; // Thickness of the ring

const TRANSFORM_ORIGIN = `${BORDER_WIDTH / 2}px ${CURSOR_SIZE * 0.15}px`; // Fine-tune pivot point

// --- Component ---
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const updateCursorPosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (isHidden) setIsHidden(false);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    const handleMouseOver = (e) => {
      const target = e.target ;
      const isInteractive =
        target.closest('a') ||
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer';
      setIsHovering(isInteractive);
    };

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver, true);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.body.style.cursor = 'none';

    return () => {
      // Remove listeners... (same as before)
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.body.style.cursor = '';
    };
  }, [isHidden]);

  return (
    <div
      // Main wrapper for positioning
      className={clsx(
        'custom-cursor pointer-events-none fixed z-[9999] transition-opacity duration-200',
        { 'opacity-0': isHidden }
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        // No scaling/clicking transform here, moved to inner elements
        // This ensures the hover ring position isn't affected by arrow scale
      }}
    >
      {/* Inner container for scaling/clicking effects + positioning */}
      <div
        className="cursor-transformer transition-transform duration-75 ease-out"
        style={{
            // Apply scaling/clicking effect here
            transform: `
                translate(-${BORDER_WIDTH / 2}px, -${CURSOR_SIZE * 0.15}px)
                scale(${isHovering ? 1.3 : 1})
                ${isClicking ? 'scale(0.85)' : ''}
            `,
            transformOrigin: TRANSFORM_ORIGIN, // Ensure scale/click originates correctly
            // Set width/height to contain the rotated arrow approximately
            // Not strictly necessary but can help reasoning about layout
            width: `${CURSOR_SIZE}px`,
            height: `${CURSOR_SIZE}px`,
        }}
      >
        {/* Container for rotation and outline */}
        <div
          className="arrow-shape transition-transform duration-75 ease-out"
          style={{
            transform: 'rotate(-45deg)', // Standard cursor angle
            transformOrigin: TRANSFORM_ORIGIN,
            filter: `drop-shadow(0px 0px 1.5px ${OUTLINE_COLOR})`,
            // Position relative to allow z-index for the arrow
            position: 'relative',
            zIndex: 2, // Arrow above the ring
          }}
        >
          {/* The Arrow Triangle */}
          <div
            className="arrow-triangle transition-colors duration-100 ease-out"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${BORDER_WIDTH / 2}px solid transparent`,
              borderRight: `${BORDER_WIDTH / 2}px solid transparent`,
              borderBottom: `${CURSOR_SIZE}px solid ${isHovering ? HOVER_ARROW_COLOR : BASE_COLOR}`,
            }}
          />
        </div>
      </div>

       {/* Hover Ring Element - positioned absolutely within the main wrapper */}
      <div
          className="hover-ring pointer-events-none absolute rounded-full transition-all duration-200 ease-out"
          style={{
              width: isHovering ? `${HOVER_RING_SIZE}px` : `${CURSOR_SIZE * 0.8}px`, // Expand size on hover
              height: isHovering ? `${HOVER_RING_SIZE}px` : `${CURSOR_SIZE * 0.8}px`, // Expand size on hover
              border: `${HOVER_RING_BORDER_WIDTH} solid ${HOVER_RING_COLOR}`,
              top: '0', // Center relative to the wrapper's top/left
              left: '0', // Center relative to the wrapper's top/left
              transform: 'translate(-50%, -50%)', // Center the ring precisely
              opacity: isHovering ? 1 : 0, // Fade in/out
              zIndex: 1, // Ring behind the arrow body
          }}
      />
    </div>
  );
};

export default CustomCursor;