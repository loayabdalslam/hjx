
# HJX — Unified UI Language (v0.1)

HJX is a unified declarative UI language that compiles into:

- HTML
- CSS
- JavaScript

from a single `.hjx` file.

The goal is to compress structure, style, and behavior into one coherent, AI-friendly language.

---

# Table of Contents

1. Philosophy  
2. File Structure  
3. Indentation Rules  
4. Full Grammar (EBNF)  
5. Component Declaration  
6. State Block  
7. Layout Block  
8. Style Block  
9. Handlers Block  
10. Expressions  
11. Interpolation  
12. Current Limitations (v0.1)

---

# 1. Philosophy

HJX is:

- Declarative-first  
- Scoped-by-default  
- AI-friendly  
- Deterministic  
- Indentation-based (like Python)

---

# 2. File Structure

A `.hjx` file consists of top-level blocks:

```
component <Name>

state:
layout:
style:
handlers:
```

Order is flexible but recommended in that order.

---

# 3. Indentation Rules

HJX is indentation-sensitive.

- Top-level blocks → 0 spaces  
- Inside blocks → 2 spaces  
- Each nested level → +2 spaces  
- Tabs are not recommended (use spaces only)

Example:

```
layout:
  view:
    text: "Hello"
```

---

# 4. Full Grammar (EBNF)

## 4.1 File Structure

```
File            = { SkippableLine | TopStmt } ;

TopStmt         = ComponentDecl
                | StateBlock
                | LayoutBlock
                | StyleBlock
                | HandlersBlock ;
```

---

## 4.2 Component Declaration

```
ComponentDecl   = "component" SP Identifier NEWLINE ;

Identifier      = Letter { Letter | Digit | "_" } ;
Letter          = "A"…"Z" | "a"…"z" | "_" ;
Digit           = "0"…"9" ;
```

Example:

```
component Counter
```

---

## 4.3 State Block

```
StateBlock      = "state:" NEWLINE { StateLine } ;

StateLine       = IND2 Identifier SP? "=" SP? StateValue NEWLINE ;

StateValue      = Number | Boolean | String ;
```

### Literals

```
Number          = [ "-" ] Digit { Digit } [ "." Digit { Digit } ] ;
Boolean         = "true" | "false" ;
String          = DQString | SQString ;

DQString        = """ { CharNoDQ } """ ;
SQString        = "'"  { CharNoSQ } "'"  ;
```

Example:

```
state:
  count = 0
  title = "Hello"
  enabled = true
```

---

## 4.4 Layout Block (Tree-Based DSL)

```
LayoutBlock     = "layout:" NEWLINE LayoutTree ;

LayoutTree      = { LayoutLine } ;
```

### Node Structure

```
LayoutLine      = ContainerLine | LeafLine ;

ContainerLine   = IND2plus NodeHead ":" NEWLINE { ChildLine } ;

LeafLine        = IND2plus LeafBody NEWLINE ;
```

### NodeHead

```
NodeHead        = Tag [ IdPart ] { ClassPart } ;

Tag             = Letter { Letter | Digit | "-" | "_" } ;

IdPart          = "#" Identifier ;

ClassPart       = "." ClassAtom ;
ClassAtom       = (Letter|Digit) { Letter | Digit | "-" | "_" } ;
```

Examples:

```
view
view#main
view.card
view#main.card.primary
```

### Leaf Node

```
LeafBody        = NodeHead [ ParenClause ] ":" String ;
```

Example:

```
text: "Hello"
button.primary: "Click me"
```

### Event Binding

```
ParenClause     = "(" OnClickClause ")" ;

OnClickClause   = "on" SP "click" SP? "->" SP? Identifier ;
```

Example:

```
button (on click -> inc): "Increase"
```

### Two-Way Binding

```
BindValueClause = "bind" SP "value" SP? "<->" SP? Identifier ;
```

Example:

```
input (bind value <-> email)
```

---

## 4.5 Style Block

```
StyleBlock      = "style:" NEWLINE { StyleLine } ;
StyleLine       = IND2 { AnyChar } NEWLINE ;
```

Raw CSS is allowed. Compiler automatically scopes CSS.

---

## 4.6 Handlers Block

```
HandlersBlock   = "handlers:" NEWLINE { HandlerDecl } ;

HandlerDecl     = IND2 Identifier ":" NEWLINE
                  { HandlerLine } ;

HandlerLine     = IND4 Statement NEWLINE ;
```

### Statements

```
Statement       = SetStmt | LogStmt ;

SetStmt         = "set" SP Identifier SP? "=" SP? Expr ;
LogStmt         = "log" SP String ;
```

Example:

```
handlers:
  inc:
    set count = count + 1
  debug:
    log "clicked"
```

---

# 5. Expressions

```
Expr   = Term { ("+" | "-") Term } ;
Term   = Factor { ("*" | "/") Factor } ;
Factor = Number | Identifier | "(" Expr ")" ;
```

Allowed:
- numbers  
- state identifiers  
- + - * /  
- parentheses  

---

# 6. Text Interpolation

Inside strings:

```
"Hello {{name}}"
```

Grammar:

```
Interpolation = "{{" SP? Identifier SP? "}}" ;
```

---

# 7. Comments

```
CommentLine = { SP } "//" { AnyChar }
```

Example:

```
  // This is a comment
```

---

# 8. Supported Tags (v0.1 Compiler)

| HJX Tag | HTML |
|----------|-------|
| view     | div   |
| text     | span  |
| button   | button|
| input    | input |

Other tags pass through directly.

---

# 9. Example Full File

```
component Counter

state:
  count = 0

layout:
  view.card:
    text: "Count: {{count}}"
    button.primary (on click -> inc): "Increase"

style:
  .card { padding: 16px; border: 1px solid #ddd; }

handlers:
  inc:
    set count = count + 1
```

---

# 10. v0.1 Limitations

- Layout nesting limited to 2 container levels  
- Only `click` event supported  
- Only `bind value <-> stateKey`  
- No conditionals  
- No loops  
- No computed state  
- No async handlers  

---

# 11. Future Extensions (v0.2 Roadmap)

Planned additions:

- if / else  
- for item in items  
- multiple events (input, submit, change)  
- attributes block  
- computed state  
- effects  
- component composition  
- multi-target codegen (React/Vue)

---

# 12. Design Philosophy for AI

HJX is intentionally:

- Context-compressible  
- AST-friendly  
- Low-ambiguity  
- LLM-safe  
- Easily parsable  

---

© 2026 HJX Language
