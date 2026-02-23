# EdgeLedger - Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Modern web browser

### Local Development Setup

1. **Install Dependencies**
```bash
pnpm install
# or
npm install
```

2. **Configure Supabase**

Create `/utils/supabase/info.tsx` with your Supabase credentials:

```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

3. **Deploy Supabase Edge Function**

The backend API is located in `/supabase/functions/server/index.tsx`. Deploy it to your Supabase project:

```bash
supabase functions deploy server
```

4. **Set Environment Variables**

In your Supabase project dashboard, set these environment variables for the edge function:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

5. **Start Development Server**
```bash
pnpm run dev
# or
npm run dev
```

6. **Open Application**
Navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## 📦 Project Structure

```
EdgeLedger/
├── /src
│   ├── /app
│   │   ├── /components         # UI components
│   │   ├── /contexts           # State management
│   │   ├── /hooks              # Custom hooks
│   │   ├── /pages              # Route pages
│   │   ├── App.tsx             # Main app component
│   │   └── routes.ts           # Router configuration
│   ├── /utils
│   │   ├── api.ts              # API client
│   │   └── analytics.ts        # Analytics utilities
│   └── /styles
│       ├── theme.css           # Theme tokens
│       └── fonts.css           # Font imports
├── /supabase
│   └── /functions
│       └── /server
│           ├── index.tsx       # Edge function (API)
│           └── kv_store.tsx    # KV storage
├── /public
│   └── manifest.json           # PWA manifest
└── package.json
```

---

## 🗄️ Database Schema

### KV Store Keys

The application uses Supabase KV store with the following key patterns:

#### Settings
```
Key: settings:{userId}
Value: {
  startingBankroll: number
  currentBankroll: number
  weeklyBudget: number
  monthlyBudget: number
  unitSize: number
  stopLoss: number
  stopLossEnabled: boolean
  coolOffEnabled: boolean
  currency: string
  oddsFormat: string
  timezone: string
  notifications: {
    betResults: boolean
    recommendations: boolean
    budgetAlerts: boolean
    weeklyReport: boolean
  }
}
```

#### Bets
```
Key: bet:{userId}:{betId}
Value: {
  id: string
  userId: string
  date: string (ISO 8601)
  event: string
  sport: string
  league: string
  market: string
  odds: number
  stake: number
  bookmaker: string
  status: 'pending' | 'won' | 'lost' | 'void' | 'cashout'
  profit: number
  notes?: string
  createdAt: string (ISO 8601)
  updatedAt: string (ISO 8601)
}
```

### Authentication
Uses Supabase Auth with email/password. User data is stored in `auth.users` table automatically.

---

## 🔌 API Endpoints

Base URL: `https://{project-id}.supabase.co/functions/v1/make-server-d1e0db95`

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Sign in (use Supabase client)

### Bets
- `GET /bets` - Get all user bets
- `GET /bets/:id` - Get single bet
- `POST /bets` - Create new bet
- `PUT /bets/:id` - Update bet
- `DELETE /bets/:id` - Delete bet
- `POST /bets/bulk-delete` - Delete multiple bets

### Settings
- `GET /settings` - Get user settings
- `PUT /settings` - Update settings

### Analytics
- `GET /analytics/stats` - Get user statistics

All endpoints (except signup) require `Authorization: Bearer {token}` header.

---

## 🎨 Theming & Customization

### Theme Tokens

Theme tokens are defined in `/src/styles/theme.css` using CSS variables:

```css
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
  /* ... more tokens */
}
```

### Customizing Colors

1. Edit `/src/styles/theme.css`
2. Update color values
3. Both light and dark modes use the same token names
4. Changes apply globally

### Adding Custom Components

1. Create component in `/src/app/components/`
2. Follow existing patterns (TypeScript, Tailwind CSS)
3. Export component
4. Import where needed

---

## 🔧 Configuration

### PWA Configuration

Edit `/public/manifest.json`:

```json
{
  "name": "EdgeLedger - Sports Betting Tracker",
  "short_name": "EdgeLedger",
  "theme_color": "#6366f1",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [...]
}
```

### Router Configuration

Routes are defined in `/src/app/routes.ts`. To add a new route:

```typescript
{
  path: '/new-route',
  element: <SuspenseWrapper><NewPage /></SuspenseWrapper>
}
```

### Analytics Configuration

Analytics formulas can be customized in `/src/utils/analytics.ts`.

---

## 📱 Building for Production

### Build Command
```bash
pnpm run build
# or
npm run build
```

This creates an optimized production build in `/dist`.

### Preview Production Build
```bash
pnpm run preview
# or
npm run preview
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables (none needed for frontend)
4. Deploy

Vercel automatically:
- Detects Vite configuration
- Optimizes build
- Enables CDN
- Provides SSL

### Option 2: Netlify

1. Push code to GitHub
2. Import project in Netlify dashboard
3. Build command: `pnpm run build`
4. Publish directory: `dist`
5. Deploy

### Option 3: Custom Server

1. Build the project: `pnpm run build`
2. Serve the `/dist` folder with any static file server
3. Ensure all routes redirect to `index.html` (for SPA routing)

Example with Express:
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000);
```

### Option 4: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔐 Security Best Practices

### Frontend Security
- ✅ All forms have validation
- ✅ XSS prevention through React
- ✅ Sensitive data never in localStorage
- ✅ HTTPS enforced in production
- ✅ Input sanitization

### Backend Security
- ✅ JWT authentication
- ✅ Rate limiting (via Supabase)
- ✅ CORS configured
- ✅ Service role key secured
- ✅ User data isolated by userId

### Environment Variables
Never commit these files:
- `/utils/supabase/info.tsx` (contains API keys)
- `.env` files
- Supabase credentials

---

## 📊 Monitoring & Analytics

### Performance Monitoring

The app includes built-in performance monitoring:

```typescript
import { PerformanceMonitor } from './hooks/usePerformance';

PerformanceMonitor.mark('operation-start');
// ... your code
PerformanceMonitor.measure('operation-complete', 'operation-start');
```

### Error Tracking

To add error tracking (e.g., Sentry):

1. Install Sentry SDK:
```bash
pnpm add @sentry/react
```

2. Initialize in `App.tsx`:
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.NODE_ENV,
});
```

---

## 🧪 Testing

### Recommended Testing Setup

1. **Unit Tests** - Vitest
```bash
pnpm add -D vitest @testing-library/react
```

2. **E2E Tests** - Playwright
```bash
pnpm add -D @playwright/test
```

3. **Type Checking**
```bash
pnpm tsc --noEmit
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Supabase Connection Error
- Verify `projectId` and `publicAnonKey` in `/utils/supabase/info.tsx`
- Check Supabase project is active
- Ensure edge function is deployed

#### 2. Authentication Not Working
- Check browser console for errors
- Verify Supabase Auth is enabled in dashboard
- Check CORS settings in edge function

#### 3. Build Errors
- Clear `node_modules` and reinstall: `pnpm install`
- Clear build cache: `rm -rf dist`
- Check for TypeScript errors: `pnpm tsc --noEmit`

#### 4. Performance Issues
- Enable React DevTools Profiler
- Check for unnecessary re-renders
- Verify lazy loading is working
- Check bundle size with `pnpm run build --analyze`

---

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org)
- [Motion (Framer Motion)](https://motion.dev)

### Support
- GitHub Issues (create issues for bugs)
- Documentation in `/FEATURES.md` and `/PROJECT_SUMMARY.md`

---

## 🎉 You're Ready!

EdgeLedger is now set up and ready for development or deployment. Follow the phases outlined in the project summary to understand all features available.

For questions or issues, refer to the comprehensive documentation in `/PROJECT_SUMMARY.md` and `/FEATURES.md`.

**Happy Tracking! 🎯**
