import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCallback } from 'react';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Compare from './pages/Compare';
import NotFound from './pages/NotFound';
import CompareBar from './components/CompareBar/CompareBar';
import { usePullToRefresh } from './hooks/usePullToRefresh';

function App() {
  const onRefresh = useCallback(() => {
    // In a real PWA, this might trigger a service worker update or refetch queries.
    // For this app, doing a hard reload guarantees we get fresh assets/data.
    window.location.reload();
  }, []);

  const pullDistance = usePullToRefresh(onRefresh, 70);

  return (
    <BrowserRouter>
      <div 
        className="ptr-indicator"
        style={{ 
          transform: `translateY(${pullDistance - 50}px) translateX(-50%)`,
          opacity: pullDistance > 10 ? Math.min(pullDistance / 70, 1) : 0,
        }}
        aria-hidden="true"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" height="24" 
          stroke="currentColor" strokeWidth="2" fill="none" 
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: `rotate(${pullDistance * 4}deg)` }}
        >
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
      </div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:id" element={<Detail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Global comparison tray — visible on all routes */}
      <CompareBar />
    </BrowserRouter>
  );
}

export default App;
