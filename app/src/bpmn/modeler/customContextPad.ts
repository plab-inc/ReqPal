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

      if (element.type === "bpmn:EndEvent") {
        return {
          "delete": entries["delete"],
          "set-color": entries["set-color"]
        };
      }

      const taskEntries = this.createTaskEntries();

      if (element.type === "label" || element.type === "bpmn:SequenceFlow" || element.type === "bpmn:Group") {
        delete entries["set-color"];
        return entries;
      }

      if (element.type !== 'bpmn:SequenceFlow') {
        delete entries['replace'];
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
      "append.append-task",
      "append.gateway",
      "append.end-event"
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

    const appendExclusiveGatewayStart = (event: any, element: ContextPadTarget) => {
      const shape = this.createExclusiveGatewayShape();
      this.create.start(event, shape, element);
    };

    const appendExclusiveGateway = (event: any, element: ContextPadTarget) => {
      if (this.autoPlace) {
        const shape = this.createExclusiveGatewayShape();
        this.autoPlace.append(element, shape);
      } else {
        appendExclusiveGatewayStart(event, element);
      }
    };

    const appendEndEventStart = (event: any, element: ContextPadTarget) => {
      const shape = this.createEndEventShape();
      this.create.start(event, shape, element);
    };

    const appendEndEvent = (event: any, element: ContextPadTarget) => {
      if (this.autoPlace) {
        const shape = this.createEndEventShape();
        this.autoPlace.append(element, shape);
      } else {
        appendEndEventStart(event, element);
      }
    };

    return {
      'append.user-task': {
        className: 'bpmn-icon-user-task',
        title: this.translate("Append User Task"),
        action: {
          dragstart: appendUserTaskStart,
          click: appendUserTask
        }
      },
      'append.service-task': {
        className: 'bpmn-icon-service-task',
        title: this.translate("Append Service Task"),
        action: {
          dragstart: appendServiceTaskStart,
          click: appendServiceTask
        }
      },
      "append.exclusive-gateway": {
        className: "bpmn-icon-gateway-xor",
        title: this.translate("Append Exclusive Gateway"),
        action: {
          dragstart: appendExclusiveGatewayStart,
          click: appendExclusiveGateway
        }
      },
      "append.end-event": {
        className: "bpmn-icon-end-event-none",
        title: this.translate("Append End Event"),
        action: {
          dragstart: appendEndEventStart,
          click: appendEndEvent
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

  private createExclusiveGatewayShape() {
    const businessObject = this.bpmnFactory.create("bpmn:ExclusiveGateway");

    return this.elementFactory.createShape({
      type: "bpmn:ExclusiveGateway",
      businessObject: businessObject
    });
  }

  private createEndEventShape() {
    const businessObject = this.bpmnFactory.create("bpmn:EndEvent");
    businessObject.name = "Ende";

    return this.elementFactory.createShape({
      type: "bpmn:EndEvent",
      businessObject: businessObject
    });
  }
}

CustomContextPad.$inject = ['config','contextPad', 'create', 'bpmnFactory', 'elementFactory', 'translate', 'injector'];

export default CustomContextPad;
