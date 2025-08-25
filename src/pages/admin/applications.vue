<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      color="primary"
      theme="dark"
      width="280"
    >
      <div class="pa-4">
        <div class="d-flex align-center mb-6">
          <img src="/cct-logo.png" alt="Smart Loan" class="nav-logo me-3" />
          <div>
            <h3 class="text-h6 font-weight-bold">SMART LOAN</h3>
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
          
          <v-list-group value="loans" :model-value="true">
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
        <v-chip color="primary" variant="flat" class="me-4">
          <v-icon start>mdi-shield-account</v-icon>
          Admin Portal
        </v-chip>
        <v-avatar color="primary" size="40">
          <v-icon>mdi-account-supervisor</v-icon>
        </v-avatar>
      </div>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-8">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Loan Applications</h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              Review and manage loan applications
            </p>
          </div>

          <v-btn
            color="primary"
            prepend-icon="mdi-refresh"
            @click="loadApplications"
            :loading="loading"
          >
            Refresh
          </v-btn>
        </div>

        <!-- Filters -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  clearable
                  @update:model-value="filterApplications"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.loanProduct"
                  :items="loanProductOptions"
                  label="Loan Product"
                  variant="outlined"
                  clearable
                  @update:model-value="filterApplications"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.amountFrom"
                  label="Amount From (₱)"
                  type="number"
                  variant="outlined"
                  @update:model-value="filterApplications"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.amountTo"
                  label="Amount To (₱)"
                  type="number"
                  variant="outlined"
                  @update:model-value="filterApplications"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Applications Table -->
        <v-card>
          <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="filteredApplications"
            :loading="loading"
            item-value="id"
            class="application-table"
          >
            <!-- Status chip -->
            <template #item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
                variant="flat"
              >
                {{ item.status }}
              </v-chip>
            </template>

            <!-- Amount formatting -->
            <template #item.loanAmount="{ item }">
              ₱{{ item.loanAmount.toLocaleString() }}
            </template>

            <!-- Date formatting -->
            <template #item.applicationDate="{ item }">
              {{ formatDate(item.applicationDate) }}
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
              <div class="d-flex gap-2">
                <v-btn
                  color="primary"
                  size="small"
                  variant="tonal"
                  @click="viewApplication(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.status === 'pending'"
                  color="success"
                  size="small"
                  variant="tonal"
                  @click="approveApplication(item)"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.status === 'pending'"
                  color="error"
                  size="small"
                  variant="tonal"
                  @click="rejectApplication(item)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </template>

            <!-- No data -->
            <template #no-data>
              <div class="text-center pa-8">
                <v-icon size="64" class="text-disabled mb-4">mdi-file-document-outline</v-icon>
                <p class="text-h6 text-disabled">No applications found</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-main>

    <!-- Application Details Dialog -->
    <v-dialog v-model="showDetails" max-width="1200" scrollable>
      <v-card v-if="selectedApplication">
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <h3>Application Details</h3>
            <p class="text-subtitle-2 text-medium-emphasis mb-0">
              ID: {{ selectedApplication.id }}
            </p>
          </div>
          <v-chip
            :color="getStatusColor(selectedApplication.status)"
            variant="flat"
          >
            {{ selectedApplication.status }}
          </v-chip>
        </v-card-title>
        
        <v-divider />

        <v-card-text style="max-height: 600px;">
          <v-row>
            <!-- Personal Information -->
            <v-col cols="12" lg="6">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Personal Information</v-card-title>
                <v-card-text>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="label">Name:</span>
                      <span class="value">{{ selectedApplication.clientName }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Mobile:</span>
                      <span class="value">{{ selectedApplication.mobileNumber }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Civil Status:</span>
                      <span class="value">{{ selectedApplication.civilStatus }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Address:</span>
                      <span class="value">{{ selectedApplication.address }}</span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Loan Information -->
            <v-col cols="12" lg="6">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Loan Information</v-card-title>
                <v-card-text>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="label">Product:</span>
                      <span class="value">{{ selectedApplication.loanProduct }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Amount:</span>
                      <span class="value">₱{{ selectedApplication.loanAmount.toLocaleString() }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Term:</span>
                      <span class="value">{{ selectedApplication.termMonths }} months</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Purpose:</span>
                      <span class="value">{{ selectedApplication.purpose }}</span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Financial Information -->
            <v-col cols="12" lg="6">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Financial Information</v-card-title>
                <v-card-text>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="label">Monthly Income:</span>
                      <span class="value">₱{{ selectedApplication.monthlyIncome.toLocaleString() }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Monthly Expenses:</span>
                      <span class="value">₱{{ selectedApplication.monthlyExpenses.toLocaleString() }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Net Income:</span>
                      <span class="value" :class="getNetIncomeClass(selectedApplication)">
                        ₱{{ (selectedApplication.monthlyIncome - selectedApplication.monthlyExpenses).toLocaleString() }}
                      </span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Business Information -->
            <v-col cols="12" lg="6">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Business Information</v-card-title>
                <v-card-text>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="label">Business Name:</span>
                      <span class="value">{{ selectedApplication.businessName }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Business Type:</span>
                      <span class="value">{{ selectedApplication.businessType }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Years in Business:</span>
                      <span class="value">{{ selectedApplication.yearsInBusiness }} years</span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Documents -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Submitted Documents</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="6" md="3" v-for="doc in selectedApplication.documents" :key="doc.type">
                      <v-card class="document-card" variant="tonal" color="primary">
                        <v-card-text class="text-center">
                          <v-icon size="32" class="mb-2">{{ getDocumentIcon(doc.type) }}</v-icon>
                          <p class="text-caption">{{ doc.type }}</p>
                          <v-btn size="small" variant="outlined" @click="viewDocument(doc)">
                            View
                          </v-btn>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="selectedApplication.status === 'pending'"
            color="error"
            variant="outlined"
            @click="rejectApplication(selectedApplication)"
          >
            Reject
          </v-btn>
          <v-btn
            v-if="selectedApplication.status === 'pending'"
            color="success"
            @click="approveApplication(selectedApplication)"
          >
            Approve
          </v-btn>
          <v-btn @click="showDetails = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog -->
    <v-dialog v-model="showConfirm" max-width="400">
      <v-card>
        <v-card-title>{{ confirmTitle }}</v-card-title>
        <v-card-text>{{ confirmMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showConfirm = false">Cancel</v-btn>
          <v-btn
            :color="confirmAction === 'approve' ? 'success' : 'error'"
            @click="executeAction"
          >
            {{ confirmAction === 'approve' ? 'Approve' : 'Reject' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/utils/useAuth'

const router = useRouter()
const { logout } = useAuth()

const drawer = ref(true)
const loading = ref(false)
const showDetails = ref(false)
const showConfirm = ref(false)
const selectedApplication = ref(null)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmAction = ref('')
const itemsPerPage = ref(10)

// Filters
const filters = ref({
  status: null,
  loanProduct: null,
  amountFrom: null,
  amountTo: null
})

// Mock data
const applications = ref([
  {
    id: 'APP-001',
    clientName: 'Juan Dela Cruz',
    loanProduct: 'Business Loan',
    loanAmount: 100000,
    termMonths: 24,
    purpose: 'Business expansion',
    status: 'pending',
    applicationDate: '2024-01-15',
    mobileNumber: '+63-912-345-6789',
    civilStatus: 'Married',
    address: '123 Main St, Quezon City',
    businessName: 'Juan\'s Store',
    businessType: 'Retail',
    yearsInBusiness: 5,
    monthlyIncome: 50000,
    monthlyExpenses: 30000,
    documents: [
      { type: 'Valid ID', url: '#' },
      { type: 'Business Permit', url: '#' },
      { type: 'Photo', url: '#' }
    ]
  },
  {
    id: 'APP-002',
    clientName: 'Maria Santos',
    loanProduct: 'Personal Loan',
    loanAmount: 50000,
    termMonths: 12,
    purpose: 'Medical expenses',
    status: 'approved',
    applicationDate: '2024-01-14',
    mobileNumber: '+63-917-123-4567',
    civilStatus: 'Single',
    address: '456 Second Ave, Manila',
    businessName: 'Maria\'s Catering',
    businessType: 'Food Service',
    yearsInBusiness: 3,
    monthlyIncome: 35000,
    monthlyExpenses: 20000,
    documents: [
      { type: 'Valid ID', url: '#' },
      { type: 'Photo', url: '#' }
    ]
  },
  {
    id: 'APP-003',
    clientName: 'Pedro Garcia',
    loanProduct: 'Equipment Loan',
    loanAmount: 200000,
    termMonths: 36,
    purpose: 'Equipment purchase',
    status: 'under_review',
    applicationDate: '2024-01-13',
    mobileNumber: '+63-920-987-6543',
    civilStatus: 'Married',
    address: '789 Third St, Pasig',
    businessName: 'Garcia Auto Repair',
    businessType: 'Automotive',
    yearsInBusiness: 8,
    monthlyIncome: 80000,
    monthlyExpenses: 45000,
    documents: [
      { type: 'Valid ID', url: '#' },
      { type: 'Business Permit', url: '#' },
      { type: 'Photo', url: '#' },
      { type: 'Co-maker ID', url: '#' }
    ]
  }
])

const filteredApplications = computed(() => {
  let filtered = applications.value

  if (filters.value.status) {
    filtered = filtered.filter(app => app.status === filters.value.status)
  }

  if (filters.value.loanProduct) {
    filtered = filtered.filter(app => app.loanProduct === filters.value.loanProduct)
  }

  if (filters.value.amountFrom) {
    filtered = filtered.filter(app => app.loanAmount >= filters.value.amountFrom)
  }

  if (filters.value.amountTo) {
    filtered = filtered.filter(app => app.loanAmount <= filters.value.amountTo)
  }

  return filtered
})

// Table configuration
const headers = [
  { title: 'Application ID', key: 'id', sortable: true },
  { title: 'Client Name', key: 'clientName', sortable: true },
  { title: 'Product', key: 'loanProduct', sortable: true },
  { title: 'Amount', key: 'loanAmount', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Date', key: 'applicationDate', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px' }
]

const statusOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'Under Review', value: 'under_review' },
  { title: 'Approved', value: 'approved' },
  { title: 'Rejected', value: 'rejected' }
]

const loanProductOptions = [
  { title: 'Business Loan', value: 'Business Loan' },
  { title: 'Personal Loan', value: 'Personal Loan' },
  { title: 'Equipment Loan', value: 'Equipment Loan' },
  { title: 'Emergency Loan', value: 'Emergency Loan' }
]

// Methods
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'approved': return 'success'
    case 'rejected': return 'error'
    case 'under_review': return 'info'
    default: return 'primary'
  }
}

const getNetIncomeClass = (application: any) => {
  const netIncome = application.monthlyIncome - application.monthlyExpenses
  if (netIncome > 10000) return 'text-success'
  if (netIncome > 0) return 'text-warning'
  return 'text-error'
}

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'Valid ID': return 'mdi-card-account-details'
    case 'Business Permit': return 'mdi-file-document'
    case 'Photo': return 'mdi-camera'
    case 'Co-maker ID': return 'mdi-account-supervisor'
    default: return 'mdi-file-document'
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewApplication = (application: any) => {
  selectedApplication.value = application
  showDetails.value = true
}

const approveApplication = (application: any) => {
  selectedApplication.value = application
  confirmTitle.value = 'Approve Application'
  confirmMessage.value = `Are you sure you want to approve the loan application for ${application.clientName}?`
  confirmAction.value = 'approve'
  showConfirm.value = true
}

const rejectApplication = (application: any) => {
  selectedApplication.value = application
  confirmTitle.value = 'Reject Application'
  confirmMessage.value = `Are you sure you want to reject the loan application for ${application.clientName}?`
  confirmAction.value = 'reject'
  showConfirm.value = true
}

const executeAction = () => {
  if (selectedApplication.value) {
    selectedApplication.value.status = confirmAction.value === 'approve' ? 'approved' : 'rejected'
    // Here you would make API call to update status
  }
  showConfirm.value = false
  showDetails.value = false
}

const viewDocument = (doc: any) => {
  // Here you would open/download the document
  console.log('View document:', doc)
}

const filterApplications = () => {
  // Trigger reactivity for computed property
}

const loadApplications = () => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}

onMounted(() => {
  loadApplications()
})
</script>

<style scoped>
.nav-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.info-grid {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  min-width: 120px;
}

.info-item .value {
  font-weight: 400;
  text-align: right;
}

.document-card {
  height: 120px;
  display: flex;
  align-items: center;
}

:deep(.v-list-item--nav .v-list-item__prepend > .v-icon) {
  opacity: 0.8;
}

:deep(.v-list-item--active) {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 56px !important;
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