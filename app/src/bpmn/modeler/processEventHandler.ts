import EventBus, { EventBusEventCallback } from "diagram-js/lib/core/EventBus";
import ElementRegistry from "diagram-js/lib/core/ElementRegistry";
import Modeling from "bpmn-js/lib/features/modeling/Modeling";
import { Moddle } from "bpmn-js/lib/model/Types.ts";
import { useScenarioModelerStore } from "@/stores/scenarioModeler.ts";
import { ModdleElement } from "bpmn-js/lib/model/Types";
import { Element } from "bpmn-js/lib/model/Types";

class ProcessEventHandler {

  private eventBus: EventBus;
  private elementRegistry: ElementRegistry;
  private modeling: Modeling;
  private moddle: Moddle;
  static $inject: string[];

  constructor(eventBus: EventBus, elementRegistry: ElementRegistry, modeling: Modeling, moddle: Moddle) {
    this.eventBus = eventBus;
    this.elementRegistry = elementRegistry;
    this.modeling = modeling;
    this.moddle = moddle;

    this.register();
  }

  private register() {
    this.eventBus.on(['saveXML.start', 'import.done'], this.updateProcessProps);
  }

  private updateProcessProps: EventBusEventCallback<void> = (): void => {
    //TODO Better synergy between store and xml props during import

    const scenarioModelerStore = useScenarioModelerStore();

    const process = this.elementRegistry.filter((element: ModdleElement) => element.type === "bpmn:Process")[0] as Element;

    if (process) {
      const { getProcessId, title, description } = scenarioModelerStore;

      this.modeling.updateProperties(process, {
        id: getProcessId,
        name: title,
        isExecutable: true
      });

      const documentation = this.moddle.create('bpmn:Documentation', { text: description });

      process.businessObject.documentation = [];
      process.businessObject.documentation.push(documentation);
    }
  }

}

ProcessEventHandler.$inject = ['eventBus','elementRegistry','modeling','moddle'];

export default ProcessEventHandler;