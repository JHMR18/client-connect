<template>
  <v-app>
    <v-main class="login-main">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-row class="justify-center">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <v-card class="login-card elevation-12" rounded="xl">
              <v-card-text class="pa-8">
                <!-- Header -->
                <div class="text-center mb-8">
                  <div class="app-icon mb-4">
                    <img src="/tgc.png" alt="TGC Logo" class="logo-image" />
                  </div>
                  <h1 class="text-h3 font-weight-bold text-error mb-2">Client Login</h1>
                  <p class="text-h6 text-medium-emphasis mb-6">Loan Management System</p>
                  <p class="text-body-2 text-medium-emphasis">Sign in to your client account</p>
                </div>

                <v-form @submit.prevent="handleLogin" ref="loginForm">
                  <v-text-field
                    v-model="email"
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    prepend-inner-icon="mdi-email-outline"
                    :rules="emailRules"
                    class="mb-4"
                    color="error"
                    rounded="lg"
                    required
                  />

                  <v-text-field
                    v-model="password"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    :rules="passwordRules"
                    class="mb-6"
                    color="error"
                    rounded="lg"
                    required
                  />

                  <v-btn
                    type="submit"
                    color="error"
                    size="large"
                    block
                    :loading="loading"
                    class="mb-4 login-btn"
                    rounded="lg"
                    @click="requestLogin"
                  >
                    Sign In as Client
                  </v-btn>

                  <div class="text-center">
                    <v-btn variant="text" color="error" size="small" @click="goToRegister" class="mb-2">
                      Don't have an account? Sign Up
                    </v-btn>
                    <br />
                    <v-btn variant="text" color="error" size="small" @click="goToLandingPage">
                      <v-icon start>mdi-arrow-left</v-icon>
                      Back to Login Options
                    </v-btn>
                  </div>
                </v-form>

                <v-alert
                  v-if="errorMessage"
                  type="error"
                  variant="tonal"
                  class="mt-4"
                  closable
                  @click:close="errorMessage = ''"
                >
                  {{ errorMessage }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/utils/useAuth";

const router = useRouter();
const loginForm = ref();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const emailRules = [
  (v: string) => !!v || "Email is required",
  (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
];

const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 6 || "Password must be at least 6 characters",
];

const { login, logout } = useAuth();

const handleLogin = async () => {
  const form = loginForm.value;
  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    // Attempt login
    await login(email.value, password.value);

    // Navigate to client dashboard
    await router.push("/client/dashboard");
  } catch (error: any) {
    console.error("Login error:", error);
    errorMessage.value =
      error?.message || "Login failed. Please check your credentials and try again.";
    // Clear session data on login failure
    await logout();
  } finally {
    loading.value = false;
  }
};

const requestLogin = handleLogin;

const goToLandingPage = () => {
  router.push("/");
};

const goToRegister = () => {
  router.push("/client/register");
};
</script>

<style scoped>
.login-main {
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

.login-main::before {
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

.login-card {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(220, 38, 38, 0.1);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(220, 38, 38, 0.05) !important;
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(220, 38, 38, 0.1) !important;
}

.app-icon {
  display: inline-block;
}

.logo-image {
  width: 120px;
  height: 120px;
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

.login-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.3);
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%) !important;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

/* Form field styling */
:deep(.v-field--outlined) {
  border-radius: 12px;
}

:deep(.v-field--outlined.v-field--focused .v-field__outline) {
  border-color: #dc2626;
  border-width: 2px;
}

:deep(.v-field--outlined .v-field__outline) {
  border-color: rgba(220, 38, 38, 0.3);
}

:deep(.v-field--outlined:hover .v-field__outline) {
  border-color: rgba(220, 38, 38, 0.5);
}

:deep(.v-label) {
  color: rgba(0, 0, 0, 0.6) !important;
}

:deep(.v-field--focused .v-label) {
  color: #dc2626 !important;
}

:deep(.v-icon) {
  color: rgba(220, 38, 38, 0.7) !important;
}

:deep(.v-field--focused .v-icon) {
  color: #dc2626 !important;
}

/* Alert styling */
:deep(.v-alert--variant-tonal.v-alert--type-error) {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 12px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .login-card {
    margin: 1rem;
  }

  :deep(.v-card-text) {
    padding: 1.5rem !important;
  }

  .logo-image {
    width: 64px;
    height: 64px;
  }
}

@media (max-width: 480px) {
  .login-card {
    margin: 0.5rem;
  }

  :deep(.v-card-text) {
    padding: 1rem !important;
  }

  .app-icon {
    padding: 12px;
  }

  .logo-image {
    width: 56px;
    height: 56px;
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
