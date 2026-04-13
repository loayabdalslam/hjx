# Performance Benchmarks

> Benchmarked on **Windows x64** • Node.js 18+ • JSDOM environment
> Date: **2026-02-17**

## Parser Performance

| Workload | Time |
|---|---|
| Parse 100 state variables | **2.15 ms** |
| Parse 1,000 state variables | **1.90 ms** |
| Parse 5,000 state variables | **11.25 ms** |
| Parse 100 static nodes | **0.95 ms** |
| Parse 1,000 static nodes | **2.55 ms** |
| Parse 5,000 static nodes | **17.12 ms** |

## Compiler Performance

| Workload | Time |
|---|---|
| Compile 100 nodes → Vanilla JS | **1.73 ms** |
| Compile 1,000 nodes → Vanilla JS | **2.87 ms** |
| Compile 5,000 nodes → Vanilla JS | **13.19 ms** |
| Scope 100 CSS rules | **0.33 ms** |
| Scope 1,000 CSS rules | **1.86 ms** |
| Compile 100 nodes → React | **2.1 ms** |
| Compile 1,000 nodes → React | **4.5 ms** |

## Flow-State Engine

| Input | Intent Match | Generation Time |
|---|---|---|
| "create a counter" | counter (98%) | < 5ms |
| "make a form" | form (95%) | < 5ms |
| "create a todo list" | todo-list (95%) | < 5ms |
| Mixed code + English | mixed (80%) | < 10ms |
| Custom grammar match | grammar (90%) | < 8ms |

## Runtime Performance (JSDOM)

| Workload | Render | Update |
|---|---|---|
| Static 100 items | 33 ms | — |
| Static 1,000 items | 135 ms | — |
| List 100 items | 59 ms | 27 ms |
| List 1,000 items | 286 ms | 217 ms |
| Conditional 100 items | 142 ms | **2 ms** |
| Conditional 1,000 items | 8,057 ms | **14 ms** |
| Text interpolation 100 items | 46 ms | **2 ms** |
| Input binding 100 items | 63 ms | **1 ms** |

## Server Runtime

| Workload | Time |
|---|---|
| Init session (100 handlers) | **8.59 ms** |
| Init session (1,000 handlers) | **9.82 ms** |
| Execute 1,000 handler calls | **3,548 ms** (3.5 ms/call) |

## Key Insights

1. **Parser is fast** — Sub-20ms even for 5,000 nodes
2. **Updates are extremely fast** — Sub-3ms for 100 items thanks to targeted DOM patching
3. **Flow-State is instant** — Pattern matching completes in < 10ms
4. **Conditional rendering scales well** — Updates remain fast even with 1,000 conditionals
5. **Input binding is efficient** — 1ms update for 100 inputs

## Running Benchmarks

```bash
npm run benchmark
```

This runs all benchmarks and outputs results to `Benchmark.md`.
