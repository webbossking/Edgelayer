import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { BrandButton } from '../components/BrandButton';

export function Cover() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#6366f1] flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.div
            className="inline-flex items-center justify-center size-24 rounded-2xl bg-white/10 backdrop-blur-sm mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BarChart3 className="size-12" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            EdgeLedger
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-3 text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Bet Tracker, Bankroll Management & Sports Betting Analytics
          </motion.p>

          <motion.p
            className="text-lg text-white/70 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            A premium SaaS platform for professional bettors. Track every wager, analyze
            performance, and manage your bankroll with sophisticated tools designed for
            winning.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/landing">
              <button className="px-8 py-4 bg-white text-[#6366f1] rounded-lg font-semibold hover:bg-white/90 transition-all inline-flex items-center gap-2 shadow-xl">
                View Landing Page
                <ArrowRight className="size-5" />
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20">
                View Dashboard
              </button>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            className="mt-20 grid md:grid-cols-3 gap-6 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="font-semibold mb-2">8 Complete Screens</h3>
              <p className="text-sm text-white/70">
                Landing, Signup, Dashboard, Recommendations, Tracker, Insights, Bankroll,
                Settings
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="font-semibold mb-2">Light & Dark Themes</h3>
              <p className="text-sm text-white/70">
                Smooth theme toggle with premium design tokens for both modes
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="font-semibold mb-2">Fully Responsive</h3>
              <p className="text-sm text-white/70">
                Optimized for desktop (1440px), tablet (1024px), and mobile (390px)
              </p>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="mt-12 flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Link to="/landing">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm hover:bg-white/20 transition-all border border-white/20">
                Landing
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm hover:bg-white/20 transition-all border border-white/20">
                Signup
              </button>
            </Link>
            <Link to="/recommendations">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm hover:bg-white/20 transition-all border border-white/20">
                Recommendations
              </button>
            </Link>
            <Link to="/tracker">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm hover:bg-white/20 transition-all border border-white/20">
                Tracker
              </button>
            </Link>
            <Link to="/insights">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm hover:bg-white/20 transition-all border border-white/20">
                Insights
              </button>
            </Link>
            <Link to="/bankroll">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm hover:bg-white/20 transition-all border border-white/20">
                Bankroll
              </button>
            </Link>
            <Link to="/settings">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm hover:bg-white/20 transition-all border border-white/20">
                Settings
              </button>
            </Link>
            <Link to="/components">
              <button className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm hover:bg-white/20 transition-all border border-white/20">
                Components
              </button>
            </Link>
          </motion.div>

          {/* Navigation Hint */}
          <motion.p
            className="mt-12 text-sm text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Professional SaaS Design • Premium Components • Production Ready
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}