import React, { useRef, useEffect } from 'react';
import { useClickTracking } from 'react-user-tracking';

export default function TrackableButton({ children, category, label, onClick }) {
  const buttonRef = useRef(null);

  useClickTracking(buttonRef, category, label);

  return (
    <button ref={buttonRef} onClick={onClick} className="btn btn-block">
      {children}
    </button>
  );
}
