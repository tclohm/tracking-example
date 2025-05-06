import React, { useState, useEffect, useRef } from 'react';
import { useTracking } from 'react-user-tracking';
import '../styles/TrackingToast.css';

interface TrackingToastProps {
  privacyUrl?: string;
  autoCollapse?: boolean; // Auto collapse on small screens
  miniView?: boolean; // Enable mini view on very small screens
}

export default function TrackingToast({ 
  privacyUrl = '/privacy',
  autoCollapse = true,
  miniView = true
}: TrackingToastProps): JSX.Element | null {
  const { events, sessionId } = useTracking();
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isMobile, setIsMobile] = useState(false);
  const [isExtraSmall, setIsExtraSmall] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Reference to track previously seen events
  const prevEventsCountRef = useRef(0);
  
  // Check for new events
  useEffect(() => {
    prevEventsCountRef.current = events.length;
  }, [events]);
  
  // Update current time for relative timestamps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000); // Update every 10 seconds
    return () => clearInterval(timer);
  }, []);

  // Time counter for "time on page"
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Check screen size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
      setIsExtraSmall(window.innerWidth < 320);
      
      // Auto collapse on small screens if enabled
      if (autoCollapse && window.innerWidth < 480) {
        setExpanded(false);
      }
    };
    
    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [autoCollapse]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  // Format absolute timestamp
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };
  
  // Format relative timestamp
  const getRelativeTime = (timestamp: number): string => {
    const seconds = Math.floor((currentTime - timestamp) / 1000);
    
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1m ago';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1h ago';
    if (hours < 24) return `${hours}h ago`;
    
    return formatTimestamp(timestamp);
  };
  
  // Get event icon based on type
  const getEventIcon = (eventType: string): string => {
    switch (eventType) {
      case 'pageview': return '🔍';
      case 'click': return '👆';
      case 'form_submit': return '📝';
      default: return '🔔';
    }
  };
  
  // Get event type class
  const getEventTypeClass = (eventType: string): string => {
    switch (eventType) {
      case 'pageview': return 'tracking-toast-event-pageview';
      case 'click': return 'tracking-toast-event-click';
      case 'form_submit': return 'tracking-toast-event-form_submit';
      default: return 'tracking-toast-event-custom';
    }
  };
  
  // Check if event is new (to highlight)
  const isNewEvent = (index: number): boolean => {
    return index < events.length - prevEventsCountRef.current;
  };

  if (!visible) return null;

  // Count events
  const clickCount = events.filter(e => e.eventType === 'click').length;
  const pageViewCount = events.filter(e => e.eventType === 'pageview').length;
  
  // Get most recent events first (reversed)
  const recentEvents = [...events].reverse();
  
  // Build container class names based on current state
  const containerClassNames = [
    'tracking-toast-container',
    isMobile ? 'tracking-toast-mobile' : '',
    isMinimized ? 'tracking-toast-collapsed-mobile' : '',
    isExtraSmall && miniView ? 'tracking-toast-mini-view' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClassNames}>
      <div className="tracking-toast-header">
        <div className="tracking-toast-title">
          <span className="tracking-toast-title-icon">👁️</span>
          {(!isMobile || !isMinimized) && 'We are tracking you'}
        </div>
        <div>
          {isMobile && (
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="tracking-toast-button tracking-toast-mobile-toggle"
            >
              {isMinimized ? '↔️' : '↕️'}
            </button>
          )}
          
          {(!isMobile || !isMinimized) && (
            <>
              <button 
                onClick={() => setExpanded(!expanded)}
                className="tracking-toast-button"
              >
                {expanded ? 'Less' : 'More'}
              </button>
              <button 
                onClick={() => setVisible(false)}
                className="tracking-toast-button tracking-toast-close-button"
              >
                ×
              </button>
            </>
          )}
        </div>
      </div>
      
      {(!isMinimized) && (
        <div className="tracking-toast-time">
          <div className="tracking-toast-time-container">
            <span className="tracking-toast-time-icon">⏱️</span>
            <span>Time on page: {formatTime(timeSpent)}</span>
          </div>
        </div>
      )}
      
      {expanded && !isMinimized && (
        <>
          <div className="tracking-toast-section">
            <div className="tracking-toast-section-header">
              <span>ACTIVITY LOG</span>
              <span className="tracking-toast-event-count">
                {events.length} events
              </span>
            </div>
            
            <div className="tracking-toast-scroll-container">
              {recentEvents.length === 0 ? (
                <div className="tracking-toast-no-events">
                  NO EVENTS RECORDED
                </div>
              ) : (
                <>
                  {recentEvents.map((event, index) => (
                    <div 
                      key={event.eventId || index} 
                      className={`
                        tracking-toast-event 
                        ${getEventTypeClass(event.eventType)}
                        ${isNewEvent(index) ? 'tracking-toast-event-new' : ''}
                      `}
                    >
                      <div className="tracking-toast-event-header">
                        <span className="tracking-toast-event-type">
                          <span>{getEventIcon(event.eventType)}</span>
                          {event.eventType}
                        </span>
                        <span className="tracking-toast-event-time">
                          {isMobile ? getRelativeTime(event.timestamp).replace(' ago', '') : getRelativeTime(event.timestamp)}
                        </span>
                      </div>
                      
                      <div className="tracking-toast-event-details">
                        {event.eventType === 'pageview' ? (
                          <div>
                            <div className="tracking-toast-event-property">
                              <span className="tracking-toast-event-label">path: </span>
                              <span className="tracking-toast-event-value">{event.metadata?.path || event.url || '/'}</span>
                            </div>
                            {event.title && (
                              <div className="tracking-toast-event-property">
                                <span className="tracking-toast-event-label">title: </span>
                                <span className="tracking-toast-event-value">{event.title}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="tracking-toast-event-property">
                              <span className="tracking-toast-event-label">element: </span>
                              <span className="tracking-toast-event-value">
                                {event.target?.tagName || 'element'}
                                {event.target?.category ? ` [${event.target.category}]` : ''}
                              </span>
                            </div>
                            {event.target?.label && (
                              <div className="tracking-toast-event-property">
                                <span className="tracking-toast-event-label">label: </span>
                                <span className="tracking-toast-event-value">{event.target.label}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          
          <div className="tracking-toast-stats">
            <div className="tracking-toast-stat">
              <span className="tracking-toast-stat-icon" style={{ color: '#4dabf7' }}>👆</span>
              Clicks: {clickCount}
            </div>
            <div className="tracking-toast-stat">
              <span className="tracking-toast-stat-icon" style={{ color: '#12b886' }}>🔍</span>
              Pages: {pageViewCount}
            </div>
            
            {!isMobile && (
              <>
                <div className="tracking-toast-stat">
                  <span className="tracking-toast-stat-icon" style={{ color: '#aaa' }}>💻</span>
                  Device: {isMobile ? 'mobile' : 'desktop'}
                </div>
                <div className="tracking-toast-stat">
                  <span className="tracking-toast-stat-icon" style={{ color: '#aaa' }}>🆔</span>
                  Session: {sessionId.substring(0, 8)}
                </div>
              </>
            )}
            
            <div className={`tracking-toast-privacy-link ${isMobile ? 'tracking-toast-mobile-footer' : ''}`}>
              <a href={privacyUrl}>
                PRIVACY POLICY
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
