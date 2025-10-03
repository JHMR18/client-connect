<template>
  <v-app>
    <v-main class="landing-main">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-row class="justify-center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="5">
            <v-card class="landing-card elevation-12" rounded="xl">
              <v-card-text class="pa-8 pa-md-12">
                <!-- Header -->
                <div class="text-center mb-10">
                  <div class="app-icon mb-6">
                    <img src="/tgc.png" alt="TGC Logo" class="logo-image" />
                  </div>
                  <h1 class="text-h2 font-weight-bold text-error mb-3">Client Connect</h1>
                  <p class="text-h6 text-medium-emphasis mb-2">Loan Management System</p>
                  <p class="text-body-1 text-medium-emphasis">
                    Please select your login type to continue
                  </p>
                </div>

                <!-- Login Options -->
                <v-row class="mb-6">
                  <v-col cols="12" md="6" class="d-flex">
                    <v-card
                      class="login-option-card flex-grow-1"
                      rounded="xl"
                      elevation="0"
                      @click="navigateToAdminLogin"
                      hover
                    >
                      <v-card-text class="pa-6 text-center">
                        <div class="option-icon mb-4">
                          <v-icon size="64" color="error">mdi-account-supervisor</v-icon>
                        </div>
                        <h3 class="text-h5 font-weight-bold mb-2">Admin Login</h3>
                        <p class="text-body-2 text-medium-emphasis mb-4">
                          Access administrative dashboard and loan management tools
                        </p>
                        <v-btn
                          color="error"
                          variant="flat"
                          size="large"
                          rounded="lg"
                          class="admin-btn"
                          block
                        >
                          <v-icon start>mdi-login</v-icon>
                          Login as Admin
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="6" class="d-flex">
                    <v-card
                      class="login-option-card flex-grow-1"
                      rounded="xl"
                      elevation="0"
                      @click="navigateToClientLogin"
                      hover
                    >
                      <v-card-text class="pa-6 text-center">
                        <div class="option-icon mb-4">
                          <v-icon size="64" color="error">mdi-account</v-icon>
                        </div>
                        <h3 class="text-h5 font-weight-bold mb-2">Client Login</h3>
                        <p class="text-body-2 text-medium-emphasis mb-4">
                          Access your loan applications and manage your account
                        </p>
                        <v-btn
                          color="error"
                          variant="flat"
                          size="large"
                          rounded="lg"
                          class="client-btn"
                          block
                        >
                          <v-icon start>mdi-login</v-icon>
                          Login as Client
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Footer Info -->
                <div class="text-center mt-8">
                  <p class="text-caption text-medium-emphasis">
                    Secure authentication powered by Directus
                  </p>
                </div>
              </v-card-text>
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

const navigateToAdminLogin = () => {
  router.push("/admin/login");
};

const navigateToClientLogin = () => {
  router.push("/client/login");
};
</script>

<style scoped>
.landing-main {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #1a1a1a 0%,
    #2d1b1b 25%,
    #3d1a1a 50%,
    #2d1b1b 75%,
    #1a1a1a 100%
  );
  position: relative;
}

.landing-main::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 25% 25%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(185, 28, 28, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.landing-card {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(220, 38, 38, 0.1);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(220, 38, 38, 0.05) !important;
  transition: all 0.3s ease;
}

.app-icon {
  display: inline-block;
}

.logo-image {
  width: 140px;
  height: 140px;
  object-fit: contain;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
  }
}

.login-option-card {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.03) 0%, rgba(185, 28, 28, 0.02) 100%);
  border: 2px solid rgba(220, 38, 38, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-option-card:hover {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(185, 28, 28, 0.05) 100%);
  border-color: rgba(220, 38, 38, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(220, 38, 38, 0.3);
}

.option-icon {
  display: inline-block;
  padding: 16px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%);
  border-radius: 50%;
  border: 2px solid rgba(220, 38, 38, 0.2);
}

.admin-btn,
.client-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.3);
  transition: all 0.3s ease;
}

.admin-btn:hover,
.client-btn:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
}

.admin-btn:active,
.client-btn:active {
  transform: translateY(0);
}

/* Mobile responsiveness */
@media (max-width: 960px) {
  .landing-card {
    margin: 1rem;
  }

  .logo-image {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 600px) {
  .landing-card {
    margin: 0.5rem;
  }

  :deep(.v-card-text) {
    padding: 1.5rem !important;
  }

  .logo-image {
    width: 70px;
    height: 70px;
  }

  .text-h2 {
    font-size: 2rem !important;
  }
}

/* Container adjustments */
.fill-height {
  min-height: 100vh;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}
</style>
