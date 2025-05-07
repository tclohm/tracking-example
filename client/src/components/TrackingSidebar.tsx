import React, { useState, useEffect, useRef } from 'react';
import { useTracking } from 'react-user-tracking';
import '../styles/TrackingSidebar.css';

interface TrackingSidebarProps {
  privacyUrl?: string;
  initiallyExpanded?: boolean;
}

const TrackingSidebar: React.FC<TrackingSidebarProps> = ({ 
  privacyUrl = '/privacy',
  initiallyExpanded = false
}) => {
  const { events, sessionId } = useTracking();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('activity'); // 'activity' or 'stats'
  
  // Reference to track previously seen events
  const prevEventsCountRef = useRef(events.length);
  
  // Update current time for relative timestamps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Check if event is new (to highlight)
  useEffect(() => {
    prevEventsCountRef.current = events.length;
  }, [events]);
  
  const isNewEvent = (index: number): boolean => {
    return index < events.length - prevEventsCountRef.current;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
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
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  // Count different event types
  const clickCount = events.filter(e => e.eventType === 'click').length;
  const pageViewCount = events.filter(e => e.eventType === 'pageview').length;
  const formSubmitCount = events.filter(e => e.eventType === 'form_submit').length;
  const heatmapClickCount = events.filter(e => e.eventType === 'heatmap_click').length;
  
  // Get most recent events first (reversed)
  const recentEvents = [...events].reverse().slice(0, 20); // Only show last 20 events
  
  return (
    <div className={`tracking-sidebar ${expanded ? 'expanded' : ''}`}>
      {/* Toggle Button */}
      <div className="tracking-sidebar-toggle" onClick={() => setExpanded(!expanded)}>
        <span className="tracking-sidebar-toggle-icon">
          {expanded ? '❯' : '❮'}
        </span>
      </div>
      
      {/* Header */}
      <div className="tracking-sidebar-header">
        <div className="tracking-sidebar-title">
          <span className="tracking-sidebar-title-icon">👁️</span>
          User Tracking
        </div>
        <div className="tracking-sidebar-timer">
          <span className="tracking-sidebar-timer-icon">⏱️</span>
          {formatTime(timeSpent)}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="tracking-sidebar-tabs">
        <div 
          className={`tracking-sidebar-tab ${activeTab === 'activity' ? 'tracking-sidebar-tab-active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </div>
        <div 
          className={`tracking-sidebar-tab ${activeTab === 'stats' ? 'tracking-sidebar-tab-active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </div>
      </div>
      
      {/* Activity Feed */}
      {activeTab === 'activity' && (
        <div className="tracking-sidebar-content">
          <div className="tracking-sidebar-events-header">
            <span className="tracking-sidebar-events-title">Recent Events</span>
            <span className="tracking-sidebar-events-count">
              {events.length}
            </span>
          </div>
          
          {recentEvents.length === 0 ? (
            <div className="tracking-sidebar-no-events">
              No events recorded yet
            </div>
          ) : (
            <div>
              {recentEvents.map((event, index) => (
                <div 
                  key={event.eventId || index} 
                  className={`tracking-sidebar-event tracking-sidebar-event-${event.eventType} ${isNewEvent(index) ? 'tracking-sidebar-event-new' : ''}`}
                >
                  <div className="tracking-sidebar-event-header">
                    <div className="tracking-sidebar-event-type">
                      <span className="tracking-sidebar-event-icon">
                        {getEventIcon(event.eventType)}
                      </span>
                      {event.eventType}
                    </div>
                    <div className="tracking-sidebar-event-time">
                      {getRelativeTime(event.timestamp)}
                    </div>
                  </div>
                  
                  <div className="tracking-sidebar-event-details">
                    {event.eventType === 'pageview' ? (
                      <div>
                        <div className="tracking-sidebar-event-property">
                          <span className="tracking-sidebar-event-label">path: </span>
                          <span>{event.metadata?.path || event.url || '/'}</span>
                        </div>
                        {event.title && (
                          <div className="tracking-sidebar-event-property">
                            <span className="tracking-sidebar-event-label">title: </span>
                            <span>{event.title}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="tracking-sidebar-event-property">
                          <span className="tracking-sidebar-event-label">element: </span>
                          <span>
                            {event.target?.tagName || 'element'}
                            {event.target?.category ? ` [${event.target.category}]` : ''}
                          </span>
                        </div>
                        {event.target?.label && (
                          <div className="tracking-sidebar-event-property">
                            <span className="tracking-sidebar-event-label">label: </span>
                            <span>{event.target.label}</span>
                          </div>
                        )}
                        {event.position && (
                          <div className="tracking-sidebar-event-position">
                            <span>x: {Math.round(event.position.x)}</span>
                            <span>y: {Math.round(event.position.y)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Stats View */}
      {activeTab === 'stats' && (
        <div className="tracking-sidebar-content">
          <div className="tracking-sidebar-stats-section">
            <h3 className="tracking-sidebar-stats-title">Event Summary</h3>
            <div className="tracking-sidebar-stats-grid">
              <div className="tracking-sidebar-stat tracking-sidebar-stat-clicks">
                <span className="tracking-sidebar-stat-icon">👆</span>
                <div className="tracking-sidebar-stat-data">
                  <div className="tracking-sidebar-stat-value">{clickCount}</div>
                  <div className="tracking-sidebar-stat-label">Clicks</div>
                </div>
              </div>
              
              <div className="tracking-sidebar-stat tracking-sidebar-stat-pageviews">
                <span className="tracking-sidebar-stat-icon">🔍</span>
                <div className="tracking-sidebar-stat-data">
                  <div className="tracking-sidebar-stat-value">{pageViewCount}</div>
                  <div className="tracking-sidebar-stat-label">Page Views</div>
                </div>
              </div>
              
              <div className="tracking-sidebar-stat tracking-sidebar-stat-forms">
                <span className="tracking-sidebar-stat-icon">📝</span>
                <div className="tracking-sidebar-stat-data">
                  <div className="tracking-sidebar-stat-value">{formSubmitCount}</div>
                  <div className="tracking-sidebar-stat-label">Form Submits</div>
                </div>
              </div>
              
              <div className="tracking-sidebar-stat tracking-sidebar-stat-heatmap">
                <span className="tracking-sidebar-stat-icon">🔥</span>
                <div className="tracking-sidebar-stat-data">
                  <div className="tracking-sidebar-stat-value">{heatmapClickCount}</div>
                  <div className="tracking-sidebar-stat-label">Heat Map Clicks</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="tracking-sidebar-stats-section">
            <h3 className="tracking-sidebar-stats-title">Session Info</h3>
            <div className="tracking-sidebar-session">
              <div className="tracking-sidebar-session-row">
                <span className="tracking-sidebar-session-label">Session ID:</span>
                <span className="tracking-sidebar-session-value">{sessionId.substring(0, 12)}...</span>
              </div>
              <div className="tracking-sidebar-session-row">
                <span className="tracking-sidebar-session-label">Device:</span>
                <span>{window.innerWidth <= 768 ? 'Mobile' : 'Desktop'}</span>
              </div>
              <div className="tracking-sidebar-session-row">
                <span className="tracking-sidebar-session-label">Duration:</span>
                <span>{formatTime(timeSpent)}</span>
              </div>
            </div>
          </div>
          
          <div className="tracking-sidebar-privacy">
            <a 
              href={privacyUrl}
              className="tracking-sidebar-privacy-link"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingSidebar;
