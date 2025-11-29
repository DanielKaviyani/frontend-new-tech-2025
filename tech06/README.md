# Tech06 - Next.js 16.0 (Latest Stable)

## 🎯 Learning Objectives
Master Next.js 16.0's latest stable features including Cache Components with 'use cache', Turbopack as default bundler, proxy.ts, React Compiler (stable), React 19.2 support, and production-ready full-stack capabilities.

## 📋 Prerequisites
- React 19.2 knowledge (see Tech01)
- TypeScript fundamentals
- Understanding of Server Components
- Basic Node.js and web fundamentals

## 📚 Curriculum

### Week 1: Next.js 16 Fundamentals & Major Changes
- [ ] Next.js 16 major features: Cache Components and 'use cache' directive
- [ ] Turbopack as default bundler (stable for dev and production)
- [ ] Breaking changes: middleware.ts → proxy.ts, async request APIs
- [ ] React Compiler (stable) integration and automatic memoization
- [ ] **Project**: Portfolio site with Turbopack bundler and React Compiler optimization

### Week 2: Cache Components & Partial Prerendering
- [ ] Cache Components with 'use cache' directive
- [ ] Partial Prerendering (PPR) completion with Cache Components
- [ ] Opt-in explicit caching vs implicit caching
- [ ] Enhanced Server Components with React 19.2
- [ ] **Project**: News aggregator with Cache Components, PPR, and dynamic/static content mixing

### Week 3: Advanced Development Tools & Performance
- [ ] Turbopack File System Caching (beta) for faster compile times
- [ ] Next.js DevTools MCP for AI-assisted debugging
- [ ] Enhanced logging for builds and development requests
- [ ] React 19.2 features: View Transitions, useEffectEvent, <Activity/>
- [ ] **Project**: Real-time analytics dashboard with DevTools MCP, View Transitions, and performance monitoring

### Week 4: Production & Advanced Patterns
- [ ] Build Adapters API (alpha) for custom build modifications
- [ ] Enhanced routing with layout deduplication and incremental prefetching
- [ ] Improved Caching APIs: updateTag() and refined revalidateTag()
- [ ] proxy.ts implementation for request interception
- [ ] **Final Project**: E-commerce platform with proxy.ts, Build Adapters, advanced caching, and production optimization

## 🛠 Tools & Setup
```bash
# Create Next.js 16 project with React 19.2 (Turbopack default)
npx create-next-app@latest my-next-app --typescript --tailwind --app
cd my-next-app

# Upgrade to Next.js 16 with automated codemod
npx @next/codemod@latest upgrade

# Development (Turbopack is now default - no --turbo flag needed)
npm run dev

# Production build (Turbopack default)
npm run build

# Or install Next.js 16.0.3 and React 19.2 manually
npm install next@16.0.3 react@19.2.0 react-dom@19.2.0

# Node.js 20.9+ and TypeScript 5+ required
npm install -D typescript@5.6.3 @types/react@18.3.12 @types/react-dom@18.3.1
```

## 🔧 New Next.js 16 Tools
```bash
# Automated migration from Next.js 15 to 16
npx @next/codemod@latest upgrade

# Migrate middleware.ts to proxy.ts
# Rename middleware.ts → proxy.ts and export 'proxy' function

# Enable Cache Components in next.config.ts
# cacheComponents: true

# Next.js DevTools MCP for AI debugging (optional)
npm install next-devtools-mcp
```

## 🎨 Practice Projects

### 1. **Portfolio Site with Turbopack & React Compiler** (Week 1)
- **Focus**: Turbopack bundling, React Compiler optimization
- **Features**: Static pages, dynamic routing, automatic memoization
- **Best Practices**: TypeScript 5+, ESLint config, performance metrics
- **Tech Stack**: Next.js 16, React 19.2, Turbopack (default)

### 2. **News Aggregator with Cache Components** (Week 2)
- **Focus**: 'use cache' directive, Partial Prerendering
- **Features**: Mixed static/dynamic content, cache invalidation
- **Best Practices**: Explicit caching strategy, SEO optimization
- **Tech Stack**: Cache Components, PPR, Server Components

### 3. **Analytics Dashboard with Advanced Tooling** (Week 3)
- **Focus**: DevTools MCP, View Transitions, performance monitoring
- **Features**: Real-time data, smooth transitions, AI debugging
- **Best Practices**: File system caching, logging strategies
- **Tech Stack**: React 19.2 features, DevTools MCP, enhanced logging

### 4. **E-commerce Platform** (Week 4 - Final)
- **Focus**: Production deployment, proxy.ts, Build Adapters
- **Features**: Payment processing, inventory management, admin panel
- **Best Practices**: Security, scalability, monitoring
- **Tech Stack**: Full Next.js 16 stack, proxy.ts, production optimization

## 📖 Essential Resources
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Cache Components Guide](https://nextjs.org/docs/app/building-your-application/caching/cache-components)
- [React Compiler with Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/react-compiler)
- [Turbopack Documentation](https://turbo.build/pack/docs)
- [Next.js DevTools MCP](https://www.npmjs.com/package/next-devtools-mcp)

## ⚠️ Breaking Changes Checklist
- [ ] Migrated middleware.ts → proxy.ts with 'proxy' export
- [ ] Updated to Node.js 20.9+ and TypeScript 5.1+
- [ ] Fully async request APIs (no more sync compatibility)
- [ ] Turbopack as default (migrate webpack config if needed)
- [ ] Updated next/image defaults (maximumRedirects: 3)

## ✅ Mastery Checklist

### Core Next.js 16 Features
- [ ] Masters Cache Components with 'use cache' directive
- [ ] Uses Turbopack as default bundler for dev and production
- [ ] Implements React Compiler for automatic optimization
- [ ] Applies Partial Prerendering with Cache Components
- [ ] Migrates from middleware.ts to proxy.ts successfully

### React 19.2 Integration
- [ ] Leverages View Transitions for smooth navigation
- [ ] Uses useEffectEvent for better effect management
- [ ] Implements <Activity/> component for UI state management
- [ ] Applies React Compiler optimizations effectively

### Development & Performance
- [ ] Uses Next.js DevTools MCP for AI-assisted debugging
- [ ] Optimizes with Turbopack File System Caching
- [ ] Implements enhanced logging for development insights
- [ ] Applies advanced caching strategies with updateTag/revalidateTag

### Production Readiness
- [ ] Deploys apps with Build Adapters API customization
- [ ] Implements proper TypeScript 5+ and Node.js 20.9+ setup
- [ ] Uses enhanced routing with layout deduplication
- [ ] Builds scalable applications following Next.js 16 best practices

## 🚀 Next Steps
- Tech01 (React 19.2) for advanced React patterns with Compiler
- Tech15 (TypeScript 5+) with enhanced Next.js 16 support
- Tech22 (State management) with React 19.2 and Cache Components
- Tech30 (Web Vitals) with Next.js 16 and Turbopack optimizations