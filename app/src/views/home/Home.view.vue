<template>
  <v-container>
    <v-row class="mt-4">
      <v-parallax style="max-height: 550px" src="@/assets/images/lamps.jpg">
        <div class="d-flex flex-column fill-height justify-center align-center text-white text-center">
          <h1 class="text-h4 font-weight-medium mb-4">
            Willkommen auf der Lernplattform
          </h1>
          <h4 class="subheading">
            Start learning today!
          </h4>
        </div>
      </v-parallax>
    </v-row>

    <v-row class="my-12">
      <v-col md="8">
        <v-sheet :elevation="9" height="100%" rounded>
          <div class="mx-sm-3">
            <h2 class="text-h4 font-weight-black text-primary" v-text="main_headline"></h2>
            <div class="text-h5 mt-4" v-text="main_text"></div>
          </div>
        </v-sheet>
      </v-col>

      <v-col md="4">
        <v-img
            src="@/assets/images/loveToLearn.jpg"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col md="4" order="2" order-md="1">
        <v-img
            src="@/assets/images/laptop.jpg"
        />
      </v-col>
      <v-col md="8" order="1" order-md="2">
        <v-sheet :elevation="9" height="100%" rounded>
          <div class="mx-sm-3">
            <h2 class="text-h4 font-weight-black text-primary" v-text="feature_headline"></h2>
            <div class="text-h5 mb-2">
              <ul class="pl-6 mt-4 mb-4">
                <li>Vielfältige Kursauswahl</li>
                <li>Interaktive Lernmethoden</li>
                <li>Flexible Lernzeiten</li>
                <li>Kostenlos</li>
              </ul>
              <div v-text="feature_subtitle"></div>
              <v-btn v-if="!authStore.session" block color="primary" class="mt-5" @click="$router.push('signup')">
                Get started
              </v-btn>
              <v-btn v-else block color="primary" class="mt-5" @click="$router.push('lessons')">
                Continue learning
              </v-btn>
            </div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.store";

const authStore = useAuthStore();

const main_headline = "Eine interaktive Lernplattform!"
const main_text = "Diese Lernplattform bietet eine moderne und benutzerfreundliche Umgebung, " +
    "um Wissen auf eine unterhaltsame undinteraktive Weise zu vermitteln. Hier werden spannende Möglichkeiten angeboten," +
    " um Fähigkeiten im Bereich der Wirtschaftsinformatik zu erweitern und neue Horizonte zu entdecken."
const feature_headline = "Merkmale"
const feature_subtitle = "Beachte, dass für die volle Funktionalität der Anwendung, ein Account mit Nutzernamen und Passwort " +
    "benötigt wird. Ein Account kann hier kostenlos angelegt werden, so dass direkt durchgestartet werden kann!"
</script>
