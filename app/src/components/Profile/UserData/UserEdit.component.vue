<template>
  <v-container>
    <v-form v-model="isFormValid">
      <v-row>
        <v-col class="d-flex flex-column align-center justify-center">
          <v-avatar
              color="secondary"
              image="@/assets/images/profile-test.jpg"
              alt="profilePicture"
              size="160"></v-avatar>
          <v-btn>Change Picture</v-btn>
        </v-col>
        <v-col class="d-flex flex-column align-center justify-center">
          <v-text-field label="Username" v-model="userName"></v-text-field>
          <v-text-field label="E-Mail" v-model="email"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.store";
import {User} from "@supabase/supabase-js";
import {ref} from "vue";
import {requiredRule} from "@/utils/validationRules";

const authStore = useAuthStore();
const user: User | null = authStore.user;

const isFormValid = ref(false);
const rules = {
  required: requiredRule
};

let userName: string = '';
let email: string = '';
onBeforeMount(() => {
  if (user && user.email) {
    userName = user.user_metadata.username;
    email = user.email;
  }
})
</script>
<style scoped>
</style>
