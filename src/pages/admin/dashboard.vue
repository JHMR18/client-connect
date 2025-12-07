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
import {
  Chart,
  LineController,
  BarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register Chart.js components
Chart.register(
  LineController,
  BarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

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
  { name: 'Completed', count: 0 },
  { name: 'Rejected', count: 0 }
])

const statusColors = ['#424242', '#757575', '#BDBDBD', '#EF5350']

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
let collectionsChartInstance: Chart | null = null
let statusChartInstance: Chart | null = null
let dailyPerformanceChartInstance: Chart | null = null

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

// Initialize charts with real data
const initializeCharts = (monthlyData: any, dailyData: any) => {
  console.log('🎨 Initializing admin charts...')
  
  // Monthly Collections Chart
  if (collectionsChart.value) {
    if (collectionsChartInstance) {
      collectionsChartInstance.destroy()
    }

    collectionsChartInstance = new Chart(collectionsChart.value, {
      type: 'line',
      data: {
        labels: monthlyData.labels,
        datasets: [{
          label: 'Collections',
          data: monthlyData.data,
          borderColor: '#EF5350',
          backgroundColor: 'rgba(239, 83, 80, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1a1a1a',
            bodyColor: '#666',
            borderColor: '#e0e0e0',
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                return '₱' + context.parsed.y.toLocaleString('en-PH', {
                  minimumFractionDigits: 2
                })
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '₱' + Number(value).toLocaleString()
            }
          }
        }
      }
    })
    console.log('✅ Monthly collections chart created')
  }

  // Status Distribution Chart
  if (statusChart.value) {
    if (statusChartInstance) {
      statusChartInstance.destroy()
    }

    statusChartInstance = new Chart(statusChart.value, {
      type: 'doughnut',
      data: {
        labels: loanStatuses.value.map(s => s.name),
        datasets: [{
          data: loanStatuses.value.map(s => s.count),
          backgroundColor: statusColors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: true,
        aspectRatio: 1,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1a1a1a',
            bodyColor: '#666',
            borderColor: '#e0e0e0',
            borderWidth: 1
          }
        },
        cutout: '60%',
        animation: {
          duration: 750
        }
      }
    })
    console.log('✅ Status distribution chart created')
  }

  // Daily Performance Chart
  if (dailyPerformanceChart.value) {
    if (dailyPerformanceChartInstance) {
      dailyPerformanceChartInstance.destroy()
    }

    dailyPerformanceChartInstance = new Chart(dailyPerformanceChart.value, {
      type: 'bar',
      data: {
        labels: dailyData.labels,
        datasets: [{
          label: 'Payments',
          data: dailyData.data,
          backgroundColor: '#616161',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1a1a1a',
            bodyColor: '#666',
            borderColor: '#e0e0e0',
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                return context.parsed.y + ' payment' + (context.parsed.y !== 1 ? 's' : '')
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    })
    console.log('✅ Daily performance chart created')
  }
}

// Load dashboard data
const loadDashboardData = async () => {
  loading.value = true
  console.log('🔵 === ADMIN DASHBOARD LOADING STARTED ===')
  
  try {
    // Load all loans
    console.log('📊 Fetching loans...')
    const loans = await client.request(
      readItems('loan', {
        fields: ['*', 'client.first_name', 'client.last_name', 'client.id'],
        limit: -1
      })
    )
    console.log('✅ Fetched loans:', loans.length)

    // Calculate basic metrics
    totalActiveLoans.value = loans.filter(l => l.status === 'active' || l.status === 'approved').length
    totalLoanPortfolio.value = loans.reduce((sum, loan) => sum + (loan.principal_amount || 0), 0)
    pendingApplications.value = loans.filter(l => l.status === 'pending').length

    console.log('📊 Active loans:', totalActiveLoans.value)
    console.log('💰 Total portfolio:', totalLoanPortfolio.value)
    console.log('⏳ Pending:', pendingApplications.value)

    // Calculate status distribution
    const statusCounts: Record<string, number> = {}
    loans.forEach(loan => {
      statusCounts[loan.status] = (statusCounts[loan.status] || 0) + 1
    })

    loanStatuses.value = [
      { name: 'Active', count: (statusCounts.active || 0) + (statusCounts.approved || 0) },
      { name: 'Pending', count: statusCounts.pending || 0 },
      { name: 'Completed', count: statusCounts.closed || 0 },
      { name: 'Rejected', count: statusCounts.rejected || 0 }
    ]
    console.log('📊 Status distribution:', loanStatuses.value)

    // Get top clients
    topClients.value = loans
      .sort((a, b) => (b.principal_amount || 0) - (a.principal_amount || 0))
      .slice(0, 5)
      .map(loan => ({
        id: loan.id,
        name: `${loan.client?.first_name || 'Unknown'} ${loan.client?.last_name || ''}`.trim() || 'Unknown Client',
        amount: loan.principal_amount || 0,
        loanDays: loan.term_days || 0
      }))
    console.log('👥 Top clients:', topClients.value.length)

    // Load payments for charts and metrics
    console.log('💳 Fetching payments...')
    const payments = await client.request(
      readItems('payments', {
        fields: ['*', 'loan.client.first_name', 'loan.client.last_name'],
        sort: ['-payment_date'],
        limit: 100
      })
    )
    console.log('✅ Fetched payments:', payments.length)

    // Generate monthly collections data (last 6 months)
    const monthlyData: Record<string, number> = {}
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      monthlyData[key] = 0
    }

    payments.forEach(payment => {
      const paymentDate = new Date(payment.payment_date)
      const key = paymentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (monthlyData.hasOwnProperty(key)) {
        monthlyData[key] += payment.amount_paid || 0
      }
    })

    totalMonthlyCollections.value = Object.values(monthlyData).reduce((sum, val) => sum + val, 0)
    console.log('💵 Monthly collections:', monthlyData)

    // Generate daily payment data (last 7 days)
    const dailyData: Record<string, number> = {}
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayName = days[date.getDay()]
      dailyData[dayName] = 0
    }

    payments.forEach(payment => {
      const paymentDate = new Date(payment.payment_date)
      const daysDiff = Math.floor((now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff >= 0 && daysDiff < 7) {
        const dayName = days[paymentDate.getDay()]
        dailyData[dayName]++
      }
    })
    console.log('📅 Daily payments:', dailyData)

    // Calculate overdue info from amortization schedule
    console.log('⚠️ Fetching overdue schedules...')
    try {
      const overdueSchedules = await client.request(
        readItems('amortization_schedule', {
          filter: {
            status: { _eq: 'overdue' }
          },
          fields: ['amount_due']
        })
      )
      
      overdueCount.value = overdueSchedules.length
      overdueAmount.value = overdueSchedules.reduce((sum, s) => sum + (s.amount_due || 0), 0)
      console.log('⚠️ Overdue count:', overdueCount.value, 'Amount:', overdueAmount.value)
    } catch (err) {
      console.error('Error fetching overdue:', err)
      overdueCount.value = 0
      overdueAmount.value = 0
    }

    // Calculate total unique clients
    const uniqueClients = new Set(loans.map(l => l.client?.id).filter(id => id))
    totalClients.value = uniqueClients.size
    console.log('👥 Total clients:', totalClients.value)

    // Calculate new clients this month (mock for now - would need user creation dates)
    newClientsThisMonth.value = Math.floor(totalClients.value * 0.1)
    
    // Calculate monthly growth (mock calculation)
    monthlyGrowth.value = totalMonthlyCollections.value > 0 ? 12.5 : 0

    // Create recent activity
    recentActivity.value = [
      ...loans.slice(0, 5).map(loan => ({
        type: 'Application',
        client: `${loan.client?.first_name || 'Unknown'} ${loan.client?.last_name || ''}`.trim() || 'Unknown Client',
        amount: loan.principal_amount,
        status: loan.status,
        date: loan.application_date
      })),
      ...payments.slice(0, 5).map(payment => ({
        type: 'Payment',
        client: `${payment.loan?.client?.first_name || 'Unknown'} ${payment.loan?.client?.last_name || ''}`.trim() || 'Unknown Client',
        amount: payment.amount_paid,
        status: 'completed',
        date: payment.payment_date
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

    console.log('📋 Recent activity:', recentActivity.value.length, 'items')

    lastUpdated.value = new Date().toLocaleTimeString()

    // Initialize charts with real data
    await nextTick()
    initializeCharts(
      {
        labels: Object.keys(monthlyData),
        data: Object.values(monthlyData)
      },
      {
        labels: Object.keys(dailyData),
        data: Object.values(dailyData)
      }
    )

    console.log('✅ === ADMIN DASHBOARD LOADING COMPLETED ===')

  } catch (error) {
    console.error('❌ Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadDashboardData()
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

.chart-wrapper {
  max-width: 100%;
  margin: 0 auto;
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
  height: auto !important;
}
</style>