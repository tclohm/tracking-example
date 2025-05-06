import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { TrackingProvider, trackingService } from 'react-user-tracking';
import TickerTrackingToast from './components/TickerTrackingToast';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { CartProvider } from './context/CartContext';

// Pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'


trackingService.config = {
  ...trackingService.config,
  apiEndpoint: 'http://localhost:3001/api/track',
}



function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <TrackingProvider>
        <CartProvider>
          <Router>
          <header>
            <div className="container">
              <div className="header-content">
                <div className="site-title">
                  <Link to="/">USER TRACKING</Link>
                </div>
                <nav>
                  <ul>
                    <li><Link to="/" className="nav-link">HOME</Link></li>
                    <li><Link to="/about" className="nav-link">ABOUT</Link></li>
                    <li><Link to="/privacy" className="nav-link">PRIVACY</Link></li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Routes>
          <footer>
            <div className="container">
              <div>© 2025 USER TRACKING</div>
              <div className="footer-links">
                <a href="https://github.com/yourusername/react-user-tracking" target="_blank" rel="noopener noreferrer">GITHUB</a>
                <a href="#" target="_blank" rel="noopener noreferrer">DOCUMENTATION</a>
                <a href="#" target="_blank" rel="noopener noreferrer">SUPPORT</a>
              </div>
            </div>
          </footer>
          </Router>
        </CartProvider>
        <TickerTrackingToast 
        privacyUrl="/privacy" 
        tickerSpeed={40}
        maxEvents={100}
        initiallyVisible={true}
        initiallyExpanded={false}
        />
      </TrackingProvider>
    </ThemeProvider>
  );
}

export default App;
