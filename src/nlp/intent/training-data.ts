export interface TrainingExample {
  input: string;
  primary_intent: string;
  secondary_intents: string[];
  entities: Record<string, string>;
  expected_structure: Record<string, unknown>;
}

export function generateTrainingData(): TrainingExample[] {
  const data: TrainingExample[] = [];

  // CREATE_COMPONENT examples
  const createExamples: TrainingExample[] = [
    { input: "create a login form with email and password", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_STATE", "MODIFY_LAYOUT"], entities: { component_type: "form", fields: "email,password" }, expected_structure: { component: "LoginForm", has_state: true, has_handler: true } },
    { input: "make a counter component", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_STATE", "ADD_HANDLER"], entities: { component_type: "counter" }, expected_structure: { component: "Counter", has_state: true, has_handler: true } },
    { input: "build a todo list app", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_STATE", "ADD_LOOP", "ADD_HANDLER"], entities: { component_type: "todo_list" }, expected_structure: { component: "TodoList", has_state: true, has_handler: true } },
    { input: "I need a dashboard page", primary_intent: "CREATE_COMPONENT", secondary_intents: ["MODIFY_LAYOUT"], entities: { component_type: "dashboard" }, expected_structure: { component: "Dashboard", has_state: true } },
    { input: "generate a button component with variants", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_STATE", "ADD_STYLE"], entities: { component_type: "button" }, expected_structure: { component: "Button", has_state: true } },
    { input: "create a user profile card", primary_intent: "CREATE_COMPONENT", secondary_intents: ["MODIFY_LAYOUT"], entities: { component_type: "card" }, expected_structure: { component: "UserProfile", has_state: true } },
    { input: "make a newsletter signup form", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_STATE", "ADD_HANDLER", "BIND_DATA"], entities: { component_type: "form" }, expected_structure: { component: "NewsletterSignup", has_state: true, has_handler: true } },
    { input: "build a settings page", primary_intent: "CREATE_COMPONENT", secondary_intents: ["MODIFY_LAYOUT", "ADD_STATE"], entities: { component_type: "settings" }, expected_structure: { component: "Settings", has_state: true } },
    { input: "I want a search bar component", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_STATE", "ADD_HANDLER"], entities: { component_type: "search_bar" }, expected_structure: { component: "SearchBar", has_state: true } },
    { input: "create a modal dialog", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_STATE", "ADD_CONDITIONAL"], entities: { component_type: "modal" }, expected_structure: { component: "Modal", has_state: true } },
    { input: "create a simple calculator", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_STATE", "ADD_HANDLER"], entities: { component_type: "calculator" }, expected_structure: { component: "Calculator", has_state: true, has_handler: true } },
    { input: "make a timer that counts down", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_STATE", "ADD_HANDLER", "ADD_SCRIPT"], entities: { component_type: "timer" }, expected_structure: { component: "Timer", has_state: true, has_handler: true } },
    { input: "build an image gallery", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_LOOP", "MODIFY_LAYOUT"], entities: { component_type: "gallery" }, expected_structure: { component: "Gallery", has_state: true } },
    { input: "I need a progress bar", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_STATE", "ADD_STYLE"], entities: { component_type: "progress_bar" }, expected_structure: { component: "ProgressBar", has_state: true } },
    { input: "create a notification toast", primary_intent: "CREATE_COMPONENT", secondary_intents: ["ADD_STATE", "ADD_CONDITIONAL"], entities: { component_type: "toast" }, expected_structure: { component: "Toast", has_state: true } },
  ];
  data.push(...createExamples);

  // ADD_STATE examples
  const stateExamples: TrainingExample[] = [
    { input: "add a count variable initialized to 0", primary_intent: "ADD_STATE", secondary_intents: [], entities: { state_var: "count", initial_value: "0", type: "number" }, expected_structure: { state_added: true } },
    { input: "create a title state with default hello world", primary_intent: "ADD_STATE", secondary_intents: [], entities: { state_var: "title", initial_value: "hello world", type: "string" }, expected_structure: { state_added: true } },
    { input: "I need a boolean flag called isLoading", primary_intent: "ADD_STATE", secondary_intents: [], entities: { state_var: "isLoading", type: "boolean" }, expected_structure: { state_added: true } },
    { input: "define an items array", primary_intent: "ADD_STATE", secondary_intents: [], entities: { state_var: "items", type: "array" }, expected_structure: { state_added: true } },
    { input: "store the user email", primary_intent: "ADD_STATE", secondary_intents: [], entities: { state_var: "email", type: "string" }, expected_structure: { state_added: true } },
    { input: "track the current page number", primary_intent: "ADD_STATE", secondary_intents: [], entities: { state_var: "page", type: "number" }, expected_structure: { state_added: true } },
    { input: "keep a list of notifications", primary_intent: "ADD_STATE", secondary_intents: [], entities: { state_var: "notifications", type: "array" }, expected_structure: { state_added: true } },
    { input: "add a showMenu boolean variable", primary_intent: "ADD_STATE", secondary_intents: [], entities: { state_var: "showMenu", type: "boolean" }, expected_structure: { state_added: true } },
    { input: "save the selected item index", primary_intent: "ADD_STATE", secondary_intents: [], entities: { state_var: "selectedIndex", type: "number" }, expected_structure: { state_added: true } },
    { input: "create a name field defaulting to empty string", primary_intent: "ADD_STATE", secondary_intents: [], entities: { state_var: "name", initial_value: "", type: "string" }, expected_structure: { state_added: true } },
  ];
  data.push(...stateExamples);

  // ADD_HANDLER examples
  const handlerExamples: TrainingExample[] = [
    { input: "add a click handler that increments the counter", primary_intent: "ADD_HANDLER", secondary_intents: ["ADD_STATE"], entities: { event: "click", action: "increment", target: "counter" }, expected_structure: { handler_added: true, event: "click" } },
    { input: "when the button is clicked show an alert", primary_intent: "ADD_HANDLER", secondary_intents: [], entities: { event: "click", action: "alert" }, expected_structure: { handler_added: true } },
    { input: "handle form submission", primary_intent: "ADD_HANDLER", secondary_intents: [], entities: { event: "submit" }, expected_structure: { handler_added: true } },
    { input: "on change update the value", primary_intent: "ADD_HANDLER", secondary_intents: [], entities: { event: "change", action: "update" }, expected_structure: { handler_added: true } },
    { input: "create a toggle function for the menu", primary_intent: "ADD_HANDLER", secondary_intents: ["ADD_STATE"], entities: { action: "toggle", target: "menu" }, expected_structure: { handler_added: true } },
    { input: "write a delete handler for list items", primary_intent: "ADD_HANDLER", secondary_intents: [], entities: { action: "delete", target: "items" }, expected_structure: { handler_added: true } },
    { input: "implement a save function", primary_intent: "ADD_HANDLER", secondary_intents: [], entities: { action: "save" }, expected_structure: { handler_added: true } },
    { input: "add a reset button handler", primary_intent: "ADD_HANDLER", secondary_intents: [], entities: { event: "click", action: "reset" }, expected_structure: { handler_added: true } },
    { input: "when the user clicks submit, log the message", primary_intent: "ADD_HANDLER", secondary_intents: [], entities: { event: "click", action: "log" }, expected_structure: { handler_added: true } },
    { input: "create a decrement handler", primary_intent: "ADD_HANDLER", secondary_intents: [], entities: { action: "decrement" }, expected_structure: { handler_added: true } },
  ];
  data.push(...handlerExamples);

  // ADD_STYLE examples
  const styleExamples: TrainingExample[] = [
    { input: "make the background blue", primary_intent: "ADD_STYLE", secondary_intents: [], entities: { property: "background", value: "blue" }, expected_structure: { style_added: true } },
    { input: "add padding of 16px to the card", primary_intent: "ADD_STYLE", secondary_intents: [], entities: { property: "padding", value: "16px" }, expected_structure: { style_added: true } },
    { input: "make the button rounded with border radius", primary_intent: "ADD_STYLE", secondary_intents: [], entities: { property: "border-radius" }, expected_structure: { style_added: true } },
    { input: "set the font size to 18px", primary_intent: "ADD_STYLE", secondary_intents: [], entities: { property: "font-size", value: "18px" }, expected_structure: { style_added: true } },
    { input: "add a shadow to the container", primary_intent: "ADD_STYLE", secondary_intents: [], entities: { property: "box-shadow" }, expected_structure: { style_added: true } },
    { input: "make it responsive for mobile", primary_intent: "ADD_STYLE", secondary_intents: [], entities: { property: "responsive" }, expected_structure: { style_added: true } },
    { input: "add dark mode support", primary_intent: "ADD_STYLE", secondary_intents: [], entities: { property: "dark-mode" }, expected_structure: { style_added: true } },
    { input: "center the content horizontally", primary_intent: "ADD_STYLE", secondary_intents: [], entities: { property: "text-align", value: "center" }, expected_structure: { style_added: true } },
    { input: "change the text color to white", primary_intent: "ADD_STYLE", secondary_intents: [], entities: { property: "color", value: "white" }, expected_structure: { style_added: true } },
    { input: "add flex layout with gap", primary_intent: "ADD_STYLE", secondary_intents: [], entities: { property: "display", value: "flex" }, expected_structure: { style_added: true } },
  ];
  data.push(...styleExamples);

  // ADD_CONDITIONAL examples
  const condExamples: TrainingExample[] = [
    { input: "show the login button only if not logged in", primary_intent: "ADD_CONDITIONAL", secondary_intents: ["ADD_STATE"], entities: { condition: "!isLoggedIn", element: "button" }, expected_structure: { has_conditional: true } },
    { input: "hide the loading spinner when data is ready", primary_intent: "ADD_CONDITIONAL", secondary_intents: ["ADD_STATE"], entities: { condition: "!isLoading" }, expected_structure: { has_conditional: true } },
    { input: "display error message if there is an error", primary_intent: "ADD_CONDITIONAL", secondary_intents: ["ADD_STATE"], entities: { condition: "hasError" }, expected_structure: { has_conditional: true } },
    { input: "conditionally render the premium badge", primary_intent: "ADD_CONDITIONAL", secondary_intents: ["ADD_STATE"], entities: { condition: "isPremium" }, expected_structure: { has_conditional: true } },
    { input: "show admin panel only for admin users", primary_intent: "ADD_CONDITIONAL", secondary_intents: [], entities: { condition: "isAdmin" }, expected_structure: { has_conditional: true } },
  ];
  data.push(...condExamples);

  // ADD_LOOP examples
  const loopExamples: TrainingExample[] = [
    { input: "iterate over the items array and display each one", primary_intent: "ADD_LOOP", secondary_intents: ["ADD_STATE"], entities: { list: "items", item: "item" }, expected_structure: { has_loop: true } },
    { input: "render a list of todo items", primary_intent: "ADD_LOOP", secondary_intents: [], entities: { list: "todos", item: "todo" }, expected_structure: { has_loop: true } },
    { input: "loop through alerts and show each", primary_intent: "ADD_LOOP", secondary_intents: [], entities: { list: "alerts", item: "alert" }, expected_structure: { has_loop: true } },
    { input: "for each product in the catalog show a card", primary_intent: "ADD_LOOP", secondary_intents: [], entities: { list: "catalog", item: "product" }, expected_structure: { has_loop: true } },
    { input: "display all messages in a loop", primary_intent: "ADD_LOOP", secondary_intents: [], entities: { list: "messages", item: "message" }, expected_structure: { has_loop: true } },
  ];
  data.push(...loopExamples);

  // BIND_DATA examples
  const bindExamples: TrainingExample[] = [
    { input: "bind the input value to the email state", primary_intent: "BIND_DATA", secondary_intents: ["ADD_STATE"], entities: { state_var: "email", input_type: "text" }, expected_structure: { has_binding: true } },
    { input: "create a two-way binding for the search field", primary_intent: "BIND_DATA", secondary_intents: [], entities: { state_var: "searchQuery" }, expected_structure: { has_binding: true } },
    { input: "sync the input with the name variable", primary_intent: "BIND_DATA", secondary_intents: [], entities: { state_var: "name" }, expected_structure: { has_binding: true } },
    { input: "link the textarea to the message state", primary_intent: "BIND_DATA", secondary_intents: [], entities: { state_var: "message" }, expected_structure: { has_binding: true } },
  ];
  data.push(...bindExamples);

  // FIX_ERROR examples
  const fixExamples: TrainingExample[] = [
    { input: "fix the syntax error in my component", primary_intent: "FIX_ERROR", secondary_intents: [], entities: { error_type: "syntax" }, expected_structure: { action: "fix" } },
    { input: "why is my component not compiling", primary_intent: "FIX_ERROR", secondary_intents: ["EXPLAIN_CODE"], entities: { error_type: "compile" }, expected_structure: { action: "diagnose" } },
    { input: "there is an indentation error", primary_intent: "FIX_ERROR", secondary_intents: [], entities: { error_type: "indentation" }, expected_structure: { action: "fix" } },
    { input: "the button click handler doesn't work", primary_intent: "FIX_ERROR", secondary_intents: [], entities: { error_type: "runtime" }, expected_structure: { action: "debug" } },
    { input: "my state variable is undefined", primary_intent: "FIX_ERROR", secondary_intents: [], entities: { error_type: "reference" }, expected_structure: { action: "fix" } },
  ];
  data.push(...fixExamples);

  // EXPLAIN_CODE examples
  const explainExamples: TrainingExample[] = [
    { input: "explain what this component does", primary_intent: "EXPLAIN_CODE", secondary_intents: [], entities: {}, expected_structure: { action: "explain" } },
    { input: "how does the event handler work", primary_intent: "EXPLAIN_CODE", secondary_intents: [], entities: { topic: "handler" }, expected_structure: { action: "explain" } },
    { input: "what is the purpose of the state block", primary_intent: "EXPLAIN_CODE", secondary_intents: [], entities: { topic: "state" }, expected_structure: { action: "explain" } },
    { input: "describe the data flow in this app", primary_intent: "EXPLAIN_CODE", secondary_intents: [], entities: { topic: "data_flow" }, expected_structure: { action: "explain" } },
  ];
  data.push(...explainExamples);

  // REFACTOR examples
  const refactorExamples: TrainingExample[] = [
    { input: "optimize the performance of this component", primary_intent: "REFACTOR", secondary_intents: [], entities: { goal: "performance" }, expected_structure: { action: "optimize" } },
    { input: "extract the header into its own component", primary_intent: "REFACTOR", secondary_intents: ["CREATE_COMPONENT"], entities: { target: "header" }, expected_structure: { action: "extract" } },
    { input: "simplify the handler logic", primary_intent: "REFACTOR", secondary_intents: [], entities: { target: "handlers" }, expected_structure: { action: "simplify" } },
    { input: "clean up the CSS", primary_intent: "REFACTOR", secondary_intents: [], entities: { target: "style" }, expected_structure: { action: "cleanup" } },
  ];
  data.push(...refactorExamples);

  // ADD_COMPUTED examples
  const computedExamples: TrainingExample[] = [
    { input: "add a computed property for the total price", primary_intent: "ADD_COMPUTED", secondary_intents: ["ADD_STATE"], entities: { name: "totalPrice" }, expected_structure: { computed_added: true } },
    { input: "calculate the average score", primary_intent: "ADD_COMPUTED", secondary_intents: [], entities: { name: "averageScore" }, expected_structure: { computed_added: true } },
    { input: "derive the full name from first and last", primary_intent: "ADD_COMPUTED", secondary_intents: [], entities: { name: "fullName" }, expected_structure: { computed_added: true } },
  ];
  data.push(...computedExamples);

  // ADD_IMPORT examples
  const importExamples: TrainingExample[] = [
    { input: "import the Button component", primary_intent: "ADD_IMPORT", secondary_intents: [], entities: { component: "Button" }, expected_structure: { import_added: true } },
    { input: "use the Card component from the library", primary_intent: "ADD_IMPORT", secondary_intents: [], entities: { component: "Card" }, expected_structure: { import_added: true } },
    { input: "include the Input component", primary_intent: "ADD_IMPORT", secondary_intents: [], entities: { component: "Input" }, expected_structure: { import_added: true } },
  ];
  data.push(...importExamples);

  // ADD_SCRIPT examples
  const scriptExamples: TrainingExample[] = [
    { input: "add a background task that updates the time every second", primary_intent: "ADD_SCRIPT", secondary_intents: ["ADD_STATE"], entities: { task: "timer" }, expected_structure: { script_added: true } },
    { input: "initialize the store with default data", primary_intent: "ADD_SCRIPT", secondary_intents: [], entities: { task: "init" }, expected_structure: { script_added: true } },
    { input: "add server-side logic for data fetching", primary_intent: "ADD_SCRIPT", secondary_intents: [], entities: { task: "fetch" }, expected_structure: { script_added: true } },
  ];
  data.push(...scriptExamples);

  return data;
}
