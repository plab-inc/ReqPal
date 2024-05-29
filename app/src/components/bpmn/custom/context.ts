import ContextPad, { ContextPadTarget } from "diagram-js/lib/features/context-pad/ContextPad";
import ContextPadProvider, {
  ContextPadEntries,
  ContextPadEntry
} from "diagram-js/lib/features/context-pad/ContextPadProvider";
import { Element } from "diagram-js/lib/model";
import Create from "diagram-js/lib/features/create/Create";
import ElementFactory from "bpmn-js/lib/features/modeling/ElementFactory";
import { Translate } from "bpmn-js/lib/features/palette/PaletteProvider";
import { ContextPadConfig } from "bpmn-js/lib/features/context-pad/ContextPadProvider";
import { Injector } from "diagram-js/lib/features/hand-tool/HandTool";

class CustomContextPad implements ContextPadProvider {

  private create: Create;
  private elementFactory: ElementFactory;
  private translate: Translate;
  private autoPlace: any;

  constructor(config: ContextPadConfig, contextPad: ContextPad, create: Create, elementFactory: ElementFactory, translate: Translate, injector: Injector) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', true);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element: Element){

    const {
      autoPlace,
      create,
      elementFactory,
      translate
    } = this;

    return function(entries: ContextPadEntries): ContextPadEntries{

      function appendUserTask(event: any, element: ContextPadTarget) {
        if (autoPlace) {
          const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });
          autoPlace.append(element, shape);
        } else {
          appendUserTaskStart(event, element);
        }
      }

      function appendUserTaskStart(event: any, element: ContextPadTarget) {
        const shape = elementFactory.createShape({ type: 'bpmn:UserTask' });

        create.start(event, shape, element);
      }

      const keysToRemove = [
        'replace',
        'append.intermediate-event',
        'append.append-task'
      ];

      keysToRemove.forEach(key => delete entries[key]);

      if (element.type === 'bpmn:SequenceFlow' || element.type === 'bpmn:Association' || element.waypoints) {
        return entries;
      }

      const userTask: ContextPadEntries = {
        'append.user-task': {
          group: 'model',
          className: 'bpmn-icon-user-task',
          title: translate('Append User Lesson Task'),
          action: {
            dragstart: appendUserTaskStart,
            click: appendUserTask
          }
        },
      }

      return {
        ...entries,
        ...userTask
      };
    }
  }

}

export default CustomContextPad;
