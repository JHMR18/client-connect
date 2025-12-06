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
                  <div class="text-h3 font-weight-bold text-white">{{ upcomingPaymentsCount }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Due This Month</div>
                </div>
                <v-icon size="48" class="text-white opacity-60">mdi-calendar-clock</v-icon>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Data Visualization Dashboard -->
        <v-row>
          <v-col cols="12" lg="8">
            <v-row>
              <!-- Payment History Chart -->
              <v-col cols="12">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon class="me-2">mdi-chart-line</v-icon>
                    Payment History & Trends
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <div style="height: 300px;">
                      <PaymentHistoryChart v-if="chartData" :data="chartData" />
                      <div v-else class="d-flex align-center justify-center h-100">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Loan Status Distribution & Outstanding Balance -->
              <v-col cols="12" md="6">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon class="me-2">mdi-chart-pie</v-icon>
                    Loan Status Overview
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <div style="height: 250px;">
                      <LoanStatusChart v-if="loanStatusData" :data="loanStatusData" />
                      <div v-else class="d-flex align-center justify-center h-100">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon class="me-2">mdi-progress-clock</v-icon>
                    Outstanding Balances
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <div v-if="loanProgress.length > 0" class="py-2">
                      <div
                        v-for="loan in loanProgress"
                        :key="loan.id"
                        class="mb-4"
                      >
                        <div class="d-flex justify-space-between align-center mb-2">
                          <span class="text-subtitle-2">{{ loan.business_name || 'Loan #' + loan.id.slice(-6) }}</span>
                          <span class="text-caption text-medium-emphasis">₱{{ formatNumber(loan.remaining_balance) }}</span>
                        </div>
                        <v-progress-linear
                          :model-value="loan.progress_percentage"
                          :color="getProgressColor(loan.progress_percentage)"
                          height="8"
                          rounded
                        >
                          <template #default="{ value }">
                            <strong>{{ Math.ceil(value) }}%</strong>
                          </template>
                        </v-progress-linear>
                        <div class="text-caption text-medium-emphasis mt-1">
                          ₱{{ formatNumber(loan.total_paid) }} paid of ₱{{ formatNumber(loan.principal_amount) }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center py-8">
                      <v-icon size="48" class="text-disabled mb-2">mdi-progress-clock</v-icon>
                      <p class="text-body-2 text-disabled">No active loans</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" lg="4">
            <v-row>
              <!-- Payment Completion Rate -->
              <v-col cols="12">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon class="me-2">mdi-chart-donut</v-icon>
                    Payment Performance
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <div class="text-center py-4">
                      <div style="position: relative; display: inline-block;">
                        <v-progress-circular
                          :model-value="paymentCompletionRate"
                          :size="120"
                          :width="12"
                          color="success"
                          class="progress-ring"
                        >
                          <div class="text-center">
                            <div class="text-h4 font-weight-bold">{{ paymentCompletionRate }}%</div>
                            <div class="text-caption text-medium-emphasis">Complete</div>
                          </div>
                        </v-progress-circular>
                      </div>
                      <div class="mt-4">
                        <div class="text-subtitle-2">Payment Summary</div>
                        <div class="text-body-2 text-medium-emphasis">
                          {{ onTimePayments }} on-time payments
                        </div>
                        <div class="text-body-2 text-medium-emphasis">
                          {{ totalPayments }} total payments
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Upcoming Payments -->
              <v-col cols="12">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon class="me-2">mdi-calendar-clock</v-icon>
                    Upcoming Payments
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <div v-if="upcomingPayments.length > 0">
                      <v-list density="compact">
                        <v-list-item
                          v-for="payment in upcomingPayments.slice(0, 5)"
                          :key="payment.id"
                          class="px-0"
                        >
                          <template #prepend>
                            <v-icon
                              :color="getUrgencyColor(payment)"
                              size="20"
                            >
                              mdi-calendar
                            </v-icon>
                          </template>
                          <v-list-item-title class="text-body-2">
                            {{ formatDate(payment.due_date) }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            ₱{{ formatNumber(payment.amount_due) }}
                          </v-list-item-subtitle>
                          <template #append>
                            <v-chip
                              :color="getUrgencyColor(payment)"
                              size="x-small"
                              variant="elevated"
                            >
                              {{ getDaysUntilDue(payment.due_date) }} days
                            </v-chip>
                          </template>
                        </v-list-item>
                      </v-list>
                    </div>
                    <div v-else class="text-center py-6">
                      <v-icon size="40" class="text-disabled mb-2">mdi-calendar-check</v-icon>
                      <p class="text-body-2 text-disabled">No upcoming payments</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Quick Actions -->
              <v-col cols="12">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon class="me-2">mdi-lightning-bolt</v-icon>
                    Quick Actions
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-2">
                    <v-row dense>
                      <v-col cols="6">
                        <v-btn
                          variant="outlined"
                          block
                          height="60"
                          class="d-flex flex-column"
                          @click="$router.push('/client/apply')"
                        >
                          <v-icon size="20" class="mb-1">mdi-file-document-plus</v-icon>
                          <span class="text-caption">New Loan</span>
                        </v-btn>
                      </v-col>
                      <v-col cols="6">
                        <v-btn
                          variant="outlined"
                          block
                          height="60"
                          class="d-flex flex-column"
                          @click="$router.push('/client/payments')"
                        >
                          <v-icon size="20" class="mb-1">mdi-credit-card</v-icon>
                          <span class="text-caption">Pay Now</span>
                        </v-btn>
                      </v-col>
                      <v-col cols="6">
                        <v-btn
                          variant="outlined"
                          block
                          height="60"
                          class="d-flex flex-column"
                          @click="$router.push('/client/loans')"
                        >
                          <v-icon size="20" class="mb-1">mdi-file-document-multiple</v-icon>
                          <span class="text-caption">My Loans</span>
                        </v-btn>
                      </v-col>
                      <v-col cols="6">
                        <v-btn
                          variant="outlined"
                          block
                          height="60"
                          class="d-flex flex-column"
                          @click="$router.push('/client/profile')"
                        >
                          <v-icon size="20" class="mb-1">mdi-account-edit</v-icon>
                          <span class="text-caption">Profile</span>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/utils/useAuth'
import { useDashboardStats, useLoanApplications, usePayments } from '@/utils/useSmartLoanApi'
import { getCurrentUser, client } from '@/utils/useDirectus'
import { readItems } from '@directus/sdk'
import PaymentHistoryChart from '@/components/charts/PaymentHistoryChart.vue'
import LoanStatusChart from '@/components/charts/LoanStatusChart.vue'

// Types for the dashboard data
interface LoanProgress {
  id: string
  business_name?: string
  remaining_balance: number
  progress_percentage: number
  total_paid: number
  principal_amount: number
}

interface UpcomingPayment {
  id: string
  due_date: string
  amount_due: number
  daysUntilDue: number
}

interface PaymentHistoryChart {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    tension: number
    fill: boolean
  }>
}

interface LoanStatusChart {
  labels: string[]
  datasets: Array<{
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }>
}

const router = useRouter()
const { logout } = useAuth()
const { getClientStats } = useDashboardStats()
const { getApplications } = useLoanApplications()
const { getPayments } = usePayments()

const drawer = ref(true)
const loading = ref(true)

// Reactive data for charts
const chartData = ref<PaymentHistoryChart | null>(null)
const loanStatusData = ref<LoanStatusChart | null>(null)
const loanProgress = ref<LoanProgress[]>([])
const upcomingPayments = ref<any[]>([])
const upcomingPaymentsCount = ref(0)
const totalLoans = ref(0)
const totalBalance = ref(0)
const pendingApplications = ref(0)
const paymentCompletionRate = ref(0)
const onTimePayments = ref(0)
const totalPayments = ref(0)

// Computed properties
const hasChartData = computed(() => chartData.value || loanStatusData.value)

// Load dashboard data
const loadDashboardData = async () => {
  try {
    loading.value = true
    console.log('🔵 === DASHBOARD DATA LOADING STARTED ===')

    // Get current authenticated user
    const currentUser = await getCurrentUser()
    console.log('🔵 Current user:', currentUser)
    
    if (!currentUser || !currentUser.id) {
      console.error('❌ No authenticated user found')
      return
    }

    const userId = currentUser.id
    console.log('🔵 User ID:', userId)

    // Fetch loans directly from database
    console.log('🔵 Fetching loans for user:', userId)
    const loans = await client.request(
      readItems('loan', {
        filter: {
          client: { _eq: userId }
        },
        fields: ['*']
      })
    )

    console.log('✅ Fetched loans:', loans)
    console.log('✅ Number of loans:', loans.length)
    if (loans.length > 0) {
      console.log('✅ First loan structure:', loans[0])
      console.log('✅ Loan statuses:', loans.map((l: any) => l.status))
    }

    // Calculate statistics
    const activeLoansArray = loans.filter((l: any) => l.status === 'active' || l.status === 'approved')
    const pendingLoansArray = loans.filter((l: any) => l.status === 'pending')
    
    console.log('📊 Active/Approved loans:', activeLoansArray.length, activeLoansArray)
    console.log('📊 Pending loans:', pendingLoansArray.length, pendingLoansArray)
    
    totalLoans.value = activeLoansArray.length
    pendingApplications.value = pendingLoansArray.length
    
    // Calculate total outstanding balance
    const calculatedBalance = activeLoansArray.reduce((sum: number, l: any) => {
      const amount = l.principal_amount || 0
      console.log('  Adding loan amount:', amount, 'Current sum:', sum)
      return sum + amount
    }, 0)
    
    console.log('💰 Total outstanding balance:', calculatedBalance)
    totalBalance.value = calculatedBalance

    // Loan status distribution for pie chart
    const statusCounts = loans.reduce((acc: any, loan: any) => {
      acc[loan.status] = (acc[loan.status] || 0) + 1
      return acc
    }, {})

    console.log('📊 Status counts:', statusCounts)

    if (Object.keys(statusCounts).length > 0) {
      const chartLabels = Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1))
      const chartData = Object.values(statusCounts)
      console.log('📊 Loan status chart - Labels:', chartLabels, 'Data:', chartData)
      
      loanStatusData.value = {
        labels: chartLabels,
        datasets: [{
          data: chartData,
          backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0', '#607D8B'],
          borderColor: ['#fff'],
          borderWidth: 2
        }]
      }
      console.log('✅ Loan status chart data set:', loanStatusData.value)
    } else {
      console.log('⚠️ No loan status data available')
    }

    // Fetch payments
    console.log('🔵 Fetching payments...')
    let payments: any[] = []
    
    try {
      payments = await client.request(
        readItems('payments', {
          filter: {
            loan: { _in: loans.map((l: any) => l.id) }
          },
          sort: ['-payment_date'],
          fields: ['*']
        })
      )
      console.log('✅ Fetched payments:', payments)
      console.log('✅ Number of payments:', payments.length)
      if (payments.length > 0) {
        console.log('✅ First payment structure:', payments[0])
      }
    } catch (paymentError) {
      console.error('❌ Error fetching payments:', paymentError)
      payments = []
    }

    // Generate payment history chart (last 6 months)
    console.log('🔵 Generating payment history chart...')
    const monthlyData: Record<string, number> = {}
    const now = new Date()
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      monthlyData[key] = 0
    }
    console.log('📅 Initialized months:', Object.keys(monthlyData))

    // Aggregate payments by month
    payments.forEach((payment: any) => {
      const paymentDate = new Date(payment.payment_date)
      const key = paymentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const amount = payment.amount_paid || 0
      
      if (monthlyData.hasOwnProperty(key)) {
        console.log(`  Adding payment: ${amount} to ${key}`)
        monthlyData[key] += amount
      }
    })

    console.log('📊 Monthly payment data:', monthlyData)

    chartData.value = {
      labels: Object.keys(monthlyData),
      datasets: [{
        label: 'Monthly Payments',
        data: Object.values(monthlyData),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        tension: 0.4,
        fill: true
      }]
    }
    console.log('✅ Payment history chart data set:', chartData.value)

    // Fetch amortization schedule for upcoming payments
    console.log('🔵 Fetching amortization schedules...')
    let schedules: any[] = []
    
    try {
      schedules = await client.request(
        readItems('amortization_schedule', {
          filter: {
            loan: { _in: loans.map((l: any) => l.id) },
            status: { _in: ['upcoming', 'overdue'] }
          },
          sort: ['due_date'],
          limit: 10,
          fields: ['*']
        })
      )
      console.log('✅ Fetched schedules:', schedules)
      console.log('✅ Number of schedules:', schedules.length)
    } catch (scheduleError) {
      console.error('❌ Error fetching schedules:', scheduleError)
      schedules = []
    }

    // Set upcoming payments list and count for this month
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()
    
    upcomingPayments.value = schedules.map((s: any) => ({
      id: s.id,
      due_date: s.due_date,
      amount_due: s.amount_due,
      daysUntilDue: calculateDaysUntilDue(s.due_date)
    }))
    
    const thisMonthPayments = schedules.filter((s: any) => {
      const dueDate = new Date(s.due_date)
      return dueDate.getMonth() === thisMonth && dueDate.getFullYear() === thisYear
    })
    
    upcomingPaymentsCount.value = thisMonthPayments.length
    console.log('📅 Upcoming payments this month:', upcomingPaymentsCount.value, thisMonthPayments)

    // Loan progress data (outstanding balances)
    console.log('🔵 Calculating loan progress...')
    loanProgress.value = await Promise.all(
      activeLoansArray.map(async (loan: any) => {
        // Get total paid for this loan
        const loanPayments = payments.filter((p: any) => p.loan === loan.id)
        const totalPaid = loanPayments.reduce((sum: number, p: any) => sum + (p.amount_paid || 0), 0)
        
        const principal = loan.principal_amount || 0
        const progress = principal > 0 ? Math.min(100, Math.round((totalPaid / principal) * 100)) : 0
        
        console.log(`  Loan ${loan.id}: Principal=${principal}, Paid=${totalPaid}, Progress=${progress}%`)
        
        return {
          id: loan.id,
          business_name: loan.business_name || `Loan #${String(loan.id).substring(0, 8)}`,
          remaining_balance: Math.max(0, principal - totalPaid),
          progress_percentage: progress,
          total_paid: totalPaid,
          principal_amount: principal
        }
      })
    )
    console.log('✅ Loan progress calculated:', loanProgress.value)

    // Payment performance metrics
    totalPayments.value = payments.length
    onTimePayments.value = payments.length // Simplified - count all as on-time
    paymentCompletionRate.value = totalPayments.value > 0
      ? Math.round((onTimePayments.value / totalPayments.value) * 100)
      : 0
    
    console.log('📊 Payment metrics:', {
      totalPayments: totalPayments.value,
      onTimePayments: onTimePayments.value,
      rate: paymentCompletionRate.value
    })

    console.log('✅ === DASHBOARD DATA LOADING COMPLETED ===')
    console.log('📊 Summary:', {
      totalLoans: totalLoans.value,
      totalBalance: totalBalance.value,
      pendingApplications: pendingApplications.value,
      upcomingPaymentsCount: upcomingPaymentsCount.value,
      hasChartData: !!chartData.value,
      hasLoanStatusData: !!loanStatusData.value,
      loanProgressCount: loanProgress.value.length,
      upcomingPaymentsListCount: upcomingPayments.value.length
    })

  } catch (error) {
    console.error('❌ === ERROR LOADING DASHBOARD DATA ===')
    console.error('❌ Error details:', error)
    console.error('❌ Error stack:', (error as Error).stack)
  } finally {
    loading.value = false
  }
}

// Helper functions
const calculateProgress = (loan: any): number => {
  if (!loan.total_amount || !loan.amount_paid) return 0
  return Math.round((loan.amount_paid / loan.total_amount) * 100)
}

const calculateDaysUntilDue = (dueDate: string): number => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const isOnTime = (payment: any): boolean => {
  return new Date(payment.paid_date) <= new Date(payment.due_date)
}

const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return 'success'
  if (percentage >= 50) return 'warning'
  return 'error'
}

const getUrgencyColor = (payment: UpcomingPayment): string => {
  const days = payment.daysUntilDue
  if (days <= 0) return 'error'
  if (days <= 3) return 'warning'
  return 'success'
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(num)
}

// Helper function for template access
const getDaysUntilDue = (dueDate: string): number => {
  return calculateDaysUntilDue(dueDate)
}

// Load data on mount
onMounted(() => {
  loadDashboardData()
})

const handleLogout = async () => {
  await logout()
  router.push('/')
}
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

/* Chart container styling */
:deep(.v-card-text .chart-container) {
  height: 280px !important;
}

/* Progress ring styling */
.progress-ring :deep(.v-progress-circular__overlay) {
  transition: stroke-dashoffset 0.5s ease;
}

/* Quick action buttons styling */
:deep(.v-btn.v-btn--outlined) {
  border: 1px solid rgba(220, 38, 38, 0.3);
  transition: all 0.2s ease;
}

:deep(.v-btn.v-btn--outlined:hover) {
  background-color: rgba(220, 38, 38, 0.05);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 38, 38, 0.1);
}

/* Urgency color styling */
:deep(.v-chip.v-chip--size-x-small) {
  font-weight: 600;
  font-size: 10px;
}

/* Loading states */
:deep(.v-progress-circular) {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>