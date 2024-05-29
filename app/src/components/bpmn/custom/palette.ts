import Palette from "diagram-js/lib/features/palette/Palette";
import PaletteProvider, {
  PaletteEntries,
  PaletteEntriesCallback
} from "diagram-js/lib/features/palette/PaletteProvider";
import Create from "diagram-js/lib/features/create/Create";
import BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";
import ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import { Translate } from "bpmn-js/lib/features/palette/PaletteProvider";

class CustomPalette implements PaletteProvider {

  private create: Create;
  private bpmnFactory: BpmnFactory;
  private elementFactory: ElementFactory;
  private translate: Translate;

  constructor(palette: Palette, create: Create, bpmnFactory: BpmnFactory, elementFactory: ElementFactory, translate: Translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
    palette.registerProvider(this);
  }

  getPaletteEntries(): PaletteEntriesCallback {

    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function createTask() {
      return function(event: any) {
        const businessObject = bpmnFactory.create('bpmn:UserTask');

        const shape = elementFactory.createShape({
          type: 'bpmn:UserTask',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    return (entries: PaletteEntries): PaletteEntries => {
      const keysToRemove = [
        'create.group',
        'create.service-task',
        'create.intermediate-event',
        'create.data-store',
        'create.subprocess-expanded',
        'create.participant-expanded',
        'create.data-object',
        'create.task'
      ];

      keysToRemove.forEach(key => delete entries[key]);

      const userTask = {
        'create.user-task': {
          group: 'activity',
          className: 'bpmn-icon-user-task',
          title: translate('Create Lesson Task'),
          action: {
            dragstart: createTask(),
            click: createTask()
          }
        },
      }

      return {
        ...entries,
        ...userTask
      };
    };

  }

}

export default CustomPalette;
