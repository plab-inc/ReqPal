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
          <v-col :cols="10">  <!-- Passt die Breite des Haupt-v-sheet an, je nachdem ob das kleine v-sheet angezeigt wird oder nicht -->
            <v-sheet min-height="80vh" rounded="lg">
              <v-container>
                <router-view></router-view>
              </v-container>
            </v-sheet>
          </v-col>
          <v-col v-if="true" cols="2"> <!-- Sie können die cols-Zahl ändern, um die Breite anzupassen -->
            <v-sheet min-height="80vh" rounded="lg">

              <v-sheet min-height="80vh" rounded="lg" class="pa-3">
                <v-row align="center"> <!-- Die align="center" Eigenschaft stellt sicher, dass das Avatar und der Name vertikal zentriert sind -->
                  <v-col cols="4">
                    <v-avatar :style="{
                      border: '5px solid white',
                    }"
                    image="@/assets/images/tom.jpg" size="75px"/>
                  </v-col>

                  <!-- Name -->
                  <v-col cols="8">
                    <h3>Max Mustermann</h3>
                  </v-col>
                </v-row>

                <!-- Verschiedene Progress Bars -->
                <div class="mt-3">
                  <div class="caption">Fähigkeit 1</div>
                  <v-progress-linear value="70" color="primary" height="8"></v-progress-linear>

                  <div class="caption mt-2">Fähigkeit 2</div>
                  <v-progress-linear value="40" color="primary" height="8"></v-progress-linear>

                  <div class="caption mt-2">Fähigkeit 3</div>
                  <v-progress-linear value="85" color="primary" height="8"></v-progress-linear>
                </div>
              </v-sheet>

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
