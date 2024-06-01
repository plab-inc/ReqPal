import Palette from "diagram-js/lib/features/palette/Palette";
import PaletteProvider, { PaletteEntries, PaletteEntriesCallback } from "diagram-js/lib/features/palette/PaletteProvider";
import Create from "diagram-js/lib/features/create/Create";
import BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";
import ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import { Translate } from "bpmn-js/lib/features/palette/PaletteProvider";
import Connect from "diagram-js/lib/features/connect/Connect";

class CustomPalette implements PaletteProvider {

  private create: Create;
  private bpmnFactory: BpmnFactory;
  private elementFactory: ElementFactory;
  private translate: Translate;

  constructor(palette: Palette, create: Create, connect: Connect, bpmnFactory: BpmnFactory, elementFactory: ElementFactory, translate: Translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
    palette.registerProvider(this);
  }

  getPaletteEntries(): PaletteEntriesCallback {
    const { bpmnFactory, create, elementFactory, translate } = this;

    return (entries: PaletteEntries): PaletteEntries => {
      this.removeUnusedEntries(entries);
      const userTaskEntries = this.createUserTaskEntry(bpmnFactory, elementFactory, create, translate);

      return {
        ...entries,
        ...userTaskEntries
      };
    };
  }

  private removeUnusedEntries(entries: PaletteEntries) {
    const keysToRemove = [
      'create.group',
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

  private createUserTaskEntry(bpmnFactory: BpmnFactory, elementFactory: ElementFactory, create: Create, translate: Translate): PaletteEntries {
    const createTask = (event: any) => {
      const businessObject = bpmnFactory.create('bpmn:UserTask', { 'camunda:assignee': '$(data.starterUserId)' });

      const shape = elementFactory.createShape({
        type: 'bpmn:UserTask',
        businessObject: businessObject
      });

      create.start(event, shape);
    };

    return {
      'create.user-task': {
        group: 'activity',
        className: 'bpmn-icon-user-task',
        title: translate('Create Lesson Task'),
        action: {
          dragstart: createTask,
          click: createTask
        }
      }
    };
  }
}

export default CustomPalette;