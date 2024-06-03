import ContextPad, { ContextPadTarget } from "diagram-js/lib/features/context-pad/ContextPad";
import ContextPadProvider, { ContextPadEntries } from "diagram-js/lib/features/context-pad/ContextPadProvider";
import { Element } from "diagram-js/lib/model";
import Create from "diagram-js/lib/features/create/Create";
import ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import { Translate } from "bpmn-js/lib/features/palette/PaletteProvider";
import { ContextPadConfig } from "bpmn-js/lib/features/context-pad/ContextPadProvider";
import { Injector } from "diagram-js/lib/features/hand-tool/HandTool";
import BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";

class CustomContextPad implements ContextPadProvider {

  private create: Create;
  private elementFactory: ElementFactory;
  private bpmnFactory: BpmnFactory;
  private readonly translate: Translate;
  private readonly autoPlace: any;
  static $inject: string[];

  constructor(config: ContextPadConfig, contextPad: ContextPad, create: Create, bpmnFactory: BpmnFactory, elementFactory: ElementFactory, translate: Translate, injector: Injector) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
    this.bpmnFactory = bpmnFactory;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', true);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element: Element) {
    return (entries: ContextPadEntries): ContextPadEntries => {
      this.removeUnusedEntries(entries);
      const userTaskEntries = this.createUserTaskEntries();

      if (element.type !== 'bpmn:SequenceFlow') {
        delete entries['replace'];
      }

      if (element.type === 'bpmn:SequenceFlow') {
        return entries;
      }

      return {
        ...entries,
        ...userTaskEntries
      };
    };
  }

  private removeUnusedEntries(entries: ContextPadEntries) {
    const keysToRemove = [
      'append.intermediate-event',
      'append.append-task'
    ];

    keysToRemove.forEach(key => delete entries[key]);
  }

  private createUserTaskEntries(): ContextPadEntries {
    const appendUserTaskStart = (event: any, element: ContextPadTarget) => {
      const shape = this.createUserTaskShape();
      this.create.start(event, shape, element);
    };

    const appendUserTask = (event: any, element: ContextPadTarget) => {
      if (this.autoPlace) {
        const shape = this.createUserTaskShape();
        this.autoPlace.append(element, shape);
      } else {
        appendUserTaskStart(event, element);
      }
    };

    return {
      'append.user-task': {
        className: 'bpmn-icon-user-task',
        title: this.translate('Append User Lesson Task'),
        action: {
          dragstart: appendUserTaskStart,
          click: appendUserTask
        }
      }
    };
  }

  private createUserTaskShape() {
    const businessObject = this.bpmnFactory.create('bpmn:UserTask', { 'camunda:assignee': '$(data.starterUserId)' });

    return this.elementFactory.createShape({
      type: 'bpmn:UserTask',
      businessObject: businessObject
    });
  }
}

CustomContextPad.$inject = ['config','contextPad', 'create', 'bpmnFactory', 'elementFactory', 'translate', 'injector'];

export default CustomContextPad;