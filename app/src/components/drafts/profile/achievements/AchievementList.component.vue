<template>
  <v-row>
    <v-col class="d-flex align-center justify-space-between flex-wrap">
      <h1>Achievements</h1>
      <v-btn variant="plain">View All</v-btn>
    </v-col>
    <v-col class="d-flex flex-column align-center justify-center flex-wrap">
      <AchievementItem
          v-for="(item) in items"
          :text="item">
      </AchievementItem>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import AchievementItem from "@/components/drafts/profile/achievements/AchievementItem.component.vue";

const items = ['1000 Punkte', 'Erste Lektion', 'Fehlerfrei']

</script>
<style scoped>
</style>
