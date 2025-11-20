<template>
  <AdminLayout>
    <v-container fluid class="pa-6">
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-8">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Dashboard</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Business loan management overview and analytics
          </p>
        </div>
        <div class="text-right">
          <div class="text-h6 font-weight-bold">{{ formatDate(new Date()) }}</div>
          <div class="text-caption text-medium-emphasis">Last updated: {{ lastUpdated }}</div>
        </div>
      </div>

      <!-- Key Metrics -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card" color="error" variant="flat">
            <v-card-text class="d-flex align-center">
              <div class="flex-grow-1">
                <div class="text-h4 font-weight-bold text-white">₱{{ totalLoanPortfolio.toLocaleString() }}</div>
                <div class="text-subtitle-2 text-white opacity-80">Total Loan Portfolio</div>
                <div class="text-caption text-white opacity-60 mt-1">+{{ monthlyGrowth }}% this month</div>
              </div>
              <v-icon size="40" class="text-white opacity-60">mdi-cash-multiple</v-icon>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card" color="grey-darken-2" variant="flat">
            <v-card-text class="d-flex align-center">
              <div class="flex-grow-1">
                <div class="text-h4 font-weight-bold text-white">{{ totalActiveLoans }}</div>
                <div class="text-subtitle-2 text-white opacity-80">Active Business Loans</div>
                <div class="text-caption text-white opacity-60 mt-1">{{ pendingApplications }} pending</div>
              </div>
              <v-icon size="40" class="text-white opacity-60">mdi-briefcase</v-icon>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card" color="error" variant="flat">
            <v-card-text class="d-flex align-center">
              <div class="flex-grow-1">
                <div class="text-h4 font-weight-bold text-white">{{ overdueCount }}</div>
                <div class="text-subtitle-2 text-white opacity-80">Overdue Payments</div>
                <div class="text-caption text-white opacity-60 mt-1">₱{{ overdueAmount.toLocaleString() }} total</div>
              </div>
              <v-icon size="40" class="text-white opacity-60">mdi-alert-circle</v-icon>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="metric-card" color="grey-darken-2" variant="flat">
            <v-card-text class="d-flex align-center">
              <div class="flex-grow-1">
                <div class="text-h4 font-weight-bold text-white">{{ totalClients }}</div>
                <div class="text-subtitle-2 text-white opacity-80">Total Clients</div>
                <div class="text-caption text-white opacity-60 mt-1">{{ newClientsThisMonth }} new this month</div>
              </div>
              <v-icon size="40" class="text-white opacity-60">mdi-account-group</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Row -->
      <v-row class="mb-6">
        <!-- Monthly Collections Chart -->
        <v-col cols="12" md="8">
          <v-card class="chart-card">
            <v-card-title class="d-flex justify-space-between align-center">
              <div>
                <h3 class="text-h6 font-weight-bold">Monthly Collections</h3>
                <p class="text-caption text-medium-emphasis mb-0">Last 6 months performance</p>
              </div>
              <v-chip color="grey-darken-2" size="small">₱{{ totalMonthlyCollections.toLocaleString() }} total</v-chip>
            </v-card-title>
            <v-card-text>
              <canvas ref="collectionsChart" height="120"></canvas>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Loan Status Distribution -->
        <v-col cols="12" md="4">
          <v-card class="chart-card">
            <v-card-title>
              <h3 class="text-h6 font-weight-bold">Loan Status Distribution</h3>
              <p class="text-caption text-medium-emphasis mb-0">Current loan portfolio</p>
            </v-card-title>
            <v-card-text>
              <canvas ref="statusChart" height="200"></canvas>
              <div class="mt-4">
                <div v-for="(status, index) in loanStatuses" :key="status.name" class="d-flex justify-space-between align-center mb-2">
                  <div class="d-flex align-center">
                    <div class="status-dot" :style="{ backgroundColor: statusColors[index] }"></div>
                    <span class="text-body-2 ml-2">{{ status.name }}</span>
                  </div>
                  <span class="text-body-2 font-weight-bold">{{ status.count }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Additional Analytics -->
      <v-row class="mb-6">
        <!-- Daily Payment Performance -->
        <v-col cols="12" md="6">
          <v-card class="chart-card">
            <v-card-title>
              <h3 class="text-h6 font-weight-bold">Daily Payment Performance</h3>
              <p class="text-caption text-medium-emphasis mb-0">Last 7 days</p>
            </v-card-title>
            <v-card-text>
              <canvas ref="dailyPerformanceChart" height="150"></canvas>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Top Clients by Loan Amount -->
        <v-col cols="12" md="6">
          <v-card class="chart-card">
            <v-card-title>
              <h3 class="text-h6 font-weight-bold">Top Clients by Loan Amount</h3>
              <p class="text-caption text-medium-emphasis mb-0">Highest loan amounts this month</p>
            </v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item v-for="(client, index) in topClients" :key="client.id">
                  <template #prepend>
                    <div class="d-flex align-center justify-center" style="width: 32px;">
                      <span class="text-h6 font-weight-bold text-grey-darken-2">{{ index + 1 }}</span>
                    </div>
                  </template>
                  <v-list-item-title class="text-body-2">{{ client.name }}</v-list-item-title>
                  <template #append>
                    <div class="text-right">
                      <div class="text-body-2 font-weight-bold">₱{{ client.amount.toLocaleString() }}</div>
                      <div class="text-caption text-medium-emphasis">{{ client.loanDays }} days</div>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Recent Activity -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <h3 class="text-h6 font-weight-bold">Recent Activity</h3>
              <p class="text-caption text-medium-emphasis mb-0">Latest loan applications and payments</p>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="activityHeaders"
                :items="recentActivity"
                :items-per-page="10"
                class="activity-table"
                density="compact"
              >
                <!-- Type -->
                <template #item.type="{ item }">
                  <v-chip :color="getActivityColor(item.type)" size="small" variant="flat">
                    {{ getActivityIcon(item.type) }} {{ item.type }}
                  </v-chip>
                </template>

                <!-- Amount -->
                <template #item.amount="{ item }">
                  <span v-if="item.amount" class="font-weight-bold text-grey-darken-3">
                    ₱{{ item.amount.toLocaleString() }}
                  </span>
                  <span v-else class="text-medium-emphasis">—</span>
                </template>

                <!-- Status -->
                <template #item.status="{ item }">
                  <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
                    {{ item.status }}
                  </v-chip>
                </template>

                <!-- Date -->
                <template #item.date="{ item }">
                  {{ formatDate(item.date) }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { client } from '@/utils/useDirectus'
import { readItems } from '@directus/sdk'

// Data refs
const loading = ref(false)
const lastUpdated = ref('')

// Metrics
const totalLoanPortfolio = ref(0)
const totalActiveLoans = ref(0)
const pendingApplications = ref(0)
const overdueCount = ref(0)
const overdueAmount = ref(0)
const totalClients = ref(0)
const newClientsThisMonth = ref(0)
const monthlyGrowth = ref(0)
const totalMonthlyCollections = ref(0)

// Charts data
const collectionsChart = ref<HTMLCanvasElement>()
const statusChart = ref<HTMLCanvasElement>()
const dailyPerformanceChart = ref<HTMLCanvasElement>()

// Activity data
const loanStatuses = ref([
  { name: 'Active', count: 0 },
  { name: 'Pending', count: 0 },
  { name: 'Approved', count: 0 },
  { name: 'Completed', count: 0 },
  { name: 'Overdue', count: 0 }
])

const statusColors = ['#424242', '#757575', '#9E9E9E', '#BDBDBD', '#EF5350']

const topClients = ref<any[]>([])

const activityHeaders = [
  { title: 'Type', key: 'type' },
  { title: 'Client', key: 'client' },
  { title: 'Amount', key: 'amount' },
  { title: 'Status', key: 'status' },
  { title: 'Date', key: 'date' }
]

const recentActivity = ref<any[]>([])

// Chart instances
let collectionsChartInstance: any = null
let statusChartInstance: any = null
let dailyPerformanceChartInstance: any = null

// Helper functions
const formatDate = (date: string | Date) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    'Application': '📝',
    'Payment': '💰',
    'Approval': '✅',
    'Completed': '🎉'
  }
  return icons[type] || '📋'
}

const getActivityColor = (type: string) => {
  const colors: Record<string, string> = {
    'Application': 'grey-darken-2',
    'Payment': 'grey-lighten-2',
    'Approval': 'grey-darken-3',
    'Completed': 'grey-darken-1'
  }
  return colors[type] || 'grey'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'active': 'grey-darken-2',
    'pending': 'grey-lighten-2',
    'approved': 'grey-darken-3',
    'completed': 'grey-darken-1',
    'rejected': 'error'
  }
  return colors[status] || 'grey'
}

// Initialize charts
const initializeCharts = () => {
  // Monthly Collections Chart
  if (collectionsChart.value) {
    const ctx = collectionsChart.value.getContext('2d')
    if (ctx) {
      // Destroy existing chart if it exists
      if (collectionsChartInstance) {
        collectionsChartInstance.destroy()
      }

      collectionsChartInstance = createChart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Collections',
            data: [120000, 145000, 165000, 180000, 195000, 210000],
            borderColor: '#EF5350',
            backgroundColor: 'rgba(239, 83, 80, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => '₱' + value.toLocaleString()
              }
            }
          }
        }
      })
    }
  }

  // Status Distribution Chart
  if (statusChart.value) {
    const ctx = statusChart.value.getContext('2d')
    if (ctx) {
      if (statusChartInstance) {
        statusChartInstance.destroy()
      }

      statusChartInstance = createChart(ctx, {
        type: 'doughnut',
        data: {
          labels: loanStatuses.value.map(s => s.name),
          datasets: [{
            data: loanStatuses.value.map(s => s.count),
            backgroundColor: statusColors,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          }
        }
      })
    }
  }

  // Daily Performance Chart
  if (dailyPerformanceChart.value) {
    const ctx = dailyPerformanceChart.value.getContext('2d')
    if (ctx) {
      if (dailyPerformanceChartInstance) {
        dailyPerformanceChartInstance.destroy()
      }

      dailyPerformanceChartInstance = createChart(ctx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Payments',
            data: [45, 52, 38, 65, 48, 25, 15],
            backgroundColor: '#616161',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }
  }
}

// Simple chart creation function (for demonstration)
const createChart = (ctx: any, config: any) => {
  // This is a simplified chart implementation
  // In a real app, you'd use a proper charting library like Chart.js
  const canvas = ctx.canvas
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height || 150

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw placeholder chart content
  ctx.fillStyle = '#E0E0E0'
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Chart Visualization', canvas.width / 2, canvas.height / 2)
  ctx.fillText('(Chart library integration needed)', canvas.width / 2, canvas.height / 2 + 20)

  return {
    destroy: () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
}

// Load dashboard data
const loadDashboardData = async () => {
  loading.value = true
  try {
    // Load loans data
    const loans = await client.request(
      readItems('loan', {
        fields: ['*', 'client.*'],
        limit: 100
      })
    )

    // Calculate metrics
    totalActiveLoans.value = loans.filter(l => l.status === 'active').length
    totalLoanPortfolio.value = loans.reduce((sum, loan) => sum + (loan.principal_amount || 0), 0)
    pendingApplications.value = loans.filter(l => l.status === 'pending').length

    // Calculate status distribution
    const statusCounts: Record<string, number> = {}
    loans.forEach(loan => {
      statusCounts[loan.status] = (statusCounts[loan.status] || 0) + 1
    })

    loanStatuses.value = [
      { name: 'Active', count: statusCounts.active || 0 },
      { name: 'Pending', count: statusCounts.pending || 0 },
      { name: 'Approved', count: statusCounts.approved || 0 },
      { name: 'Completed', count: statusCounts.completed || 0 },
      { name: 'Overdue', count: statusCounts.overdue || 0 }
    ]

    // Get top clients
    topClients.value = loans
      .sort((a, b) => (b.principal_amount || 0) - (a.principal_amount || 0))
      .slice(0, 5)
      .map(loan => ({
        id: loan.id,
        name: `${loan.client?.first_name || 'Unknown'} ${loan.client?.last_name || ''}`,
        amount: loan.principal_amount || 0,
        loanDays: loan.term_days || 0
      }))

    // Load payments data for activity
    const payments = await client.request(
      readItems('payments', {
        fields: ['*', 'loan.client.*'],
        sort: ['-payment_date'],
        limit: 10
      })
    )

    // Create recent activity
    recentActivity.value = [
      ...loans.slice(0, 5).map(loan => ({
        type: 'Application',
        client: `${loan.client?.first_name || 'Unknown'} ${loan.client?.last_name || ''}`,
        amount: loan.principal_amount,
        status: loan.status,
        date: loan.application_date
      })),
      ...payments.slice(0, 5).map(payment => ({
        type: 'Payment',
        client: `${payment.loan?.client?.first_name || 'Unknown'} ${payment.loan?.client?.last_name || ''}`,
        amount: payment.amount_paid,
        status: 'completed',
        date: payment.payment_date
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Calculate additional metrics (mock data for now)
    totalClients.value = new Set(loans.map(l => l.client?.id)).size
    newClientsThisMonth.value = 8
    monthlyGrowth.value = 12.5
    overdueCount.value = 15
    overdueAmount.value = 45000
    totalMonthlyCollections.value = 210000

    lastUpdated.value = new Date().toLocaleTimeString()

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadDashboardData()
  await nextTick()
  initializeCharts()
})
</script>

<style scoped>
.metric-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.chart-card {
  background: white;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.activity-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(0, 0, 0, 0.02);
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>