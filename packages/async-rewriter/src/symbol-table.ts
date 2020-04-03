/* eslint no-console:0 */
/**
 * Symbol Table implementation, which is a stack of key-value maps.
 *
 * A single symbol has a name and type attribute.
 * The type attribute will be one of:
 *     unknown: { type: 'unknown', attributes?: {} }
 *     function: { type: 'function', returnsPromise?: bool, returnType?: type name or obj, attributes?: {} }
 *     class instance: { type: classname, attributes?: {} }
 *     class definition: { type: 'classdef', returnType: type name or obj }
 */
export default class SymbolTable {
  private scopeStack: object[];
  public types: any;
  constructor(initialScope: object[], types: object) {
    this.types = types;
    this.scopeStack = initialScope;
    Object.keys(this.types).forEach(s => {
      if (s === 'unknown' || this.lookup(s).type !== 'unknown') return;
      this.add(s, { type: 'classdef', returnType: this.types[s], lib: true });
    });
  }
  deepCopy(): SymbolTable {
    const newStack = JSON.parse(JSON.stringify(this.scopeStack));
    return new SymbolTable(newStack, this.types);
  }
  lookup(item): any {
    for (let i = this.last; i >= 0; i--) {
      if (this.scopeStack[i][item]) {
        return this.scopeStack[i][item];
      }
    }
    return this.types.unknown;
  }
  add(item, value): void {
    this.scopeStack[this.last][item] = value;
  }
  addToParent(item, value): void {
    const end = Math.max(this.last - 1, 0);
    for (let i = end; i >= 0; i--) {
      if (this.scopeStack[i][item]) {
        this.scopeStack[i][item] = value;
        return;
      }
    }
    this.scopeStack[end][item] = value;
  }
  addToTopLevel(item, value): void {
    this.scopeAt(1)[item] = value;
  }
  update(item, value): void {
    for (let i = this.last; i >= 0; i--) {
      if (this.scopeStack[i][item]) {
        this.scopeStack[i][item] = value;
        return;
      }
    }
    return this.add(item, value);
  }
  updateIfDefined(item, value): boolean {
    for (let i = this.last; i >= 0; i--) {
      if (this.scopeStack[i][item]) {
        this.scopeStack[i][item] = value;
        return true;
      }
    }
    return false;
  }
  updateFunctionScoped(path, key, type, t): void {
    // Because it adds to scopes only via nodes, will add to actual ST regardless of branching
    let scopeParent = path.getFunctionParent();
    if (scopeParent === null) {
      scopeParent = path.findParent(p => t.isProgram(p));
    }
    const shellScope = scopeParent.node.shellScope;
    if (shellScope === undefined) {
      // scope of the parent is out of scope?
      throw new Error('internal error');
    }
    this.scopeAt(shellScope)[key] = type;
  }
  popScope(): object {
    if (this.depth === 1) return;
    return this.scopeStack.pop();
  }
  pushScope(): number {
    const scope = {};
    return this.scopeStack.push(scope) - 1;
  }
  get depth(): number {
    return this.scopeStack.length;
  }
  get last(): number {
    return this.depth - 1;
  }
  scopeAt(i): object {
    return this.scopeStack[i];
  }
  compareSymbolTables(alternates): void {
    this.scopeStack.forEach((thisScope, i) => {
      const keys = new Set();
      alternates.forEach((st) => {
        if (this.depth !== st.depth) {
          throw new Error('Internal Error: scope tracking errored');
        }
        Object.keys(st.scopeAt(i)).forEach(k => keys.add(k));
      });
      keys.forEach((k: number) => {
        const equal = alternates.every((a) => JSON.stringify(a.scopeAt(i)[k]) === JSON.stringify(alternates[0].scopeAt(i)[k]));
        if (equal) {
          thisScope[k] = alternates[0].scopeAt(i)[k];
        } else {
          const hasAsync = alternates.some((a) => a.scopeAt(i)[k] !== undefined && a.scopeAt(i)[k].hasAsyncChild);
          if (hasAsync) {
            throw new Error(`Error: cannot conditionally assign Shell API types. Type type of ${k} is unable to be inferred. Try using a locally scoped variable instead.`);
          } else {
            thisScope[k] = this.types.unknown;
          }
        }
      });
    });
  }
  printSymbol(symbol, key): string {
    const type = symbol.type;
    let info = '';
    if (type === 'function') {
      let rt = symbol.returnType;
      if (typeof symbol.returnType === 'undefined') {
        rt = '?';
      } else if (typeof symbol.returnType === 'object') {
        rt = rt.type;
      }
      const rp = symbol.returnsPromise === undefined ? '?' : symbol.returnsPromise;
      info = `returnType: ${rt} returnsPromise: ${rp}`;
    } else if (type === 'classdef') {
      info = this.printSymbol(symbol.returnType, 'returnType');
    } else {
      info = '[]';
      if (symbol.attributes !== undefined) {
        info = Object.keys(symbol.attributes).map((v) => {
          return `${v}: <${symbol.attributes[v].type}>`;
        }).join(', ');
      }
      info = ` attributes: { ${info} }`;
    }
    return `  ${key}: { type: '${type}' ${info} }`;
  }
  print(): void {
    console.log('----Printing Symbol Table----');
    for (let scopeDepth = this.last; scopeDepth >= 0; scopeDepth--) {
      const scope = this.scopeStack[scopeDepth];
      console.log(`scope@${scopeDepth}:`);
      Object.keys(scope).filter((s) => (!scope[s].lib)).forEach((k) => {
        console.log(this.printSymbol(scope[k], k));
      });
    }
    console.log('-----------------------------');
  }
}

