import React, { useState, useEffect } from 'react';
import { useTracking } from 'react-user-tracking';

// TrackingToast component - displays tracking info
interface TrackingToastProps {
  privacyUrl?: string;
  maxEvents?: number;
}

export default function TrackingToast({ 
  privacyUrl = '/privacy',
  maxEvents = 5 
}: TrackingToastProps): JSX.Element | null {
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

  // Format page path to be more readable
  const formatPath = (path: string): string => {
    if (!path) return '';
    // Remove http/https and domain
    const cleanPath = path.replace(/https?:\/\/[^\/]+/, '');
    // Clean up trailing slashes
    return cleanPath.replace(/\/$/, '') || '/';
  };

  if (!visible) return null;

  // Count clicks - make sure we're properly counting
  const clickCount = events.filter(e => e.eventType === 'click').length;
  const pageViewCount = events.filter(e => e.eventType === 'pageview').length;
  
  // Get last N events in REVERSE order (newest first)
  const recentEvents = [...events].slice(-maxEvents).reverse();
  
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
            Recent Activity (newest first)
          </div>
          
          <div style={{ marginTop: '10px' }}>
            {events.length === 0 ? (
              <div className="monospace">
                NO EVENTS RECORDED
              </div>
            ) : (
              <div>
                {recentEvents.map((event, index) => (
                  <div 
                    key={event.eventId || index} 
                    className="tracking-toast-event"
                    style={{ 
                      marginBottom: '8px',
                      paddingBottom: '8px', 
                      borderBottom: index < recentEvents.length - 1 ? '1px solid #444' : 'none' 
                    }}
                  >
                    <span 
                      className="tracking-toast-event-type"
                      style={{ 
                        color: event.eventType === 'click' ? '#4dabf7' : 
                               event.eventType === 'pageview' ? '#12b886' : '#ddd',
                        fontWeight: 'bold'
                      }}
                    >
                      {event.eventType}:
                    </span>
                    {' '}
                    <span className="monospace">
                      {event.eventType === 'pageview' ? (
                        <span title={event.url}>
                          {formatPath(event.url || '')}
                          {event.title ? ` "${event.title}"` : ''} 
                        </span>
                      ) : (
                        <span>
                          {event.target?.tagName || ''}
                          {event.target?.id ? `#${event.target.id}` : ''}
                          {event.target?.category ? ` [${event.target.category}]` : ''}
                          {event.target?.label ? ` - ${event.target.label}` : ''}
                        </span>
                      )}
                    </span>
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
