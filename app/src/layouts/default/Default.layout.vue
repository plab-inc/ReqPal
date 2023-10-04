<template>
  <v-app>
    <Navigation></Navigation>
    <v-main>
      <div v-for="alert in alertStore.alerts" :key="alert.id">
        <v-alert :type="alert.type" closable @click:close="alertStore.removeAlert(alert.id)" >
          {{ alert.message }}
        </v-alert>
        {{ removeAlertWithDelay(alert.id) }}
      </div>
      <v-container>
        <v-row>
          <v-col :cols="mainContainerCols">
            <v-sheet min-height="80vh" rounded="lg">
              <v-container>
                <router-view></router-view>
              </v-container>
            </v-sheet>
          </v-col>
          <v-col :cols="profileContainerCols" v-if="showProfileContainer">
            <v-sheet min-height="80vh" rounded="lg" elevation="16">
              <v-container>

              </v-container>
            </v-sheet>
            <v-sheet rounded="lg" class="my-2" elevation="7">
              <v-btn
                  variant="plain"
                  block
                  rounded="0"
                  @click="toggleSmallContainer()"
              >
                <template v-slot:default>
                  <v-icon>
                    {{ expandProfileContainer ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
                  </v-icon>
                </template>
              </v-btn>
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
const expandProfileContainer = ref(false);
const showProfileContainer = ref(true);
const mainContainerCols = ref(11);
const profileContainerCols = ref(1);

const removeAlertWithDelay = (alertId: string, delay = 10000) => {
  setTimeout(() => {
    alertStore.removeAlert(alertId);
  }, delay);
};

const toggleSmallContainer = () => {
  expandProfileContainer.value = !expandProfileContainer.value;
  profileContainerCols.value = expandProfileContainer.value ? 2 : 1;
  mainContainerCols.value = expandProfileContainer.value ? 10 : 11;
};
</script>
