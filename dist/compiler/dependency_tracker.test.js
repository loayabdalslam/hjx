import { describe, it, expect, beforeEach } from 'vitest';
import { DependencyTracker } from './dependency_tracker';
describe('DependencyTracker', () => {
    let tracker;
    beforeEach(() => {
        tracker = new DependencyTracker();
    });
    // Mocking a simple HJX Component AST
    const mockAst = {
        kind: "HJXAst",
        version: "0.2",
        component: { name: "CounterApp" },
        imports: {},
        script: "",
        state: {
            count: 0,
            price: 10
        },
        computed: {
            // total depends on 'count' and 'price'
            total: "count * price"
        },
        api: [],
        layout: {
            kind: "node",
            tag: "div",
            id: "root",
            classes: [],
            attrs: {},
            text: null,
            events: {},
            bind: null,
            props: {},
            children: [
                {
                    kind: "node",
                    tag: "span",
                    id: "display-count",
                    classes: [],
                    attrs: {},
                    text: "Current count: {{ count }}", // Direct state dependency
                    events: {},
                    bind: null,
                    props: {},
                    children: []
                },
                {
                    kind: "node",
                    tag: "p",
                    id: "display-total",
                    classes: [],
                    attrs: {},
                    text: "Total is: {{ total }}", // Computed dependency
                    events: {},
                    bind: null,
                    props: {},
                    children: []
                }
            ]
        },
        style: [],
        styleRaw: "",
        handlers: {},
        breakpoints: []
    };
    it('should identify state variables correctly', () => {
        const result = tracker.analyze(mockAst);
        expect(result.metrics.totalElements).toBeGreaterThan(0);
        const graph = tracker.exportGraph();
        expect(graph.nodes.states).toContain('count');
        expect(graph.nodes.states).toContain('price');
    });
    it('should map state variables to DOM elements', () => {
        tracker.analyze(mockAst);
        const affected = tracker.getAffectedElements('count');
        // 'count' should affect the span with ID 'display-count'
        expect(Array.from(affected)).toContain('display-count');
    });
    it('should track computed dependencies (Chain Reaction)', () => {
        tracker.analyze(mockAst);
        // If 'price' changes, 'total' changes. 
        // Since 'display-total' uses 'total', 'price' should affect 'display-total'.
        const affectedByPrice = tracker.getAffectedElements('price');
        expect(Array.from(affectedByPrice)).toContain('display-total');
    });
    it('should identify "Hot States" (frequently used variables)', () => {
        const result = tracker.analyze(mockAst);
        // In our mock, 'count' is used in text and in a computed property
        // while 'price' is only used in a computed property.
        expect(result.metrics.hotStates[0].key).toBe('count');
    });
});
