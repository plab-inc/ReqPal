import {defineStore} from 'pinia';
import {XpActivityLogDTO} from "@/types/xpActivityLog.ts";
import {IAlert} from "@/stores/util.ts";

interface GamificationAlertState {
    gamificationAlerts: IAlert[],
    gamificationAlertQueue: IAlert[],
    activeTimer: NodeJS.Timeout | null,
}

export const useGamificationAlertStore = defineStore({
    id: 'gamificationAlert',
    state: () : GamificationAlertState => ({
        gamificationAlerts: [] as IAlert[],
        gamificationAlertQueue: [] as IAlert[],
        activeTimer: null,
    }),
    actions: {
        removeCurrentAlertAndResetTimer() {
            if (this.activeTimer) {
                clearTimeout(this.activeTimer);
                this.activeTimer = null;
            }
            this.gamificationAlerts = [];
            const next = this.gamificationAlertQueue.shift() || null;
            if (next) {
                this.gamificationAlerts.push(next);
                this.queueGamificationAlert(next.id);
            }
        },
        addGamificationAlert(activity: XpActivityLogDTO) {
            const xp: number | null = activity.received_xp;
            const action: string | null = activity.action;
            let alertText: string = "";
            let actionType: string = "";
            let actionTitle: string = "";

            if (action) {
                const actionParts = action.split(':');
                if (actionParts.length > 1) {
                    actionType = action.split(':')[0].trim();
                    actionTitle = action.split(':')[1].trim();
                } else {
                    actionType = action;
                }
            }

            switch (actionType.toLowerCase()) {
                case('objective'):
                    alertText = xp + " XP für Lernziel " + actionTitle + " erhalten!"
                    break;
                case('achievement'):
                    alertText = xp + " XP für Achievement " + actionTitle + " erhalten!";
                    break;
                case('reqpal achievement'):
                    alertText = xp + " XP für ReqPal Achievement " + actionTitle + " erhalten!";
                    break;
                case('all lesson objectives'):
                    alertText = xp + " XP für alle Lernziele dieser Lektion erhalten!";
                    break;
                case('scenario completed'):
                    alertText = xp + " XP für das Beenden des Szenarios erhalten!";
                    break;
                default:
                    alertText = xp + " XP erhalten!"
            }

            const id: string = Date.now().toString();
            if(this.gamificationAlerts.length > 0) {
                this.gamificationAlertQueue.push({id: id, message: alertText, type: "success"});
            } else {
                this.gamificationAlerts.push({id: id, message: alertText, type: "success"});
                this.queueGamificationAlert(id);
            }

        },
        queueGamificationAlert(alertId: string) {
            this.activeTimer = setTimeout(() => {
                this.removeCurrentAlertAndResetTimer();
            }, 5000);
        }
    }
});
