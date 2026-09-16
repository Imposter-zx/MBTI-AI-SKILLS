import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { TypesPage } from './pages/TypesPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComparePage } from './pages/ComparePage';
import { BuilderPage } from './pages/BuilderPage';
import { LabPage } from './pages/LabPage';

export function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/types" element={<TypesPage />} />
            <Route path="/types/:type" element={<ProfilePage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
