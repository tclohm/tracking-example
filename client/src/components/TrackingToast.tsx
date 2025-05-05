import React, { useState, useEffect } from 'react';
import { useTracking } from 'react-user-tracking';

// TrackingToast component - displays tracking info
interface TrackingToastProps {
  privacyUrl?: string;
}

export default function TrackingToast({ privacyUrl = '/privacy' }: TrackingToastProps): JSX.Element | null {
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  if (!visible) return null;

  // Count clicks and pageviews
  const clickCount = events.filter(e => e.eventType === 'click').length;
  const pageViewCount = events.filter(e => e.eventType === 'pageview').length;
  
  return (
    <div className="tracking-toast-container">
      <div className="tracking-toast-header">
        <div className="tracking-toast-title">
          We are tracking you
        </div>
        <div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="tracking-toast-button"
          >
            {expanded ? 'Less' : 'More'}
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
          Time on page: {formatTime(timeSpent)}
        </div>
      </div>
      
      {expanded && (
        <div className="tracking-toast-section">
          <div className="tracking-toast-section-title uppercase mb-xs">
            Recent Activity
          </div>
          
          <div>
            {events.length === 0 ? (
              <div className="monospace">
                NO EVENTS RECORDED
              </div>
            ) : (
              <div>
                {events.map((event, index) => (
                  <div 
                    key={index} 
                    style={{
                      padding: '4px 0',
                      borderBottom: index < events.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                    }}
                  >
                    <div style={{ 
                      color: event.eventType === 'click' ? '#4dabf7' : 
                             event.eventType === 'pageview' ? '#12b886' : '#ddd'
                    }}>
                      {event.eventType}:
                      {' '}
                      <span style={{ opacity: 0.8 }}>
                        {event.eventType === 'pageview' 
                          ? (event.title || event.url || 'Page')
                          : (event.target?.tagName || 'element')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {expanded && (
        <div className="tracking-toast-section">
          <div className="tracking-toast-stats">
            <div className="monospace">
              Clicks: {clickCount}
            </div>
            <div className="monospace">
              Pages: {pageViewCount}
            </div>
            <div className="monospace">
              Device: desktop
            </div>
            <div className="monospace mt-sm">
              <a href={privacyUrl} className="uppercase">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackingToast;
