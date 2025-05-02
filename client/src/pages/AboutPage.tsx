import { React, useRef } from 'react'
import { usePageViewTracking, useTracking } from 'react-user-tracking';
const AboutPage = () => {
  usePageViewTracking();
  return (
    <div>
      <main>
        <div className="container">
          <h1>ABOUT</h1>
          <p className="monospace">
            A DEMONSTRATION OF THE REACT-USER-TRACKING LIBRARY
          </p>
          
          <div style={{ marginTop: '2rem' }}>
            <h2>FEATURES</h2>
            <ul style={{ fontFamily: 'var(--font-monospace)', marginTop: '1rem', marginLeft: '1.5rem' }}>
              <li>AUTOMATIC PAGE VIEW TRACKING</li>
              <li>ELEMENT CLICK TRACKING</li>
              <li>FORM SUBMISSION TRACKING</li>
              <li>DEVICE AND BROWSER DETECTION</li>
              <li>BATCHED EVENT SENDING</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <h2>HOW TO USE</h2>
            <p className="monospace">
              CHECK THE TRACKING TOAST IN THE BOTTOM RIGHT CORNER
              TO SEE YOUR ACTIVITY BEING TRACKED IN REAL-TIME.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
