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
              <v-card title="Hochladen von Katalogen" variant="flat">
                <v-card-text>
                  <ul>
                    <li>Wähle eine CSV oder XLSX Datei aus, um einen neuen Katalog hochzuladen.</li>
                    <li>Die Datei muss korrekt formatiert sein. Beispieldateien kannst du dir hier herunterladen.</li>
                    <li>Jede Anforderung (Requirement) kann mit beliebig vielen Produktspalten verbunden sein. Das bedeutet, dass die Anzahl der Spalten in der Datei variabel sein kann.</li>
                    <li>CSV Dateien müssen mit Semikolon als Spaltentrennung exportiert werden.</li>
                    <li>Produktspalten sollten jeweils paarweise auftreten: Ein Produktname gefolgt von einer Produkt-URL.</li>
                    <li>Die URLs müssen mit http:// oder https:// beginnen.</li>
                    <li>Die folgenden Zeilen nach der Produktzeile sollten die Anforderungen enthalten. Jede Anforderung sollte eine eindeutige ID, einen Titel und eine Beschreibung haben, gefolgt von Qualifizierungsinformationen und Kommentaren für jedes Produkt.</li>
                  </ul>
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
import CatalogUpload from "@/components/catalog/CatalogUpload.vue";

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
