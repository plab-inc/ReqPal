declare module 'bpmn-js-color-picker';
declare module 'bpmn-js-token-simulation';
declare module 'bpmn-js-properties-panel';
declare module '@/bpmn/properties/CustomProperties.js';
declare module "dijkstrajs" {
  export interface Graph {
    [key: string]: { [key: string]: number };
  }

  export function find_path(graph: Graph, s: string, d: string): string[];
}