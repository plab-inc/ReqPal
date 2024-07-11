<template>
    <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
        close-on-content-click
        rounded
        closable
        color="primary"
        location="top right"
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
import {useUtilStore} from "@/stores/util.ts";

const props = defineProps({text: String, id: String});

const snackbar = ref<boolean>(true);
const timeout = 5000;
const utilStore = useUtilStore();

function closeSnackbar() {
  snackbar.value = false;
  if (props.id) utilStore.removeAlert(props.id);
}
</script>