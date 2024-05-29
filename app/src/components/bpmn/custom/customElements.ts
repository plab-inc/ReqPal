import CustomPalette from './palette.ts';
import CustomContextPad from "./context.ts";

export default {
  __init__: [ 'customPalette','customContextPad'],
  customPalette: [ 'type', CustomPalette ],
  customContextPad: [ 'type', CustomContextPad ],
};