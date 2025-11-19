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
                <h3 class="text-h5 font-weight-bold mb-2">{{ profileData.first_name }} {{ profileData.last_name }}</h3>
                <p class="text-subtitle-2 text-medium-emphasis mb-4">{{ profileData.email }}</p>
                
                <v-chip color="error" variant="flat" class="mb-4">
                  <v-icon start>mdi-check-circle</v-icon>
                  Verified Account
                </v-chip>

                <v-divider class="my-4" />

                <div class="text-left">
                  <div class="d-flex align-center mb-3">
                    <v-icon color="error" size="20" class="me-3">mdi-calendar</v-icon>
                    <div>
                      <p class="text-caption text-medium-emphasis mb-0">Member Since</p>
                      <p class="font-weight-medium mb-0">{{ formatDate(profileData.date_created) }}</p>
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
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="profileData.first_name"
                        label="First Name"
                        variant="outlined"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'First name is required']"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="profileData.middle_name"
                        label="Middle Name"
                        variant="outlined"
                        :readonly="!editMode"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="profileData.last_name"
                        label="Last Name"
                        variant="outlined"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'Last name is required']"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileData.nickname"
                        label="Nickname"
                        variant="outlined"
                        :readonly="!editMode"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileData.dob"
                        label="Date of Birth"
                        variant="outlined"
                        type="date"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'Date of birth is required']"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="profileData.gender"
                        :items="genderOptions"
                        label="Gender"
                        variant="outlined"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'Gender is required']"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="profileData.civil_status"
                        :items="civilStatusOptions"
                        label="Civil Status"
                        variant="outlined"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'Civil status is required']"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="profileData.citizenship"
                        label="Citizenship"
                        variant="outlined"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'Citizenship is required']"
                      />
                    </v-col>
                    <v-col cols="12" v-if="profileData.civil_status === 'Married'">
                      <v-text-field
                        v-model="profileData.spouse_name"
                        label="Spouse Name"
                        variant="outlined"
                        :readonly="!editMode"
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
                        v-model="profileData.mobile_number"
                        label="Mobile Number"
                        variant="outlined"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'Mobile number is required']"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="profileData.present_address"
                        label="Present Address"
                        variant="outlined"
                        rows="2"
                        :readonly="!editMode"
                        :rules="[v => !!v || 'Present address is required']"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-textarea
                        v-model="profileData.employment_address"
                        label="Employment Address"
                        variant="outlined"
                        rows="2"
                        :readonly="!editMode"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-textarea
                        v-model="profileData.previous_address"
                        label="Previous Address"
                        variant="outlined"
                        rows="2"
                        :readonly="!editMode"
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/utils/useAuth'
import { client } from '@/utils/useDirectus'
import { readMe, updateMe, updateUser } from '@directus/sdk'

const router = useRouter()
const { logout } = useAuth()

const drawer = ref(true)
const editMode = ref(false)
const saving = ref(false)
const changingPassword = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const userId = ref<string | null>(null)

const profileForm = ref()
const passwordForm = ref()

// Profile data matching Directus schema
const profileData = ref({
  first_name: '',
  middle_name: '',
  last_name: '',
  nickname: '',
  email: '',
  dob: '',
  gender: '',
  civil_status: '',
  citizenship: '',
  spouse_name: '',
  mobile_number: '',
  present_address: '',
  employment_address: '',
  previous_address: '',
  date_created: ''
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

const genderOptions = ['Male', 'Female', 'Other']
const civilStatusOptions = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced']

// Fetch current user profile
const fetchProfile = async () => {
  loading.value = true
  try {
    const user: any = await client.request(
      readMe({
        fields: [
          'id',
          'first_name',
          'middle_name',
          'last_name',
          'nickname',
          'email',
          'dob',
          'gender',
          'civil_status',
          'citizenship',
          'spouse_name',
          'mobile_number',
          'present_address',
          'employment_address',
          'previous_address',
          'date_created'
        ]
      })
    )

    if (user) {
      userId.value = user.id
      profileData.value = {
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',
        nickname: user.nickname || '',
        email: user.email || '',
        dob: user.dob ? user.dob.split('T')[0] : '',
        gender: user.gender || '',
        civil_status: user.civil_status || '',
        citizenship: user.citizenship || '',
        spouse_name: user.spouse_name || '',
        mobile_number: user.mobile_number || '',
        present_address: user.present_address || '',
        employment_address: user.employment_address || '',
        previous_address: user.previous_address || '',
        date_created: user.date_created || ''
      }
      originalProfileData.value = { ...profileData.value }
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    snackbar.message = 'Failed to load profile data'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    loading.value = false
  }
}

// Methods
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
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
    const updateData: any = {
      first_name: profileData.value.first_name,
      last_name: profileData.value.last_name,
      email: profileData.value.email,
      mobile_number: profileData.value.mobile_number,
      present_address: profileData.value.present_address
    }

    if (profileData.value.middle_name) updateData.middle_name = profileData.value.middle_name
    if (profileData.value.nickname) updateData.nickname = profileData.value.nickname
    if (profileData.value.dob) updateData.dob = profileData.value.dob
    if (profileData.value.gender) updateData.gender = profileData.value.gender
    if (profileData.value.civil_status) updateData.civil_status = profileData.value.civil_status
    if (profileData.value.citizenship) updateData.citizenship = profileData.value.citizenship
    if (profileData.value.spouse_name) updateData.spouse_name = profileData.value.spouse_name
    if (profileData.value.employment_address) updateData.employment_address = profileData.value.employment_address
    if (profileData.value.previous_address) updateData.previous_address = profileData.value.previous_address

    await client.request(updateMe(updateData))

    editMode.value = false
    snackbar.message = 'Profile updated successfully!'
    snackbar.color = 'success'
    snackbar.show = true
    
    // Refresh profile data
    await fetchProfile()
  } catch (error: any) {
    console.error('Error updating profile:', error)
    snackbar.message = error?.errors?.[0]?.message || 'Failed to update profile. Please try again.'
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
    if (!userId.value) throw new Error('User ID not found')

    await client.request(
      updateUser(userId.value, {
        password: passwordData.newPassword
      })
    )

    passwordData.currentPassword = ''
    passwordData.newPassword = ''
    passwordData.confirmPassword = ''
    
    snackbar.message = 'Password changed successfully!'
    snackbar.color = 'success'
    snackbar.show = true
  } catch (error: any) {
    console.error('Error changing password:', error)
    snackbar.message = error?.errors?.[0]?.message || 'Failed to change password. Please try again.'
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

onMounted(() => {
  fetchProfile()
})
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
