<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Meine Kataloge ({{ catalogs.length }}/{{ MAX_CATALOGS }})
    </v-col>
    <v-col cols="auto">
      <v-btn-group
        elevation="3"
        variant="outlined"
        rounded
        divided
      >
        <v-tooltip location="bottom" text="Neuen Katalog Als Tabelle Hochladen">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="router.push({path: '/catalogs/upload'})"
              :disabled="catalogs.length >= MAX_CATALOGS"
            >
              Neuen Katalog Hochladen
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip location="bottom" :text="checkForOnlyOneNewCatalog() ? 'Neuen Katalog Umbenennen': 'Leeren Katalog Anlegen'">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :disabled="catalogs.length >= MAX_CATALOGS"
              @click="createOrRenameCatalog()"
            >
              {{ !checkForOnlyOneNewCatalog() ? 'Neuen Katalog Erstellen' : 'Neuen Katalog Umbenennen' }}
            </v-btn>
          </template>
        </v-tooltip>
      </v-btn-group>
    </v-col>
  </v-row>
  <v-divider />
  <v-row>
    <v-col>
      <v-list>
        <v-list-item
          v-for="catalog in examples"
          :key="catalog.catalog_id"
          @click="openCatalogDetails(catalog.catalog_id)"
          border
          variant="outlined"
          rounded
          base-color="info"
          min-height="80px"
          ripple
          elevation="7"
          class="ma-5"
          subtitle="Beispielkatalog"
        >
          <v-list-item-title>{{ catalog.catalog_name }}</v-list-item-title>
          <template v-slot:prepend>
            <v-icon>
              mdi-newspaper-variant
            </v-icon>
          </template>
          <template v-slot:append>
            <v-btn-group
              variant="outlined"
              elevation="24"
              divided
              density="default"
            >
              <v-btn
                @click.stop="downloadCatalog(catalog.catalog_id)"
                color="success"
              >
                Herunterladen
              </v-btn>
            </v-btn-group>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          v-for="catalog in catalogs"
          :key="catalog.catalog_id"
          @click="openCatalogDetails(catalog.catalog_id)"
          border
          variant="outlined"
          rounded
          min-height="80px"
          ripple
          elevation="12"
          class="ma-5"
        >
          <v-list-item-title>{{ catalog.catalog_name }}</v-list-item-title>
          <template v-slot:prepend>
            <v-icon>
              mdi-newspaper-variant
            </v-icon>
          </template>
          <template v-slot:append>
            <v-btn-group
              variant="outlined"
              elevation="24"
              divided
              density="default"
            >
              <v-btn
                @click.stop="downloadCatalog(catalog.catalog_id)"
                color="success"
              >
                Herunterladen
              </v-btn>
              <v-btn
                @click.stop="openDeleteDialog(catalog.catalog_id)"
                color="error"
              >
                Löschen
              </v-btn>
            </v-btn-group>
          </template>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useCatalogStore } from "@/stores/catalog.ts";
import router from "@/router";
import alertService from "@/services/util/alert.ts";
import CatalogService from "@/services/database/catalog.ts";
import { useAuthStore } from "@/stores/auth.ts";

const catalogStore = useCatalogStore();
const authStore = useAuthStore();
const catalogs = catalogStore.getCustomCatalogs;
const examples = catalogStore.getExampleCatalogs;

const MAX_CATALOGS = 5;

async function openCatalogDetails(catalogId: string) {
  await router.push({ name: "CatalogDetails", params: { catalogId: catalogId } });
}

function openDeleteDialog(catalogId: string) {
  alertService.openDialog(
    "Katalog löschen",
    "Möchtest du den Katalog wirklich löschen? Das löschen ist unwiederruflich und weitet sich auf alle Lektionen aus, die diesen Katalog nutzen.",
    "Ja",
    "Nein",
    () => deleteCatalog(catalogId)
  );
}

function checkForOnlyOneNewCatalog(){
  return catalogs.some(catalog => catalog.catalog_name === "Neuer Katalog");
}

function deleteCatalog(catalogId: string): void {
  catalogStore.deleteCatalog(catalogId)
    .then(() => {
      alertService.addSuccessAlert("Katalog gelöscht");
    });
}

async function createOrRenameCatalog() {

  if (checkForOnlyOneNewCatalog()) {
    const newCatalog = catalogs.find(catalog => catalog.catalog_name === "Neuer Katalog");
    if (newCatalog) {
      await openCatalogDetails(newCatalog?.catalog_id);
    }
    return;
  }

  if (authStore.user?.id) {
    const data = await CatalogService.push.addCatalog("Neuer Katalog", authStore.user?.id);

    if (data) {
      await openCatalogDetails(data.catalog_id);
    }

  }
}

async function downloadCatalog(catalogId: string): Promise<void> {
  const { catalog_name, csv } = await CatalogService.pull.downloadCatalog(catalogId);

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `${catalog_name}.csv`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

</script>