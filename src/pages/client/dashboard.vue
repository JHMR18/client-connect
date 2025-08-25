<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      color="#1a1a1a"
      theme="dark"
      width="280"
    >
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
          <v-btn
            color="error"
            variant="text"
            prepend-icon="mdi-logout"
            block
            @click="handleLogout"
          >
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
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-h4 font-weight-bold mb-2">Welcome back!</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Manage your loans and applications from your personal dashboard
          </p>
        </div>

        <!-- Summary Cards -->
        <v-row class="mb-8">
          <v-col cols="12" md="6" lg="3">
            <v-card class="stat-card" color="error" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h3 font-weight-bold text-white">{{ totalLoans }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Active Loans</div>
                </div>
                <v-icon size="48" class="text-white opacity-60">mdi-file-document-multiple</v-icon>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-card class="stat-card" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 100%)" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h3 font-weight-bold text-white">₱{{ totalBalance.toLocaleString() }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Outstanding Balance</div>
                </div>
                <v-icon size="48" class="text-white opacity-60">mdi-cash</v-icon>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-card class="stat-card" style="background: linear-gradient(135deg, #4a0e0e 0%, #2d1818 100%)" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h3 font-weight-bold text-white">{{ pendingApplications }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Pending Applications</div>
                </div>
                <v-icon size="48" class="text-white opacity-60">mdi-clock-outline</v-icon>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-card class="stat-card" style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h3 font-weight-bold text-white">{{ upcomingPayments }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Due This Month</div>
                </div>
                <v-icon size="48" class="text-white opacity-60">mdi-calendar-clock</v-icon>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Activity & Quick Actions -->
        <v-row>
          <v-col cols="12" lg="8">
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="me-2">mdi-history</v-icon>
                Recent Activity
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="activity in recentActivity"
                    :key="activity.id"
                    class="px-0"
                  >
                    <template #prepend>
                      <v-avatar :color="activity.color" size="40">
                        <v-icon color="white">{{ activity.icon }}</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title>{{ activity.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ activity.description }}</v-list-item-subtitle>

                    <template #append>
                      <div class="text-caption text-medium-emphasis">
                        {{ activity.date }}
                      </div>
                    </template>
                  </v-list-item>
                </v-list>

                <div v-if="recentActivity.length === 0" class="text-center py-8">
                  <v-icon size="64" class="text-disabled mb-4">mdi-history</v-icon>
                  <p class="text-h6 text-disabled">No recent activity</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="me-2">mdi-lightning-bolt</v-icon>
                Quick Actions
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-list>
                  <v-list-item
                    prepend-icon="mdi-file-document-plus"
                    title="Apply for New Loan"
                    subtitle="Start a new loan application"
                    @click="$router.push('/client/apply')"
                    class="quick-action-item"
                  />
                  <v-list-item
                    prepend-icon="mdi-credit-card"
                    title="Make Payment"
                    subtitle="Pay your loan installment"
                    @click="$router.push('/client/payments')"
                    class="quick-action-item"
                  />
                  <v-list-item
                    prepend-icon="mdi-file-document-multiple"
                    title="View My Loans"
                    subtitle="Check loan status and details"
                    @click="$router.push('/client/loans')"
                    class="quick-action-item"
                  />
                  <v-list-item
                    prepend-icon="mdi-account-edit"
                    title="Update Profile"
                    subtitle="Manage your personal information"
                    @click="$router.push('/client/profile')"
                    class="quick-action-item"
                  />
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/utils/useAuth'

const router = useRouter()
const { logout } = useAuth()

const drawer = ref(true)

// Dashboard data
const totalLoans = ref(2)
const totalBalance = ref(125000)
const pendingApplications = ref(1)
const upcomingPayments = ref(3)

const recentActivity = ref([
  {
    id: 1,
    title: 'Payment Received',
    description: 'Monthly payment of ₱5,000 for Business Loan',
    date: '2 days ago',
    icon: 'mdi-check-circle',
    color: 'success'
  },
  {
    id: 2,
    title: 'Application Submitted',
    description: 'New loan application for ₱50,000',
    date: '1 week ago',
    icon: 'mdi-file-document-plus',
    color: 'primary'
  },
  {
    id: 3,
    title: 'Document Uploaded',
    description: 'Valid ID and business permit uploaded',
    date: '1 week ago',
    icon: 'mdi-cloud-upload',
    color: 'info'
  }
])

const handleLogout = async () => {
  await logout()
  router.push('/')
}

onMounted(async () => {
  // Load dashboard data from API
  // This would be replaced with actual API calls
})
</script>

<style scoped>
.app-icon {
  display: inline-block;
  padding: 8px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.1) 100%);
  border-radius: 50%;
  border: 1px solid rgba(220, 38, 38, 0.3);
}

.stat-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid rgba(220, 38, 38, 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(220, 38, 38, 0.2);
}

.quick-action-item {
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.quick-action-item:hover {
  background-color: rgba(220, 38, 38, 0.05);
  border-color: rgba(220, 38, 38, 0.2);
  transform: translateX(4px);
}

:deep(.v-main) {
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%);
  min-height: 100vh;
}

:deep(.v-app-bar) {
  background: white !important;
  border-bottom: 1px solid rgba(220, 38, 38, 0.1);
}

:deep(.v-card) {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.v-list-item--nav .v-list-item__prepend > .v-icon) {
  opacity: 0.9;
}

:deep(.v-list-item--active) {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.1) 100%);
  border-radius: 8px;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

:deep(.v-list-item:hover:not(.v-list-item--active)) {
  background: rgba(220, 38, 38, 0.08);
  border-radius: 8px;
}

/* Navigation drawer styling */
:deep(.v-navigation-drawer) {
  background: linear-gradient(180deg, #1a1a1a 0%, #2d1818 100%) !important;
  border-right: 1px solid rgba(220, 38, 38, 0.2);
}

/* Activity cards */
:deep(.v-list-item .v-avatar) {
  border: 1px solid rgba(220, 38, 38, 0.2);
}

/* Enhanced card styling */
:deep(.v-card:not(.stat-card)) {
  border-radius: 16px;
  transition: all 0.3s ease;
}

:deep(.v-card:hover:not(.stat-card)) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

@media (max-width: 1263px) {
  :deep(.v-navigation-drawer) {
    transform: translateX(-100%) !important;
  }

  :deep(.v-navigation-drawer--active) {
    transform: translateX(0) !important;
  }
}

/* Custom scrollbar for dark theme */
:deep(.v-navigation-drawer ::-webkit-scrollbar) {
  width: 6px;
}

:deep(.v-navigation-drawer ::-webkit-scrollbar-track) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.v-navigation-drawer ::-webkit-scrollbar-thumb) {
  background: rgba(220, 38, 38, 0.3);
  border-radius: 3px;
}

:deep(.v-navigation-drawer ::-webkit-scrollbar-thumb:hover) {
  background: rgba(220, 38, 38, 0.5);
}
</style>