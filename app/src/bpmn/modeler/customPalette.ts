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
      const customEntries = this.createCustomEntries();

      return {
        ...entries,
        ...customEntries
      };
    };
  }

  private removeUnusedEntries(entries: PaletteEntries) {
    const keysToRemove = [
      "create.task",
      "create.exclusive-gateway",
      "create.parallel-gateway",
      "create.inclusive-gateway",
      'create.intermediate-event',
      "create.event-based-gateway",
      "create.subprocess-expanded",
      'create.data-store',
      'create.participant-expanded',
      'create.data-object',
    ];

    keysToRemove.forEach(key => delete entries[key]);
  }

  private createCustomEntries(): PaletteEntries {
    const createExclusiveGateway = (event: any) => {
      const businessObject = this.bpmnFactory.create("bpmn:ExclusiveGateway");

      const shape = this.elementFactory.createShape({
        type: "bpmn:ExclusiveGateway",
        businessObject: businessObject
      });

      this.create.start(event, shape);
    };

    const createUserTask = (event: any) => {
      const businessObject = this.bpmnFactory.create('bpmn:UserTask');

      const shape = this.elementFactory.createShape({
        type: 'bpmn:UserTask',
        businessObject: businessObject
      });

      this.create.start(event, shape);
    };

    const createServiceTask = (event: any) => {
      const businessObject = this.bpmnFactory.create('bpmn:ServiceTask');

      const shape = this.elementFactory.createShape({
        type: 'bpmn:ServiceTask',
        businessObject: businessObject
      });

      this.create.start(event, shape);
    };

    const createEndEvent = (event: any) => {
      const businessObject = this.bpmnFactory.create("bpmn:EndEvent");
      businessObject.name = "Ende";

      const shape = this.elementFactory.createShape({
        type: "bpmn:EndEvent",
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
      },
      'create.service-task': {
        group: 'activity',
        className: 'bpmn-icon-service-task',
        title: this.translate('Create Gamification Service'),
        action: {
          dragstart: createServiceTask,
          click: createServiceTask
        }
      },
      "create.exclusive-gateway": {
        group: "gateway",
        className: "bpmn-icon-gateway-xor",
        title: this.translate("Create Exclusive Gateway"),
        action: {
          dragstart: createExclusiveGateway,
          click: createExclusiveGateway
        }
      },
      "create.end-event": {
        group: "event",
        className: "bpmn-icon-end-event-none",
        title: this.translate("Create End Event"),
        action: {
          dragstart: createEndEvent,
          click: createEndEvent
        }
      }
    };
  }
}

CustomPalette.$inject = ["palette", "create", "bpmnFactory", "elementFactory", "translate"];

export default CustomPalette;