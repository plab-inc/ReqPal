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
  private readonly translate: Translate;
  static $inject: string[];

  constructor(palette: Palette, create: Create, bpmnFactory: BpmnFactory, elementFactory: ElementFactory, translate: Translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(): PaletteEntriesCallback {
    return (entries: PaletteEntries): PaletteEntries => {
      this.removeUnusedEntries(entries);
      const userTaskEntries = this.createUserTaskEntries();

      return {
        ...entries,
        ...userTaskEntries
      };
    };
  }

  private removeUnusedEntries(entries: PaletteEntries) {
    const keysToRemove = [
      'create.service-task',
      'create.intermediate-event',
      'create.data-store',
      'create.subprocess-expanded',
      'create.participant-expanded',
      'create.data-object',
      'create.task',
    ];

    keysToRemove.forEach(key => delete entries[key]);
  }

  private createUserTaskEntries(): PaletteEntries {
    const createUserTask = (event: any) => {
      const businessObject = this.bpmnFactory.create('bpmn:UserTask');

      const shape = this.elementFactory.createShape({
        type: 'bpmn:UserTask',
        businessObject: businessObject
      });

      this.create.start(event, shape);
    };

    return {
      'create.user-task': {
        group: 'activity',
        className: 'bpmn-icon-user-task',
        title: this.translate('Create Lesson Task'),
        action: {
          dragstart: createUserTask,
          click: createUserTask
        }
      }
    };
  }
}

CustomPalette.$inject = ['palette','create', 'bpmnFactory', 'elementFactory', 'translate'];

export default CustomPalette;