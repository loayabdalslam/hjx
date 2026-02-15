# Composition Example

A more complex example showing component composition and imports.

## Code

```hjx
component CompositionDemo

imports:
  Button from "./components/Button.hjx"
  Input from "./components/Input.hjx"
  Card from "./components/Card.hjx"

state:
  name = ""
  count = 0
  message = "Welcome to HJX Composition!"

script:
  import { v4 } from "uuid";
  console.log("CompositionDemo initialized with UUID:", v4());

layout:
  view.min-h-screen.bg-background.text-foreground.flex.items-center.justify-center.p-4:
    Card (class="w-[400px]" title="Login" description="Enter your details below"):
      view.flex.flex-col.gap-4:
        view.space-y-2:
          view.text-sm.font-medium: "Username"
          Input (placeholder="johndoe" bind value <-> name)

        view.space-y-2:
          view.text-sm.font-medium: "Counter: {{count}}"
          view.flex.gap-2:
            Button (variant="outline" size="icon" on click -> dec): "-"
            Button (on click -> inc): "+"

        view.pt-4:
          Button (class="w-full" on click -> submit): "Submit"

        view.text-sm.text-muted-foreground.text-center: "{{message}}"

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
  submit:
    log "Submitting form..."
    set message = "Hello " + name + "! You clicked " + count + " times."
```

## Features Demonstrated

- **Component Imports**: Importing reusable components
- **Script Block**: Custom JavaScript code
- **Complex Layout**: Nested structures with Tailwind-like classes
- **String Concatenation**: Building dynamic messages

## Try It

```bash
node dist/cli.js dev examples/composition_demo.hjx --out dist-app --port 5173
```

*Note: This example requires the component files in the `examples/components/` directory.*