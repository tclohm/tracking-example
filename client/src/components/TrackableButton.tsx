import React, { useRef } from 'react';
import { useClickTracking, useTracking } from 'react-user-tracking';

export default function TrackableButton({ children, category, label, onClick }) {
  const { trackEvent } = useTracking();
  const buttonRef = useRef(null);
  
  // Use the click tracking hook
  useClickTracking(buttonRef, category, label);
  
  const handleClick = (e) => {
    // If there's an external onClick handler, call it
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button ref={buttonRef} onClick={handleClick} className="btn btn-block">
      {children}
    </button>
  );
}
