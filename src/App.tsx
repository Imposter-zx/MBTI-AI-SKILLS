import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Lazy-loaded pages — each becomes a separate chunk, shrinking the initial bundle
const HomePage    = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const TypesPage   = lazy(() => import('./pages/TypesPage').then((m) => ({ default: m.TypesPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const ComparePage = lazy(() => import('./pages/ComparePage').then((m) => ({ default: m.ComparePage })));
const BuilderPage = lazy(() => import('./pages/BuilderPage').then((m) => ({ default: m.BuilderPage })));
const LabPage     = lazy(() => import('./pages/LabPage').then((m) => ({ default: m.LabPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

/** Minimal suspense fallback — matches the app background color */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c14]">
      <div className="flex items-center gap-3 text-slate-500">
        <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <span className="text-sm font-mono">Loading…</span>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"            element={<HomePage />} />
              <Route path="/types"       element={<TypesPage />} />
              <Route path="/types/:type" element={<ProfilePage />} />
              <Route path="/compare"     element={<ComparePage />} />
              <Route path="/builder"     element={<BuilderPage />} />
              <Route path="/lab"         element={<LabPage />} />
              <Route path="/404"         element={<NotFoundPage />} />
              <Route path="*"            element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
