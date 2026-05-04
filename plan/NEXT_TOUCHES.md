# HJX Next Touches - Quick Reference

**Last Updated:** 2026-05-04  
**Current Phase:** 7 (Bug Fixes & Stability)  
**Next 4 Weeks:** Phases 7-8

---

## 🚨 Immediate Actions (This Week)

### 1. Fix Critical Test Failure
```bash
# Current status: Tests fail on import
npm test -- --run

# Fix: Remove orchestrator import from classifier.ts
# File: src/nlp/intent/classifier.ts
# Action: Delete line 1, implement fallback classification
```

**Time:** 30 minutes

### 2. Clean Git State
```bash
# Restore deleted example files
git restore examples/01-beginner-counter.hjx
git restore examples/02-beginner-todo.hjx
git restore examples/03-intermediate-form.hjx
git restore examples/04-intermediate-dashboard.hjx
git restore examples/05-advanced-ecommerce.hjx

# Commit lovable deletions
git add src/lovable/
git commit -m "Remove lovable integration"
```

**Time:** 15 minutes

### 3. Organize Untracked Files
```bash
# Delete redundant docs
rm EXAMPLES_COMPLETE.md EXAMPLES_SETUP.md IMPLEMENTATION_COMPLETE.md

# Add organized files
git add grammar-english.yml src/components/variants.ts src/nlp/flow/component_patterns.ts

# Commit
git commit -m "Organize untracked files"
```

**Time:** 15 minutes

### 4. Verify Everything Works
```bash
npm run build
npm test -- --run
npm run dev  # Test on http://localhost:5172
```

**Time:** 10 minutes

**Total This Week:** ~1 hour

---

## 📋 Phase 7 Detailed Tasks (Weeks 1-2)

### Week 1: Bug Fixes

| Task | File | Action | Time |
|------|------|--------|------|
| Fix orchestrator import | `src/nlp/intent/classifier.ts` | Remove import, implement fallback | 1h |
| Fix neural generator | `src/nlp/generation/neural-generator.ts` | Remove orchestrator dependency | 1h |
| Update NLP index | `src/nlp/index.ts` | Update exports | 30m |
| Restore examples | `examples/*.hjx` | Git restore | 15m |
| Commit deletions | `src/lovable/` | Git commit | 15m |
| Organize files | Various | Delete/add files | 30m |
| Run tests | All | Verify passing | 30m |

**Week 1 Total:** ~4.5 hours

### Week 2: Verification & Polish

| Task | Command | Expected Result | Time |
|------|---------|-----------------|------|
| Full test suite | `npm test -- --run` | All tests pass | 1h |
| Build check | `npm run build` | No errors | 30m |
| Dev server | `npm run dev` | Runs on 5172 | 30m |
| Examples test | Manual | All examples work | 1h |
| Documentation | Review | README, CLAUDE.md current | 1h |
| Git cleanup | `git status` | Clean working tree | 30m |

**Week 2 Total:** ~4.5 hours

**Phase 7 Total:** ~9 hours

---

## 🎯 Phase 8 Preview (Weeks 3-4)

### Performance Optimization

**Goals:**
- Parser: -20% time
- Compiler: -15% time
- Runtime: <3ms updates

**Key Tasks:**

1. **Profile Parser** (2h)
   ```bash
   npm run build
   node --prof dist/cli.js parse examples/counter.hjx
   node --prof-process isolate-*.log > profile.txt
   ```

2. **Optimize Tokenizer** (3h)
   - Cache common patterns
   - Reduce regex compilations
   - Benchmark improvements

3. **Optimize Compiler** (3h)
   - Reduce AST traversals
   - Cache computed values
   - Parallel compilation

4. **Benchmark Runtime** (2h)
   - Measure DOM updates
   - Profile signal reactivity
   - Identify bottlenecks

5. **Add Performance Tests** (2h)
   - Regression detection
   - Benchmark suite
   - CI integration

**Phase 8 Total:** ~12 hours

---

## 📊 Current Project Status

### Completed ✅
- Phase 1: Design System Foundation
- Phase 2: Built-in Component Library (10 components)
- Phase 3: Grammar Extension
- Phase 4: Variants & Composition
- Phase 5: Task Tracking System
- Phase 6: Documentation & Examples

### In Progress 🔄
- Phase 7: Bug Fixes & Stability (THIS WEEK)

### Upcoming 📅
- Phase 8: Performance Optimization (Weeks 3-4)
- Phase 9: Enhanced Error Handling (Weeks 5-6)
- Phase 10: Testing Infrastructure (Weeks 7-8)

---

## 🔧 Development Commands

```bash
# Build
npm run build

# Test
npm test                    # Watch mode
npm test -- --run          # Single run
npm run coverage           # Coverage report

# Development
npm run dev                # Dev server (port 5172)
npm run docs:dev           # Docs server (port 5173)

# CLI
node dist/cli.js parse examples/counter.hjx
node dist/cli.js build examples/counter.hjx --out dist-app
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
node dist/cli.js flow "create a counter"
```

---

## 📁 Key Files to Know

### Core Compiler
- `src/parser.ts` - HJX → AST
- `src/compiler/vanilla.ts` - Vanilla JS target
- `src/compiler/react.ts` - React target
- `src/compiler/nl_css.ts` - Natural language CSS

### NLP Engine
- `src/nlp/flow/flow_engine.ts` - Main engine
- `src/nlp/intent/classifier.ts` - Intent classification
- `src/nlp/generation/neural-generator.ts` - Code generation

### Components
- `src/components/registry.ts` - Component registry
- `src/components/variants.ts` - Variant definitions
- `src/design-system/tokens.ts` - Design tokens

### CLI & Dev
- `src/cli.ts` - CLI entry point
- `src/devserver.ts` - Dev server with hot reload

---

## 🐛 Known Issues

### Critical (Phase 7)
1. ❌ Missing orchestrator module - FIXING THIS WEEK
2. ❌ Deleted files in git - FIXING THIS WEEK
3. ❌ Untracked files - FIXING THIS WEEK

### Medium (Phase 8-9)
- Parser performance could be optimized
- Error messages could be more helpful
- Test coverage is incomplete

### Low (Phase 10+)
- Documentation could be more comprehensive
- Examples could be more diverse
- Community templates needed

---

## 📈 Success Metrics

### This Week (Phase 7)
- ✅ Tests pass: `npm test -- --run`
- ✅ Build succeeds: `npm run build`
- ✅ Git status clean: `git status`
- ✅ Dev server works: `npm run dev`

### This Month (Phases 7-8)
- ✅ All bugs fixed
- ✅ Performance improved 20%
- ✅ Test coverage 70%+
- ✅ Zero critical issues

### This Quarter (Phases 7-10)
- ✅ Test coverage 80%+
- ✅ Error handling improved
- ✅ Performance optimized
- ✅ Integration tests added

---

## 🚀 Quick Start for New Contributors

1. **Clone & Setup**
   ```bash
   git clone https://github.com/loayabdalslam/hjx.git
   cd hjx
   npm install
   npm run build
   ```

2. **Run Tests**
   ```bash
   npm test -- --run
   ```

3. **Start Dev Server**
   ```bash
   npm run dev
   ```

4. **Read Documentation**
   - `CLAUDE.md` - Project overview
   - `README.md` - Feature guide
   - `plan/LONGTERM_PLAN.md` - Strategic plan
   - `plan/PHASE_7_ACTION_PLAN.md` - Current phase

---

## 📞 Questions?

- **Architecture:** See `CLAUDE.md`
- **Features:** See `README.md`
- **Long-term:** See `plan/LONGTERM_PLAN.md`
- **Current Phase:** See `plan/PHASE_7_ACTION_PLAN.md`

---

**Last Updated:** 2026-05-04  
**Next Update:** 2026-05-11
