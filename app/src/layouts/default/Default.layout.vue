<template>
  <v-app>
    <Navigation></Navigation>
    <v-main>
      <div v-for="alert in alertStore.alerts" :key="alert.id">
        <v-alert :type="alert.type" closable @click:close="alertStore.removeAlert(alert.id)" >
          {{ alert.message }}
        </v-alert>
      </div>
      <v-container>
        <v-row>
          <v-col>  <!-- Passt die Breite des Haupt-v-sheet an, je nachdem ob das kleine v-sheet angezeigt wird oder nicht -->
            <v-sheet min-height="80vh" rounded="lg">
              <v-container>
                <router-view></router-view>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <Footer></Footer>
  </v-app>
</template>

<script lang="ts" setup>
import Navigation from "@/components/Navigation.component.vue";
import Footer from "@/components/Footer.component.vue";
import { useAlertStore } from "@/stores/alert.store";

const alertStore = useAlertStore();
</script>
