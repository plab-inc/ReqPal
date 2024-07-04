import { Group, isSelectEntryEdited, SelectEntry } from "@bpmn-io/properties-panel";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil.js";
import { jsx } from "@bpmn-io/properties-panel/preact/jsx-runtime";
import { useService } from "bpmn-js-properties-panel";
import { useLessonStore } from "@/stores/lesson.ts";
import { toRaw } from "vue";

export function ServiceTaskGroup(element, translate) {
  const group = {
    label: translate('Gamification Service To Call'),
    id: 'GamificationService',
    component: Group,
    entries: [...ServiceTaskProps({ element, translate })]
  };
  if (group.entries.length) {
    return group;
  }
  return null;
}

function ServiceTaskProps(props) {
  const { element } = props;
  if (!(is(element, 'bpmn:ServiceTask'))) {return [];}
  const entries = [];

  entries.push({
    id: 'serviceTaskType',
    component: ServiceTaskType,
    isEdited: isSelectEntryEdited,
  });

  const taskType = getServiceTaskType(element);

  if (taskType === 'assignAchievement') {
    entries.push({
      id: 'achievementToAssign',
      component: AssignAchievementTaskType,
      isEdited: isSelectEntryEdited,
    });
  }

  return entries;
}

function ServiceTaskType(props) {
  const { element } = props;
  const translate = useService('translate');
  const modeling = useService('modeling');

  const getValue = () => getServiceTaskType(element);

  const setValue = (value) => {
    modeling.updateProperties(element, { serviceTaskType: value })
  };

  const getOptions = () => [
    { value: 'assignAchievement', label: translate('Assign Achievement') },
    //{ value: 'grantXPToObjective', label: translate('Grant XP To Learning Objective') }
  ];

  return jsx(SelectEntry, {
    element,
    id: "serviceTaskType",
    label: translate('Gamification Service Task Type'),
    getValue,
    setValue,
    getOptions
  });
}

function AssignAchievementTaskType(props) {
  const { element } = props;
  const bpmnFactory = useService('bpmnFactory');
  const translate = useService('translate');
  const modeling = useService('modeling');

  const getValue = () => {
    return getAchievementToAssign(element);
  };

  const setValue = (value) => {
    const businessObject = element.businessObject;
    const achievements = getOptions();
    const selectedAchievement = achievements.find(achievement => achievement.value === value);
    const label = selectedAchievement ? 'Assign Achievement: ' + selectedAchievement.label : '';

    businessObject.set('achievementToAssign', value);
    businessObject.set('name', label);

    addExecutionListener(element, modeling, bpmnFactory);
  };

  const getOptions = () => {
    return [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' }
    ]
  };

  return jsx(SelectEntry, {
    element: element,
    id: "achievementToAssign",
    label: translate('Achievement To Assign'),
    getValue: getValue,
    setValue: setValue,
    getOptions: getOptions,
    validate: (element) => {
      if (!element) {
        return translate('Achievement Is Required.');
      }
    }
  });
}

function getAchievementToAssign(element) {
  const businessObject = element.businessObject;
  return businessObject.get('achievementToAssign');
}

function getServiceTaskType(element) {
  const businessObject = element.businessObject;
  return businessObject.get('serviceTaskType');
}

function addExecutionListener(element, modeling, bpmnFactory) {
  const businessObject = getBusinessObject(element);

  if (!businessObject.extensionElements) {
    businessObject.extensionElements = bpmnFactory.create('bpmn:ExtensionElements', {
      values: []
    });
  }

  const extensionElements = businessObject.extensionElements;

  const executionListenerStart = bpmnFactory.create('camunda:ExecutionListener', {
    event: 'start',
    //TODO add correct delegate
    delegateExpression: '${TODO}'
  });


  extensionElements.get('values').push(executionListenerStart);

  modeling.updateProperties(element, {
    extensionElements: extensionElements
  });
}

function setInputParameters(element, modeling, bpmnFactory, achievementId) {
  const businessObject = getBusinessObject(element);

  if (!businessObject.extensionElements) {
    businessObject.extensionElements = bpmnFactory.create('bpmn:ExtensionElements', {
      values: []
    });
  }

  const extensionElements = businessObject.extensionElements;

  const inputParameter = bpmnFactory.create('camunda:InputParameter', {
    name: 'achievementId',
    value: achievementId
  });

  let inputOutput = extensionElements.values.find(value => is(value, 'camunda:InputOutput'));

  if (!inputOutput) {
    inputOutput = bpmnFactory.create('camunda:InputOutput', {
      inputParameters: [],
      outputParameters: []
    });
    extensionElements.values.push(inputOutput);
  }

  inputOutput.inputParameters.push(inputParameter);

  modeling.updateProperties(element, {
    extensionElements: extensionElements
  });
}