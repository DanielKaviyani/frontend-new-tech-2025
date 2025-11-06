# Tech01 - React 19.2 with Server Components

## 🎯 Learning Objectives
Master React 19.2 features including Server Components, Actions, new hooks like useActionState and useEffectEvent, and modern patterns for building scalable applications.

## 📋 Prerequisites
- Basic JavaScript (ES6+)
- HTML & CSS fundamentals
- Basic understanding of Node.js

## 📚 Curriculum

### Week 1: React 19.2 Fundamentals
- [ ] React 19.2 new features overview
- [ ] Actions and automatic form handling
- [ ] New hooks: useActionState, useFormStatus, useOptimistic
- [ ] Enhanced Server Components with 'use client'/'use server' directives
- [ ] **Project**: Build a form handling app with Actions and new hooks

### Week 2: Advanced Server Components & Actions
- [ ] Server Components with 'use server' directive
- [ ] Client Components with 'use client' directive
- [ ] Server Actions for data mutations
- [ ] Optimistic updates with useOptimistic
- [ ] **Project**: Blog with Server Components and Server Actions

### Week 3: Advanced Hooks & Performance
- [ ] useEffectEvent for separating events from effects
- [ ] Activity component for component lifecycle management
- [ ] Enhanced concurrent features with Actions
- [ ] Performance optimization with React Compiler
- [ ] **Project**: Advanced search interface with Activity and performance monitoring

### Week 4: Production-Ready Patterns
- [ ] Partial Pre-rendering for faster load times
- [ ] Enhanced error boundaries with Server Components
- [ ] cacheSignal for resource management
- [ ] Performance tracks in Chrome DevTools
- [ ] **Final Project**: E-commerce product catalog with React 19.2 optimizations

## 🛠 Tools & Setup
```bash
# Create new React app with React 19.2
npx create-react-app my-react-app
# or with Vite (recommended)
npm create react@latest my-react-app -- --template typescript
# Update to React 19.2
npm install react@19.2.0 react-dom@19.2.0
# Update ESLint for new hooks
npm install eslint-plugin-react-hooks@latest
```

## 📖 Essential Resources
- [React 19.2 Official Docs](https://react.dev/)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [React 19.2 Release Notes](https://react.dev/blog/2025/10/01/react-19-2)
- [Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)

## 🎨 Practice Projects
1. **News Reader**: Server-side rendered news app
2. **Dashboard**: Real-time analytics dashboard
3. **Social Feed**: Infinite scroll with suspense

## ✅ Mastery Checklist
- [ ] Can explain Server vs Client Components with new directives
- [ ] Implements Actions and Server Actions effectively
- [ ] Uses new hooks: useActionState, useFormStatus, useOptimistic
- [ ] Applies useEffectEvent for better effect management
- [ ] Utilizes Activity component for performance optimization
- [ ] Builds production-ready applications with React 19.2
- [ ] Understands React 19.2 mental model and best practices

## 🚀 Next Steps
After mastering React 19.2, consider:
- Tech06 (Next.js 15) for full-stack React with App Router
- Tech15 (TypeScript) for type safety with enhanced React 19.2 support
- Tech22 (Redux Toolkit) for advanced state management patterns