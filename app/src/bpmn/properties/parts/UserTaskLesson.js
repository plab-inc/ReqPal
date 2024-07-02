import { Group, isSelectEntryEdited, SelectEntry } from "@bpmn-io/properties-panel";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil.js";
import { jsx } from "@bpmn-io/properties-panel/preact/jsx-runtime";
import { useService } from "bpmn-js-properties-panel";
import { useLessonStore } from "@/stores/lesson.ts";
import { toRaw } from "vue";

export function UserTaskGroup(element, translate) {
  const group = {
    label: translate('Lesson'),
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
  const { element, translate } = props;
  if (!(is(element, 'bpmn:UserTask'))) {
    return [];
  }
  const entries = [];

  entries.push({
    id: 'lesson',
    component: LessonType,
    isEdited: isSelectEntryEdited,
    get(element, node) {
      const lessonId = getLesson(element);
      return { lesson: lessonId || '' };
    },
    set(element, values) {
      const lessonId = values.lesson;
      const businessObject = element.businessObject;
      businessObject.set('lesson', lessonId);
      return [element];
    }
  });

  return entries;
}

function LessonType(props) {
  const { element } = props;
  const bpmnFactory = useService('bpmnFactory');
  const translate = useService('translate');
  const modeling = useService('modeling');

  const getValue = () => {
    return getLesson(element);
  };

  const setValue = (value) => {
    const businessObject = element.businessObject;
    const lessons = getOptions();
    const selectedLesson = lessons.find(lesson => lesson.value === value);
    const label = selectedLesson ? selectedLesson.label : '';

    businessObject.set('lesson', value);
    businessObject.set('name', label);
    businessObject.set('camunda:assignee', '${studentId}');

    setInputParameters(element, modeling, bpmnFactory, value);
    addExecutionListener(element, modeling, bpmnFactory);
  };

  const getOptions = () => {
    const lessonStore = useLessonStore();
    const lessons = toRaw(lessonStore.lessons);
    const publishedLessons = lessons.filter(lesson => lesson.lessonDTO.published);
    return publishedLessons.map(lesson => ({
      value: lesson.lessonDTO.uuid,
      label: lesson.lessonDTO.title
    }));
  };

  return jsx(SelectEntry, {
    element: element,
    id: "lesson",
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

function getLesson(element) {
  const businessObject = element.businessObject;
  return businessObject.get('lesson');
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
    delegateExpression: '${lessonUserTaskDelegate}'
  });

  const executionListenerEnd = bpmnFactory.create('camunda:ExecutionListener', {
    event: 'end',
    delegateExpression: '${lessonUserTaskDelegate}'
  });

  extensionElements.get('values').push(executionListenerStart);
  extensionElements.get('values').push(executionListenerEnd);

  modeling.updateProperties(element, {
    extensionElements: extensionElements
  });
}

function setInputParameters(element, modeling, bpmnFactory, lessonId) {
  const businessObject = getBusinessObject(element);

  if (!businessObject.extensionElements) {
    businessObject.extensionElements = bpmnFactory.create('bpmn:ExtensionElements', {
      values: []
    });
  }

  const extensionElements = businessObject.extensionElements;

  const inputParameter = bpmnFactory.create('camunda:InputParameter', {
    name: 'lessonId',
    value: lessonId
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