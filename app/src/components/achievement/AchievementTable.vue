<template>
  <v-data-table-virtual
      class="mt-5"
      v-model:expanded="expanded"
      :headers="headers"
      :items="achievementStore.getAchievements ? achievementStore.getAchievements : []"
      item-value="id"
      hover
      height="70vh"
      no-data-text="Sie haben noch keine Achievements erstellt."
  >
    <template v-slot:item.image="{item}">
      <div class="d-flex align-center justify-center">
        <v-img max-width="40" :src="getAchievementImageUrl(item.image)" :alt="'Achievement Image: '+item.image"></v-img>
      </div>
    </template>
    <template v-slot:item.actions="{ item }">
      <div>
        <v-btn
            class="ml-1"
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
  </v-data-table-virtual>
  <EditAchievement v-if="editDialog" :dialog="editDialog" @update:dialog="updateEditDialog"></EditAchievement>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {DeleteAchievement} from "@/utils/dialogs.ts";
import {useUtilStore} from "@/stores/util.ts";
import {useAchievementStore} from "@/stores/achievement.ts";
import {Achievement} from "@/types/achievement.ts";
import EditAchievement from "@/components/achievement/EditAchievement.vue";
import {getAchievementImageUrl} from "@/utils/achievementImage.ts";

const expanded = ref<any>([]);
const utilStore = useUtilStore();
const editDialog = ref<boolean>(false);

const achievementStore = useAchievementStore();

const headers = ref([
  {title: "Titel", value: "title", sortable: true, width: "25%", align: "start"},
  {title: "Beschreibung", value: "description", sortable: true, width: "auto", align: "center"},
  {title: "Bild", value: "image", sortable: true, width: "auto", align: "center"},
  {title: "Aktionen", value: "actions", sortable: false, width: "auto", align: "end"}
] as const);

function openEditDialog(item: Achievement | null) {
  if (item) {
    achievementStore.achievement = item;
    editDialog.value = true;
  }
}

function updateEditDialog(value: boolean) {
  editDialog.value = value;
}

function deleteAchievement(item: Achievement) {
  utilStore.openDialog(DeleteAchievement, () => {
    achievementStore.deleteAchievement(item.id);
  });
}
</script>