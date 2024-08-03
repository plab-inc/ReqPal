<template>
  <v-container>
    <v-row>
      <v-col>
        <v-parallax style="max-height: 550px; border-radius: 5px" src="@/assets/images/lamps.jpg">
          <div class="d-flex flex-column fill-height justify-center align-center text-white text-center">
            <h1 class="text-h3 font-weight-medium mb-3" hidden>
              Willkommen bei ReqPal
            </h1>
            <reqpal style="width: 50%; height: auto;"></reqpal>
            <h2>
              Lern- und Übungsumgebung zur funktionalen Bewertung von Standardanwendungssystemen
            </h2>
          </div>
        </v-parallax>
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="7">
        <v-sheet :elevation="14" height="100%" rounded>
          <div class="mx-sm-3">
            <h2 class="text-h4 font-weight-black text-warning" v-text="main_headline"></h2>
            <div class="text-h5 mt-4" v-text="main_text"></div>
          </div>
        </v-sheet>
      </v-col>
      <v-col sm="5">
        <v-img style="border-radius: 5px; max-height: 800px"
               src="@/assets/images/loveToLearn.jpg"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col sm="4" order="2" order-sm="1">
        <v-img style="border-radius: 5px"
               src="@/assets/images/laptop.jpg"
        />
      </v-col>
      <v-col sm="8" order="1" order-sm="2">
        <v-sheet :elevation="18" height="100%" rounded>
          <div class="mx-sm-3">
            <h2 class="text-h4 font-weight-black text-primary" v-text="feature_headline"></h2>
            <div class="text-h5 mb-2">
              <ul class="pl-6 mt-4 mb-4">
                <li>Praxisorientierte Übungen</li>
                <li>Interaktives Feedback</li>
                <li>Anpassbare Kriterienkataloge für Dozenten</li>
                <li>Kostenlos nutzbar</li>
              </ul>
              <div v-text="feature_subtitle"></div>
              <v-btn v-if="!authStore.session" block color="primary" class="mt-5" @click="router.push('signup')">
                Melde dich an!
              </v-btn>
              <v-btn v-else block color="primary" class="mt-5" @click="router.push('lessons')">
                Lerne weiter
              </v-btn>
            </div>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.ts";
import reqpal from "@/assets/reqPalBanner.svg";
import router from "@/router";

const authStore = useAuthStore();

const main_headline = "Interaktives Lernen in der Wirtschaftsinformatik!"
const main_text = "Diese Plattform bietet eine effektive und interaktive Lernumgebung für die Wirtschaftsinformatik." +
    "Sie verbindet fundierte Lehrinhalte mit praktischen Übungen, um ein tiefgreifendes Verständnis für Standardsoftwarebewertung zu fördern. " +
    "Entwickelt für eine intuitive Benutzererfahrung, ermöglicht sie den Nutzern, ihre Kenntnisse systematisch zu erweitern und anzuwenden."
const feature_headline = "Plattformmerkmale"
const feature_subtitle = "Hinweis: Für den kompletten Zugang zu allen Funktionalitäten ist die Erstellung eines Accounts " +
    "mit Nutzernamen und Passwort erforderlich. Die Registrierung ist und bleibt kostenlos."
</script>