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
            <v-icon color="error" size="32">mdi-shield-account</v-icon>
          </div>
          <div>
            <h3 class="text-h6 font-weight-bold text-error">Client Connect</h3>
            <p class="text-caption opacity-80 mb-0">Admin Portal</p>
          </div>
        </div>

        <v-divider class="mb-4" />

        <v-list nav density="compact">
          <v-list-item
            prepend-icon="mdi-view-dashboard"
            title="Dashboard"
            value="dashboard"
            :active="$route.path === '/admin/dashboard'"
            @click="$router.push('/admin/dashboard')"
          />
          
          <v-list-group value="loans">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-file-document-multiple"
                title="Loan Management"
              />
            </template>
            <v-list-item
              title="Applications"
              prepend-icon="mdi-file-document-plus"
              :active="$route.path === '/admin/applications'"
              @click="$router.push('/admin/applications')"
            />
            <v-list-item
              title="Active Loans"
              prepend-icon="mdi-file-document-check"
              :active="$route.path === '/admin/loans'"
              @click="$router.push('/admin/loans')"
            />
            <v-list-item
              title="Risk Assessment"
              prepend-icon="mdi-scale-balance"
              :active="$route.path === '/admin/risk-assessment'"
              @click="$router.push('/admin/risk-assessment')"
            />
          </v-list-group>

          <v-list-item
            prepend-icon="mdi-account-group"
            title="Clients"
            value="clients"
            :active="$route.path === '/admin/clients'"
            @click="$router.push('/admin/clients')"
          />
          
          <v-list-item
            prepend-icon="mdi-credit-card"
            title="Payments"
            value="payments"
            :active="$route.path === '/admin/payments'"
            @click="$router.push('/admin/payments')"
          />

          <v-list-group value="products">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-package-variant"
                title="Loan Products"
              />
            </template>
            <v-list-item
              title="Manage Products"
              prepend-icon="mdi-cog"
              :active="$route.path === '/admin/loan-products'"
              @click="$router.push('/admin/loan-products')"
            />
            <v-list-item
              title="Interest Rates"
              prepend-icon="mdi-percent"
              :active="$route.path === '/admin/interest-rates'"
              @click="$router.push('/admin/interest-rates')"
            />
          </v-list-group>

          <v-list-group value="reports">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-chart-box"
                title="Reports"
              />
            </template>
            <v-list-item
              title="Financial Reports"
              prepend-icon="mdi-chart-line"
              :active="$route.path === '/admin/financial-reports'"
              @click="$router.push('/admin/financial-reports')"
            />
            <v-list-item
              title="Collection Reports"
              prepend-icon="mdi-cash-multiple"
              :active="$route.path === '/admin/collection-reports'"
              @click="$router.push('/admin/collection-reports')"
            />
            <v-list-item
              title="Audit Logs"
              prepend-icon="mdi-history"
              :active="$route.path === '/admin/audit-logs'"
              @click="$router.push('/admin/audit-logs')"
            />
          </v-list-group>
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
          <v-icon start>mdi-shield-account</v-icon>
          Admin Portal
        </v-chip>
        <v-avatar color="error" size="40">
          <v-icon>mdi-account-supervisor</v-icon>
        </v-avatar>
      </div>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-h4 font-weight-bold mb-2">Admin Dashboard</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Loan management overview and system administration
          </p>
        </div>

        <!-- KPI Cards -->
        <v-row class="mb-8">
          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card" color="error" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h3 font-weight-bold text-white">{{ totalActiveLoans }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Active Loans</div>
                </div>
                <v-icon size="48" class="text-white opacity-60">mdi-file-document-multiple</v-icon>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card" style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h3 font-weight-bold text-white">{{ pendingApplications }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Pending Applications</div>
                </div>
                <v-icon size="48" class="text-white opacity-60">mdi-clock-outline</v-icon>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 100%)" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h3 font-weight-bold text-white">₱{{ totalPortfolio.toLocaleString() }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Total Portfolio</div>
                </div>
                <v-icon size="48" class="text-white opacity-60">mdi-cash-multiple</v-icon>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card" style="background: linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h3 font-weight-bold text-white">{{ overdueLoans }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Overdue Loans</div>
                </div>
                <v-icon size="48" class="text-white opacity-60">mdi-alert-circle</v-icon>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Charts and Tables Row -->
        <v-row class="mb-8">
          <!-- Loan Performance Chart -->
          <v-col cols="12" lg="8">
            <v-card>
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon class="me-2">mdi-chart-line</v-icon>
                  Loan Performance Overview
                </div>
                <v-btn-toggle
                  v-model="chartPeriod"
                  color="primary"
                  variant="outlined"
                  divided
                  density="compact"
                >
                  <v-btn value="week">Week</v-btn>
                  <v-btn value="month">Month</v-btn>
                  <v-btn value="year">Year</v-btn>
                </v-btn-toggle>
              </v-card-title>
              <v-divider />
              <v-card-text>
                <div class="chart-placeholder">
                  <v-icon size="64" class="text-disabled">mdi-chart-line</v-icon>
                  <p class="text-h6 text-disabled mt-4">Chart visualization would go here</p>
                  <p class="text-caption text-disabled">Loan disbursements, collections, and performance metrics</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Recent Applications -->
          <v-col cols="12" lg="4">
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="me-2">mdi-file-document-plus</v-icon>
                Recent Applications
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-0">
                <v-list>
                  <v-list-item
                    v-for="application in recentApplications"
                    :key="application.id"
                  >
                    <template #prepend>
                      <v-avatar :color="getStatusColor(application.status)" size="40">
                        <v-icon color="white">{{ getStatusIcon(application.status) }}</v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title>{{ application.clientName }}</v-list-item-title>
                    <v-list-item-subtitle>
                      ₱{{ application.amount.toLocaleString() }} - {{ application.product }}
                    </v-list-item-subtitle>

                    <template #append>
                      <v-chip
                        :color="getStatusColor(application.status)"
                        size="small"
                        variant="flat"
                      >
                        {{ application.status }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-btn
                  color="primary"
                  variant="text"
                  prepend-icon="mdi-eye"
                  @click="$router.push('/admin/applications')"
                >
                  View All
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Quick Actions & System Status -->
        <v-row>
          <v-col cols="12" lg="6">
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="me-2">mdi-lightning-bolt</v-icon>
                Quick Actions
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-btn
                      color="primary"
                      variant="tonal"
                      size="large"
                      block
                      prepend-icon="mdi-file-document-plus"
                      @click="$router.push('/admin/applications')"
                    >
                      Review Applications
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      color="success"
                      variant="tonal"
                      size="large"
                      block
                      prepend-icon="mdi-credit-card"
                      @click="$router.push('/admin/payments')"
                    >
                      Record Payment
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      color="info"
                      variant="tonal"
                      size="large"
                      block
                      prepend-icon="mdi-account-plus"
                      @click="$router.push('/admin/clients')"
                    >
                      Add Client
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      color="warning"
                      variant="tonal"
                      size="large"
                      block
                      prepend-icon="mdi-chart-box"
                      @click="$router.push('/admin/financial-reports')"
                    >
                      Generate Report
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="6">
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="me-2">mdi-alert-circle-outline</v-icon>
                System Alerts
              </v-card-title>
              <v-divider />
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="alert in systemAlerts"
                    :key="alert.id"
                    class="px-0"
                  >
                    <template #prepend>
                      <v-icon :color="alert.color">{{ alert.icon }}</v-icon>
                    </template>
                    <v-list-item-title>{{ alert.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ alert.description }}</v-list-item-subtitle>
                    <template #append>
                      <div class="text-caption">{{ alert.time }}</div>
                    </template>
                  </v-list-item>
                </v-list>

                <div v-if="systemAlerts.length === 0" class="text-center py-4">
                  <v-icon size="48" class="text-success mb-2">mdi-check-circle</v-icon>
                  <p class="text-body-2 text-success">All systems operational</p>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/utils/useAuth'

const router = useRouter()
const { logout } = useAuth()

const drawer = ref(true)
const chartPeriod = ref('month')

// Dashboard data
const totalActiveLoans = ref(147)
const pendingApplications = ref(23)
const totalPortfolio = ref(12500000)
const overdueLoans = ref(8)

const recentApplications = ref([
  {
    id: 1,
    clientName: 'Juan Dela Cruz',
    amount: 50000,
    product: 'Business Loan',
    status: 'pending'
  },
  {
    id: 2,
    clientName: 'Maria Santos',
    amount: 25000,
    product: 'Personal Loan',
    status: 'approved'
  },
  {
    id: 3,
    clientName: 'Pedro Garcia',
    amount: 75000,
    product: 'Equipment Loan',
    status: 'under review'
  },
  {
    id: 4,
    clientName: 'Ana Reyes',
    amount: 30000,
    product: 'Emergency Loan',
    status: 'rejected'
  }
])

const systemAlerts = ref([
  {
    id: 1,
    title: 'High Risk Applications',
    description: '5 applications flagged for manual review',
    icon: 'mdi-alert-triangle',
    color: 'warning',
    time: '2h ago'
  },
  {
    id: 2,
    title: 'Payment Overdue',
    description: '8 loans have overdue payments requiring attention',
    icon: 'mdi-alert-circle',
    color: 'error',
    time: '4h ago'
  },
  {
    id: 3,
    title: 'System Backup Completed',
    description: 'Daily backup completed successfully',
    icon: 'mdi-check-circle',
    color: 'success',
    time: '6h ago'
  }
])

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'approved': return 'success'
    case 'rejected': return 'error'
    case 'under review': return 'info'
    default: return 'primary'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return 'mdi-clock-outline'
    case 'approved': return 'mdi-check-circle'
    case 'rejected': return 'mdi-close-circle'
    case 'under review': return 'mdi-eye'
    default: return 'mdi-file-document'
  }
}

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

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.02) 0%, rgba(185, 28, 28, 0.05) 100%);
  border-radius: 12px;
  border: 2px dashed rgba(220, 38, 38, 0.2);
}

:deep(.v-main) {
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%);
  min-height: 100vh;
}

:deep(.v-app-bar) {
  background: white !important;
  border-bottom: 1px solid rgba(220, 38, 38, 0.1);
}

:deep(.v-card:not(.stat-card)) {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  transition: all 0.3s ease;
}

:deep(.v-card:hover:not(.stat-card)) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

:deep(.v-btn) {
  text-transform: none;
  font-weight: 500;
}

:deep(.v-btn--variant-tonal) {
  border: 1px solid rgba(220, 38, 38, 0.2);
}

:deep(.v-btn--variant-tonal:hover) {
  border-color: rgba(220, 38, 38, 0.3);
  transform: translateY(-1px);
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

:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 56px !important;
}

/* Navigation drawer styling */
:deep(.v-navigation-drawer) {
  background: linear-gradient(180deg, #1a1a1a 0%, #2d1818 100%) !important;
  border-right: 1px solid rgba(220, 38, 38, 0.2);
}

/* Enhanced chip styling */
:deep(.v-chip) {
  border: 1px solid rgba(220, 38, 38, 0.2);
}

:deep(.v-chip:hover) {
  transform: scale(1.02);
}

/* Button styling */
:deep(.v-btn-group) {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(220, 38, 38, 0.2);
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