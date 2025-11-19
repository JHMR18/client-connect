<template>
  <v-app>
    <v-main class="register-main">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-row class="justify-center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="5">
            <v-card class="register-card elevation-12" rounded="xl">
              <v-card-text class="pa-8">
                <!-- Header -->
                <div class="text-center mb-6">
                  <div class="app-icon mb-4">
                    <img src="/tgc.png" alt="TGC Logo" class="logo-image" />
                  </div>
                  <h1 class="text-h3 font-weight-bold text-error mb-2">Create Account</h1>
                  <p class="text-body-2 text-medium-emphasis">Register as a new client</p>
                </div>

                <v-form @submit.prevent="handleRegister" ref="registerForm">
                  <v-row>
                    <!-- Personal Information -->
                    <v-col cols="12">
                      <h3 class="text-h6 mb-3 text-error">Personal Information</h3>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.first_name"
                        label="First Name"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.middle_name"
                        label="Middle Name"
                        variant="outlined"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.last_name"
                        label="Last Name"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.nickname"
                        label="Nickname"
                        variant="outlined"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.dob"
                        label="Date of Birth"
                        type="date"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-select
                        v-model="formData.gender"
                        label="Gender"
                        :items="['Male', 'Female', 'Other']"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-select
                        v-model="formData.civil_status"
                        label="Civil Status"
                        :items="['Single', 'Married', 'Widowed', 'Separated', 'Divorced']"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.citizenship"
                        label="Citizenship"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="12" v-if="formData.civil_status === 'Married'">
                      <v-text-field
                        v-model="formData.spouse_name"
                        label="Spouse Name"
                        variant="outlined"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <!-- Contact Information -->
                    <v-col cols="12">
                      <h3 class="text-h6 mb-3 mt-4 text-error">Contact Information</h3>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.email"
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        prepend-inner-icon="mdi-email-outline"
                        :rules="[rules.required, rules.email]"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.mobile_number"
                        label="Mobile Number"
                        variant="outlined"
                        prepend-inner-icon="mdi-phone"
                        :rules="[rules.required]"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.present_address"
                        label="Present Address"
                        variant="outlined"
                        :rules="[rules.required]"
                        rows="2"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-textarea
                        v-model="formData.employment_address"
                        label="Employment Address"
                        variant="outlined"
                        rows="2"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-textarea
                        v-model="formData.previous_address"
                        label="Previous Address"
                        variant="outlined"
                        rows="2"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <!-- Account Security -->
                    <v-col cols="12">
                      <h3 class="text-h6 mb-3 mt-4 text-error">Account Security</h3>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.password"
                        label="Password"
                        :type="showPassword ? 'text' : 'password'"
                        variant="outlined"
                        prepend-inner-icon="mdi-lock-outline"
                        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showPassword = !showPassword"
                        :rules="[rules.required, rules.minLength]"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="confirmPassword"
                        label="Confirm Password"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        variant="outlined"
                        prepend-inner-icon="mdi-lock-check-outline"
                        :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showConfirmPassword = !showConfirmPassword"
                        :rules="[rules.required, rules.passwordMatch]"
                        density="comfortable"
                        rounded="lg"
                      />
                    </v-col>
                  </v-row>

                  <v-btn
                    type="submit"
                    color="error"
                    size="large"
                    block
                    :loading="loading"
                    class="mt-6 mb-4 register-btn"
                    rounded="lg"
                  >
                    Create Account
                  </v-btn>

                  <div class="text-center">
                    <v-btn variant="text" color="error" size="small" @click="goToLogin">
                      Already have an account? Sign In
                    </v-btn>
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

                <v-alert
                  v-if="successMessage"
                  type="success"
                  variant="tonal"
                  class="mt-4"
                  closable
                  @click:close="successMessage = ''"
                >
                  {{ successMessage }}
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { client } from "@/utils/useDirectus";
import { createUser, readRoles } from "@directus/sdk";

const router = useRouter();
const registerForm = ref();
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const confirmPassword = ref("");
const clientRoleId = ref<string | null>(null);

const formData = ref({
  first_name: "",
  middle_name: "",
  last_name: "",
  nickname: "",
  dob: "",
  gender: "",
  civil_status: "",
  citizenship: "",
  spouse_name: "",
  email: "",
  mobile_number: "",
  present_address: "",
  employment_address: "",
  previous_address: "",
  password: "",
  role: null as string | null,
  status: "active"
});

const rules = {
  required: (v: string) => !!v || "This field is required",
  email: (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
  minLength: (v: string) => v.length >= 8 || "Password must be at least 8 characters",
  passwordMatch: (v: string) => v === formData.value.password || "Passwords must match"
};

// Fetch client role ID on component mount
const fetchClientRole = async () => {
  try {
    const roles: any = await client.request(
      readRoles({
        filter: {
          name: {
            _eq: "client"
          }
        },
        fields: ["id", "name"]
      })
    );
    
    if (roles && roles.length > 0) {
      clientRoleId.value = roles[0].id;
    } else {
      console.error("Client role not found in the system");
    }
  } catch (error) {
    console.error("Error fetching client role:", error);
  }
};

const handleRegister = async () => {
  const form = registerForm.value;
  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Create user in Directus
    const userData: any = {
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
      email: formData.value.email,
      password: formData.value.password,
      status: "active",
      role: clientRoleId.value
    };

    // Add optional fields if they exist
    if (formData.value.middle_name) userData.middle_name = formData.value.middle_name;
    if (formData.value.nickname) userData.nickname = formData.value.nickname;
    if (formData.value.dob) userData.dob = formData.value.dob;
    if (formData.value.gender) userData.gender = formData.value.gender;
    if (formData.value.civil_status) userData.civil_status = formData.value.civil_status;
    if (formData.value.citizenship) userData.citizenship = formData.value.citizenship;
    if (formData.value.spouse_name) userData.spouse_name = formData.value.spouse_name;
    if (formData.value.mobile_number) userData.mobile_number = formData.value.mobile_number;
    if (formData.value.present_address) userData.present_address = formData.value.present_address;
    if (formData.value.employment_address) userData.employment_address = formData.value.employment_address;
    if (formData.value.previous_address) userData.previous_address = formData.value.previous_address;

    await client.request(createUser(userData));

    successMessage.value = "Account created successfully! Redirecting to login...";
    
    // Clear form
    setTimeout(() => {
      router.push("/client/login");
    }, 2000);
  } catch (error: any) {
    console.error("Registration error:", error);
    errorMessage.value = error?.errors?.[0]?.message || error?.message || "Registration failed. Please try again.";
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push("/client/login");
};

const goToLandingPage = () => {
  router.push("/");
};

onMounted(() => {
  fetchClientRole();
});
</script>

<style scoped>
.register-main {
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
  padding: 2rem 0;
}

.register-main::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 25% 25%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(185, 28, 28, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.register-card {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(220, 38, 38, 0.1);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.app-icon {
  display: inline-block;
}

.logo-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.register-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.3);
}

.register-btn:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%) !important;
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
}

:deep(.v-field--outlined) {
  border-radius: 12px;
}

:deep(.v-field--outlined.v-field--focused .v-field__outline) {
  border-color: #dc2626;
}
</style>
