import { ConditionGroup } from "./parts/ConditionGroup.js";
import { UserTaskGroup } from "./parts/UserTaskLesson.js";
import { ServiceTaskGroup } from "@/bpmn/properties/parts/GamificationServiceTask.js";

export default function CustomPropertiesProvider(propertiesPanel, translate) {

  this.getGroups = function(element) {
    return function(groups) {

      const deleteCamundaPlatformGroups = (groups) => {
        return groups.filter(group => !(group.id.startsWith("CamundaPlatform__")));
      };

      const conditionGroup= ConditionGroup(element, translate);
      const userTaskLessonGroup = UserTaskGroup(element, translate);
      const gamificationServiceTaskGroup = ServiceTaskGroup(element, translate);

      let filteredGroups = deleteCamundaPlatformGroups(groups);

      if(conditionGroup !== null){
        filteredGroups.push(conditionGroup);
      }

      if(userTaskLessonGroup !== null){
        filteredGroups.push(userTaskLessonGroup);
      }

      if(gamificationServiceTaskGroup !== null){
        filteredGroups.push(gamificationServiceTaskGroup);
      }

      return filteredGroups;

    };
  };

  propertiesPanel.registerProvider(500, this);
}

CustomPropertiesProvider.$inject = [ 'propertiesPanel', 'translate' ];