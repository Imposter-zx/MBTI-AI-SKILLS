import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Home, Compass, Wrench } from 'lucide-react';
import { Button } from '../components/shared/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        {/* Animated brain */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Brain className="w-12 h-12 text-cyan-400" />
            </div>
          </div>
        </motion.div>

        {/* Error code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-purple-500 mb-2">
            404
          </div>
          <h1 className="text-2xl font-bold text-slate-200 mb-3">
            Cognitive Dead-End
          </h1>
          <p className="text-slate-500 leading-relaxed mb-8">
            The neural path you're looking for doesn't exist in this framework.
            Try reorienting your cognitive map.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/">
              <Button size="lg">
                <Home className="w-4 h-4" />
                Return Home
              </Button>
            </Link>
            <Link to="/types">
              <Button variant="secondary" size="lg">
                <Compass className="w-4 h-4" />
                Explore Types
              </Button>
            </Link>
            <Link to="/builder">
              <Button variant="ghost" size="lg">
                <Wrench className="w-4 h-4" />
                Open Builder
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Subtle hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 text-xs text-slate-700 font-mono"
        >
          error: route_not_found · cognitive_map: reload_required
        </motion.p>
      </div>
    </div>
  );
}
