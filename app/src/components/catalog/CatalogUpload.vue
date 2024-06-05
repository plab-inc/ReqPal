<template>
  <v-card variant="flat">
    <v-container>
      <v-form @submit.prevent v-model="formIsValid">
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
                <v-progress-circular indeterminate model-value="20" color="warning"></v-progress-circular>
              </div>
              <div v-else>
                <v-icon class="mr-2" size="32">mdi-file-upload</v-icon>
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
                variant="outlined"
                v-model="state.files"
                show-icon="false"
                clearable
                :disabled="loading"
                :rules="[requiredUniqueCatalogNameRule(state.files)]"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col>
            <v-btn
                color="primary"
                @click="handleFileUpload(state.files[0])" block
                :disabled="!formIsValid || loading || state.files.length === 0"
            >
              Katalog Hochladen
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";
import { DatabaseError, PrivilegeError } from "@/errors/custom.ts";
import { Catalog } from "@/types/catalog.ts";
import AlertService from "@/services/util/alert.ts";
import CatalogService from "@/services/database/catalog.ts";
import router from "@/router";
import * as XLSX from "xlsx";
import { requiredUniqueCatalogNameRule } from "@/utils/validationRules.ts";
import { reactive, ref } from "vue";

interface Props {
  maxFileSize?: number;
  acceptedFileTypes?: string[];
}

const loading = ref(false);
const formIsValid = ref(false);

async function readFileAsBinaryString(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      const result = event?.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read the file as a binary string.'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading the file.'));

    reader.readAsBinaryString(file);
  });
}

async function xlsxToCsv(xlsxFile: File): Promise<File> {
  try {
    const data = await readFileAsBinaryString(xlsxFile);
    const workbook = XLSX.read(data, {type: 'binary'});
    const wsname = workbook.SheetNames[0];
    const ws = workbook.Sheets[wsname];
    const csv = XLSX.utils.sheet_to_csv(ws, {FS: ';'});
    const csvBlob = new Blob([csv], {type: 'text/csv'});
    return new File([csvBlob], xlsxFile.name, {type: 'text/csv'});
  } catch (error) {
    throw error;
  }
}

async function handleFileUpload(file: File): Promise<void> {
  loading.value = true;

  if (formIsValid && file) {
    if (file.name.endsWith('.xlsx')) {
      file = await xlsxToCsv(file);
    }
    persistCatalog(file);
  }
}

function persistCatalog(File: File) {

  state.borderColor = "transparent";

  CatalogService.uploadCatalog(File).then(() => {
      AlertService.addSuccessAlert("Katalog erfolgreich hochgeladen.");
      router.push({ name: "Catalogs" });
  }).catch((error: any) => {
    if (error.code == 42501) {
      throw new PrivilegeError("Rechte zum Hochladen fehlen.", error.code);
    } else {
      throw new DatabaseError("Fehler beim Hochladen des Katalogs.", error.code);
    }
  }).finally(() => {
      state.borderColor = themeColors.info;
      state.files = [];
      loading.value = false;
  });
}

const themeColors = useTheme().current.value.colors;

const state = reactive({
  files: [] as File[],
  borderColor: themeColors.info,
  backgroundColor: 'transparent',
});

const props = withDefaults(defineProps<Props>(), {
  maxFileSize: 1048576,
  acceptedFileTypes: () => ['.csv', '.xlsx']
});
const handleDragOver = () => {
  state.borderColor = themeColors.warning;
  state.backgroundColor = 'rgba(0,0,0,0.3)';
}
const handleDragLeave = () => {
  state.borderColor = themeColors.info;
  state.backgroundColor = 'transparent';
}
const handleDrop = (e: DragEvent) => {
  handleDragLeave();
  if (e.dataTransfer) {
    const droppedFiles = Array.from(e.dataTransfer.files).filter(validateFile);

    state.files = [droppedFiles[0]];

    /* allow multiple files
    for (let i = 0; i < droppedFiles.length; i++) {
      state.files.push(droppedFiles[i]);
    }
    */
  }
}
const validateFile = (file: File) => {
  const fileType = '.' + file.name.split('.').pop();
  const fileSize = file.size;

  if (!props.acceptedFileTypes.includes(fileType)) {
    AlertService.addWarningAlert(`Dateityp ${fileType} wird nicht unterstützt.`);
  }

  if (fileSize > props.maxFileSize) {
    AlertService.addWarningAlert(`Datei ist zu groß. Maximale Dateigröße: ${props.maxFileSize / 1024 / 1024}MB`);
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