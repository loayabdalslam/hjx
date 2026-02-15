export type HJXStateValue = string | number | boolean;

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
  children: HJXNode[];
};

export type HJXHandler = {
  name: string;
  body: string[]; // lines of tiny statement language
};

export type HJXAst = {
  kind: "HJXAst";
  version: "0.1";
  component: { name: string };
  imports: Record<string, string>;
  script: string;
  state: Record<string, HJXStateValue>;
  layout: HJXNode | null;
  style: string;
  handlers: Record<string, HJXHandler>;
};
