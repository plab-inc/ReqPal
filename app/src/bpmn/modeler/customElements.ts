import CustomPalette from './customPalette.ts';
import CustomContextPad from "./customContextPad.ts";
import CustomPopupMenu from "./customPopup.ts"
import ProcessEventHandler from "@/bpmn/modeler/processEventHandler.ts";

export default {
  __init__: [ 'customPalette','customContextPad', 'customPopupMenu', 'processEventHandler' ],
  customPalette: [ 'type', CustomPalette ],
  customContextPad: [ 'type', CustomContextPad ],
  customPopupMenu: ['type', CustomPopupMenu],
  processEventHandler: ['type', ProcessEventHandler]
};