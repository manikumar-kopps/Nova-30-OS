import { useState, useCallback, useRef, useEffect } from 'react';

interface UseDraggableOptions {
  initialX?: number;
  initialY?: number;
  onDragStart?: (x: number, y: number) => void;
  onDrag?: (x: number, y: number) => void;
  onDragEnd?: (x: number, y: number) => void;
  bounds?: { left: number; top: number; right: number; bottom: number };
  handle?: React.RefObject<HTMLElement | null>;
}

interface UseDraggableReturn {
  position: { x: number; y: number };
  isDragging: boolean;
  dragProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
  setPosition: (x: number, y: number) => void;
}

export function useDraggable(options: UseDraggableOptions): UseDraggableReturn {
  const { initialX = 0, initialY = 0, onDragStart, onDrag, onDragEnd, bounds, handle } = options;
  const [position, setPos] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  
  const startPos = useRef({ x: 0, y: 0 });
  const startElemPos = useRef({ x: 0, y: 0 });

  const setPosition = useCallback((x: number, y: number) => {
    setPos({ x, y });
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number, target: EventTarget | null) => {
    if (handle?.current && target instanceof Node && !handle.current.contains(target)) {
      return;
    }
    
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
    startElemPos.current = { ...position };
    
    if (onDragStart) {
      onDragStart(position.x, position.y);
    }
  }, [handle, position, onDragStart]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    handleStart(e.clientX, e.clientY, e.target);
  }, [handleStart]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY, e.target);
  }, [handleStart]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number, clientY: number) => {
      const dx = clientX - startPos.current.x;
      const dy = clientY - startPos.current.y;
      
      let newX = startElemPos.current.x + dx;
      let newY = startElemPos.current.y + dy;
      
      if (bounds) {
        newX = Math.max(bounds.left, Math.min(newX, bounds.right));
        newY = Math.max(bounds.top, Math.min(newY, bounds.bottom));
      }
      
      setPos({ x: newX, y: newY });
      if (onDrag) onDrag(newX, newY);
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);

    const onEnd = () => {
      setIsDragging(false);
      if (onDragEnd) onDragEnd(position.x, position.y);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, bounds, onDrag, onDragEnd, position.x, position.y]);

  return {
    position,
    isDragging,
    dragProps: {
      onMouseDown,
      onTouchStart
    },
    setPosition
  };
}
