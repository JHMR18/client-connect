<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app permanent color="#1a1a1a" theme="dark" width="280">
      <div class="pa-4">
        <div class="d-flex align-center mb-6">
          <div class="app-icon me-3">
            <v-icon color="error" size="32">mdi-account-network</v-icon>
          </div>
          <div>
            <h3 class="text-h6 font-weight-bold text-error">Client Connect</h3>
            <p class="text-caption opacity-80 mb-0">Client Portal</p>
          </div>
        </div>

        <v-divider class="mb-4" />

        <v-list nav density="compact">
          <v-list-item
            prepend-icon="mdi-view-dashboard"
            title="Dashboard"
            value="dashboard"
            :active="$route.path === '/client/dashboard'"
            @click="$router.push('/client/dashboard')"
          />
          <v-list-item
            prepend-icon="mdi-file-document-plus"
            title="Apply for Loan"
            value="apply"
            :active="$route.path === '/client/apply'"
            @click="$router.push('/client/apply')"
          />
          <v-list-item
            prepend-icon="mdi-file-document-multiple"
            title="My Loans"
            value="loans"
            :active="$route.path === '/client/loans'"
            @click="$router.push('/client/loans')"
          />
          <v-list-item
            prepend-icon="mdi-credit-card"
            title="Payments"
            value="payments"
            :active="$route.path === '/client/payments'"
            @click="$router.push('/client/payments')"
          />
          <v-list-item
            prepend-icon="mdi-account-edit"
            title="Profile"
            value="profile"
            :active="$route.path === '/client/profile'"
            @click="$router.push('/client/profile')"
          />
        </v-list>
      </div>

      <template #append>
        <div class="pa-4">
          <v-divider class="mb-4" />
          <v-btn color="error" variant="text" prepend-icon="mdi-logout" block @click="handleLogout">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="white" elevation="2" height="70">
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-lg-and-up" />
      </template>

      <v-spacer />

      <div class="d-flex align-center">
        <v-chip color="error" variant="flat" class="me-4">
          <v-icon start>mdi-account-circle</v-icon>
          Client Portal
        </v-chip>
        <v-avatar color="error" size="40">
          <v-icon>mdi-account</v-icon>
        </v-avatar>
      </div>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-h4 font-weight-bold mb-2">My Profile</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Manage your personal information and account settings
          </p>
        </div>

        <v-row>
          <!-- Profile Overview Card -->
          <v-col cols="12" md="4">
            <v-card class="profile-card">
              <v-card-text class="text-center pa-6">
                <v-avatar color="error" size="120" class="mb-4">
                  <v-icon size="60">mdi-account</v-icon>
                </v-avatar>
                <h3 class="text-h5 font-weight-bold mb-2">{{ profileData.firstName }} {{ profileData.lastName }}</h3>
                <p class="text-subtitle-2 text-medium-emphasis mb-4">{{ profileData.email }}</p>
                
                <v-chip color="success" variant="flat" class="mb-4">
                  <v-icon start>mdi-check-circle</v-icon>
                  Verified Account
                </v-chip>

                <v-divider class="my-4" />

                <div class="text-left">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="error" size="20" class="me-3">mdi-calendar</v-icon>
                    <div>
                      <p class="text-caption text-medium-emphasis mb-0">Member Since</p>
                      <p class="font-weight-medium mb-0">{{ formatDate(profileData.joinDate) }}</p>
                    </div>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon color="error" size="20" class="me-3">mdi-shield-check</v-icon>
                    <div>
                      <p class="text-caption text-medium-emphasis mb-0">Account Status</p>
                      <p class="font-weight-medium mb-0">Active</p>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Profile Details -->
          <v-col cols="12" md="8">
            <v-card class="mb-4">
              <v-card-title class="d-flex justify-space-between align-center">
                <span>Personal Information</span>
                <v-btn
                  v-if="!editMode"
                  color="error"
                  variant="text"
                  prepend-icon="mdi-pencil"
                  @click="enableEdit"
                >
                  Edit
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-form ref="profileForm">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileData.firstName"
                        label="First Name"
                        variant="outlined"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'First name is required']"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileData.lastName"
                        label="Last Name"
                        variant="outlined"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'Last name is required']"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileData.email"
                        label="Email Address"
                        variant="outlined"
                        type="email"
                        :readonly="!editMode"
                        :rules="[
                          v => !!v || 'Email is required',
                          v => /.+@.+\..+/.test(v) || 'Email must be valid'
                        ]"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileData.phone"
                        label="Phone Number"
                        variant="outlined"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'Phone number is required']"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileData.dateOfBirth"
                        label="Date of Birth"
                        variant="outlined"
                        type="date"
                        :readonly="!editMode"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="profileData.gender"
                        :items="genderOptions"
                        label="Gender"
                        variant="outlined"
                        :readonly="!editMode"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="profileData.address"
                        label="Address"
                        variant="outlined"
                        rows="3"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'Address is required']"
                      />
                    </v-col>
                  </v-row>

                  <v-row v-if="editMode" class="mt-2">
                    <v-col cols="12" class="d-flex gap-3">
                      <v-btn
                        color="error"
                        prepend-icon="mdi-content-save"
                        @click="saveProfile"
                        :loading="saving"
                      >
                        Save Changes
                      </v-btn>
                      <v-btn
                        variant="outlined"
                        @click="cancelEdit"
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>

            <!-- Employment Information -->
            <v-card class="mb-4">
              <v-card-title>Employment Information</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="profileData.employer"
                      label="Employer"
                      variant="outlined"
                      :readonly="!editMode"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="profileData.occupation"
                      label="Occupation"
                      variant="outlined"
                      :readonly="!editMode"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="profileData.monthlyIncome"
                      label="Monthly Income (₱)"
                      variant="outlined"
                      type="number"
                      :readonly="!editMode"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="profileData.employmentStatus"
                      :items="employmentStatusOptions"
                      label="Employment Status"
                      variant="outlined"
                      :readonly="!editMode"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Change Password -->
            <v-card>
              <v-card-title>Change Password</v-card-title>
              <v-card-text>
                <v-form ref="passwordForm">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="passwordData.currentPassword"
                        label="Current Password"
                        variant="outlined"
                        :type="showCurrentPassword ? 'text' : 'password'"
                        :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showCurrentPassword = !showCurrentPassword"
                        :rules="[v => !!v || 'Current password is required']"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="passwordData.newPassword"
                        label="New Password"
                        variant="outlined"
                        :type="showNewPassword ? 'text' : 'password'"
                        :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showNewPassword = !showNewPassword"
                        :rules="[
                          v => !!v || 'New password is required',
                          v => v.length >= 8 || 'Password must be at least 8 characters'
                        ]"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="passwordData.confirmPassword"
                        label="Confirm New Password"
                        variant="outlined"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showConfirmPassword = !showConfirmPassword"
                        :rules="[
                          v => !!v || 'Please confirm password',
                          v => v === passwordData.newPassword || 'Passwords do not match'
                        ]"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-btn
                        color="error"
                        prepend-icon="mdi-lock-reset"
                        @click="changePassword"
                        :loading="changingPassword"
                      >
                        Change Password
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Success Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/utils/useAuth'

const router = useRouter()
const { logout } = useAuth()

const drawer = ref(true)
const editMode = ref(false)
const saving = ref(false)
const changingPassword = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const profileForm = ref()
const passwordForm = ref()

// Profile data
const profileData = ref({
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  email: 'juan.delacruz@example.com',
  phone: '+63 912 345 6789',
  dateOfBirth: '1990-01-15',
  gender: 'Male',
  address: '123 Main Street, Barangay San Jose, Manila, Metro Manila',
  employer: 'ABC Corporation',
  occupation: 'Software Engineer',
  monthlyIncome: 50000,
  employmentStatus: 'Full-time',
  joinDate: '2023-01-15'
})

const originalProfileData = ref({ ...profileData.value })

const passwordData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say']
const employmentStatusOptions = ['Full-time', 'Part-time', 'Self-employed', 'Unemployed', 'Retired']

// Methods
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const enableEdit = () => {
  originalProfileData.value = { ...profileData.value }
  editMode.value = true
}

const cancelEdit = () => {
  profileData.value = { ...originalProfileData.value }
  editMode.value = false
}

const saveProfile = async () => {
  const form = profileForm.value
  if (!form) return

  const { valid } = await form.validate()
  if (!valid) return

  saving.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    editMode.value = false
    snackbar.message = 'Profile updated successfully!'
    snackbar.color = 'success'
    snackbar.show = true
  } catch (error) {
    snackbar.message = 'Failed to update profile. Please try again.'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  const form = passwordForm.value
  if (!form) return

  const { valid } = await form.validate()
  if (!valid) return

  changingPassword.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    passwordData.currentPassword = ''
    passwordData.newPassword = ''
    passwordData.confirmPassword = ''
    
    snackbar.message = 'Password changed successfully!'
    snackbar.color = 'success'
    snackbar.show = true
  } catch (error) {
    snackbar.message = 'Failed to change password. Please try again.'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    changingPassword.value = false
  }
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}
</script>

<style scoped>
.app-icon {
  display: inline-block;
  padding: 8px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%);
  border-radius: 50%;
  border: 2px solid rgba(220, 38, 38, 0.2);
}

.profile-card {
  border-radius: 16px;
  height: 100%;
}

:deep(.v-list-item--nav .v-list-item__prepend > .v-icon) {
  opacity: 0.8;
}

:deep(.v-list-item--active) {
  background-color: rgba(220, 38, 38, 0.2);
  border-radius: 8px;
}

@media (max-width: 1263px) {
  :deep(.v-navigation-drawer) {
    transform: translateX(-100%) !important;
  }

  :deep(.v-navigation-drawer--active) {
    transform: translateX(0) !important;
  }
}
</style>
