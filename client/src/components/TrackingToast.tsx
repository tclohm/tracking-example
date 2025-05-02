import React, { useState, useEffect } from 'react';
import { useTracking } from 'react-user-tracking';

// Tom Sachs-inspired tracking toast component
const TrackingToast = ({ privacyUrl = '/privacy' }) => {
  const { events, sessionId } = useTracking();
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Time counter for "time on page"
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const timer = window.setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    console.log("EVENTS", events)
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  if (!visible) return null;

  // Count clicks
  const clickCount = events.filter(e => e.eventType === 'click').length;
  const pageViewCount = events.filter(e => e.eventType === 'pageview').length;
  
  return (
    <div className="tracking-toast-container">
      <div className="tracking-toast-header">
        <div className="tracking-toast-title">
          ACTIVITY LOG
        </div>
        <div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="tracking-toast-button"
          >
            {expanded ? 'LESS' : 'MORE'}
          </button>
          <button 
            onClick={() => setVisible(false)}
            className="tracking-toast-button"
            style={{ marginLeft: '8px' }}
          >
            X
          </button>
        </div>
      </div>
      
      <div className="tracking-toast-time">
        <div className="monospace">
          SESSION ID: {sessionId.substring(0, 8).toUpperCase()}
        </div>
        <div className="monospace">
          TIME ON PAGE: {formatTime(timeSpent)}
        </div>
      </div>
      
      {expanded && (
        <div className="tracking-toast-section">
          <div className="tracking-toast-section-title uppercase mb-xs">
            Recent Events
          </div>
          
          {events.length === 0 ? (
            <div className="monospace">
              NO EVENTS RECORDED
            </div>
          ) : (
            <div>
              {events.slice(0, 5).map((event, index) => (
                <div key={event.eventId || index} className="tracking-toast-event">
                  <span className="tracking-toast-event-type">
                    {event.eventType.toUpperCase()}:
                  </span>
                  {' '}
                  <span className="monospace">
                    {event.target?.tagName || ''}
                    {event.target?.id ? `#${event.target.id}` : ''}
                    {event.target?.category ? ` [${event.target.category}]` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {expanded && (
        <div className="tracking-toast-section">
          <div className="tracking-toast-stats">
            <div className="monospace">
              CLICKS: {clickCount}
            </div>
            <div className="monospace">
              PAGES: {pageViewCount}
            </div>
            <div className="monospace mt-sm">
              <a href={privacyUrl} className="uppercase">
                PRIVACY POLICY
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingToast;
