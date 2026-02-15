export type HJXStateValue = string | number | boolean;

export type HJXBind = { prop: "value"; state: string };

export type HJXNode = {
  kind: "node";
  tag: string;
  id?: string;
  classes: string[];
  attrs: Record<string, string>;
  text: string | null; // only for leaf nodes currently
  events: Record<string, string>; // eventName -> handlerName
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
  state: Record<string, HJXStateValue>;
  layout: HJXNode | null;
  style: string;
  handlers: Record<string, HJXHandler>;
};
