<template>
  <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      close-on-content-click
      rounded
      closable
      color="primary"
      location="top right"
      :style="{ top: `${index * 70}px` }"
  >
    {{ props.text }}
    <template v-slot:actions>
      <v-btn
          color="secondary"
          @click="closeSnackbar"
      >
        <v-icon>
          mdi-close-circle-outline
        </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useGamificationAlertStore} from "@/stores/alert.ts";

interface Props {
  text: string,
  id: string,
  index: number
}

const props = defineProps<Props>();

const snackbar = ref<boolean>(true);
const timeout = 5000;
const gamificationAlertStore = useGamificationAlertStore();

function closeSnackbar() {
  snackbar.value = false;
  if (props.id) gamificationAlertStore.removeCurrentAlertAndResetTimer();
}
</script>
