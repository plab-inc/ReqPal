<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Neuen Katalog hochladen
    </v-col>
  </v-row>
  <v-divider/>
  <v-container>
    <v-row>
      <v-col>
        <v-card variant="outlined" class="pa-5" color="primary">
          <v-row>
            <v-col>
              <CatalogUpload></CatalogUpload>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-card title="Hochladen von Katalogen" prepend-icon="mdi-information-outline" variant="flat">
                <v-card-text>
                  <div>Wähle eine CSV oder XLSX Datei aus, um einen neuen Katalog hochzuladen.</div>
                  <div>Die Datei muss korrket formatiert sein. Beispieldateien kannst du dir hier herunterladen.</div>
                  <div>Zu jeder Requirement kann es beliebig viele Produkt Spalten geben.</div>
                  <div>CVS Dateien müssen mit Semikolon Spaltentrennung exportiert werden.</div>
                </v-card-text>
                <v-card-actions>
                  <v-btn variant="outlined" @click="downloadExample('csv')">
                    Beispiel Katalog als CSV
                  </v-btn>
                  <v-btn variant="outlined" @click="downloadExample('xlsx')">
                    Beispiel Katalog als XLSX (Excel)
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import CatalogUpload from "@/components/catalog/CatalogUpload.component.vue";

function downloadExample(type: string){
  const url = import.meta.env.BASE_URL + 'catalogs/Example_Requirements_Catalog_' + type.toUpperCase() + '.' + type;
  const link = document.createElement('a');
  link.href = url;
  link.download = "";
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
