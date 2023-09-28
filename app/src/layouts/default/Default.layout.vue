<template>
  <v-app>
    <Navigation></Navigation>
    <v-main>
      <div v-for="alert in alertStore.alerts" :key="alert.id">
        <v-alert :type="alert.type" closable @click:close="alertStore.removeAlert(alert.id)" >
          {{ alert.message }}
        </v-alert>
      </div>
      <v-container fluid>
        <v-row>
          <v-col :cols="10">
            <v-sheet min-height="80vh" rounded="lg">
              <v-container>
                <router-view></router-view>
              </v-container>
            </v-sheet>
          </v-col>
          <v-col v-if="true" :cols="2" style="elevation: below">
            <v-sheet min-height="80vh" rounded="lg">
              <v-container>
                <!-- TODO -->
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
