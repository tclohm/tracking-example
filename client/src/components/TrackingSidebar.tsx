import React, { useState, useEffect, useRef } from 'react';
import { useTracking } from 'react-user-tracking';
import '../styles/TrackingSidebar.css';

interface TrackingWidgetProps {
  privacyUrl?: string;
  initiallyExpanded?: boolean;
}

const TrackingSidebar: React.FC<TrackingWidgetProps> = ({
  privacyUrl = '/privacy',
  initiallyExpanded = false
}) => {
  const { events, sessionId } = useTracking();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  // Reference to track previously seen events
  const prevEventsCountRef = useRef(events.length);
  
  // Update time counters
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Track new events for highlighting
  useEffect(() => {
    prevEventsCountRef.current = events.length;
  }, [events]);
  
  const isNewEvent = (index: number): boolean => {
    return index < events.length - prevEventsCountRef.current;
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  // Format relative timestamp
  const getRelativeTime = (timestamp: number): string => {
    const seconds = Math.floor((currentTime - timestamp) / 1000);
    
    if (seconds < 5) return 'now';
    if (seconds < 60) return `${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1m';
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1h';
    if (hours < 24) return `${hours}h`;
    
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Get event icon based on type
  const getEventIcon = (eventType: string): string => {
    switch (eventType) {
      case 'pageview': return '🔍';
      case 'click': return '👆';
      case 'form_submit': return '📝';
      case 'heatmap_click': return '🔥';
      default: return '🔔';
    }
  };

  // Count events by type
  const clickCount = events.filter(e => e.eventType === 'click').length;
  const pageViewCount = events.filter(e => e.eventType === 'pageview').length;
  const formSubmitCount = events.filter(e => e.eventType === 'form_submit').length;
  const heatmapClickCount = events.filter(e => e.eventType === 'heatmap_click').length;
  
  // Get most recent events first
  const recentEvents = [...events].reverse().slice(0, 15);
  
  return (
    <div className="tracking-widget-container">
      {/* Summary Widget */}
      <div className="tracking-widget tracking-widget-summary">
        <div className="tracking-widget-title">
          <h3>
            <span className="tracking-widget-title-icon">📊</span>
            Tracking Dashboard
          </h3>
          <div className="tracking-widget-controls">
            <button 
              className="tracking-widget-button" 
              onClick={() => setExpanded(!expanded)}
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? '−' : '+'}
            </button>
          </div>
        </div>
        
        <div className="tracking-widget-stats">
          <div className="tracking-widget-stat">
            <div className="tracking-widget-stat-header">
              <span className="tracking-widget-stat-icon">👆</span>
              <span>Clicks</span>
            </div>
            <div className="tracking-widget-stat-value">{clickCount}</div>
          </div>
          
          <div className="tracking-widget-stat">
            <div className="tracking-widget-stat-header">
              <span className="tracking-widget-stat-icon">🔍</span>
              <span>Page Views</span>
            </div>
            <div className="tracking-widget-stat-value">{pageViewCount}</div>
          </div>
          
          <div className="tracking-widget-stat">
            <div className="tracking-widget-stat-header">
              <span className="tracking-widget-stat-icon">📝</span>
              <span>Forms</span>
            </div>
            <div className="tracking-widget-stat-value">{formSubmitCount}</div>
          </div>
          
          <div className="tracking-widget-stat">
            <div className="tracking-widget-stat-header">
              <span className="tracking-widget-stat-icon">⏱️</span>
              <span>Time</span>
            </div>
            <div className="tracking-widget-stat-value">{formatTime(timeSpent)}</div>
          </div>
        </div>
        
        <div className="tracking-widget-session">
          <span>Session: {sessionId.substring(0, 10)}...</span>
          <span>{events.length} events</span>
        </div>
      </div>
      
      {/* Activity Widget (Expandable) */}
      <div className={`tracking-widget tracking-widget-activity ${expanded ? 'expanded' : ''}`}>
        <div className="tracking-widget-section">
          <div className="tracking-widget-section-header">
            <div className="tracking-widget-section-title">Recent Activity</div>
            <div className="tracking-widget-count">{events.length}</div>
          </div>
          
          {recentEvents.length === 0 ? (
            <div className="tracking-widget-empty">
              <div className="tracking-widget-empty-icon">💤</div>
              <div>No tracking events recorded yet</div>
            </div>
          ) : (
            <div className="tracking-widget-events">
              {recentEvents.map((event, index) => (
                <div 
                  key={event.eventId || index}
                  className={`tracking-widget-event tracking-widget-event-${event.eventType} ${isNewEvent(index) ? 'tracking-widget-event-new' : ''}`}
                >
                  <div className="tracking-widget-event-header">
                    <div className="tracking-widget-event-type">
                      <span>{getEventIcon(event.eventType)}</span>
                      <span>{event.eventType}</span>
                    </div>
                    <div className="tracking-widget-event-time">
                      {getRelativeTime(event.timestamp)}
                    </div>
                  </div>
                  
                  <div className="tracking-widget-event-details">
                    {event.eventType === 'pageview' ? (
                      <>
                        <div>path: {event.metadata?.path || event.url || '/'}</div>
                        {event.title && <div>title: {event.title}</div>}
                      </>
                    ) : (
                      <>
                        <div>
                          element: {event.target?.tagName || 'element'}
                          {event.target?.category ? ` [${event.target.category}]` : ''}
                        </div>
                        {event.target?.label && <div>label: {event.target.label}</div>}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingSidebar;
