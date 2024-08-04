<template>
  <v-chip-group v-model=versions variant="outlined" mandatory="force" selected-class="bg-deep-purple" column>
    <v-chip :key="0" @click="selectVersion(null)">Alle Versionen</v-chip>
    <v-chip
      v-for="version in props.scenario?.studentProgressStatistics?.versionsStatistics"
      :key="version.versionNumber"
      @click="selectVersion(version.versionNumber)"
    >
      Version {{ version.versionNumber }}
    </v-chip>
  </v-chip-group>
  <v-spacer />
  <v-progress-linear
    :model-value="endedCount"
    :max="totalCount"
    :buffer-color="startedCount === 0 ? 'primary' : 'error'"
    buffer-opacity="1"
    reverse
    :buffer-value="startedCount"
    color="success"
    class="my-2"
    height="20"
    rounded="pill"
  >
    {{ totalCount === 0 ? "Noch keine Daten" : "" }}
  </v-progress-linear>
  <div v-if="selectedVersion === null">
    {{ endedCount }} von {{ totalCount }} {{ totalCount !== 1 ? "Personen haben" : "Person hat" }} das Szenario
    abgeschlossen.
    <br>
    {{ startedCount }} {{ startedCount !== 1 ? "Personen bearbeiten" : "Person bearbeitet" }} das Szenario aktuell.
    <br>
  </div>
  <div v-if="selectedVersion !== null">
    {{ endedCount }} von {{ totalCount }} {{ totalCount !== 1 ? "Personen haben" : "Person hat" }} diese Version
    abgeschlossen.
    <br>
    {{ startedCount }} {{ startedCount !== 1 ? "Personen bearbeiten" : "Person bearbeitet" }} diese Version aktuell.
    <br>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import { Scenario } from "@/types/scenario.ts";

const props = defineProps<{
  scenario?: Scenario;
}>();

const versions = ref<number[]>([0]);
const selectedVersion = ref<number | null>(null);

const endedCount = ref<number>(0);
const totalCount = ref<number>(0);
const startedCount = ref<number>(0);

watch(selectedVersion, (newVersion) => {
  if (newVersion === null) {
    const totalStatistics = props.scenario?.studentProgressStatistics?.totalStatistics;
    const studentCount = props.scenario?.studentProgressStatistics?.studentCount;

    if (totalStatistics && studentCount) {
      endedCount.value = totalStatistics.endedCount;
      totalCount.value = studentCount - 1;
      startedCount.value = totalStatistics.startedCount - totalStatistics.endedCount;
    }
  }

  if (newVersion != null) {
    const versionStatistics = props.scenario?.studentProgressStatistics?.versionsStatistics.find(
      (version) => version.versionNumber === newVersion
    );
    if (versionStatistics) {
      endedCount.value = versionStatistics.statistics.endedCount;
      totalCount.value = versionStatistics.statistics.totalEntries;
      startedCount.value = versionStatistics.statistics.startedCount;
    }
  }
}, { immediate: true });

const selectVersion = (version: number | null) => {
  selectedVersion.value = version;
};
</script>
