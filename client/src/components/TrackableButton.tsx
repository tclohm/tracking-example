import React, { useRef, ReactNode } from 'react';
import { useTracking } from 'react-user-tracking';


interface TrackableButtonProps {
  children: React.ReactNode;
  category?: string;
  label?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export default function TrackableButton({ 
  children,
  category,
  label,
  onClick 
}: TrackableButtonProps) {
  const { trackEvent } = useTracking();
  const buttonRef = useRef(null);
  
  // Use the click tracking hook
  
  const handleClick = (e) => {

    trackEvent('click', {
      target: {
        tagName: buttonRef.current?.tagName.toLowerCase() || 'button',
        id: buttonRef.current?.id || '',
        category,
        label
      },
      position: {
        x: e.clientX,
        y: e.clientY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      }
    });

    if (onClick) {
      onClick(e);
    }

     console.log('Button clicked', { category, label });
  };

  return (
    <button ref={buttonRef} onClick={handleClick} className="btn btn-block">
      {children}
    </button>
  );
}
