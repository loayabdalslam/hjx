export type HJXStateValue = string | number | boolean | any[] | Record<string, any> | null;

export type HJXBind = { prop: "value"; state: string };

export type HJXNode = {
  kind: "node" | "if" | "for" | "else";
  tag: string;
  condition?: string;  // for "if"
  iterator?: { item: string; list: string }; // for "for"
  id?: string;
  classes: string[];
  attrs: Record<string, string>;
  text: string | null;
  events: Record<string, string>;
  bind: HJXBind | null;
  props: Record<string, any>;
  children: HJXNode[];
};

export type HJXHandler = {
  name: string;
  body: string[]; // lines of tiny statement language
};

export type HJXApiEndpoint = {
  method: string;       // GET, POST, PUT, DELETE
  path: string;         // /api/todos, /api/todos/:id
  handlerName: string;  // fetchTodos, createTodo
  query?: Record<string, any>;
  params?: Record<string, any>;
  body?: Record<string, any>;
  response?: { type: string; item?: any; schema?: any };
};

export type HJXStyleRule = {
  selector: string;
  properties: string[];  // natural language lines like "padding 16px"
  pseudo?: string;       // :hover, :active, etc.
  media?: string;        // @mobile, @tablet, etc.
};

export type HJXBreakpoint = {
  name: string;
  value: string;
};

export type HJXAst = {
  kind: "HJXAst";
  version: "0.2";
  component: { name: string };
  imports: Record<string, string>;
  script: string;
  state: Record<string, HJXStateValue>;
  api: HJXApiEndpoint[];           // NEW: REST API endpoints
  layout: HJXNode | null;
  style: HJXStyleRule[];           // CHANGED: structured style rules
  styleRaw: string;                // BACKWARD COMPAT: raw CSS string
  handlers: Record<string, HJXHandler>;
  computed: Record<string, string>; // computed state variables
  breakpoints: HJXBreakpoint[];    // NEW: custom breakpoints
  designSystem?: {
    theme?: 'light' | 'dark';
    tokens?: Record<string, any>;
  };
};
