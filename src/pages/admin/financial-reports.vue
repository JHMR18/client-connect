<template>
  <AdminLayout>
    <v-container fluid class="pa-6">
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-8">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Financial Reports</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Overview of financial performance and revenue
          </p>
        </div>
        
        <div class="d-flex gap-4" style="width: 300px">
          <v-select
            v-model="selectedYear"
            :items="availableYears"
            label="Year"
            variant="outlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-calendar"
            @update:model-value="processData"
          />
        </div>
      </div>

      <!-- Summary Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card class="stat-card stat-card-revenue" elevation="2">
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar color="success" size="48" class="me-3" style="background: rgba(76, 175, 80, 0.1) !important;">
                  <v-icon size="24" color="success">mdi-cash-multiple</v-icon>
                </v-avatar>
                <div>
                  <p class="text-body-2 text-medium-emphasis mb-1">Total Revenue ({{ selectedYear }})</p>
                  <h3 class="text-h4 font-weight-bold">₱{{ totalRevenue.toLocaleString() }}</h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="stat-card" elevation="2">
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar color="primary" size="48" class="me-3" style="background: rgba(33, 150, 243, 0.1) !important;">
                  <v-icon size="24" color="primary">mdi-bank-transfer</v-icon>
                </v-avatar>
                <div>
                  <p class="text-body-2 text-medium-emphasis mb-1">Total Transactions</p>
                  <h3 class="text-h4 font-weight-bold">{{ totalTransactions }}</h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="stat-card" elevation="2">
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar color="info" size="48" class="me-3" style="background: rgba(3, 169, 244, 0.1) !important;">
                  <v-icon size="24" color="info">mdi-chart-line</v-icon>
                </v-avatar>
                <div>
                  <p class="text-body-2 text-medium-emphasis mb-1">Avg. Monthly Revenue</p>
                  <h3 class="text-h4 font-weight-bold">₱{{ avgMonthlyRevenue.toLocaleString() }}</h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts Row -->
      <v-row class="mb-6">
        <v-col cols="12" md="8">
          <v-card class="fill-height" elevation="2">
            <v-card-title>Monthly Revenue</v-card-title>
            <v-card-text>
              <div style="height: 350px; position: relative">
                <canvas ref="revenueChart"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card class="fill-height" elevation="2">
            <v-card-title>Payment Methods</v-card-title>
            <v-card-text>
              <div style="height: 350px; position: relative">
                <canvas ref="methodChart"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Detailed Table -->
      <v-card elevation="2">
        <v-card-title>Monthly Breakdown</v-card-title>
        <v-data-table
          :headers="headers"
          :items="monthlyBreakdown"
          :loading="loading"
          class="elevation-0"
        >
          <template #item.revenue="{ item }">
            <span class="font-weight-bold">₱{{ item.revenue.toLocaleString() }}</span>
          </template>
          
          <template #item.avgTransaction="{ item }">
            ₱{{ item.avgTransaction.toLocaleString() }}
          </template>

          <template #item.growth="{ item }">
            <v-chip
              :color="item.growth >= 0 ? 'success' : 'error'"
              size="small"
              variant="tonal"
            >
              <v-icon start size="small">
                {{ item.growth >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
              </v-icon>
              {{ Math.abs(item.growth).toFixed(1) }}%
            </v-chip>
          </template>
        </v-data-table>
      </v-card>

    </v-container>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { client } from '@/utils/useDirectus'
import { readItems } from '@directus/sdk'
import Chart from 'chart.js/auto'

// Refs
const loading = ref(false)
const payments = ref<any[]>([])
const revenueChart = ref<HTMLCanvasElement | null>(null)
const methodChart = ref<HTMLCanvasElement | null>(null)
let revenueChartInstance: Chart | null = null
let methodChartInstance: Chart | null = null

// Date handling
const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const availableYears = computed(() => {
  const years = [currentYear]
  // Add previous years if needed logic
  years.push(currentYear - 1)
  return years.sort((a, b) => b - a)
})

// Metrics
const totalRevenue = ref(0)
const totalTransactions = ref(0)
const avgMonthlyRevenue = ref(0)
const monthlyBreakdown = ref<any[]>([])

// Table headers
const headers = [
  { title: 'Month', key: 'monthName' },
  { title: 'Transactions', key: 'transactionCount' },
  { title: 'Avg. Payment', key: 'avgTransaction' },
  { title: 'Revenue', key: 'revenue' },
  { title: 'Growth', key: 'growth' },
]

// Fetch data
const fetchData = async () => {
  loading.value = true
  try {
    const response = await client.request(
        readItems('payments', {
            fields: ['amount_paid', 'payment_date', 'payment_method'],
            limit: -1,
            sort: ['payment_date']
        })
    )
    payments.value = response
    processData()
  } catch (error) {
    console.error('Error fetching financial data:', error)
  } finally {
    loading.value = false
  }
}

// Process data for charts and tables
const processData = () => {
  if (!payments.value.length) return

  // Filter by selected year
  const yearPayments = payments.value.filter(p => {
    return new Date(p.payment_date).getFullYear() === selectedYear.value
  })

  // 1. Calculate Summary Metrics
  totalRevenue.value = yearPayments.reduce((sum, p) => sum + (p.amount_paid || 0), 0)
  totalTransactions.value = yearPayments.length
  
  // 2. monthly aggregation
  const monthlyData = new Array(12).fill(0).map(() => ({ revenue: 0, count: 0 }))
  
  yearPayments.forEach(p => {
    const month = new Date(p.payment_date).getMonth()
    monthlyData[month].revenue += (p.amount_paid || 0)
    monthlyData[month].count++
  })

  const activeMonths = monthlyData.filter(m => m.revenue > 0).length
  avgMonthlyRevenue.value = activeMonths > 0 ? Math.round(totalRevenue.value / activeMonths) : 0

  // 3. Prepare Table Data
  monthlyBreakdown.value = monthlyData.map((data, index) => {
    const prevRevenue = index > 0 ? monthlyData[index - 1].revenue : 0
    let growth = 0
    
    if (prevRevenue > 0) {
        growth = ((data.revenue - prevRevenue) / prevRevenue) * 100
    } else if (index > 0 && data.revenue > 0) {
        growth = 100 // From 0 to something
    }

    return {
        monthName: new Date(2024, index).toLocaleString('default', { month: 'long' }),
        transactionCount: data.count,
        revenue: data.revenue,
        avgTransaction: data.count > 0 ? Math.round(data.revenue / data.count) : 0,
        growth: growth
    }
  })

  // 4. Update Charts
  updateCharts(monthlyData, yearPayments)
}

const updateCharts = (monthlyData: any[], yearPayments: any[]) => {
  // Revenue Chart
  if (revenueChart.value) {
    if (revenueChartInstance) revenueChartInstance.destroy()
    
    revenueChartInstance = new Chart(revenueChart.value, {
      type: 'bar',
      data: {
        labels: monthlyData.map((_, i) => new Date(2024, i).toLocaleString('default', { month: 'short' })),
        datasets: [{
          label: 'Revenue',
          data: monthlyData.map(d => d.revenue),
          backgroundColor: '#4CAF50',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (val) => '₱' + val.toLocaleString()
                }
            }
        }
      }
    })
  }

  // Payment Methods Chart
  if (methodChart.value) {
      if (methodChartInstance) methodChartInstance.destroy()

      const methods: Record<string, number> = {}
      yearPayments.forEach(p => {
          const method = p.payment_method || 'Unknown'
          methods[method] = (methods[method] || 0) + 1
      })

      methodChartInstance = new Chart(methodChart.value, {
          type: 'doughnut',
          data: {
              labels: Object.keys(methods).map(k => k.toUpperCase().replace('_', ' ')),
              datasets: [{
                  data: Object.values(methods),
                  backgroundColor: ['#2196F3', '#FF9800', '#F44336', '#9C27B0']
              }]
          },
          options: {
              responsive: true,
              plugins: {
                  legend: { position: 'bottom' }
              }
          }
      })
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.stat-card {
  border-left: 4px solid #e0e0e0;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card-revenue {
  border-left-color: #4CAF50;
}
</style>
