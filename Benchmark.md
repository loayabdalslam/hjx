# HJX Framework Benchmarks

Date: 2026-02-17T03:32:43.137Z
Platform: win32 x64

## Parser Performance

- Parse 100 state variables: 2.1540 ms
- Parse 1000 state variables: 1.9012 ms
- Parse 5000 state variables: 11.2450 ms
- Parse 100 static nodes: 0.9520 ms
- Parse 1000 static nodes: 2.5544 ms
- Parse 5000 static nodes: 17.1168 ms

## Compiler Performance

### AST to Vanilla JS (Layout & Bindings)

- Compile 100 static nodes: 1.7312 ms
- Compile 1000 static nodes: 2.8730 ms
- Compile 5000 static nodes: 13.1901 ms

### CSS Scoping

- Scope 100 CSS rules: 0.3314 ms
- Scope 1000 CSS rules: 1.8636 ms
- Scope 5000 CSS rules: 13.2182 ms

### Server-Driven Compilation

- Compile 100 static nodes (Server-Driven): 4.0291 ms
- Compile 1000 static nodes (Server-Driven): 4.3129 ms
- Compile 5000 static nodes (Server-Driven): 41.7881 ms

## Server Runtime Performance (Node.js)

### Session Initialization

- Init Session with 100 handlers: 8.5885 ms
- Init Session with 1000 handlers: 9.8178 ms

### Server-Side Handler Execution

- Execute 1000 handler calls (state update): 3547.5162 ms
  Average per call: 3.5475 ms

## Runtime Performance (JSDOM)

### Static Render

- Initial Render 100 items: 33.4269 ms
- Initial Render 1000 items: 134.6692 ms
- Initial Render 2000 items: 190.6899 ms

### List Rendering (For Loop)

- Initial Render 100 items: 59.0953 ms
- Update 100 items: 26.5429 ms
- Initial Render 1000 items: 285.9972 ms
- Update 1000 items: 217.4409 ms
- Initial Render 2000 items: 630.7752 ms
- Update 2000 items: 310.5724 ms

### Conditional Rendering (If)

- Initial Render 100 items: 141.6852 ms
- Update 100 items: 1.9500 ms
- Initial Render 1000 items: 8056.9953 ms
- Update 1000 items: 14.1274 ms
- Initial Render 2000 items: 31983.7775 ms
- Update 2000 items: 129.7308 ms

### Input Binding (2-way)

- Initial Render 100 items: 62.5710 ms
- Update 100 items: 1.0200 ms
- Initial Render 500 items: 1138.1358 ms
- Update 500 items: 3.5023 ms
- Initial Render 1000 items: 3464.9630 ms
- Update 1000 items: 6.7603 ms

### Text Interpolation

- Initial Render 100 items: 45.7540 ms
- Update 100 items: 1.9796 ms
- Initial Render 1000 items: 3437.9881 ms
- Update 1000 items: 22.1705 ms
- Initial Render 2000 items: 14116.6718 ms
- Update 2000 items: 26.2272 ms

### Deep Nesting

- Initial Render 10 items: 1.0894 ms
- Initial Render 50 items: 2.6990 ms
- Initial Render 100 items: 6.2670 ms

### Click Handlers (Event Delegation)

- Initial Render 100 items: 64.9415 ms
- Update 100 items: 112.1592 ms
- Initial Render 1000 items: 6105.0045 ms
- Update 1000 items: 15165.2039 ms
- Initial Render 2000 items: 27768.6729 ms
- Update 2000 items: 48991.6428 ms
