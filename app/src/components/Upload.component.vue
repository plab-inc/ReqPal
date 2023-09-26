<template>
  <v-card variant="outlined">
    <v-container>
      <v-row align="center">
        <v-col
            cols="13"
            class="dashed-border"
            @drop.prevent="handleDrop"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            :style="{ borderColor: state.borderColor, backgroundColor: state.backgroundColor }"
            :class="{ 'loading': loading }"
        >
          <v-card-text class="text-center">
            <div v-if="loading">
              <v-progress-circular indeterminate model-value="20" color="primary"></v-progress-circular>
            </div>
            <div v-else>
              <v-icon  class="mr-2" size="32">mdi-file-upload</v-icon>
              <span>Datei hier ablegen</span>
            </div>
          </v-card-text>

        </v-col>
      </v-row>
      <v-row align="center">
        <v-col>
          <v-file-input
              label="Datei auswählen"
              color="secondary"
              accept=".csv"
              variant="outlined"
              v-model="state.files"
              show-icon="false"
              multiple
              :disabled="loading"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col>
          <v-btn color="primary" @click="handleFileUpload(state.files[0])" block :disabled="loading">Upload</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import {addSuccessAlert, addWarningAlert} from "@/services/alert.service";
import { useTheme } from "vuetify";
import { Catalog } from "@/types/catalog.types.ts";

import CatalogService from "@/services/database/catalog.service";

interface Props {
  maxFileSize?: number;
  acceptedFileTypes?: string[];
}

const loading = ref(false);

const handleFileUpload = (File: File) => {

  loading.value = true;
  state.borderColor= 'transparent';

  CatalogService.convertCSVToCatalog(File)
      .then((catalog: Catalog) => {
        CatalogService.push.uploadCatalogToDatabase(catalog)
        .catch((error: any) => {
          addWarningAlert(error.message);
          state.borderColor = themeColors.secondary;
          state.files = [];
          loading.value = false;
        })
        .then(() => {
          addSuccessAlert('Katalog erfolgreich hochgeladen.');
        })
        .finally(() => {
          state.borderColor = themeColors.secondary;
          state.files = [];
          loading.value = false;
        });})
      .catch((error: any) => {
        addWarningAlert(error.message);
        state.borderColor = themeColors.secondary;
        state.files = [];
        loading.value = false;
      });
}

const themeColors = useTheme().current.value.colors;

const state = reactive({
  files: [] as File[],
  borderColor: themeColors.secondary,
  backgroundColor: 'transparent',
});

const props = withDefaults(defineProps<Props>(), {
  maxFileSize: 1048576,
  acceptedFileTypes: () => ['.csv']
});
const handleDragOver = () => {
  state.borderColor = themeColors.info;
  state.backgroundColor = 'rgba(0,0,0,0.3)';
}
const handleDragLeave = () => {
  state.borderColor = themeColors.secondary;
  state.backgroundColor = 'transparent';
}
const handleDrop = (e: DragEvent) => {
  handleDragLeave();
  if(e.dataTransfer){
    const droppedFiles = Array.from(e.dataTransfer.files).filter(validateFile);

    for (let i = 0; i < droppedFiles.length; i++) {
      state.files.push(droppedFiles[i]);
    }
  }
}
const validateFile = (file: File) => {
  const fileType = '.' + file.name.split('.').pop();
  const fileSize = file.size;

  if (!props.acceptedFileTypes.includes(fileType)) {
    addWarningAlert(`Dateityp ${fileType} wird nicht unterstützt.`);
  }

  if (fileSize > props.maxFileSize) {
    addWarningAlert(`Datei ist zu groß. Maximale Dateigröße: ${props.maxFileSize / 1024 / 1024}MB`);
  }

  return props.acceptedFileTypes.includes(fileType) && fileSize <= props.maxFileSize;
}

</script>

<style scoped>
.dashed-border {
  border: 2px dashed;
  border-radius: 10px;
  padding: 30px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}
</style>