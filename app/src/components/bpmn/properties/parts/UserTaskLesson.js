import { Group, isSelectEntryEdited, SelectEntry } from "@bpmn-io/properties-panel";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil.js";
import { jsx } from "@bpmn-io/properties-panel/preact/jsx-runtime";
import { useService } from "bpmn-js-properties-panel";
import { useLessonStore } from "@/stores/lesson.ts";
import { toRaw } from "vue";

export function UserTaskGroup(element, translate) {
  const group = {
    label: translate('Lesson'),
    id: 'ReqPal__Lesson',
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
      const lessonId = getLesson(element)
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

    addExecutionListener(element, modeling, bpmnFactory, value);
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

function addExecutionListener(element, modeling, bpmnFactory, lessonId) {
  const businessObject = getBusinessObject(element);

  if (!businessObject.extensionElements) {
    businessObject.extensionElements = bpmnFactory.create('bpmn:ExtensionElements', {
      values: []
    });
  }

  const extensionElements = businessObject.extensionElements;

  const script = bpmnFactory.create('camunda:Script', {
    scriptFormat: 'JavaScript',
    value: `item.data.currentLessonId = "${lessonId}";`
  });

  const executionListener = bpmnFactory.create('camunda:ExecutionListener', {
    event: 'start',
    script: script
  });

  extensionElements.get('values').push(executionListener);

  modeling.updateProperties(element, {
    extensionElements: extensionElements
  });
}
