<template>
  <v-data-table-virtual
      class="mt-5"
      v-model:expanded="expanded"
      :headers="headers"
      :items="achievementStore.getReqPalAchievements ? achievementStore.getReqPalAchievements : []"
      item-value="id"
      hover
      show-expand
      expand-on-click
      height="70vh"
      no-data-text="Sie haben noch keine ReqPal-Achievements erstellt."
  >
    <template v-slot:item.actions="{ item }">
      <div>
        <v-btn
            class="ml-1"
            density="compact"
            color="success"
            variant="plain"
            size="medium"
            icon="mdi-plus"
            @click.stop="openReqPalAchievementLevelEditDialog(null, item)"
        />
        <v-btn
            class="ml-2"
            density="compact"
            color="success"
            variant="plain"
            size="medium"
            icon="mdi-pencil"
            @click.stop="openReqPalAchievementEditDialog(item)"
        />
        <v-btn
            class="ml-2"
            density="compact"
            color="error"
            variant="plain"
            size="medium"
            icon="mdi-delete"
            @click.stop="deleteReqPalAchievement(item)"
        />
      </div>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <v-data-table-virtual
              :headers="levelHeaders"
              :items="item.levels.length > 0 ? item.levels : []"
              item-value="id"
              hover
              density="compact"
              no-data-text="Sie haben noch keine ReqPal-Achievement-Level erstellt."
          >
            <template v-slot:item.actions="{ item: level }">
              <div>
                <v-btn
                    class="ml-1"
                    density="compact"
                    color="success"
                    variant="plain"
                    size="medium"
                    icon="mdi-pencil"
                    @click.stop="openReqPalAchievementLevelEditDialog(level, item)"
                />
                <v-btn
                    class="ml-2"
                    density="compact"
                    color="error"
                    variant="plain"
                    size="medium"
                    icon="mdi-delete"
                    @click.stop="deleteReqPalAchievementLevel(level)"
                />
              </div>
            </template>
            <template v-slot:item.image="{ item: level }">
              <div class="d-flex align-center justify-center">
                <v-img max-width="50" v-if="level.image" :src="getAchievementImageUrl(level.image)"
                       :alt="'Achievement Image: '+level.image"></v-img>
              </div>
            </template>
          </v-data-table-virtual>
        </td>
      </tr>
    </template>
  </v-data-table-virtual>
  <EditReqPalAchievement v-if="editDialog" :dialog="editDialog"
                         @update:dialog="updateEditDialog"></EditReqPalAchievement>
  <EditReqPalAchievementLevel v-if="editLevelDialog" :dialog="editLevelDialog"
                              @update:dialog="updateLevelEditDialog"></EditReqPalAchievementLevel>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {DeleteReqPalAchievement, DeleteReqPalAchievementLevel} from "@/utils/dialogs.ts";
import {useUtilStore} from "@/stores/util.ts";
import {useAchievementStore} from "@/stores/achievement.ts";
import {ReqPalAchievement, ReqPalAchievementLevelDTO} from "@/types/achievement.ts";
import {getAchievementImageUrl} from "@/utils/achievementImage.ts";
import EditReqPalAchievement from "@/components/achievement/EditReqPalAchievement.vue";
import EditReqPalAchievementLevel from "@/components/achievement/EditReqPalAchievementLevel.vue";

const expanded = ref<any>([]);
const utilStore = useUtilStore();
const editDialog = ref<boolean>(false);
const editLevelDialog = ref<boolean>(false);

const achievementStore = useAchievementStore();

const headers = ref([
  {title: "Beschreibung", value: "description", sortable: true, width: "25%", align: "start"},
  {title: "Ziel", value: "target_field", sortable: true, width: "auto", align: "center"},
  {title: "Aktionen", value: "actions", sortable: false, width: "auto", align: "end"}
] as const);

const levelHeaders = ref([
  {title: "Level", value: "level", sortable: true, width: "auto", align: "start"},
  {title: "Titel", value: "title", sortable: true, width: "auto", align: "center"},
  {title: "Beschreibung", value: "description", sortable: true, width: "auto", align: "center"},
  {title: "Schwellenwert", value: "threshold", sortable: true, width: "auto", align: "center"},
  {title: "XP-Belohnung", value: "xp", sortable: true, width: "auto", align: "center"},
  {title: "Bild", value: "image", sortable: false, width: "auto", align: "center"},
  {title: "Level-Aktionen", value: "actions", sortable: false, width: "auto", align: "end"},
] as const);

function openReqPalAchievementEditDialog(item: ReqPalAchievement | null) {
  achievementStore.reqPalAchievement = item;
  editLevelDialog.value = false;
  editDialog.value = true;
}

function openReqPalAchievementLevelEditDialog(item: (ReqPalAchievementLevelDTO | null), reqPalAchievement: ReqPalAchievement) {
  achievementStore.reqPalAchievementLevel = item;
  achievementStore.reqPalAchievement = reqPalAchievement;
  editDialog.value = false;
  editLevelDialog.value = true;
}

function updateLevelEditDialog(value: boolean) {
  editLevelDialog.value = value;
}

function updateEditDialog(value: boolean) {
  editDialog.value = value;
}

function deleteReqPalAchievement(item: ReqPalAchievement) {
  utilStore.openDialog(DeleteReqPalAchievement, () => {
    achievementStore.deleteReqPalAchievement(item.id);
  });
}

function deleteReqPalAchievementLevel(item: ReqPalAchievementLevelDTO) {
  utilStore.openDialog(DeleteReqPalAchievementLevel, () => {
    achievementStore.deleteReqPalAchievementLevel(item);
  });
}
</script>