import { useNavigate } from 'react-router';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandButton } from '../components/BrandButton';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center size-24 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] mb-6">
            <Search className="size-12 text-white" />
          </div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-6xl font-bold mb-4"
          >
            404
          </motion.h1>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-bold mb-2"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground mb-8"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <BrandButton
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </BrandButton>
          
          <BrandButton
            variant="primary"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <Home className="size-4" />
            Go to Dashboard
          </BrandButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-xs text-muted-foreground"
        >
          <p>Need help? Visit our <a href="/settings" className="text-[#6366f1] hover:underline">settings page</a></p>
        </motion.div>
      </div>
    </div>
  );
}
