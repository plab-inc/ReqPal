import ContextPad, { ContextPadTarget } from "diagram-js/lib/features/context-pad/ContextPad";
import ContextPadProvider, { ContextPadEntries } from "diagram-js/lib/features/context-pad/ContextPadProvider";
import { Element } from "diagram-js/lib/model";
import Create from "diagram-js/lib/features/create/Create";
import ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import { Translate } from "bpmn-js/lib/features/palette/PaletteProvider";
import { ContextPadConfig } from "bpmn-js/lib/features/context-pad/ContextPadProvider";
import { Injector } from "diagram-js/lib/features/hand-tool/HandTool";
import { Moddle } from "bpmn-js/lib/model/Types";

class CustomContextPad implements ContextPadProvider {

  private create: Create;
  private elementFactory: ElementFactory;
  private translate: Translate;
  private autoPlace: any;
  private moddle: Moddle;

  constructor(config: ContextPadConfig, contextPad: ContextPad, create: Create, elementFactory: ElementFactory, translate: Translate, injector: Injector, moddle: Moddle) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
    this.moddle = moddle;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', true);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element: Element) {
    const {
      autoPlace,
      create,
      elementFactory,
      translate,
      moddle
    } = this;

    return (entries: ContextPadEntries): ContextPadEntries => {
      this.removeUnusedEntries(entries);
      const userTaskEntries = this.createUserTaskEntries(autoPlace, create, elementFactory, moddle, translate);

      if (element.type !== 'bpmn:SequenceFlow') {
        delete entries['replace'];
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

  private createUserTaskEntries(autoPlace: any, create: Create, elementFactory: ElementFactory, moddle: Moddle, translate: Translate): ContextPadEntries {

    const appendUserTaskStart = (event: any, element: ContextPadTarget) => {
      const shape = this.createUserTaskShape(elementFactory, moddle);
      create.start(event, shape, element);
    };

    const appendUserTask = (event: any, element: ContextPadTarget) => {
      if (autoPlace) {
        const shape = this.createUserTaskShape(elementFactory, moddle);
        autoPlace.append(element, shape);
      } else {
        appendUserTaskStart(event, element);
      }
    };

    return {
      'append.user-task': {
        group: 'model',
        className: 'bpmn-icon-user-task',
        title: translate('Append User Lesson Task'),
        action: {
          dragstart: appendUserTaskStart,
          click: appendUserTask
        }
      }
    };
  }

  private createUserTaskShape(elementFactory: ElementFactory, moddle: Moddle) {
    return elementFactory.createShape({
      type: 'bpmn:UserTask',
      businessObject: moddle.create('bpmn:UserTask', {
        'camunda:assignee': '$(data.starterUserId)'
      })
    });
  }
}

export default CustomContextPad;