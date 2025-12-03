<template>
  <AdminLayout>
    <v-container fluid class="pa-6">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-8">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Payment Management</h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              Record daily loan payments and manage payment schedules
            </p>
          </div>

          <v-btn
            color="error"
            prepend-icon="mdi-plus"
            @click="showPaymentDialog = true"
            :disabled="!selectedLoan"
          >
            Record Daily Payment
          </v-btn>
        </div>

        <!-- Summary Cards Removed -->

        <!-- Loan Selector for Payment Recording -->
        <v-card class="mb-6">
          <v-card-title>
            <v-icon class="me-2">mdi-briefcase</v-icon>
            Select Business Loan for Payment Recording
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="selectedLoanId"
                  :items="activeLoans"
                  item-title="display_name"
                  item-value="id"
                  label="Select Business Loan"
                  variant="outlined"
                  prepend-inner-icon="mdi-briefcase"
                  :loading="loadingLoans"
                  @update:model-value="loadLoanSchedule"
                  clearable
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon>mdi-briefcase</v-icon>
                      </template>
                      <template #subtitle>
                        ₱{{ item.raw.principal_amount?.toLocaleString() }} • {{ item.raw.term_days }} days • {{ item.raw.client_name }}
                      </template>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" v-if="selectedLoan">
                <v-card variant="outlined" class="pa-4">
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-subtitle-2">Daily Payment:</span>
                    <span class="text-h6 text-primary font-weight-bold">₱{{ calculateDailyPayment(selectedLoan).toLocaleString() }}</span>
                  </div>
                  <div class="d-flex justify-space-between align-center mt-2">
                    <span class="text-subtitle-2">Total Term:</span>
                    <span class="text-body-2">{{ selectedLoan.term_days }} days</span>
                  </div>
                  <div class="d-flex justify-space-between align-center mt-2">
                    <span class="text-subtitle-2">Client:</span>
                    <span class="text-body-2">{{ selectedLoan.client_name }}</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Daily Payment Schedule -->
        <v-card v-if="selectedLoan" class="mb-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <span>Daily Payment Schedule</span>
              <div class="text-caption text-medium-emphasis">
                {{ selectedLoan.client_name }} • ₱{{ calculateDailyPayment(selectedLoan).toLocaleString() }} per day
              </div>
            </div>
            <div>
              <v-chip color="grey-darken-2" size="small" variant="flat" class="mr-2">
                {{ loanSchedule.length }} Days
              </v-chip>
              <v-btn
                color="error"
                size="small"
                prepend-icon="mdi-cash-plus"
                @click="showPaymentDialog = true"
                :disabled="!selectedLoan"
              >
                Record Payment
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text>
            <!-- Quick Stats -->
            <v-row class="mb-4">
              <v-col cols="12" md="3">
                <div class="text-center pa-3 bg-grey-darken-3 rounded text-white">
                  <div class="text-h4 font-weight-bold">
                    {{ loanSchedule.filter(s => s.status === 'paid').length }}
                  </div>
                  <div class="text-caption">Days Paid</div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-center pa-3 bg-grey-lighten-2 rounded">
                  <div class="text-h4 font-weight-bold">
                    {{ loanSchedule.filter(s => s.status === 'upcoming').length }}
                  </div>
                  <div class="text-caption">Days Remaining</div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-center pa-3 bg-red-lighten-4 rounded">
                  <div class="text-h4 text-error font-weight-bold">
                    {{ loanSchedule.filter(s => s.status === 'overdue').length }}
                  </div>
                  <div class="text-caption">Days Overdue</div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-center pa-3 bg-grey-darken-3 rounded text-white">
                  <div class="text-h4 font-weight-bold">
                    {{ Math.round((loanSchedule.filter(s => s.status === 'paid').length / loanSchedule.length) * 100) }}%
                  </div>
                  <div class="text-caption">Completion Rate</div>
                </div>
              </v-col>
            </v-row>

            <!-- Payment Schedule Table -->
            <v-data-table
              :headers="scheduleHeaders"
              :items="loanSchedule"
              :loading="loadingSchedule"
              item-value="id"
              class="elevation-0"
              :items-per-page="14"
            >
              <!-- Period (Day #) -->
              <template #item.period="{ item }">
                <div class="d-flex align-center">
                  <span class="font-weight-medium">Day {{ item.period }}</span>
                  <v-chip
                    v-if="item.is_weekend"
                    size="x-small"
                    color="orange"
                    variant="tonal"
                    class="ml-2"
                  >
                    Weekend
                  </v-chip>
                </div>
              </template>

              <!-- Due Date -->
              <template #item.due_date="{ item }">
                <div>
                  {{ formatDate(item.due_date) }}
                  <div class="text-caption" :class="item.is_weekend ? 'text-orange' : 'text-medium-emphasis'">
                    {{ getDayName(item.due_date) }}
                  </div>
                </div>
              </template>

              <!-- Daily Payment -->
              <template #item.amount_due="{ item }">
                <div class="font-weight-medium">
                  ₱{{ item.amount_due?.toLocaleString() || 0 }}
                </div>
              </template>

              <!-- Amount Paid -->
              <template #item.amount_paid="{ item }">
                <span v-if="item.amount_paid != null && item.amount_paid > 0" class="text-success font-weight-medium">
                  ₱{{ item.amount_paid.toLocaleString() }}
                </span>
                <span v-else class="text-medium-emphasis">—</span>
              </template>

              <!-- Status -->
              <template #item.status="{ item }">
                <v-chip :color="getScheduleStatusColor(item.status)" size="small" variant="flat">
                  {{ item.status }}
                </v-chip>
              </template>

              <!-- Actions -->
              <template #item.actions="{ item }">
                <v-btn
                  v-if="item.status === 'upcoming' || item.status === 'overdue'"
                  color="error"
                  size="small"
                  variant="tonal"
                  @click="recordPaymentForDay(item)"
                >
                  <v-icon start>mdi-cash</v-icon>
                  Pay Day {{ item.period }}
                </v-btn>
                <v-chip v-else color="grey-darken-2" size="small" variant="flat">
                  <v-icon start size="small">mdi-check</v-icon>
                  Paid
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <!-- Payment History Table -->
        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-history</v-icon>
            Recent Daily Payments
          </v-card-title>
          <v-card-text>
            <!-- Filters for payment history -->
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  label="Search by client name or receipt"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.paymentMethod"
                  :items="paymentMethods"
                  label="Payment Method"
                  variant="outlined"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.dateFrom"
                  label="From Date"
                  type="date"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.dateTo"
                  label="To Date"
                  type="date"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <!-- Payment History Table -->
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="paymentHeaders"
              :items="filteredPayments"
              :loading="loading"
              item-value="id"
              class="payment-table"
            >
              <!-- Client name -->
              <template #item.client_name="{ item }">
                <div class="font-weight-medium">{{ item.client_name }}</div>
              </template>

              <!-- Amount formatting -->
              <template #item.amount_paid="{ item }">
                <span class="font-weight-bold text-grey-darken-3">
                  ₱{{ item.amount_paid.toLocaleString() }}
                </span>
              </template>

              <!-- Payment method chip -->
              <template #item.payment_method="{ item }">
                <v-chip
                  :color="getPaymentMethodColor(item.payment_method)"
                  size="small"
                  variant="flat"
                >
                  {{ item.payment_method.toUpperCase() }}
                </v-chip>
              </template>

              <!-- Date formatting -->
              <template #item.payment_date="{ item }">
                {{ formatDate(item.payment_date) }}
              </template>

              <!-- Actions -->
              <template #item.actions="{ item }">
                <div class="d-flex gap-2">
                  <v-btn
                    color="primary"
                    size="small"
                    variant="tonal"
                    @click="viewReceipt(item)"
                  >
                    <v-icon>mdi-receipt</v-icon>
                  </v-btn>
                </div>
              </template>

              <!-- No data -->
              <template #no-data>
                <div class="text-center pa-8">
                  <v-icon size="64" class="text-disabled mb-4">mdi-credit-card-off</v-icon>
                  <p class="text-h6 text-disabled">No payments found</p>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>

    <!-- Record Payment Dialog -->
    <v-dialog v-model="showPaymentDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>
          <v-icon class="me-2" color="success">mdi-cash-plus</v-icon>
          Record Daily Payment
        </v-card-title>

        <v-form ref="paymentFormRef" @submit.prevent="recordPayment">
          <v-card-text>
            <v-alert type="info" variant="tonal" class="mb-4" v-if="selectedSchedule">
              <div class="d-flex justify-space-between align-center">
                <span><strong>Day {{ selectedSchedule.period }}:</strong> {{ formatDate(selectedSchedule.due_date) }}</span>
                <strong>Due: ₱{{ selectedSchedule.amount_due?.toLocaleString() }}</strong>
              </div>
            </v-alert>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.number="paymentFormData.amount"
                  label="Payment Amount (₱)"
                  type="number"
                  step="0.01"
                  variant="outlined"
                  prepend-inner-icon="mdi-cash"
                  :hint="selectedSchedule ? `Daily amount due: ₱${selectedSchedule.amount_due?.toLocaleString() || 0}` : 'Enter payment amount'"
                  persistent-hint
                  :rules="[
                    v => !!v || 'Amount is required',
                    v => v > 0 || 'Amount must be positive'
                  ]"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="paymentFormData.paymentMethod"
                  :items="paymentMethods"
                  label="Payment Method"
                  variant="outlined"
                  prepend-inner-icon="mdi-credit-card"
                  :rules="[v => !!v || 'Payment method is required']"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="paymentFormData.receiptNumber"
                  label="Receipt Number"
                  variant="outlined"
                  prepend-inner-icon="mdi-receipt"
                  :rules="[v => !!v || 'Receipt number is required']"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="paymentFormData.notes"
                  label="Notes (Optional)"
                  variant="outlined"
                  rows="3"
                  placeholder="Any additional notes about this payment..."
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn @click="closePaymentDialog">Cancel</v-btn>
            <v-btn
              type="submit"
              color="success"
              :loading="recording"
            >
              Record Payment
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { client } from '@/utils/useDirectus'
import { readItems, createItem, updateItem } from '@directus/sdk'

// Data refs
const loading = ref(false)
const recording = ref(false)
const showPaymentDialog = ref(false)
const loadingLoans = ref(false)
const loadingSchedule = ref(false)
const searchQuery = ref('')
const itemsPerPage = ref(15)
const paymentFormRef = ref()

// Summary data
const totalCollectedToday = ref(0)
const paymentsToday = ref(0)
const overdueAccounts = ref(0)
const activeLoansCount = ref(0)

// Filters
const filters = ref({
  paymentMethod: null,
  dateFrom: null,
  dateTo: null
})

// Form data
const paymentFormData = ref({
  amount: null as number | null,
  paymentMethod: 'cash',
  receiptNumber: '',
  notes: ''
})

// Loan and schedule refs
const selectedLoanId = ref<string | null>(null)
const selectedLoan = ref<any>(null)
const selectedSchedule = ref<any>(null)
const activeLoans = ref<any[]>([])
const loanSchedule = ref<any[]>([])
const payments = ref<any[]>([])

// Constants
const paymentMethods = ['cash', 'bank_transfer', 'gcash']

// Table headers
const scheduleHeaders = [
  { title: 'Day #', key: 'period', sortable: false },
  { title: 'Date', key: 'due_date' },
  { title: 'Daily Payment', key: 'amount_due' },
  { title: 'Amount Paid', key: 'amount_paid' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const paymentHeaders = [
  { title: 'Client', key: 'client_name' },
  { title: 'Amount', key: 'amount_paid' },
  { title: 'Payment Method', key: 'payment_method' },
  { title: 'Receipt #', key: 'receipt_number' },
  { title: 'Date', key: 'payment_date' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Computed properties
const filteredPayments = computed(() => {
  let filtered = payments.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(payment =>
      payment.client_name?.toLowerCase().includes(query) ||
      payment.receipt_number?.toLowerCase().includes(query)
    )
  }

  if (filters.value.paymentMethod) {
    filtered = filtered.filter(payment => payment.payment_method === filters.value.paymentMethod)
  }

  if (filters.value.dateFrom) {
    filtered = filtered.filter(payment => payment.payment_date >= filters.value.dateFrom)
  }

  if (filters.value.dateTo) {
    filtered = filtered.filter(payment => payment.payment_date <= filters.value.dateTo)
  }

  return filtered
})

// Helper functions
const calculateDailyPayment = (loan: any) => {
  const principal = loan.principal_amount || 0
  const termDays = loan.term_days || 0
  return termDays > 0 ? Math.round(principal / termDays) : 0
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getDayName = (date: string) => {
  if (!date) return ''
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[new Date(date).getDay()]
}

const getScheduleStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    paid: 'success',
    upcoming: 'info',
    overdue: 'error'
  }
  return colors[status] || 'grey'
}

const getPaymentMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    cash: 'grey-darken-2',
    bank_transfer: 'grey-lighten-2',
    gcash: 'grey-darken-3'
  }
  return colors[method] || 'grey'
}

// Generate daily amortization schedule
const generateDailySchedule = (loan: any) => {
  const principal = loan.principal_amount || 0
  const termDays = loan.term_days || 0

  if (termDays === 0) return []

  const dailyPayment = Math.round(principal / termDays)
  const schedule = []
  const startDate = new Date(loan.approval_date || loan.application_date)

  for (let day = 1; day <= termDays; day++) {
    const dueDate = new Date(startDate)
    dueDate.setDate(dueDate.getDate() + day)

    const dayOfWeek = dueDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    schedule.push({
      period: day,
      due_date: dueDate.toISOString().split('T')[0],
      amount_due: dailyPayment,
      amount_paid: 0,
      status: 'upcoming',
      loan: loan.id,
      is_weekend: isWeekend
    })
  }

  return schedule
}

// API functions
const loadActiveLoans = async () => {
  loadingLoans.value = true
  try {
    const loans = await client.request(
      readItems('loan', {
        filter: {
          status: { _in: ['active', 'approved'] }
        },
        fields: ['*', 'client.*']
      })
    )

    activeLoans.value = loans.map((loan: any) => ({
      ...loan,
      display_name: `${loan.client?.first_name || 'Unknown'} ${loan.client?.last_name || ''} - ₱${loan.principal_amount?.toLocaleString()}`,
      client_name: `${loan.client?.first_name || 'Unknown'} ${loan.client?.last_name || ''}`
    }))

    activeLoansCount.value = loans.length
    overdueAccounts.value = 0 // Would calculate from actual schedule data

  } catch (error) {
    console.error('Error loading loans:', error)
  } finally {
    loadingLoans.value = false
  }
}

const loadLoanSchedule = async () => {
  if (!selectedLoanId.value) return

  loadingSchedule.value = true
  try {
    // Get selected loan
    selectedLoan.value = activeLoans.value.find(l => l.id === selectedLoanId.value)
    if (!selectedLoan.value) return

    // Load or generate schedule
    let schedule = await client.request(
      readItems('amortization_schedule', {
        filter: {
          loan: { _eq: selectedLoanId.value }
        },
        sort: ['due_date']
      })
    )

    // If no schedule exists, generate it
    if (schedule.length === 0) {
      const generatedSchedule = generateDailySchedule(selectedLoan.value)

      for (const item of generatedSchedule) {
        await client.request(createItem('amortization_schedule', item))
      }

      // Reload schedule
      schedule = await client.request(
        readItems('amortization_schedule', {
          filter: {
            loan: { _eq: selectedLoanId.value }
          },
          sort: ['due_date']
        })
      )
    }

    // Update overdue status
    const today = new Date()
    schedule = schedule.map((item: any) => {
      const dueDate = new Date(item.due_date)
      if (item.status === 'upcoming' && dueDate < today) {
        return { ...item, status: 'overdue' }
      }
      return item
    })

    loanSchedule.value = schedule
  } catch (error) {
    console.error('Error loading schedule:', error)
  } finally {
    loadingSchedule.value = false
  }
}

const loadPayments = async () => {
  loading.value = true
  try {
    const paymentRecords = await client.request(
      readItems('payments', {
        fields: ['*', 'loan.client.*'],
        sort: ['-payment_date']
      })
    )

    payments.value = paymentRecords.map((payment: any) => ({
      ...payment,
      client_name: payment.loan?.client
        ? `${payment.loan.client.first_name} ${payment.loan.client.last_name}`
        : 'Unknown Client'
    }))

    // Calculate today's statistics
    const today = new Date().toISOString().split('T')[0]
    const todayPayments = paymentRecords.filter(p => p.payment_date === today)

    totalCollectedToday.value = todayPayments.reduce((sum, p) => sum + (p.amount_paid || 0), 0)
    paymentsToday.value = todayPayments.length

  } catch (error) {
    console.error('Error loading payments:', error)
  } finally {
    loading.value = false
  }
}

const recordPaymentForDay = (scheduleItem: any) => {
  selectedSchedule.value = scheduleItem
  paymentFormData.value = {
    ...paymentFormData.value,
    amount: scheduleItem.amount_due
  }
  showPaymentDialog.value = true
}

const recordPayment = async () => {
  const form = paymentFormRef.value
  if (!form || !selectedLoan.value || !selectedSchedule.value) return

  const { valid } = await form.validate()
  if (!valid) return

  recording.value = true

  try {
    const amountPaid = paymentFormData.value.amount || 0
    const amountDue = selectedSchedule.value.amount_due || 0

    // Create payment record
    await client.request(
      createItem('payments', {
        loan: selectedLoan.value.id,
        payment_date: new Date().toISOString().split('T')[0],
        amount_paid: amountPaid,
        payment_method: paymentFormData.value.paymentMethod,
        receipt_number: paymentFormData.value.receiptNumber,
        notes: paymentFormData.value.notes
      })
    )

    // Update schedule status
    if (amountPaid >= amountDue) {
      // Full payment
      await client.request(
        updateItem('amortization_schedule', selectedSchedule.value.id, {
          status: 'paid',
          amount_paid: amountDue
        })
      )
    } else {
      // Partial payment
      const newAmountDue = amountDue - amountPaid
      await client.request(
        updateItem('amortization_schedule', selectedSchedule.value.id, {
          amount_due: newAmountDue,
          amount_paid: amountPaid
        })
      )
    }

    // Refresh data
    await loadLoanSchedule()
    await loadPayments()

    // Check if loan is fully paid
    const allPaid = loanSchedule.value.every(item => item.status === 'paid')
    if (allPaid) {
      await client.request(
        updateItem('loan', selectedLoan.value.id, {
          fully_paid: true
        })
      )
      // Refresh active loans list to reflect changes (e.g. might move out of active list if we filter by fully_paid)
      await loadActiveLoans()
      alert(`Loan fully paid!`)
    }

    closePaymentDialog()
    alert(`Payment of ₱${amountPaid.toLocaleString()} recorded successfully!`)
  } catch (error) {
    console.error('Error recording payment:', error)
    alert('Error recording payment. Please try again.')
  } finally {
    recording.value = false
  }
}

const closePaymentDialog = () => {
  showPaymentDialog.value = false
  selectedSchedule.value = null
  paymentFormData.value = {
    amount: null,
    paymentMethod: 'cash',
    receiptNumber: '',
    notes: ''
  }
}

const viewReceipt = (payment: any) => {
  console.log('View receipt:', payment)
  alert(`Receipt #${payment.receipt_number} for ₱${payment.amount_paid.toLocaleString()}`)
}

onMounted(async () => {
  await Promise.all([
    loadActiveLoans(),
    loadPayments()
  ])
})
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.payment-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(76, 175, 80, 0.05);
}
</style>