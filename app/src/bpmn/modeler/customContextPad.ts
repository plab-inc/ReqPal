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
      const taskEntries = this.createTaskEntries();

      if (element.type !== 'bpmn:SequenceFlow') {
        delete entries['replace'];
      }

      if (element.type === 'bpmn:SequenceFlow') {
        return entries;
      }

      if (element.type === "bpmn:Group") {
        delete entries["set-color"];
        return entries;
      }

      return {
        ...entries,
        ...taskEntries,
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

  private createTaskEntries(): ContextPadEntries {
    const appendServiceTaskStart = (event: any, element: ContextPadTarget) => {
      const shape = this.createServiceTaskShape();
      this.create.start(event, shape, element);
    };

    const appendServiceTask = (event: any, element: ContextPadTarget) => {
      if (this.autoPlace) {
        const shape = this.createServiceTaskShape();
        this.autoPlace.append(element, shape);
      } else {
        appendServiceTaskStart(event, element);
      }
    };

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
        title: this.translate('Append Lesson Task'),
        action: {
          dragstart: appendUserTaskStart,
          click: appendUserTask
        }
      },
      'append.service-task': {
        className: 'bpmn-icon-service-task',
        title: this.translate('Append Gamification Service'),
        action: {
          dragstart: appendServiceTaskStart,
          click: appendServiceTask
        }
      }
    };
  }

  private createUserTaskShape() {
    const businessObject = this.bpmnFactory.create('bpmn:UserTask');

    return this.elementFactory.createShape({
      type: 'bpmn:UserTask',
      businessObject: businessObject
    });
  }

  private createServiceTaskShape() {
    const businessObject = this.bpmnFactory.create('bpmn:ServiceTask');

    return this.elementFactory.createShape({
      type: 'bpmn:ServiceTask',
      businessObject: businessObject
    });
  }

}

CustomContextPad.$inject = ['config','contextPad', 'create', 'bpmnFactory', 'elementFactory', 'translate', 'injector'];

export default CustomContextPad;