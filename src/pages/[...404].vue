<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row class="fill-height" align="center" justify="center">
          <v-col cols="12" md="6" class="text-center">
            <v-card class="pa-8 elevation-0" max-width="500" mx-auto>
              <div class="mb-6">
                <v-icon size="120" color="red" class="mb-4"> mdi-alert-circle-outline </v-icon>
                <h1 class="text-h2 font-weight-bold red--text mb-4">404</h1>
                <h2 class="text-h4 font-weight-medium mb-4">Page Not Found</h2>
              </div>

              <div class="d-flex flex-column flex-sm-row gap-4 justify-center">
                <v-btn color="red" size="large" @click="goHome" prepend-icon="mdi-home">
                  Go Home
                </v-btn>

                <v-btn
                  variant="outlined"
                  color="red"
                  size="large"
                  @click="goBack"
                  prepend-icon="mdi-arrow-left"
                >
                  Go Back
                </v-btn>
              </div>

              <v-divider class="my-6" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.gap-4 {
  gap: 1rem;
}
</style>
