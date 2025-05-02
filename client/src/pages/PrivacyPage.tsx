import React, { useRef } from 'react';
import { usePageViewTracking, useClickTracking } from 'react-user-tracking';
const PrivacyPage = () => {
  // Track page view
  let pageRef = useRef(null)
  usePageViewTracking();
  
  useClickTracking(pageRef, 'page', 'privacy_page');
  
  return (
    <div ref={pageRef}>
      <main>
        <div className="container">
          <h1>PRIVACY POLICY</h1>
          <p className="monospace">
            THIS IS A DEMO APPLICATION. NO REAL DATA IS BEING COLLECTED.
          </p>
          
          <div style={{ marginTop: '2rem' }}>
            <h2>DATA COLLECTION</h2>
            <p className="monospace">
              THE REACT-USER-TRACKING LIBRARY DEMONSTRATES HOW TO TRACK:
            </p>
            <ul style={{ fontFamily: 'var(--font-monospace)', marginTop: '1rem', marginLeft: '1.5rem' }}>
              <li>PAGE VIEWS</li>
              <li>CLICK EVENTS</li>
              <li>FORM SUBMISSIONS</li>
              <li>DEVICE INFORMATION</li>
            </ul>
            <p className="monospace" style={{ marginTop: '1rem' }}>
              IN A REAL APPLICATION, THIS DATA WOULD TYPICALLY BE SENT TO AN
              ANALYTICS SERVER. IN THIS DEMO, ALL DATA REMAINS LOCAL TO YOUR BROWSER.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
