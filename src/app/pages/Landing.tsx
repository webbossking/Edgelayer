import { Link } from 'react-router';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  CheckCircle2, 
  Moon, 
  Sun,
  ArrowRight,
  Zap,
  Lock,
  Bell,
  Target,
  DollarSign,
  LineChart,
  Activity,
  Award,
  Users,
  Globe
} from 'lucide-react';
import { BrandButton } from '../components/BrandButton';
import { useTheme } from '../contexts/ThemeContext';

export function Landing() {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into your betting patterns, ROI by sport, and performance metrics that matter."
    },
    {
      icon: DollarSign,
      title: "Bankroll Management",
      description: "Smart budgeting tools, unit sizing calculators, and automatic stop-loss enforcement."
    },
    {
      icon: Target,
      title: "Kelly Criterion",
      description: "Optimize your stake sizes with Kelly Criterion calculator and risk management tools."
    },
    {
      icon: LineChart,
      title: "Performance Tracking",
      description: "Track every bet with detailed stats, profit/loss trends, and comprehensive bet history."
    },
    {
      icon: Zap,
      title: "Smart Recommendations",
      description: "AI-powered bet suggestions based on your historical performance and betting patterns."
    },
    {
      icon: Bell,
      title: "Real-time Alerts",
      description: "Stay informed with customizable notifications for bet results and bankroll milestones."
    }
  ];

  const stats = [
    { value: "50K+", label: "Tracked Bets" },
    { value: "98%", label: "Uptime" },
    { value: "2.4x", label: "Avg ROI Increase" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="font-semibold text-lg tracking-tight">EdgeLedger</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="size-4 text-muted-foreground" />
                ) : (
                  <Sun className="size-4 text-muted-foreground" />
                )}
              </button>
              <Link to="/signin">
                <BrandButton variant="ghost" size="sm">Sign In</BrandButton>
              </Link>
              <Link to="/signup">
                <BrandButton variant="primary" size="sm">Get Started →</BrandButton>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-background to-[#8b5cf6]/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6366f1]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 text-sm mb-8"
            >
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366f1] opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-[#6366f1]" />
              </span>
              <span className="text-foreground">Now with AI-powered recommendations</span>
            </motion.div>

            {/* Hero Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Your edge in{' '}
              <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent animate-gradient">
                sports betting
              </span>
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Professional bet tracking, bankroll management, and analytics platform. 
              Make data-driven decisions and maximize your ROI.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link to="/signup">
                <BrandButton variant="primary" size="lg" className="group">
                  Start Free Trial
                  <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </BrandButton>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="size-8 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] border-2 border-background" />
                ))}
              </div>
              <span>Trusted by 10,000+ professional bettors</span>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 max-w-6xl mx-auto"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute -inset-4 bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 rounded-3xl blur-3xl" />
              
              {/* Dashboard Showcase */}
              <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-muted/30 border-b border-border px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-red-500/80" />
                    <div className="size-3 rounded-full bg-yellow-500/80" />
                    <div className="size-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 text-center text-xs text-muted-foreground">
                    app.edgeledger.com/dashboard
                  </div>
                </div>
                
                {/* App Preview Content */}
                <div className="p-6 bg-gradient-to-br from-background to-muted/20">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {/* KPI Cards */}
                    {[
                      { label: 'Total Profit', value: '+₦324,050', change: '+12.5%', positive: true },
                      { label: 'Win Rate', value: '58.3%', change: '+3.2%', positive: true },
                      { label: 'ROI', value: '14.8%', change: '-1.4%', positive: false }
                    ].map((kpi, i) => (
                      <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                        className="bg-card border border-border rounded-lg p-4"
                      >
                        <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
                        <div className="text-2xl font-bold mb-1">{kpi.value}</div>
                        <div className={`text-xs ${kpi.positive ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                          {kpi.change}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Chart Placeholder */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                      className="bg-card border border-border rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-semibold">Performance Trend</div>
                        <TrendingUp className="size-4 text-[#10b981]" />
                      </div>
                      <div className="h-32 flex items-end gap-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.5, delay: 1.1 + i * 0.05 }}
                            className="flex-1 bg-gradient-to-t from-[#6366f1] to-[#8b5cf6] rounded-t"
                          />
                        ))}
                      </div>
                    </motion.div>
                    
                    {/* Recent Bets */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                      className="bg-card border border-border rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-semibold">Recent Bets</div>
                        <Activity className="size-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-3">
                        {[
                          { sport: 'NBA', team: 'Lakers vs Celtics', result: 'won', amount: '+₦12,500' },
                          { sport: 'NFL', team: 'Chiefs -3.5', result: 'won', amount: '+₦20,000' },
                          { sport: 'MLB', team: 'Yankees ML', result: 'lost', amount: '-₦10,000' }
                        ].map((bet, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 1.3 + i * 0.1 }}
                            className="flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-medium text-foreground">{bet.team}</div>
                              <div className="text-muted-foreground">{bet.sport}</div>
                            </div>
                            <div className={`font-semibold ${bet.result === 'won' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                              {bet.amount}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Everything you need to win
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional-grade tools designed for serious bettors who want to maximize their edge
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl hover:shadow-[#6366f1]/5 hover:border-[#6366f1]/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                <div className="relative">
                  <div className="bg-[#6366f1]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="size-6 text-[#6366f1]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Built for trust & security
              </h2>
              <p className="text-lg text-muted-foreground">
                Your data is encrypted and secure. We take responsible gambling seriously.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Lock, title: "Bank-level Security", description: "256-bit encryption and secure data storage" },
                { icon: Shield, title: "Privacy First", description: "Your betting data stays private, always" },
                { icon: Globe, title: "Responsible Gambling", description: "Built-in tools to promote healthy betting habits" }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#6366f1]/10 mb-4">
                    <item.icon className="size-8 text-[#6366f1]" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade when you're ready
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-2">Starter</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">Free</span>
                </div>
                <p className="text-sm text-muted-foreground">Perfect for getting started</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 100 bets/month",
                  "Basic analytics",
                  "Manual bet entry",
                  "7-day history",
                  "Email support"
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-[#10b981] shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <BrandButton variant="secondary" className="w-full">
                  Get Started
                </BrandButton>
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card border-2 border-[#6366f1] rounded-2xl p-8 relative shadow-2xl shadow-[#6366f1]/10 scale-105"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-2">Pro</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">₦1,000</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">For serious bettors</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited bets",
                  "Advanced analytics & insights",
                  "Kelly Criterion calculator",
                  "AI recommendations",
                  "Unlimited history",
                  "Priority support",
                  "Export data"
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-[#10b981] shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <BrandButton variant="primary" className="w-full">
                  Start Free Trial
                </BrandButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]" />
        <div className="absolute inset-0 bg-grid-white/5" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to gain your edge?
            </h2>
            <p className="text-lg text-white/90 mb-10">
              Join thousands of professional bettors using EdgeLedger to track, analyze, and optimize their betting strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <BrandButton 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-[#6366f1] hover:bg-white/90"
                >
                  Start Free Trial
                  <ArrowRight className="size-4 ml-2" />
                </BrandButton>
              </Link>
              <Link to="/dashboard">
                <BrandButton 
                  variant="secondary" 
                  size="lg"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  View Demo
                </BrandButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="font-semibold text-lg tracking-tight">EdgeLedger</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Professional bet tracking, bankroll management, and analytics platform for serious sports bettors.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="size-4" />
                <p>Bet responsibly. 1-800-GAMBLER</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Demo</Link></li>
                <li><Link to="/signup" className="hover:text-foreground transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 EdgeLedger. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}