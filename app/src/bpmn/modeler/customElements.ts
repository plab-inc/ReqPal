import CustomPalette from './customPalette.ts';
import CustomContextPad from "./customContextPad.ts";
import CustomPopupMenu from "./customPopup.ts"

export default {
  __init__: [ 'customPalette','customContextPad', 'customPopupMenu' ],
  customPalette: [ 'type', CustomPalette ],
  customContextPad: [ 'type', CustomContextPad ],
  customPopupMenu: ['type', CustomPopupMenu]
};