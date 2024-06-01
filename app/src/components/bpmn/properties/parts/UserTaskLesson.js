import { Group, SelectEntry, isSelectEntryEdited } from "@bpmn-io/properties-panel";
import { is } from "bpmn-js/lib/util/ModelUtil.js";
import { jsx, jsxs } from '@bpmn-io/properties-panel/preact/jsx-runtime';
import { useService } from "bpmn-js-properties-panel";


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
      const lessonId = element.businessObject.get('lesson');
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
  const commandStack = useService('commandStack');
  const translate = useService('translate');

  const getValue = () => {
    return getLesson(element);
  };

  const setValue = value => {
    const businessObject = element.businessObject;
    businessObject.set('lesson', value);
    businessObject.set('name', value);
    commandStack.execute('element.updateProperties', {
      element: element,
      properties: {
        lesson: value
      }
    });
  };

  const getOptions = () => {
    return [
      { value: '1', label: translate('Lesson 1') },
      { value: '2', label: translate('Lesson 2') },
      { value: '3', label: translate('Lesson 3') }
    ];
  };

  return jsx(SelectEntry, {
    element: element,
    id: "lesson",
    label: translate('Lesson to solve'),
    getValue: getValue,
    setValue: setValue,
    getOptions: getOptions
  });
}

function getLesson(element) {
  const businessObject = element.businessObject;
  return businessObject.get('lesson');
}