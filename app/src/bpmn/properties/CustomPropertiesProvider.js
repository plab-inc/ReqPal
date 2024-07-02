import { ConditionGroup } from "./parts/ConditionGroup.js";
import { UserTaskGroup } from "./parts/UserTaskLesson.js";
import { GeneralGroup } from "@/bpmn/properties/parts/GeneralGroup.js";

export default function CustomPropertiesProvider(propertiesPanel, translate) {

  this.getGroups = function(element) {
    return function(groups) {

      const deleteGroupsToReplace = (groups) => {
        return groups.filter(group => !(group.id.startsWith("CamundaPlatform__") || group.id === "general"));
      };

      const conditionGroup = ConditionGroup(element, translate);
      const userTaskLessonGroup = UserTaskGroup(element, translate);
      const generalGroup = GeneralGroup(element, translate);

      let filteredGroups = deleteGroupsToReplace(groups);

      if (conditionGroup) filteredGroups.push(conditionGroup);
      if (generalGroup) filteredGroups.unshift(generalGroup);
      if (userTaskLessonGroup) filteredGroups.push(userTaskLessonGroup);

      return filteredGroups;
    };
  };

  propertiesPanel.registerProvider(500, this);
}

CustomPropertiesProvider.$inject = ['propertiesPanel', 'translate'];