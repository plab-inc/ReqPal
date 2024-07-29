<template>
  <div v-if="stepperStore.scenario">
    <div class="text-h3">
      Szenario: {{ stepperStore.scenario?.title }}
    </div>
    <v-divider opacity="1" class="my-2" />
    <div class="text-h5">
      {{ stepperStore.scenario?.description }}
    </div>
    <v-divider opacity="1" class="my-2" />
    <div class="text-h6">
      Lektionen in diesem Szenario: {{ stepperStore.scenario?.lessonsCount }}
    </div>
    <div class="text-h6">
      Minimal zu lösende Lektionen: {{ stepperStore.scenario?.minLessons }}
    </div>
    <div class="text-h6">
      Zu erreichende Achievements:
    </div>
  </div>
  <div v-else>
    <div class="text-h3">
      Kein Szenario geladen.
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStepperStore } from "@/stores/stepper.ts";

const stepperStore = useStepperStore();
</script>