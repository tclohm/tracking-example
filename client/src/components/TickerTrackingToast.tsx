import React, { useState, useEffect, useRef } from 'react';
import { useTracking } from 'react-user-tracking';
import '../styles/TickerTrackingToast.css';

interface TickerTrackingToastProps {
  privacyUrl?: string;
  tickerSpeed?: number; // Speed of ticker scrolling in pixels per second
  maxEvents?: number; // Maximum number of events to keep in memory
  initiallyVisible?: boolean;
  initiallyExpanded?: boolean;
}

export default function TickerTrackingToast({
  privacyUrl = '/privacy',
  tickerSpeed = 30,
  maxEvents = 100,
  initiallyVisible = true,
  initiallyExpanded = false
}: TickerTrackingToastProps): JSX.Element | null {
  const { events, sessionId } = useTracking();
  const [visible, setVisible] = useState(initiallyVisible);
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [isPaused, setIsPaused] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // References for ticker functionality
  const tickerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  
  // Track previous events count to highlight new events
  const prevEventsCountRef = useRef(0);
  
  // Time counter for "time on page"
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter to show most recent events first
  const recentEvents = [...events]
    .slice(-maxEvents)
    .reverse();
  
  // Get stats
  const clickCount = events.filter(e => e.eventType === 'click').length;
  const pageViewCount = events.filter(e => e.eventType === 'pageview').length;
  
  // Animate ticker
  useEffect(() => {
    if (!tickerRef.current || !visible || expanded || isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastTimestampRef.current;
      if (elapsed > 0) {
        // Calculate the movement based on tickerSpeed
        const movement = (tickerSpeed * elapsed) / 1000;
        
        if (tickerRef.current) {
          // Get the width of the ticker content
          const tickerContent = tickerRef.current.querySelector('.ticker-content') as HTMLElement;
          if (tickerContent) {
            const currentLeft = parseFloat(tickerContent.style.transform.replace('translateX(', '').replace('px)', '') || '0');
            const contentWidth = tickerContent.offsetWidth;
            const containerWidth = tickerRef.current.offsetWidth;
            
            if (Math.abs(currentLeft) >= contentWidth) {
              // Reset position when all content has scrolled
              tickerContent.style.transform = `translateX(${containerWidth}px)`;
            } else {
              // Move the content to the left
              tickerContent.style.transform = `translateX(${currentLeft - movement}px)`;
            }
          }
        }
        
        lastTimestampRef.current = timestamp;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visible, expanded, isPaused, tickerSpeed]);
  
  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  // Get relative time
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
    
    return new Date(timestamp).toLocaleTimeString();
  };
  
  // Get event type icon and color
  const getEventInfo = (eventType: string) => {
    switch (eventType) {
      case 'pageview': 
        return { icon: '🔍', colorClass: 'event-pageview' };
      case 'click': 
        return { icon: '👆', colorClass: 'event-click' };
      case 'form_submit': 
        return { icon: '📝', colorClass: 'event-form' };
      case 'heatmap_click':
        return { icon: '🔥', colorClass: 'event-heatmap' };
      default: 
        return { icon: '🔔', colorClass: 'event-custom' };
    }
  };
  
  // Check if an event is new
  const isNewEvent = (index: number): boolean => {
    return index < events.length - prevEventsCountRef.current;
  };
  
  // Update previous events count
  useEffect(() => {
    prevEventsCountRef.current = events.length;
  }, [events]);
  
  // Don't render anything if not visible
  if (!visible) {
    return (
      <button 
        className="ticker-toggle-button"
        onClick={() => setVisible(true)}
        title="Show tracking information"
      >
        <span>📊</span>
      </button>
    );
  }
  
  return (
    <div className={`ticker-tracking-toast ${expanded ? 'expanded' : ''}`}>
      {!expanded ? (
        // Ticker View (Collapsed)
        <>
          <div className="ticker-controls">
            <button 
              className="ticker-button"
              onClick={() => setExpanded(true)}
              title="Expand"
            >
              <span>↑</span>
            </button>
            <button 
              className="ticker-button"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Resume" : "Pause"}
            >
              <span>{isPaused ? "▶" : "⏸"}</span>
            </button>
            <button 
              className="ticker-button"
              onClick={() => setVisible(false)}
              title="Hide"
            >
              <span>×</span>
            </button>
          </div>
          
          <div className="ticker-container" ref={tickerRef}>
            <div className="ticker-content" style={{ transform: 'translateX(0px)' }}>
              <div className="ticker-item ticker-stats">
                <span className="ticker-time">⏱️ {formatTime(timeSpent)}</span>
                <span className="ticker-count">👆 Clicks: {clickCount}</span>
                <span className="ticker-count">🔍 Pages: {pageViewCount}</span>
                <span className="ticker-count">🆔 Session: {sessionId.substring(0, 8)}</span>
              </div>
              
              {recentEvents.slice(0, 5).map((event, index) => {
                const { icon, colorClass } = getEventInfo(event.eventType);
                return (
                  <div 
                    key={event.eventId || index} 
                    className={`ticker-item ${colorClass} ${isNewEvent(index) ? 'new-event' : ''}`}
                  >
                    <span className="ticker-icon">{icon}</span>
                    <span className="ticker-event-type">{event.eventType}</span>
                    <span className="ticker-time">{getRelativeTime(event.timestamp)}</span>
                    {event.eventType === 'pageview' && (
                      <span className="ticker-detail">
                        {event.metadata?.path || event.url?.split('?')[0] || '/'}
                      </span>
                    )}
                    {event.eventType === 'click' && (
                      <span className="ticker-detail">
                        {event.target?.tagName || 'element'}
                        {event.target?.category ? ` [${event.target.category}]` : ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        // Expanded View
        <>
          <div className="ticker-header">
            <div className="ticker-title">
              <span className="ticker-icon">👁️</span>
              <span>Activity Tracker</span>
            </div>
            <div className="ticker-controls">
              <button 
                className="ticker-button"
                onClick={() => setExpanded(false)}
                title="Collapse"
              >
                <span>↓</span>
              </button>
              <button 
                className="ticker-button"
                onClick={() => setVisible(false)}
                title="Hide"
              >
                <span>×</span>
              </button>
            </div>
          </div>
          
          <div className="ticker-expanded-content">
            <div className="ticker-stats-panel">
              <div className="ticker-stat-group">
                <div className="ticker-stat">
                  <span className="ticker-icon">⏱️</span>
                  <span>Time on page: {formatTime(timeSpent)}</span>
                </div>
                <div className="ticker-stat">
                  <span className="ticker-icon">👆</span>
                  <span>Clicks: {clickCount}</span>
                </div>
                <div className="ticker-stat">
                  <span className="ticker-icon">🔍</span>
                  <span>Page views: {pageViewCount}</span>
                </div>
              </div>
              <div className="ticker-stat-group">
                <div className="ticker-stat">
                  <span className="ticker-icon">💻</span>
                  <span>Device: {window.innerWidth <= 768 ? 'mobile' : 'desktop'}</span>
                </div>
                <div className="ticker-stat">
                  <span className="ticker-icon">🆔</span>
                  <span>Session ID: {sessionId.substring(0, 8)}</span>
                </div>
                <div className="ticker-stat">
                  <span className="ticker-icon">📊</span>
                  <span>Total events: {events.length}</span>
                </div>
              </div>
            </div>
            
            <div className="ticker-events-container">
              <div className="ticker-section-header">Recent Activity</div>
              
              <div className="ticker-events-list">
                {recentEvents.length === 0 ? (
                  <div className="ticker-no-events">No activity recorded yet</div>
                ) : (
                  recentEvents.map((event, index) => {
                    const { icon, colorClass } = getEventInfo(event.eventType);
                    return (
                      <div 
                        key={event.eventId || index} 
                        className={`ticker-event-card ${colorClass} ${isNewEvent(index) ? 'new-event' : ''}`}
                      >
                        <div className="ticker-event-header">
                          <div className="ticker-event-type">
                            <span className="ticker-icon">{icon}</span>
                            <span>{event.eventType}</span>
                          </div>
                          <div className="ticker-event-time">{getRelativeTime(event.timestamp)}</div>
                        </div>
                        
                        <div className="ticker-event-details">
                          {event.eventType === 'pageview' && (
                            <>
                              <div className="ticker-event-property">
                                <span className="ticker-property-label">path:</span>
                                <span className="ticker-property-value">{event.metadata?.path || event.url?.split('?')[0] || '/'}</span>
                              </div>
                              {event.title && (
                                <div className="ticker-event-property">
                                  <span className="ticker-property-label">title:</span>
                                  <span className="ticker-property-value">{event.title}</span>
                                </div>
                              )}
                            </>
                          )}
                          
                          {(event.eventType === 'click' || event.eventType === 'heatmap_click') && (
                            <>
                              <div className="ticker-event-property">
                                <span className="ticker-property-label">element:</span>
                                <span className="ticker-property-value">
                                  {event.target?.tagName || 'element'}
                                  {event.target?.category ? ` [${event.target.category}]` : ''}
                                </span>
                              </div>
                              {event.position && (
                                <div className="ticker-event-property">
                                  <span className="ticker-property-label">position:</span>
                                  <span className="ticker-property-value">
                                    {event.position.x}, {event.position.y}
                                  </span>
                                </div>
                              )}
                              {event.target?.label && (
                                <div className="ticker-event-property">
                                  <span className="ticker-property-label">label:</span>
                                  <span className="ticker-property-value">{event.target.label}</span>
                                </div>
                              )}
                            </>
                          )}
                          
                          {event.eventType === 'form_submit' && (
                            <>
                              <div className="ticker-event-property">
                                <span className="ticker-property-label">form:</span>
                                <span className="ticker-property-value">
                                  {event.metadata?.formName || event.target?.formId || 'unnamed form'}
                                </span>
                              </div>
                              {event.metadata?.fields && (
                                <div className="ticker-event-property">
                                  <span className="ticker-property-label">fields:</span>
                                  <span className="ticker-property-value">
                                    {event.metadata.fields.length} field(s)
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            <div className="ticker-footer">
              <a href={privacyUrl} className="ticker-privacy-link">Privacy Policy</a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
