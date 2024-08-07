import { ConditionGroup } from "./parts/ConditionGroup.js";
import { UserTaskGroup } from "./parts/UserTaskLesson.js";
import { GeneralGroup } from "@/bpmn/properties/parts/GeneralGroup.js";
import { ServiceTaskGroup } from "@/bpmn/properties/parts/GamificationServiceTask.js";
import { DocumentationGroup } from "@/bpmn/properties/parts/DocumentationGroup.js";

export default function CustomPropertiesProvider(propertiesPanel, translate) {

  this.getGroups = function(element) {
    return function(groups) {

      const deleteGroupsToReplace = (groups) => {
        return groups.filter(group => !(group.id.startsWith("CamundaPlatform__") || group.id === "general" || group.id === "documentation"));
      };

      const conditionGroup= ConditionGroup(element, translate);
      const userTaskLessonGroup = UserTaskGroup(element, translate);
      const gamificationServiceTaskGroup = ServiceTaskGroup(element, translate);
      const generalGroup = GeneralGroup(element, translate);
      const documentationGroup = DocumentationGroup(element, translate);

      let filteredGroups = deleteGroupsToReplace(groups);

      if (conditionGroup) filteredGroups.unshift(conditionGroup);
      if (gamificationServiceTaskGroup) filteredGroups.unshift(gamificationServiceTaskGroup);
      if (userTaskLessonGroup) filteredGroups.unshift(userTaskLessonGroup);
      if (generalGroup) filteredGroups.unshift(generalGroup);
      if (documentationGroup) filteredGroups.push(documentationGroup);

      return filteredGroups;
    };
  };

  propertiesPanel.registerProvider(500, this);
}

CustomPropertiesProvider.$inject = ['propertiesPanel', 'translate'];