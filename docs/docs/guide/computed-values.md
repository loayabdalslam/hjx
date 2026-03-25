# Computed Values

Computed values are derived state that automatically update when their dependencies change. They're perfect for calculations, transformations, and derived data.

## What are Computed Values?

Computed values are reactive expressions that:
- **Auto-update** when their dependencies change
- **Cache results** until dependencies change (memoization)
- **Derive new values** from existing state
- **Keep logic declarative** instead of imperative

## Syntax

```hjx
component MyComponent

state:
  price = 25
  quantity = 3
  taxRate = 0.1

computed:
  subtotal = "price * quantity"
  tax = "subtotal * taxRate"
  total = "subtotal + tax"
  formattedTotal = "'$' + total.toFixed(2)"

layout:
  view.card:
    text: "Price: ${{price}}"
    text: "Quantity: {{quantity}}"
    text: "Subtotal: ${{subtotal}}"
    text: "Tax: ${{tax}}"
    text.bold: "Total: {{formattedTotal}}"

handlers:
  updatePrice:
    set price = price + 5
```

When `price` changes, `subtotal`, `tax`, `total`, and `formattedTotal` all update automatically.

## How It Works

### Dependency Tracking

HJX automatically tracks which state variables each computed value depends on:

```hjx
state:
  a = 10
  b = 5
  c = 3

computed:
  sum = "a + b"           // Depends on: a, b
  product = "a * c"       // Depends on: a, c
  combined = "sum + product" // Depends on: sum (which depends on a, b)
```

The dependency graph looks like:
```
a ─┬─> sum ─────> combined
   │              ↑
b ─┘              │
                  │
c ────────────────┘
     (via product)
```

### Automatic Updates

When you change `a`:
1. `sum` recalculates
2. `product` recalculates
3. `combined` recalculates (using new `sum` and `product`)
4. All DOM elements showing these values update

## Examples

### Shopping Cart

```hjx
component ShoppingCart

state:
  items = [
    { name: "Laptop", price: 999, quantity: 1 },
    { name: "Mouse", price: 29, quantity: 2 }
  ]
  discountCode = ""
  discountPercent = 0

computed:
  itemCount = "items.reduce((sum, item) => sum + item.quantity, 0)"
  subtotal = "items.reduce((sum, item) => sum + item.price * item.quantity, 0)"
  discountAmount = "subtotal * (discountPercent / 100)"
  total = "subtotal - discountAmount"
  hasDiscount = "discountPercent > 0"

layout:
  view.cart:
    text.title: "Shopping Cart ({{itemCount}} items)"
    
    for (item in items):
      view.cart-item:
        text: "{{item.name}} - ${{item.price}} x {{item.quantity}}"
    
    view.summary:
      text: "Subtotal: ${{subtotal}}"
      if (hasDiscount):
        text.discount: "Discount: -${{discountAmount}}"
      text.bold: "Total: ${{total}}"

handlers:
  applyDiscount:
    if (discountCode === "SAVE10"):
      set discountPercent = 10
      log "10% discount applied"
```

### Form Validation

```hjx
component LoginForm

state:
  email = ""
  password = ""
  confirmPassword = ""
  agreedToTerms = false

computed:
  emailValid = "email.includes('@') && email.includes('.')"
  passwordValid = "password.length >= 8"
  passwordsMatch = "password === confirmPassword && password !== ''"
  formValid = "emailValid && passwordValid && passwordsMatch && agreedToTerms"
  errorMessage = "!formValid ? 'Please fill all fields correctly' : ''"

layout:
  view.form:
    text.title: "Create Account"
    
    input (bind value <-> email):
    if (!emailValid && email !== ""):
      text.error: "Invalid email format"
    
    input (bind value <-> password):
    if (!passwordValid && password !== ""):
      text.error: "Password must be at least 8 characters"
    
    input (bind value <-> confirmPassword):
    if (!passwordsMatch && confirmPassword !== ""):
      text.error: "Passwords do not match"
    
    view.checkbox:
      input (bind checked <-> agreedToTerms):
      text: "I agree to the terms"
    
    button (disabled=!formValid on click -> submit): "Create Account"
    
    if (!formValid):
      text.note: "{{errorMessage}}"

handlers:
  submit:
    log "Form submitted!"
```

### Real-Time Dashboard

```hjx
component Dashboard

state:
  revenue = 15000
  expenses = 8000
  users = 1250
  activeUsers = 890
  targetRevenue = 20000

computed:
  profit = "revenue - expenses"
  profitMargin = "(profit / revenue) * 100"
  userEngagement = "(activeUsers / users) * 100"
  revenueProgress = "(revenue / targetRevenue) * 100"
  isProfitable = "profit > 0"
  reachedTarget = "revenue >= targetRevenue"

layout:
  view.dashboard:
    view.metric-card:
      text.label: "Revenue"
      text.value: "${{revenue}}"
      text.progress: "{{revenueProgress.toFixed(1)}}% of target"
    
    view.metric-card:
      text.label: "Expenses"
      text.value: "${{expenses}}"
    
    view.metric-card:
      text.label: "Profit"
      text.value: "${{profit}}"
      if (isProfitable):
        text.positive: "▲ Profitable"
      if (!isProfitable):
        text.negative: "▼ Loss"
    
    view.metric-card:
      text.label: "Profit Margin"
      text.value: "{{profitMargin.toFixed(1)}}%"
    
    view.metric-card:
      text.label: "User Engagement"
      text.value: "{{userEngagement.toFixed(1)}}%"
      text.detail: "{{activeUsers}} / {{users}} users"
    
    if (reachedTarget):
      view.celebration:
        text: "🎉 Revenue target reached!"

handlers:
  refreshData:
    log "Refreshing dashboard data..."
```

### Todo List with Filters

```hjx
component TodoApp

state:
  todos = [
    { text: "Learn HJX", completed: true },
    { text: "Build UI", completed: false },
    { text: "Deploy App", completed: false }
  ]
  filter = "all"
  searchText = ""

computed:
  totalCount = "todos.length"
  completedCount = "todos.filter(t => t.completed).length"
  activeCount = "todos.filter(t => !t.completed).length"
  filteredTodos = "todos.filter(t => { if (filter === 'active') return !t.completed; if (filter === 'completed') return t.completed; return true; }).filter(t => t.text.toLowerCase().includes(searchText.toLowerCase()))"
  hasActiveTodos = "activeCount > 0"
  allCompleted = "completedCount === totalCount"
  completionPercentage = "(completedCount / totalCount) * 100"

layout:
  view.todo-app:
    text.title: "Todo List"
    text.progress: "{{completionPercentage.toFixed(0)}}% complete ({{completedCount}}/{{totalCount}})"
    
    view.filters:
      input (bind value <-> searchText placeholder="Search todos..."):
      button (on click -> setFilterAll): "All"
      button (on click -> setFilterActive): "Active"
      button (on click -> setFilterCompleted): "Completed"
    
    view.todo-list:
      for (todo in filteredTodos):
        view.todo-item:
          text: "{{todo.text}}"
          if (todo.completed):
            text.status: "✓"
    
    if (hasActiveTodos):
      text.hint: "{{activeCount}} tasks remaining"
    if (allCompleted):
      text.celebration: "🎉 All tasks completed!"

handlers:
  setFilterAll:
    set filter = "all"
  setFilterActive:
    set filter = "active"
  setFilterCompleted:
    set filter = "completed"
```

## Best Practices

### 1. Keep Computations Simple

```hjx
# ✅ Good: Simple expressions
computed:
  total = "price * quantity"
  fullName = "firstName + ' ' + lastName"
  isValid = "email.includes('@') && password.length >= 8"

# ❌ Avoid: Complex logic in computed
computed:
  badExample: |
    "items.map(item => {
      const result = complexCalculation(item);
      if (result > threshold) {
        return transform(result);
      }
      return default;
    }).filter(x => x !== null).reduce((a, b) => a + b, 0)"
```

For complex logic, use handlers or server-side scripts.

### 2. Use Descriptive Names

```hjx
# ✅ Clear names
computed:
  totalRevenue = "revenue - refunds"
  activeUserCount = "users.filter(u => u.lastLogin > thirtyDaysAgo).length"
  hasUnsavedChanges = "formData !== originalData"

# ❌ Unclear names
computed:
  x = "a - b"
  temp = "users.length"
  flag = "data !== old"
```

### 3. Chain Computed Values

Computed values can depend on other computed values:

```hjx
state:
  baseSalary = 50000
  bonus = 5000
  taxRate = 0.25

computed:
  grossIncome = "baseSalary + bonus"
  tax = "grossIncome * taxRate"
  netIncome = "grossIncome - tax"
  monthlyIncome = "netIncome / 12"
  weeklyIncome = "monthlyIncome / 4"
```

This creates a dependency chain that updates efficiently.

### 4. Avoid Circular Dependencies

```hjx
# ❌ This will cause an error:
computed:
  a = "b + 1"
  b = "a + 1"  # Circular!
```

HJX detects circular dependencies at compile time.

## Performance

Computed values are **memoized** - they only recalculate when dependencies change:

```hjx
state:
  count = 0
  name = "Alice"

computed:
  doubled = "count * 2"  // Only recalculates when count changes
```

### Dependency Graph Visualization

```
State: count, name
       ↓
Computed: doubled (depends on: count)
       
When count changes:
  1. doubled recalculates
  2. DOM elements using {{doubled}} update
  
When name changes:
  1. doubled does NOT recalculate (no dependency)
  2. Only DOM elements using {{name}} update
```

## Common Patterns

### Percentage Calculations

```hjx
computed:
  progress = "(current / total) * 100"
  discountPercent = "((original - sale) / original) * 100"
  completionRate = "(completed / total) * 100"
```

### String Formatting

```hjx
computed:
  fullName = "firstName + ' ' + lastName"
  greeting = "'Hello, ' + name + '!'"
  statusText = "isActive ? 'Active' : 'Inactive'"
  priceFormatted = "'$' + price.toFixed(2)"
```

### Array Operations

```hjx
computed:
  itemCount = "items.length"
  hasItems = "items.length > 0"
  total = "items.reduce((sum, item) => sum + item.price, 0)"
  names = "items.map(item => item.name).join(', ')"
  filtered = "items.filter(item => item.active)"
```

### Conditional Values

```hjx
computed:
  statusColor = "status === 'active' ? 'green' : 'red'"
  buttonText = "isLoading ? 'Loading...' : 'Submit'"
  isVisible = "userRole === 'admin' || hasPermission"
  errorMessage = "errors.length > 0 ? errors[0] : ''"
```

## Troubleshooting

### Computed Value Not Updating

**Problem:** Your computed value isn't updating when state changes.

**Solution:** Check that you're referencing state variables correctly:

```hjx
# ❌ Wrong: String literal, not a reference
computed:
  bad = "count"  # This is just the string "count"

# ✅ Correct: Expression with variable reference
computed:
  good = "count"  # This references the count variable
```

### Circular Dependency Error

**Problem:** Compiler reports circular dependency.

**Solution:** Review your computed chain:

```hjx
# ❌ Circular
computed:
  a = "b + 1"
  b = "c + 1"
  c = "a + 1"  # c -> a -> b -> c

# ✅ Fixed
computed:
  a = "base + 1"
  b = "a + 1"
  c = "b + 1"  # Linear chain
```

### Performance Issues

**Problem:** Computed values recalculating too often.

**Solution:** Check for unnecessary dependencies:

```hjx
state:
  count = 0
  unused = "never changes"

computed:
  # ❌ Depends on unused state
  bad = "count + unused.length"
  
  # ✅ Only depends on what's needed
  good = "count * 2"
```