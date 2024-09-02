declare module 'bpmn-js-color-picker';
declare module 'bpmn-js-token-simulation';
declare module "bpmn-js-bpmnlint"
declare module 'bpmn-js-properties-panel';
declare module '@/bpmn/properties/CustomProperties.js';
declare module "dijkstrajs" {
  export interface Graph {
    [key: string]: { [key: string]: number };
  }

  export function find_path(graph: Graph, s: string, d: string): string[];
}

declare module "@/bpmn/linter/packed-lint-config" {
  export const config: any;
  export const resolver: any;
  const _default: {
    resolver: any;
    config: any;
  };
  export default _default;
}