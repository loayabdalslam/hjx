export enum TokenType {
  KEYWORD = "KEYWORD",
  IDENTIFIER = "IDENTIFIER",
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  OPERATOR = "OPERATOR",
  DELIMITER = "DELIMITER",
  INDENT = "INDENT",
  DEDENT = "DEDENT",
  NEWLINE = "NEWLINE",
  COMMENT = "COMMENT",
  VARIABLE = "VARIABLE",
  EVENT_BINDING = "EVENT_BINDING",
  BIND_DIRECTIVE = "BIND_DIRECTIVE",
  CSS_CLASS = "CSS_CLASS",
  CSS_ID = "CSS_ID",
  TEMPLATE_LITERAL = "TEMPLATE_LITERAL",
  ATTRIBUTE = "ATTRIBUTE",
  BOOLEAN_ATTR = "BOOLEAN_ATTR",
  WHITESPACE = "WHITESPACE",
  EOF = "EOF",
  ERROR = "ERROR",
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  indent: number;
  raw?: string;
}

export interface TokenStream {
  tokens: Token[];
  errors: TokenError[];
}

export interface TokenError {
  message: string;
  line: number;
  column: number;
  value: string;
}

const HJX_KEYWORDS = new Set([
  "component", "state", "layout", "style", "handlers",
  "imports", "script", "computed", "if", "for", "else",
  "in", "set", "log", "export", "function", "from",
  "true", "false", "slot",
]);

const HJX_LAYOUT_TAGS = new Set([
  "view", "text", "button", "input", "img", "a",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "span", "div", "ul", "li", "ol",
  "form", "label", "select", "option", "textarea",
  "table", "thead", "tbody", "tr", "td", "th",
  "header", "footer", "nav", "main", "section", "article", "aside",
  "Card", "Button", "Input", "Modal", "Dialog", "Alert",
]);

const OPERATORS = ["===", "!=", "<->", "<=", ">=", "&&", "||", "->", "=", "<", ">", "!", "+", "-", "*", "/", "?"];
const DELIMITERS = ["(", ")", ":", ".", "#", "{", "}", "[", "]", ",", ";"];

export class HJXTokenizer {
  private source: string;
  private pos: number = 0;
  private line: number = 1;
  private column: number = 1;
  private indentStack: number[] = [0];
  private tokens: Token[] = [];
  private errors: TokenError[] = [];
  private atLineStart: boolean = true;

  constructor(source: string) {
    this.source = source.replace(/\r\n/g, "\n");
  }

  tokenize(): TokenStream {
    this.tokens = [];
    this.errors = [];
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.indentStack = [0];
    this.atLineStart = true;

    while (this.pos < this.source.length) {
      if (this.atLineStart) {
        this.handleIndentation();
        this.atLineStart = false;
      }

      if (this.pos >= this.source.length) break;

      const ch = this.source[this.pos];

      if (ch === "\n") {
        this.emitToken(TokenType.NEWLINE, "\n", this.line, this.column);
        this.pos++;
        this.line++;
        this.column = 1;
        this.atLineStart = true;
        continue;
      }

      if (ch === " " || ch === "\t") {
        this.skipWhitespace();
        continue;
      }

      if (ch === "/" && this.peek() === "/") {
        this.readLineComment();
        continue;
      }

      if (ch === "/" && this.peek() === "*") {
        this.readBlockComment();
        continue;
      }

      if (ch === '"' || ch === "'") {
        this.readString(ch);
        continue;
      }

      if (ch === "{") {
        if (this.source.substring(this.pos, this.pos + 2) === "{{") {
          this.readTemplateVariable();
          continue;
        }
        this.emitToken(TokenType.DELIMITER, "{", this.line, this.column);
        this.pos++;
        this.column++;
        continue;
      }

      if (this.isDigit(ch) || (ch === "-" && this.isDigit(this.peek()))) {
        this.readNumber();
        continue;
      }

      if (this.isIdentifierStart(ch)) {
        this.readIdentifierOrKeyword();
        continue;
      }

      // Multi-char operators
      let matchedOp = false;
      for (const op of OPERATORS) {
        if (this.source.substring(this.pos, this.pos + op.length) === op) {
          this.emitToken(TokenType.OPERATOR, op, this.line, this.column);
          this.pos += op.length;
          this.column += op.length;
          matchedOp = true;
          break;
        }
      }
      if (matchedOp) continue;

      if (DELIMITERS.includes(ch)) {
        this.emitToken(TokenType.DELIMITER, ch, this.line, this.column);
        this.pos++;
        this.column++;
        continue;
      }

      this.errors.push({
        message: `Unexpected character: '${ch}'`,
        line: this.line,
        column: this.column,
        value: ch,
      });
      this.emitToken(TokenType.ERROR, ch, this.line, this.column);
      this.pos++;
      this.column++;
    }

    // Emit remaining DEDENT tokens
    while (this.indentStack.length > 1) {
      this.indentStack.pop();
      this.emitToken(TokenType.DEDENT, "", this.line, this.column);
    }

    this.emitToken(TokenType.EOF, "", this.line, this.column);
    return { tokens: this.tokens, errors: this.errors };
  }

  private handleIndentation(): void {
    let spaces = 0;
    while (this.pos < this.source.length && (this.source[this.pos] === " " || this.source[this.pos] === "\t")) {
      if (this.source[this.pos] === "\t") {
        spaces += 4;
      } else {
        spaces += 1;
      }
      this.pos++;
    }

    // Skip blank lines and comment-only lines for indentation
    if (this.pos >= this.source.length || this.source[this.pos] === "\n") return;
    if (this.source.substring(this.pos).startsWith("//")) return;

    const currentIndent = this.indentStack[this.indentStack.length - 1];

    if (spaces > currentIndent) {
      this.indentStack.push(spaces);
      this.emitToken(TokenType.INDENT, " ".repeat(spaces), this.line, this.column);
    } else if (spaces < currentIndent) {
      while (this.indentStack.length > 1 && this.indentStack[this.indentStack.length - 1] > spaces) {
        this.indentStack.pop();
        this.emitToken(TokenType.DEDENT, "", this.line, this.column);
      }
      if (this.indentStack[this.indentStack.length - 1] !== spaces) {
        this.errors.push({
          message: `Indentation error: expected ${this.indentStack[this.indentStack.length - 1]}, got ${spaces}`,
          line: this.line,
          column: 1,
          value: " ".repeat(spaces),
        });
      }
    }

    this.column = spaces + 1;
  }

  private skipWhitespace(): void {
    while (this.pos < this.source.length && (this.source[this.pos] === " " || this.source[this.pos] === "\t")) {
      this.pos++;
      this.column++;
    }
  }

  private readLineComment(): void {
    const start = this.pos;
    const startCol = this.column;
    while (this.pos < this.source.length && this.source[this.pos] !== "\n") {
      this.pos++;
      this.column++;
    }
    this.emitToken(TokenType.COMMENT, this.source.substring(start, this.pos), this.line, startCol);
  }

  private readBlockComment(): void {
    const start = this.pos;
    const startCol = this.column;
    const startLine = this.line;
    this.pos += 2;
    this.column += 2;
    while (this.pos < this.source.length) {
      if (this.source.substring(this.pos, this.pos + 2) === "*/") {
        this.pos += 2;
        this.column += 2;
        break;
      }
      if (this.source[this.pos] === "\n") {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.pos++;
    }
    this.emitToken(TokenType.COMMENT, this.source.substring(start, this.pos), startLine, startCol);
  }

  private readString(quote: string): void {
    const startCol = this.column;
    this.pos++; // skip opening quote
    this.column++;
    let value = "";
    while (this.pos < this.source.length && this.source[this.pos] !== quote) {
      // Check for template variable inside string
      if (this.source[this.pos] === "{" && this.source[this.pos + 1] === "{") {
        // Emit accumulated string part if any
        if (value.length > 0) {
          this.emitToken(TokenType.STRING, value, this.line, startCol);
          value = "";
        }
        // Read template variable
        this.pos += 2;
        this.column += 2;
        let varValue = "";
        while (this.pos < this.source.length && this.source.substring(this.pos, this.pos + 2) !== "}}") {
          if (this.source[this.pos] === "\n") {
            this.line++;
            this.column = 1;
          } else {
            varValue += this.source[this.pos];
            this.column++;
          }
          this.pos++;
        }
        if (this.pos < this.source.length) {
          this.pos += 2;
          this.column += 2;
        }
        this.emitToken(TokenType.TEMPLATE_LITERAL, varValue.trim(), this.line, startCol);
        continue;
      }
      if (this.source[this.pos] === "\\") {
        this.pos++;
        this.column++;
        value += this.source[this.pos] ?? "";
      } else if (this.source[this.pos] === "\n") {
        value += "\n";
        this.line++;
        this.column = 1;
      } else {
        value += this.source[this.pos];
        this.column++;
      }
      this.pos++;
    }
    if (this.pos < this.source.length) {
      this.pos++; // skip closing quote
      this.column++;
    }
    // Emit remaining string value
    if (value.length > 0) {
      this.emitToken(TokenType.STRING, value, this.line, startCol);
    }
  }

  private readTemplateVariable(): void {
    const startCol = this.column;
    this.pos += 2; // skip {{
    this.column += 2;
    let value = "";
    while (this.pos < this.source.length && this.source.substring(this.pos, this.pos + 2) !== "}}") {
      if (this.source[this.pos] === "\n") {
        this.line++;
        this.column = 1;
      } else {
        value += this.source[this.pos];
        this.column++;
      }
      this.pos++;
    }
    if (this.pos < this.source.length) {
      this.pos += 2; // skip }}
      this.column += 2;
    }
    this.emitToken(TokenType.TEMPLATE_LITERAL, value.trim(), this.line, startCol);
  }

  private readNumber(): void {
    const start = this.pos;
    const startCol = this.column;
    if (this.source[this.pos] === "-") {
      this.pos++;
      this.column++;
    }
    while (this.pos < this.source.length && this.isDigit(this.source[this.pos])) {
      this.pos++;
      this.column++;
    }
    if (this.pos < this.source.length && this.source[this.pos] === ".") {
      this.pos++;
      this.column++;
      while (this.pos < this.source.length && this.isDigit(this.source[this.pos])) {
        this.pos++;
        this.column++;
      }
    }
    this.emitToken(TokenType.NUMBER, this.source.substring(start, this.pos), this.line, startCol);
  }

  private readIdentifierOrKeyword(): void {
    const start = this.pos;
    const startCol = this.column;
    while (this.pos < this.source.length && this.isIdentifierPart(this.source[this.pos])) {
      this.pos++;
      this.column++;
    }
    const value = this.source.substring(start, this.pos);

    if (value === "true" || value === "false") {
      this.emitToken(TokenType.BOOLEAN, value, this.line, startCol);
    } else if (HJX_KEYWORDS.has(value)) {
      this.emitToken(TokenType.KEYWORD, value, this.line, startCol);
    } else if (HJX_LAYOUT_TAGS.has(value)) {
      this.emitToken(TokenType.IDENTIFIER, value, this.line, startCol);
    } else {
      this.emitToken(TokenType.IDENTIFIER, value, this.line, startCol);
    }
  }

  private emitToken(type: TokenType, value: string, line: number, column: number): void {
    this.tokens.push({ type, value, line, column, indent: this.indentStack[this.indentStack.length - 1] });
  }

  private peek(offset: number = 1): string {
    return this.source[this.pos + offset] ?? "";
  }

  private isDigit(ch: string): boolean {
    return ch >= "0" && ch <= "9";
  }

  private isIdentifierStart(ch: string): boolean {
    return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_";
  }

  private isIdentifierPart(ch: string): boolean {
    return this.isIdentifierStart(ch) || this.isDigit(ch) || ch === "-";
  }
}

export function tokenizeHJX(source: string): TokenStream {
  return new HJXTokenizer(source).tokenize();
}
