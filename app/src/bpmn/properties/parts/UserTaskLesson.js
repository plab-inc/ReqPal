import { CheckboxEntry, Group, isSelectEntryEdited, SelectEntry } from "@bpmn-io/properties-panel";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil.js";
import { jsx } from "@bpmn-io/properties-panel/preact/jsx-runtime";
import { useService } from "bpmn-js-properties-panel";
import { useLessonStore } from "@/stores/lesson.ts";
import { toRaw } from "vue";
import { setInputParameters } from "@/bpmn/properties/util/Helper.js";

export function UserTaskGroup(element, translate) {
  const group = {
    label: translate('Student Task'),
    id: 'Lesson',
    component: Group,
    entries: [...UserTaskProps({ element, translate })]
  };
  if (group.entries.length) {
    return group;
  }
  return null;
}

function UserTaskProps(props) {
  const { element } = props;
  if (!(is(element, 'bpmn:UserTask'))) {return [];}
  const entries = [];

  entries.push({
    id: 'taskType',
    component: TaskType,
    isEdited: isSelectEntryEdited,
  });

  const taskType = getTaskType(element);

  if (taskType === "solveLesson") {
    entries.push({
        id: "lessonToSolve",
        component: LessonType,
        isEdited: isSelectEntryEdited
      },
      {
        id: "grantPointsAsXP",
        component: GrantAchievedPointsAsXP,
        isEdited: isSelectEntryEdited
      }
    );
  }

  return entries;
}

function TaskType(props) {
  const { element } = props;
  const translate = useService('translate');
  const modeling = useService('modeling');
  const lessonStore = useLessonStore();

  const getValue = () => getTaskType(element);

  const setValue = (value) => {
    modeling.updateProperties(element, { taskType: value })
  };

  const getOptions = () => {
    const options = [];

    if (lessonStore.lessons.length > 0) {
      options.push({ value: 'solveLesson', label: translate('Solve Lesson') });
    }

    if (lessonStore.lessons.length === 0) {
      options.push({ value: "noLessons", label: translate("No Lessons found") });
    }

    return options;
  };

  return jsx(SelectEntry, {
    element,
    id: "taskType",
    label: translate('Student Task Type'),
    getValue,
    setValue,
    validate: (element) => {
      if (!element) {
        return translate('Required.');
      }
    },
    getOptions
  });
}

function LessonType(props) {
  const { element } = props;
  const bpmnFactory = useService('bpmnFactory');
  const translate = useService('translate');
  const modeling = useService('modeling');

  const getValue = () => {
    return getLessonToSolve(element);
  };

  const setValue = (value) => {
    const businessObject = element.businessObject;
    const lessons = getOptions();
    const selectedLesson = lessons.find(lesson => lesson.value === value);
    const label = selectedLesson ? selectedLesson.label : '';

    businessObject.set('lessonToSolve', value);
    businessObject.set('name', label);
    businessObject.set('camunda:assignee', '${studentId}');

    setInputParameters(element, modeling, bpmnFactory,'lessonId', value);
    setInputParameters(element, modeling, bpmnFactory,'grantPointsAsXP', "false");

    addExecutionListener(element, modeling, bpmnFactory);
  };

  const getOptions = () => {
    const lessonStore = useLessonStore();
    const lessons = toRaw(lessonStore.lessons);
    return lessons.map(lesson => ({
      value: lesson.lessonDTO.uuid,
      label: lesson.lessonDTO.title
    }));
  };

  return jsx(SelectEntry, {
    element: element,
    id: "lessonToSolve",
    label: translate('Lesson to solve'),
    getValue: getValue,
    setValue: setValue,
    getOptions: getOptions,
    validate: (element) => {
      if (!element) {
        return translate('Lesson is required.');
      }
    }
  });
}

function GrantAchievedPointsAsXP(props) {
  const { element } = props;
  const debounce = useService('debounceInput');
  const translate = useService('translate');
  const modeling = useService('modeling');
  const bpmnFactory = useService('bpmnFactory');
  const lessonObjectives = getLessonObjectives(getLessonToSolve(element)).join(", ") || "No objectives defined in lesson.";
  const disabled = getLessonObjectives(getLessonToSolve(element)).length === 0;

  const getValue = () => {
    const businessObject = getBusinessObject(element);
    return businessObject ? !!businessObject.grantPointsAsXP : false;
  };

  const setValue = (value) => {
    const businessObject = getBusinessObject(element);
    if (businessObject) {
      modeling.updateProperties(element, { grantPointsAsXP: value });
      setInputParameters(element, modeling, bpmnFactory,'grantPointsAsXP', value.toString());
    }
  };

  return jsx(CheckboxEntry, {
    element,
    id: "grantPointsAsXP",
    label: translate("Grant achieved points as XP to lesson objective(s):"),
    getValue,
    debounce: debounce,
    setValue,
    description: lessonObjectives,
    disabled: disabled
  });
}

function getLessonObjectives(lessonId) {
  const lessonStore = useLessonStore();
  return lessonStore.getLessonObjectives(lessonId);
}

function getLessonToSolve(element) {
  const businessObject = element.businessObject;
  return businessObject.get('lessonToSolve');
}

function getTaskType(element) {
  const businessObject = element.businessObject;
  return businessObject.get('taskType');
}

function addExecutionListener(element, modeling, bpmnFactory) {
  const businessObject = getBusinessObject(element);

  businessObject.extensionElements = businessObject.extensionElements || bpmnFactory.create('bpmn:ExtensionElements', { values: [] });

  const extensionElements = businessObject.extensionElements;

  const existingListeners = extensionElements.get('values').filter(value => value.$type === 'camunda:ExecutionListener');

  ['start', 'end'].forEach(event => {
    const alreadyExists = existingListeners.some(listener => listener.event === event && listener.delegateExpression === '${lessonUserTaskDelegate}');
    if (!alreadyExists) {
      const listener = bpmnFactory.create('camunda:ExecutionListener', {
        event: event,
        delegateExpression: '${lessonUserTaskDelegate}'
      });
      extensionElements.get('values').push(listener);
    }
  });

  modeling.updateProperties(element, { extensionElements });
}