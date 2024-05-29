import { ISecureUser, IUserInfo } from "bpmn-server";

enum USER_ROLE {
  SYSTEM = 'SYSTEM',
}

class CustomSecureUser implements ISecureUser {
  userName;
  userGroups;
  tenantId?;
  modelsOwner?;
  constructor(params: IUserInfo) {
    Object.assign(this, params);
  }
  static SystemUser() {
    return new CustomSecureUser({ userName: 'system', userGroups: [USER_ROLE.SYSTEM], tenantId: null, modelsOwner: null });
  }
  isAdmin(): boolean {
    return (this.userGroups.includes('teacher') || this.userGroups.includes(USER_ROLE.SYSTEM));
  }
  isSystem(): boolean {
    return (this.userGroups.includes(USER_ROLE.SYSTEM));
  }
  inGroup(userGroup) :boolean {
    return (this.userGroups.includes(userGroup))
  }
  qualifyInstances(query) {
    if (this.tenantId)
      query['items.assignee'] = this.tenantId;

    return query;
  }
  qualifyItems(query) {
    return this.qualifyInstances(query);
  }
  qualifyStartEvents(query) {
    //TODO
    return query;
  }
  qualifyDeleteInstances(query) {
    //TODO
    return false;
  }
  qualifyModels(query) {
    if (this.modelsOwner)
      query['owner'] = this.modelsOwner;

    return query;
  }
  canModifyModel(name) {
    return this.inGroup('teacher');
  }
  canDeleteModel(name) {
    //TODO
    return false;
  }
  async qualifyViewItems(query) {

  }
  canInvoke(item) : boolean {
    return true;
  }
  canAssign(item) : boolean {
    return false;
  }
  async canStart(name, startNodeId, user) { }
}
const SystemUser = new CustomSecureUser({ userName: 'system', userGroups: [USER_ROLE.SYSTEM], tenantId: null, modelsOwner: null });

export {CustomSecureUser, USER_ROLE , IUserInfo, SystemUser }