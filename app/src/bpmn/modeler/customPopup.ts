import PopupMenuProvider, { PopupMenuEntries, PopupMenuEntriesProvider, } from "diagram-js/lib/features/popup-menu/PopupMenuProvider";

import PopupMenu, { PopupMenuTarget } from "diagram-js/lib/features/popup-menu/PopupMenu";

class CustomPopupMenu implements PopupMenuProvider {
  static $inject: string[];

  constructor(popupMenu: PopupMenu) {
    popupMenu.registerProvider('bpmn-replace',this);
  }

  getPopupMenuEntries(target: PopupMenuTarget): PopupMenuEntriesProvider | PopupMenuEntries {
    return (entries: PopupMenuEntries): PopupMenuEntries => {

      const keysToRemove = [
        'replace-with-conditional-flow'
      ];

      keysToRemove.forEach(key => delete entries[key]);

      return {
        ...entries,
      };
    };
  }

}

CustomPopupMenu.$inject = ['popupMenu'];

export default CustomPopupMenu;