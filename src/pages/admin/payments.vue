<template>
  <AdminLayout>
    <v-container fluid class="pa-6">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-8">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">Payment Management</h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              Record and track loan payments
            </p>
          </div>

          <v-btn
            color="success"
            prepend-icon="mdi-plus"
            @click="showPaymentDialog = true"
          >
            Record Payment
          </v-btn>
        </div>

        <!-- Summary Cards -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card" color="success" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h4 font-weight-bold text-white">₱{{ totalCollectedToday.toLocaleString() }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Today's Collections</div>
                </div>
                <v-icon size="40" class="text-white opacity-60">mdi-cash-multiple</v-icon>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card" color="info" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h4 font-weight-bold text-white">{{ paymentsToday }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Payments Today</div>
                </div>
                <v-icon size="40" class="text-white opacity-60">mdi-credit-card</v-icon>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card" color="warning" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h4 font-weight-bold text-white">{{ overdueAccounts }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Overdue Accounts</div>
                </div>
                <v-icon size="40" class="text-white opacity-60">mdi-alert-circle</v-icon>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" lg="3">
            <v-card class="stat-card" color="primary" variant="flat">
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">
                  <div class="text-h4 font-weight-bold text-white">₱{{ monthlyTarget.toLocaleString() }}</div>
                  <div class="text-subtitle-2 text-white opacity-80">Monthly Target</div>
                </div>
                <v-icon size="40" class="text-white opacity-60">mdi-target</v-icon>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filters -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="searchQuery"
                  label="Search by client name or receipt"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  @input="filterPayments"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.paymentMethod"
                  :items="paymentMethods"
                  label="Payment Method"
                  variant="outlined"
                  clearable
                  @update:model-value="filterPayments"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.dateFrom"
                  label="From Date"
                  type="date"
                  variant="outlined"
                  @update:model-value="filterPayments"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.dateTo"
                  label="To Date"
                  type="date"
                  variant="outlined"
                  @update:model-value="filterPayments"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Payments Table -->
        <v-card>
          <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="filteredPayments"
            :loading="loading"
            item-value="id"
            class="payment-table"
          >
            <!-- Amount formatting -->
            <template #item.amount_paid="{ item }">
              <span class="font-weight-bold text-success">
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

            <!-- Remaining balance -->
            <template #item.remaining_balance="{ item }">
              ₱{{ item.remaining_balance.toLocaleString() }}
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
                <v-btn
                  color="info"
                  size="small"
                  variant="tonal"
                  @click="printReceipt(item)"
                >
                  <v-icon>mdi-printer</v-icon>
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
        </v-card>
      </v-container>

    <!-- Record Payment Dialog -->
    <v-dialog v-model="showPaymentDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>Record Payment</v-card-title>

        <v-form ref="paymentForm" @submit.prevent="recordPayment">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="paymentForm.loanId"
                  :items="activeLoans"
                  item-title="display"
                  item-value="id"
                  label="Select Loan"
                  variant="outlined"
                  :rules="[v => !!v || 'Please select a loan']"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="paymentForm.amount"
                  label="Payment Amount (₱)"
                  type="number"
                  step="0.01"
                  variant="outlined"
                  :rules="[
                    v => !!v || 'Amount is required',
                    v => v > 0 || 'Amount must be positive'
                  ]"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="paymentForm.paymentMethod"
                  :items="paymentMethods"
                  label="Payment Method"
                  variant="outlined"
                  :rules="[v => !!v || 'Payment method is required']"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="paymentForm.receiptNumber"
                  label="Receipt Number"
                  variant="outlined"
                  :rules="[v => !!v || 'Receipt number is required']"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="paymentForm.paymentDate"
                  label="Payment Date"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Payment date is required']"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="paymentForm.notes"
                  label="Notes (Optional)"
                  variant="outlined"
                  rows="3"
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

const loading = ref(false)
const recording = ref(false)
const showPaymentDialog = ref(false)
const searchQuery = ref('')
const itemsPerPage = ref(10)
const paymentForm = ref()

// Summary data
const totalCollectedToday = ref(45000)
const paymentsToday = ref(12)
const overdueAccounts = ref(8)
const monthlyTarget = ref(2000000)

// Filters
const filters = ref({
  paymentMethod: null,
  dateFrom: null,
  dateTo: null
})

// Form data
const paymentFormData = ref({
  loanId: null,
  amount: null,
  paymentMethod: null,
  receiptNumber: '',
  paymentDate: new Date().toISOString().split('T')[0],
  notes: ''
})

// Mock data
const payments = ref([
  {
    id: 'PAY-001',
    loan_id: 'LOAN-001',
    client_name: 'Juan Dela Cruz',
    amount_paid: 5000,
    remaining_balance: 95000,
    payment_method: 'cash',
    receipt_number: 'REC-001',
    payment_date: '2024-01-15',
    notes: 'Monthly payment'
  },
  {
    id: 'PAY-002',
    loan_id: 'LOAN-002',
    client_name: 'Maria Santos',
    amount_paid: 3500,
    remaining_balance: 46500,
    payment_method: 'gcash',
    receipt_number: 'REC-002',
    payment_date: '2024-01-14',
    notes: 'Partial payment'
  },
  {
    id: 'PAY-003',
    loan_id: 'LOAN-003',
    client_name: 'Pedro Garcia',
    amount_paid: 8000,
    remaining_balance: 192000,
    payment_method: 'bank_transfer',
    receipt_number: 'REC-003',
    payment_date: '2024-01-13',
    notes: 'Monthly installment'
  }
])

const activeLoans = ref([
  {
    id: 'LOAN-001',
    display: 'LOAN-001 - Juan Dela Cruz (₱100,000)',
    client_name: 'Juan Dela Cruz',
    remaining_balance: 95000
  },
  {
    id: 'LOAN-002',
    display: 'LOAN-002 - Maria Santos (₱50,000)',
    client_name: 'Maria Santos',
    remaining_balance: 46500
  },
  {
    id: 'LOAN-003',
    display: 'LOAN-003 - Pedro Garcia (₱200,000)',
    client_name: 'Pedro Garcia',
    remaining_balance: 192000
  }
])

const filteredPayments = computed(() => {
  let filtered = payments.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(payment => 
      payment.client_name.toLowerCase().includes(query) ||
      payment.receipt_number.toLowerCase().includes(query)
    )
  }

  if (filters.value.paymentMethod) {
    filtered = filtered.filter(payment => 
      payment.payment_method === filters.value.paymentMethod
    )
  }

  if (filters.value.dateFrom) {
    filtered = filtered.filter(payment => 
      payment.payment_date >= filters.value.dateFrom
    )
  }

  if (filters.value.dateTo) {
    filtered = filtered.filter(payment => 
      payment.payment_date <= filters.value.dateTo
    )
  }

  return filtered
})

// Table configuration
const headers = [
  { title: 'Receipt #', key: 'receipt_number', sortable: true },
  { title: 'Client', key: 'client_name', sortable: true },
  { title: 'Amount', key: 'amount_paid', sortable: true },
  { title: 'Method', key: 'payment_method', sortable: true },
  { title: 'Date', key: 'payment_date', sortable: true },
  { title: 'Balance', key: 'remaining_balance', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' }
]

const paymentMethods = [
  { title: 'Cash', value: 'cash' },
  { title: 'Bank Transfer', value: 'bank_transfer' },
  { title: 'GCash', value: 'gcash' }
]

// Methods
const getPaymentMethodColor = (method: string) => {
  switch (method) {
    case 'cash': return 'success'
    case 'gcash': return 'info' 
    case 'bank_transfer': return 'primary'
    default: return 'secondary'
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const recordPayment = async () => {
  const form = paymentForm.value
  if (!form) return

  const { valid } = await form.validate()
  if (!valid) return

  recording.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Add new payment to list
    const selectedLoan = activeLoans.value.find(loan => loan.id === paymentFormData.value.loanId)
    const newPayment = {
      id: `PAY-${String(payments.value.length + 1).padStart(3, '0')}`,
      loan_id: paymentFormData.value.loanId,
      client_name: selectedLoan?.client_name || 'Unknown',
      amount_paid: paymentFormData.value.amount,
      remaining_balance: (selectedLoan?.remaining_balance || 0) - paymentFormData.value.amount,
      payment_method: paymentFormData.value.paymentMethod,
      receipt_number: paymentFormData.value.receiptNumber,
      payment_date: paymentFormData.value.paymentDate,
      notes: paymentFormData.value.notes
    }

    payments.value.unshift(newPayment)
    closePaymentDialog()
  } catch (error) {
    console.error('Error recording payment:', error)
  } finally {
    recording.value = false
  }
}

const closePaymentDialog = () => {
  showPaymentDialog.value = false
  paymentFormData.value = {
    loanId: null,
    amount: null,
    paymentMethod: null,
    receiptNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  }
}

const viewReceipt = (payment: any) => {
  console.log('View receipt:', payment)
  // Implementation for viewing receipt
}

const printReceipt = (payment: any) => {
  console.log('Print receipt:', payment)
  // Implementation for printing receipt
}

const filterPayments = () => {
  // Trigger reactivity for computed property
}

onMounted(() => {
  loading.value = true
  // Simulate loading
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.stat-card {
  border-radius: 16px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}
</style>