# State Block

The `state:` block defines reactive variables that power HJX's reactivity system.

## Syntax

```hjx
state:
  variable1 = value1
  variable2 = value2
```

## Supported Types

### Numbers

```hjx
state:
  count = 0
  price = 19.99
  negative = -42
```

### Strings

```hjx
state:
  name = "John"
  empty = ""
  template = 'Hello {{name}}'
```

### Booleans

```hjx
state:
  isActive = true
  isComplete = false
```

### Arrays

```hjx
state:
  items = []
  fruits = ["apple", "banana"]
  mixed = [1, "two", true]
```

### Objects

```hjx
state:
  user = { name: "John", age: 30 }
  config = { theme: "dark", lang: "en" }
```

## Nested Values

Access nested values with dot notation:

```hjx
state:
  user = { profile: { name: "John" } }

layout:
  text: "{{user.profile.name}}"
```

## Computed State

In server-driven mode, computed values can be derived:

```hjx
script:
  export function init(store) {
    store.compute('fullName', () => {
      const first = store.get('firstName');
      const last = store.get('lastName');
      return first + ' ' + last;
    });
  }
```

## State Updates

Update state in handlers:

```hjx
handlers:
  increment:
    set count = count + 1
  
  addItem:
    set items = [...items, newItem]
  
  updateUser:
    set user = { ...user, name: newName }
```

## Complete Example

```hjx
component UserProfile

state:
  name = "John Doe"
  age = 30
  isEditing = false
  hobbies = ["coding", "reading"]
  settings = { theme: "dark", notifications: true }

layout:
  view.card:
    text: "Name: {{name}}"
    text: "Age: {{age}}"
    text: "Hobbies: {{hobbies.length}}"
    for (hobby in hobbies):
      text: "• {{hobby}}"
    if (isEditing):
      text: "(Editing mode)"
    button (on click -> toggleEdit): "Edit"

style:
  .card { padding: 16px; border: 1px solid #ddd; border-radius: 8px; }

handlers:
  toggleEdit:
    set isEditing = !isEditing
```

## Best Practices

1. **Initialize all used state** - No undefined variables
2. **Use appropriate types** - Don't store everything as strings
3. **Keep state flat when possible** - Easier to update
4. **Group related data** - Use objects for related values
