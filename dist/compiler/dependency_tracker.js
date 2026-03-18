export class DependencyTracker {
    graph = {
        stateToElements: new Map(),
        stateToComputed: new Map(),
        computedDeps: new Map(),
        computedExprs: new Map(),
        elementExpressions: new Map(),
        handlerEffects: new Map(),
        elementParents: new Map(),
        dynamicElements: new Set(),
        metrics: {
            totalElements: 0,
            totalExpressions: 0,
            hotStates: []
        }
    };
    startTime = 0;
    expressionCount = 0;
    dependencyCache = new Map();
    cacheTTL = 60000; // 1 minute cache TTL
    batchMode = false;
    pendingUpdates = new Map();
    /**
     * Main entry point - analyzes entire AST
     */
    analyze(ast) {
        this.startTime = performance.now();
        this.clearCache();
        // Collect all state keys and computed keys
        const stateKeys = new Set([
            ...Object.keys(ast.state || {}),
            ...Object.keys(ast.computed || {})
        ]);
        const context = {
            stateKeys,
            path: [],
            inDynamicBlock: false,
            trackNestedProperties: true // Enable nested property tracking
        };
        // Initialize state sets so all defined states appear in nodes
        if (ast.state) {
            for (const key of Object.keys(ast.state)) {
                this.graph.stateToElements.set(key, new Set());
            }
        }
        // Analyze layout
        if (ast.layout) {
            this.traverseNode(ast.layout, context);
        }
        // Analyze computed values
        if (ast.computed) {
            this.analyzeComputed(ast.computed, stateKeys);
        }
        // Analyze handlers
        if (ast.handlers) {
            this.analyzeHandlers(ast.handlers, stateKeys);
        }
        // Post-processing
        this.calculateMetrics();
        this.validateGraph();
        const analysisTime = performance.now() - this.startTime;
        return {
            graph: this.graph,
            metrics: {
                analysisTime,
                elementCount: this.graph.elementExpressions.size,
                expressionCount: this.expressionCount,
                dependencyCount: Array.from(this.graph.stateToElements.values())
                    .reduce((acc, set) => acc + set.size, 0),
                totalElements: this.graph.metrics.totalElements,
                hotStates: this.graph.metrics.hotStates
            }
        };
    }
    /**
     * Clear dependency cache
     */
    clearCache() {
        const now = Date.now();
        for (const [key, entry] of this.dependencyCache.entries()) {
            if (now - entry.timestamp > this.cacheTTL) {
                this.dependencyCache.delete(key);
            }
        }
    }
    /**
     * Begin batch operations mode
     */
    beginBatch() {
        this.batchMode = true;
        this.pendingUpdates.clear();
    }
    /**
     * End batch operations mode
     */
    endBatch() {
        this.batchMode = false;
        this.processPendingUpdates();
    }
    /**
     * Process pending batch updates
     */
    processPendingUpdates() {
        this.pendingUpdates.forEach((deps, elementId) => {
            deps.forEach(dep => {
                if (!this.graph.stateToElements.has(dep)) {
                    this.graph.stateToElements.set(dep, new Set());
                }
                this.graph.stateToElements.get(dep).add(elementId);
            });
        });
        this.pendingUpdates.clear();
    }
    /**
     * Clean up resources
     */
    cleanup() {
        this.dependencyCache.clear();
        this.pendingUpdates.clear();
        // Optional: clear graphs for unused components
        this.graph = {
            stateToElements: new Map(),
            stateToComputed: new Map(),
            computedDeps: new Map(),
            computedExprs: new Map(),
            elementExpressions: new Map(),
            handlerEffects: new Map(),
            elementParents: new Map(),
            dynamicElements: new Set(),
            metrics: {
                totalElements: 0,
                totalExpressions: 0,
                hotStates: []
            }
        };
        this.expressionCount = 0;
    }
    /**
     * Recursively traverse layout nodes
     */
    traverseNode(node, context) {
        const elementId = node.id || this.generateElementId(context.path);
        const wasDynamic = context.inDynamicBlock;
        // Track dynamic blocks
        if (node.kind === 'if' || node.kind === 'for' || node.kind === 'else') {
            context.inDynamicBlock = true;
            this.graph.dynamicElements.add(elementId);
        }
        // Analyze all possible dependency sources
        this.analyzeText(node.text, elementId, context);
        this.analyzeAttributes(node.attrs, elementId, context);
        this.analyzeCondition(node.condition, elementId, context);
        this.analyzeLoop(node.iterator, elementId, context);
        this.analyzeEvents(node.events, elementId, context);
        this.analyzeBindings(node.bind, elementId, context);
        // Recurse into children
        if (node.children) {
            node.children.forEach((child, index) => {
                const childPath = [...context.path, index];
                // Use the same ID generation logic as the child will use
                const childId = child.id || this.generateElementId(childPath);
                this.graph.elementParents.set(childId, elementId);
                // Pass context modifications to children
                let childContext = {
                    ...context,
                    path: childPath,
                    inDynamicBlock: context.inDynamicBlock || node.kind === 'if' || node.kind === 'for',
                    currentIfCondition: node.kind === 'if' ? node.condition : context.currentIfCondition
                };
                // Add loop-specific context
                if (node.kind === 'for' && node.iterator) {
                    childContext = {
                        ...childContext,
                        currentLoopItem: node.iterator.item,
                        currentLoopListSource: node.iterator.list
                    };
                }
                this.traverseNode(child, childContext);
            });
        }
        context.inDynamicBlock = wasDynamic;
    }
    /**
     * Generate stable ID based on path
     */
    generateElementId(path) {
        if (path.length === 0)
            return 'root';
        return `el_${path.join('_')}`;
    }
    /**
     * Analyze text content for dependencies
     */
    analyzeText(text, elementId, context) {
        if (!text)
            return;
        const deps = this.extractDependencies(text, context);
        if (deps.size === 0)
            return;
        const expression = {
            type: 'text',
            expression: text,
            dependencies: deps
        };
        this.addElementExpression(elementId, expression);
        this.mapDepsToElement(deps, elementId);
    }
    /**
     * Analyze attributes for dependencies
     */
    analyzeAttributes(attrs, elementId, context) {
        if (!attrs)
            return;
        for (const [key, value] of Object.entries(attrs)) {
            if (value.includes('{{')) {
                const deps = this.extractDependencies(value, context);
                if (deps.size > 0) {
                    const expression = {
                        type: 'attribute',
                        expression: value,
                        dependencies: deps,
                        attribute: key
                    };
                    this.addElementExpression(elementId, expression);
                    this.mapDepsToElement(deps, elementId);
                }
            }
        }
    }
    /**
     * Analyze condition expressions
     */
    analyzeCondition(condition, elementId, context) {
        if (!condition)
            return;
        const deps = this.extractDependencies(condition, context);
        if (deps.size === 0)
            return;
        const expression = {
            type: 'condition',
            expression: condition,
            dependencies: deps
        };
        this.addElementExpression(elementId, expression);
        this.mapDepsToElement(deps, elementId);
    }
    /**
     * Analyze loop expressions
     */
    analyzeLoop(iterator, elementId, context) {
        if (!iterator)
            return;
        const deps = this.extractDependencies(iterator.list, context);
        if (deps.size === 0)
            return;
        const expression = {
            type: 'loop',
            expression: iterator.list,
            dependencies: deps,
            item: iterator.item,
            list: iterator.list
        };
        this.addElementExpression(elementId, expression);
        this.mapDepsToElement(deps, elementId);
    }
    /**
     * Analyze event handlers
     */
    analyzeEvents(events, elementId, context) {
        if (!events)
            return;
        for (const [eventName, handlerName] of Object.entries(events)) {
            const expression = {
                type: 'event',
                expression: handlerName,
                dependencies: new Set(),
                eventName,
                handlerName
            };
            this.addElementExpression(elementId, expression);
            // Events don't create state dependencies directly
        }
    }
    /**
     * Analyze two-way bindings
     */
    analyzeBindings(bind, elementId, context) {
        if (!bind)
            return;
        if (context.stateKeys.has(bind.state)) {
            const deps = new Set([bind.state]);
            const expression = {
                type: 'binding',
                expression: bind.state,
                dependencies: deps,
                bindProp: bind.prop
            };
            this.addElementExpression(elementId, expression);
            this.mapDepsToElement(deps, elementId);
        }
    }
    /**
     * Extract state dependencies from an expression
     */
    extractDependencies(expr, context) {
        // Check cache first
        const cacheKey = `${expr}|${context.inDynamicBlock}|${context.currentLoopItem}|${context.currentLoopListSource}`;
        const cached = this.dependencyCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            return new Set(cached.deps); // Return a copy
        }
        const deps = this.extractDependenciesImpl(expr, context);
        // Cache the result
        this.dependencyCache.set(cacheKey, {
            deps: new Set(deps),
            timestamp: Date.now()
        });
        return deps;
    }
    /**
     * Internal implementation of dependency extraction
     */
    extractDependenciesImpl(expr, context) {
        const deps = new Set();
        // 1. IMPROVED REGEX: Capture variables inside interpolations and bare logic
        // The original regex was too restrictive for complex expressions
        const interpolationRegex = /\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g;
        let match;
        while ((match = interpolationRegex.exec(expr)) !== null) {
            this.processDependencyToken(match[1], context, deps);
        }
        // 2. FIX: Analyze bare identifiers even if {{ exists elsewhere
        // Original logic skipped this if '{{' was present, missing mixed expressions
        const cleanExpr = expr.replace(/\{\{|\}\}/g, ' ');
        const tokens = cleanExpr.split(/[^A-Za-z0-9_.]+/);
        for (const token of tokens) {
            if (token.trim()) {
                this.processDependencyToken(token, context, deps);
            }
        }
        // 3. FIX: Loop Reactivity Logic
        // If an expression uses a loop 'item', the element MUST depend on the 'list'
        // so that if the list is sorted/replaced, the item re-renders.
        if (context.currentLoopItem && expr.includes(context.currentLoopItem)) {
            if (context.currentLoopListSource) {
                deps.add(context.currentLoopListSource);
            }
        }
        return deps;
    }
    /**
     * FIX: Recursive Dependency Resolution
     * Added to ensure that elements depending on Computed B
     * are also linked to State A if Computed B depends on A.
     */
    resolveFullDependencyChain(directDeps) {
        const fullDeps = new Set(directDeps);
        const toProcess = Array.from(directDeps);
        while (toProcess.length > 0) {
            const dep = toProcess.pop();
            const subDeps = this.graph.computedDeps.get(dep);
            if (subDeps) {
                subDeps.forEach(sd => {
                    if (!fullDeps.has(sd)) {
                        fullDeps.add(sd);
                        toProcess.push(sd);
                    }
                });
            }
        }
        return fullDeps;
    }
    /**
     * Process a single dependency token
     */
    processDependencyToken(token, context, deps) {
        const rootKey = token.split('.')[0];
        // Skip if not a valid state key
        if (!context.stateKeys.has(rootKey))
            return;
        // Skip reserved words
        if (this.isReservedWord(rootKey))
            return;
        // Skip current loop item
        if (rootKey === context.currentLoopItem)
            return;
        // Add root dependency
        deps.add(rootKey);
        // Add full path for nested property tracking if enabled
        if (context.trackNestedProperties && token.includes('.')) {
            deps.add(token);
        }
    }
    /**
     * Map dependencies to element
     */
    mapDepsToElement(deps, elementId) {
        if (this.batchMode) {
            // Batch mode - store pending updates
            if (!this.pendingUpdates.has(elementId)) {
                this.pendingUpdates.set(elementId, new Set());
            }
            deps.forEach(dep => this.pendingUpdates.get(elementId).add(dep));
        }
        else {
            // Immediate mode - update directly
            deps.forEach(dep => {
                if (!this.graph.stateToElements.has(dep)) {
                    this.graph.stateToElements.set(dep, new Set());
                }
                this.graph.stateToElements.get(dep).add(elementId);
            });
        }
    }
    /**
     * Add expression to element
     */
    addElementExpression(elementId, expression) {
        if (!this.graph.elementExpressions.has(elementId)) {
            this.graph.elementExpressions.set(elementId, []);
        }
        this.graph.elementExpressions.get(elementId).push(expression);
        this.expressionCount++;
    }
    /**
     * Analyze computed values
     */
    analyzeComputed(computed, stateKeys) {
        // First pass: store expressions
        for (const [key, expr] of Object.entries(computed)) {
            this.graph.computedExprs.set(key, expr);
        }
        // Second pass: build dependency graph
        for (const [key, expr] of Object.entries(computed)) {
            const deps = this.extractDependencies(expr, {
                stateKeys,
                path: [],
                inDynamicBlock: false,
                trackNestedProperties: true
            });
            this.graph.computedDeps.set(key, deps);
            // Map state to computed
            deps.forEach(dep => {
                if (!this.graph.stateToComputed.has(dep)) {
                    this.graph.stateToComputed.set(dep, new Set());
                }
                this.graph.stateToComputed.get(dep).add(key);
            });
        }
        // Check for circular dependencies
        this.checkCircularDependencies();
    }
    /**
     * Check for circular dependencies in computed values
     */
    checkCircularDependencies() {
        const visiting = new Set();
        const visited = new Set();
        const dfs = (key, stack) => {
            if (stack.has(key)) {
                const cycle = Array.from(stack).concat(key).join(' -> ');
                throw new Error(`Circular dependency detected in computed values: ${cycle}`);
            }
            if (visited.has(key))
                return;
            visiting.add(key);
            stack.add(key);
            const deps = this.graph.computedDeps.get(key);
            if (deps) {
                deps.forEach(dep => {
                    if (this.graph.computedDeps.has(dep)) {
                        dfs(dep, new Set(stack));
                    }
                });
            }
            visiting.delete(key);
            visited.add(key);
        };
        this.graph.computedDeps.forEach((_, key) => {
            if (!visited.has(key)) {
                dfs(key, new Set());
            }
        });
    }
    /**
     * Analyze handlers to track state modifications
     */
    analyzeHandlers(handlers, stateKeys) {
        for (const [handlerName, handler] of Object.entries(handlers)) {
            const modified = new Set();
            if (handler.body && Array.isArray(handler.body)) {
                handler.body.forEach((line) => {
                    // Look for set statements
                    const setMatch = line.match(/set\s+([A-Za-z_][A-Za-z0-9_]*)/);
                    if (setMatch) {
                        const stateKey = setMatch[1];
                        if (stateKeys.has(stateKey)) {
                            modified.add(stateKey);
                        }
                    }
                    // Look for increment/decrement
                    const incMatch = line.match(/set\s+([A-Za-z_][A-Za-z0-9_]*)\s*\+{2}/);
                    if (incMatch) {
                        const stateKey = incMatch[1];
                        if (stateKeys.has(stateKey)) {
                            modified.add(stateKey);
                        }
                    }
                    // Look for decrement
                    const decMatch = line.match(/set\s+([A-Za-z_][A-Za-z0-9_]*)\s*\-{2}/);
                    if (decMatch) {
                        const stateKey = decMatch[1];
                        if (stateKeys.has(stateKey)) {
                            modified.add(stateKey);
                        }
                    }
                    // Look for compound assignment
                    const compoundMatch = line.match(/set\s+([A-Za-z_][A-Za-z0-9_]*)\s*[\+\-\*\/%]\s*=\s*/);
                    if (compoundMatch) {
                        const stateKey = compoundMatch[1];
                        if (stateKeys.has(stateKey)) {
                            modified.add(stateKey);
                        }
                    }
                    // Look for direct assignment with dot notation (object properties)
                    const dotMatch = line.match(/set\s+([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)\s*=/);
                    if (dotMatch) {
                        const stateKey = dotMatch[1];
                        if (stateKeys.has(stateKey)) {
                            modified.add(stateKey);
                        }
                    }
                });
            }
            this.graph.handlerEffects.set(handlerName, modified);
        }
    }
    /**
     * Calculate performance metrics
     */
    calculateMetrics() {
        // Find hot states (affect many elements)
        const hotStates = [];
        // Look at all state and computed keys
        const allKeys = new Set([
            ...this.graph.stateToElements.keys(),
            ...this.graph.stateToComputed.keys()
        ]);
        allKeys.forEach((state) => {
            const affectedCount = this.getAffectedElements(state).size;
            hotStates.push({ key: state, count: affectedCount });
        });
        // Sort by count descending
        hotStates.sort((a, b) => b.count - a.count);
        this.graph.metrics = {
            totalElements: this.graph.elementExpressions.size,
            totalExpressions: this.expressionCount,
            hotStates
        };
    }
    /**
     * Validate the dependency graph
     */
    validateGraph() {
        try {
            this.checkForOrphanedElements();
            this.checkForMissingDependencies();
            this.checkForInvalidReferences();
        }
        catch (error) {
            console.error('Graph validation failed:', error);
            // Don't throw - validation is non-critical
        }
    }
    /**
     * Check for orphaned elements
     */
    checkForOrphanedElements() {
        this.graph.elementExpressions.forEach((_, elementId) => {
            if (elementId !== 'root' && !this.graph.elementParents.has(elementId)) {
                console.warn(`Warning: Element ${elementId} has no parent reference`);
            }
        });
    }
    /**
     * Check for missing dependencies
     */
    checkForMissingDependencies() {
        this.graph.elementExpressions.forEach((expressions, elementId) => {
            expressions.forEach(expr => {
                expr.dependencies.forEach(dep => {
                    const rootKey = dep.split('.')[0];
                    if (!this.graph.stateToElements.has(rootKey) &&
                        !this.graph.computedDeps.has(rootKey) &&
                        !this.graph.stateToComputed.has(rootKey)) {
                        console.warn(`Warning: Element ${elementId} depends on missing state '${rootKey}'`);
                    }
                });
            });
        });
    }
    /**
     * Check for invalid references
     */
    checkForInvalidReferences() {
        // Check for unused state variables
        const usedState = new Set([
            ...this.graph.stateToElements.keys(),
            ...this.graph.stateToComputed.keys()
        ]);
        // This would be logged in development mode
        // console.log('Used state keys:', Array.from(usedState));
    }
    /**
     * Check if a word is a JavaScript reserved word
     */
    isReservedWord(word) {
        const reserved = new Set([
            // Keywords
            'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
            'default', 'delete', 'do', 'else', 'export', 'extends', 'finally',
            'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return',
            'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void',
            'while', 'with', 'yield',
            // Future reserved
            'enum', 'implements', 'interface', 'let', 'package', 'private',
            'protected', 'public', 'static',
            // Literals
            'true', 'false', 'null', 'undefined',
            // Global objects
            'Infinity', 'NaN', 'undefined',
            // Strict mode
            'await'
        ]);
        return reserved.has(word);
    }
    /**
     * Get dependency statistics
     */
    getStats() {
        return {
            totalStates: this.graph.stateToElements.size,
            totalComputed: this.graph.computedDeps.size,
            totalElements: this.graph.elementExpressions.size,
            totalDynamicElements: this.graph.dynamicElements.size,
            cacheSize: this.dependencyCache.size,
            avgDependenciesPerElement: this.expressionCount / Math.max(1, this.graph.elementExpressions.size)
        };
    }
    /**
     * Find elements affected by a state change
     */
    getAffectedElements(stateKey) {
        const elements = new Set();
        const processedComputed = new Set();
        // Helper to find elements through computed chains recursively
        const collectFromComputed = (computedKey) => {
            if (processedComputed.has(computedKey))
                return;
            processedComputed.add(computedKey);
            // 1. Elements directly watching this computed value
            const directElements = this.graph.stateToElements.get(computedKey);
            if (directElements)
                directElements.forEach(el => elements.add(el));
            // 2. Other computed values watching THIS computed value
            const childComputed = this.graph.stateToComputed.get(computedKey);
            if (childComputed)
                childComputed.forEach(child => collectFromComputed(child));
        };
        // Start with direct elements
        const direct = this.graph.stateToElements.get(stateKey);
        if (direct)
            direct.forEach(el => elements.add(el));
        // Follow all computed branches
        const relatedComputed = this.graph.stateToComputed.get(stateKey);
        if (relatedComputed) {
            relatedComputed.forEach(comp => collectFromComputed(comp));
        }
        return elements;
    }
    /**
     * Export graph for visualization
     */
    exportGraph() {
        return {
            nodes: {
                states: Array.from(this.graph.stateToElements.keys()),
                computed: Array.from(this.graph.computedDeps.keys()),
                elements: Array.from(this.graph.elementExpressions.keys())
            },
            edges: {
                stateToElement: Array.from(this.graph.stateToElements.entries())
                    .flatMap(([state, elements]) => Array.from(elements).map(el => ({ from: state, to: el }))),
                stateToComputed: Array.from(this.graph.stateToComputed.entries())
                    .flatMap(([state, computed]) => Array.from(computed).map(comp => ({ from: state, to: comp }))),
                computedToComputed: Array.from(this.graph.computedDeps.entries())
                    .flatMap(([comp, deps]) => Array.from(deps)
                    .filter(dep => this.graph.computedDeps.has(dep))
                    .map(dep => ({ from: comp, to: dep })))
            },
            metrics: this.graph.metrics
        };
    }
}
