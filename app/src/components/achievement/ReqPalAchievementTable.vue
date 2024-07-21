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
            @click.stop="openLevelEditDialog(null, item)"
        />
        <v-btn
            class="ml-2"
            density="compact"
            color="success"
            variant="plain"
            size="medium"
            icon="mdi-pencil"
            @click.stop="openEditDialog(item)"
        />
        <v-btn
            class="ml-2"
            density="compact"
            color="error"
            variant="plain"
            size="medium"
            icon="mdi-delete"
            @click.stop="deleteAchievement(item)"
        />
      </div>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <v-table density="compact" v-if="item.levels.length > 0">
            <thead>
            <tr>
              <th class="text-left">
                Level
              </th>
              <th class="text-left">
                Titel
              </th>
              <th class="text-left">
                Schwellenwert
              </th>
              <th class="text-left">
                Bild
              </th>
              <th class="text-end">
                Level-Aktionen
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(level, i) in item.levels"
                :key="i"
            >
              <td>{{ level.level }}</td>
              <td>{{ level.title }}</td>
              <td>{{ level.threshold }}</td>
              <td>
                <v-img max-width="50" v-if="level.image" :src="getAchievementImageUrl(level.image)"
                       :alt="'Achievement Image: '+level.image"></v-img>
              </td>
              <td>
                <div class="d-flex justify-end align-center">
                  <v-btn
                      class="ml-1"
                      density="compact"
                      color="success"
                      variant="plain"
                      size="medium"
                      icon="mdi-pencil"
                      @click.stop="openLevelEditDialog(level, item)"
                  />
                  <v-btn
                      class="ml-2"
                      density="compact"
                      color="error"
                      variant="plain"
                      size="medium"
                      icon="mdi-delete"
                      @click.stop="deleteAchievementLevel(level)"
                  />
                </div>
              </td>
            </tr>
            </tbody>
          </v-table>
          <div v-else>
            <p class="mb-2 mt-2">Noch keine Level hinzugefügt.</p>
            <v-btn
                block
                @click.stop="openLevelEditDialog(null, item)"
            >
              Neues Level hinzufügen
            </v-btn>
          </div>
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
import {DeleteAchievement} from "@/utils/dialogs.ts";
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

function openEditDialog(item: ReqPalAchievement | null) {
  achievementStore.reqPalAchievement = item;
  editLevelDialog.value = false;
  editDialog.value = true;
}

function openLevelEditDialog(item: (ReqPalAchievementLevelDTO | null), achievement: ReqPalAchievement) {
  achievementStore.reqPalAchievementLevel = item;
  achievementStore.reqPalAchievement = achievement;
  editDialog.value = false;
  editLevelDialog.value = true;
}

function updateLevelEditDialog(value: boolean) {
  editLevelDialog.value = value;
}

function updateEditDialog(value: boolean) {
  editDialog.value = value;
}

function deleteAchievement(item: ReqPalAchievement) {
  utilStore.openDialog(DeleteAchievement, () => {
    achievementStore.deleteReqPalAchievement(item.id);
  });
}

function deleteAchievementLevel(item: ReqPalAchievementLevelDTO) {
  utilStore.openDialog(DeleteAchievement, () => {
    achievementStore.deleteReqPalAchievementLevel(item);
  });
}
</script>