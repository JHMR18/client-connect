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
          <h1 class="text-h4 font-weight-bold mb-2">Payments & Amortization</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            View your payment schedules and make payments
          </p>
        </div>

        <!-- Active Loans Summary -->
        <v-card v-if="activeLoans.length > 0" class="mb-6">
          <v-card-title>
            <v-icon class="me-2">mdi-briefcase</v-icon>
            Active Business Loans
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="loan in activeLoans" :key="loan.id" cols="12" md="6" lg="4">
                <v-card
                  variant="outlined"
                  :class="{ 'border-primary border-2': selectedLoanId === loan.id }"
                  @click="selectLoan(loan.id)"
                  style="cursor: pointer"
                  hover
                >
                  <v-card-title class="d-flex justify-space-between align-center">
                    <span class="text-subtitle-2">Business Loan #{{ String(loan.id).substring(0, 8) }}</span>
                    <v-chip :color="getStatusColor(loan.status)" size="small" variant="flat">
                      {{ loan.status }}
                    </v-chip>
                  </v-card-title>
                  <v-card-text>
                    <div class="text-body-2">
                      <div class="mb-2">
                        <strong>Amount:</strong> ₱{{ loan.principal_amount?.toLocaleString() }}
                      </div>
                      <div class="mb-2">
                        <strong>Term:</strong> {{ loan.term_days }} days
                      </div>
                      <div>
                        <strong>Purpose:</strong> {{ loan.purpose || 'General' }}
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Loan Summary -->
        <v-row v-if="selectedLoan" class="mb-6">
          <v-col cols="12" sm="6" md="3">
            <v-card color="error" variant="flat">
              <v-card-text>
                <div class="text-h4 font-weight-bold text-white">
                  ₱{{ selectedLoan.principal_amount?.toLocaleString() }}
                </div>
                <div class="text-subtitle-2 text-white opacity-80">Principal Amount</div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card color="primary" variant="flat">
              <v-card-text>
                <div class="text-h4 font-weight-bold text-white">
                  ₱{{ calculateDailyPayment(selectedLoan).toLocaleString() }}
                </div>
                <div class="text-subtitle-2 text-white opacity-80">Daily Payment</div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card color="success" variant="flat">
              <v-card-text>
                <div class="text-h4 font-weight-bold text-white">
                  ₱{{ totalPaid.toLocaleString() }}
                </div>
                <div class="text-subtitle-2 text-white opacity-80">Total Paid</div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card color="info" variant="flat">
              <v-card-text>
                <div class="text-h4 font-weight-bold text-white">
                  ₱{{ remainingBalance.toLocaleString() }}
                </div>
                <div class="text-subtitle-2 text-white opacity-80">Remaining Balance</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Daily Payment Breakdown -->
        <v-card v-if="selectedLoan" class="mb-6">
          <v-card-title>
            <v-icon class="me-2">mdi-cash-clock</v-icon>
            Daily Payment Breakdown
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="d-flex justify-space-between align-center pa-3 bg-grey-lighten-4 rounded">
                  <span class="font-weight-medium">Principal Amount:</span>
                  <span class="font-weight-bold">₱{{ selectedLoan.principal_amount?.toLocaleString() }}</span>
                </div>
                <div class="d-flex justify-space-between align-center pa-3 bg-red-lighten-4 rounded mt-2">
                  <span class="font-weight-medium">Interest (17%):</span>
                  <span class="font-weight-bold text-error">₱{{ (selectedLoan.principal_amount * 0.17).toLocaleString() }}</span>
                </div>
                <div class="d-flex justify-space-between align-center pa-3 bg-orange-lighten-4 rounded mt-2">
                  <span class="font-weight-medium">Processing Fee:</span>
                  <span class="font-weight-bold">₱150</span>
                </div>
                <div class="d-flex justify-space-between align-center pa-3 bg-orange-lighten-4 rounded mt-2">
                  <span class="font-weight-medium">Doc Stamp:</span>
                  <span class="font-weight-bold">₱45</span>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="pa-3 bg-primary-lighten-4 rounded">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="font-weight-medium">Daily Payment:</span>
                    <span class="font-weight-bold text-primary">₱{{ calculateDailyPayment(selectedLoan).toLocaleString() }}</span>
                  </div>
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="font-weight-medium">Payment Period:</span>
                    <span class="font-weight-bold">{{ selectedLoan.term_days }} days</span>
                  </div>
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="font-weight-medium">Total to Pay:</span>
                    <span class="font-weight-bold text-error">₱{{ (calculateDailyPayment(selectedLoan) * selectedLoan.term_days).toLocaleString() }}</span>
                  </div>
                </div>

                <v-alert type="info" variant="tonal" class="mt-3">
                  <v-icon start>mdi-information</v-icon>
                  <div class="text-body-2">
                    <strong>Payment Progress:</strong> You've completed {{ Math.round((totalPaid / totalAmountDue) * 100) }}% of your daily payment obligation.
                  </div>
                </v-alert>

                <!-- Progress bar for visual representation -->
                <div class="mt-3">
                  <div class="text-caption mb-1">Payment Progress</div>
                  <v-progress-linear
                    :model-value="(totalPaid / totalAmountDue) * 100"
                    color="success"
                    height="20"
                    rounded
                  >
                    <template #default="{ value }">
                      <small>{{ Math.round(value) }}%</small>
                    </template>
                  </v-progress-linear>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Amortization Schedule -->
        <v-card v-if="selectedLoan" class="mb-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <span>Daily Payment Schedule</span>
              <div class="text-caption text-medium-emphasis">
                Daily ₱{{ calculateDailyPayment(selectedLoan).toLocaleString() }} payments for {{ selectedLoan.term_days }} days
              </div>
            </div>
            <v-chip :color="getStatusColor(selectedLoan.status)" size="small">
              {{ selectedLoan.status }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <!-- Quick Stats -->
            <v-row class="mb-4">
              <v-col cols="12" md="3">
                <div class="text-center pa-3 bg-blue-lighten-4 rounded">
                  <div class="text-h4 text-primary font-weight-bold">{{ selectedLoan.term_days }}</div>
                  <div class="text-caption">Total Days</div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-center pa-3 bg-green-lighten-4 rounded">
                  <div class="text-h4 text-success font-weight-bold">
                    {{ amortizationSchedule.filter(s => s.status === 'paid').length }}
                  </div>
                  <div class="text-caption">Days Paid</div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-center pa-3 bg-orange-lighten-4 rounded">
                  <div class="text-h4 text-orange font-weight-bold">
                    {{ amortizationSchedule.filter(s => s.status === 'upcoming').length }}
                  </div>
                  <div class="text-caption">Days Remaining</div>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-center pa-3 bg-red-lighten-4 rounded">
                  <div class="text-h4 text-error font-weight-bold">
                    {{ amortizationSchedule.filter(s => s.status === 'overdue').length }}
                  </div>
                  <div class="text-caption">Days Overdue</div>
                </div>
              </v-col>
            </v-row>

            <v-data-table
              :headers="scheduleHeaders"
              :items="amortizationSchedule"
              :loading="loadingSchedule"
              item-value="id"
              class="elevation-0"
              :row-class="getRowClass"
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

              <!-- Amount Due -->
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
                  @click="openPaymentDialog(item)"
                >
                  Pay Daily
                </v-btn>
                <v-chip v-else color="success" size="small" variant="flat">
                  <v-icon start size="small">mdi-check</v-icon>
                  Paid
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <!-- Payment History -->
        <v-card v-if="selectedLoan">
          <v-card-title>Payment History</v-card-title>

          <v-card-text>
            <v-data-table
              :headers="paymentHeaders"
              :items="paymentHistory"
              :loading="loadingPayments"
              item-value="id"
              class="elevation-0"
            >
              <!-- Payment Date -->
              <template #item.payment_date="{ item }">
                {{ formatDate(item.payment_date) }}
              </template>

              <!-- Amount Paid -->
              <template #item.amount_paid="{ item }">
                ₱{{ item.amount_paid.toLocaleString() }}
              </template>

              <!-- Payment Method -->
              <template #item.payment_method="{ item }">
                <v-chip size="small" variant="tonal">
                  <v-icon start size="small">{{ getPaymentMethodIcon(item.payment_method) }}</v-icon>
                  {{ item.payment_method }}
                </v-chip>
              </template>

              <!-- Receipt -->
              <template #item.receipt_number="{ item }">
                <v-chip size="small" color="grey" variant="outlined">
                  {{ item.receipt_number }}
                </v-chip>
              </template>
            </v-data-table>

            <div v-if="paymentHistory.length === 0" class="text-center pa-8 text-medium-emphasis">
              <v-icon size="64" class="mb-4">mdi-history</v-icon>
              <p>No payment history yet</p>
            </div>
          </v-card-text>
        </v-card>

        <!-- Empty State -->
        <v-card v-if="!selectedLoan && !loadingLoans" class="text-center pa-8">
          <v-icon size="64" color="grey" class="mb-4">mdi-credit-card-off</v-icon>
          <h3 class="text-h6 mb-2">No Active Business Loans</h3>
          <p class="text-medium-emphasis mb-4">
            You don't have any active business loans to make payments on.
          </p>
          <v-btn color="error" prepend-icon="mdi-briefcase" @click="$router.push('/client/apply')">
            Apply for Business Loan
          </v-btn>
        </v-card>
      </v-container>
    </v-main>

    <!-- Payment Dialog -->
    <v-dialog v-model="showPaymentDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>Make Payment</v-card-title>

        <v-form ref="paymentForm" @submit.prevent="submitPayment">
          <v-card-text>
            <v-alert type="info" variant="tonal" class="mb-4">
              <div class="d-flex justify-space-between align-center">
                <span>Amount Due:</span>
                <strong>₱{{ selectedSchedule?.amount_due?.toLocaleString() }}</strong>
              </div>
              <div class="d-flex justify-space-between align-center mt-2">
                <span>Due Date:</span>
                <strong>{{ formatDate(selectedSchedule?.due_date) }}</strong>
              </div>
            </v-alert>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.number="paymentData.amount_paid"
                  label="Payment Amount (₱)"
                  type="number"
                  variant="outlined"
                  prepend-inner-icon="mdi-cash"
                  :hint="`Amount due: ₱${selectedSchedule?.amount_due?.toLocaleString() || 0}. You can pay more or less.`"
                  persistent-hint
                  :rules="[
                    v => !!v || 'Payment amount is required',
                    v => v > 0 || 'Amount must be greater than 0'
                  ]"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="paymentData.payment_method"
                  :items="paymentMethods"
                  label="Payment Method"
                  variant="outlined"
                  prepend-inner-icon="mdi-credit-card"
                  :rules="[v => !!v || 'Payment method is required']"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="paymentData.receipt_number"
                  label="Receipt/Reference Number (Optional)"
                  variant="outlined"
                  prepend-inner-icon="mdi-receipt"
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn @click="closePaymentDialog">Cancel</v-btn>
            <v-btn type="submit" color="error" :loading="submittingPayment">
              Submit Payment
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/utils/useAuth'
import { client, getCurrentUser } from '@/utils/useDirectus'
import { readItems, createItem, updateItem } from '@directus/sdk'

const router = useRouter()
const { logout } = useAuth()

const drawer = ref(true)
const loadingLoans = ref(false)
const loadingSchedule = ref(false)
const loadingPayments = ref(false)
const submittingPayment = ref(false)
const showPaymentDialog = ref(false)
const paymentForm = ref()

const selectedLoanId = ref<string | null>(null)
const selectedLoan = ref<any>(null)
const activeLoans = ref<any[]>([])
const amortizationSchedule = ref<any[]>([])
const paymentHistory = ref<any[]>([])
const selectedSchedule = ref<any>(null)
const currentUser = ref<any>(null)

const paymentData = ref({
  amount_paid: null as number | null,
  payment_method: 'cash',
  receipt_number: ''
})

const paymentMethods = ['cash', 'bank_transfer', 'gcash']

const scheduleHeaders = [
  { title: 'Day #', key: 'period', sortable: false },
  { title: 'Date', key: 'due_date' },
  { title: 'Daily Payment', key: 'amount_due' },
  { title: 'Amount Paid', key: 'amount_paid' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const paymentHeaders = [
  { title: 'Payment Date', key: 'payment_date' },
  { title: 'Amount', key: 'amount_paid' },
  { title: 'Method', key: 'payment_method' },
  { title: 'Receipt #', key: 'receipt_number' },
  { title: 'Balance After', key: 'remaining_balance' }
]

// Calculate daily payment
const calculateDailyPayment = (loan: any) => {
  const principal = loan.principal_amount || 0
  const termDays = loan.term_days || 0
  return termDays > 0 ? Math.round(principal / termDays) : 0
}

// Computed
const totalAmountDue = computed(() => {
  if (!selectedLoan.value) return 0
  const principal = selectedLoan.value.principal_amount || 0

  // Business Loan has 17% interest rate
  const interestRate = 17
  const totalInterest = (principal * interestRate / 100)

  // Add processing fee and doc stamp
  const processingFee = 150
  const docStamp = 45
  const loanDischarge = principal // Daily payment scheme includes full principal repayment

  return principal + totalInterest + processingFee + docStamp
})

const totalPaid = computed(() => {
  return paymentHistory.value.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0)
})

const remainingBalance = computed(() => {
  return totalAmountDue.value - totalPaid.value
})

// Generate amortization schedule based on loan details
const generateAmortizationSchedule = (loan: any) => {
  const principal = loan.principal_amount || 0
  const termDays = loan.term_days || 0

  console.log('Generating daily schedule with:', { principal, termDays })

  if (termDays === 0) {
    console.error('Cannot generate schedule: term_days is 0')
    return []
  }

  // Business Loan daily payment calculation
  const dailyPayment = Math.round(principal / termDays)

  console.log('Calculated daily payment:', dailyPayment)

  const schedule = []
  const startDate = new Date(loan.approval_date || loan.application_date)

  // Generate daily schedule
  for (let day = 1; day <= termDays; day++) {
    const dueDate = new Date(startDate)
    dueDate.setDate(dueDate.getDate() + day)

    // Skip weekends (optional - remove if payments should be every day including weekends)
    const dayOfWeek = dueDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 = Sunday, 6 = Saturday
      // You can choose to include or exclude weekends
      // For now, I'll include weekends but mark them differently
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      schedule.push({
        period: day,
        due_date: dueDate.toISOString().split('T')[0],
        amount_due: dailyPayment,
        amount_paid: 0, // Initialize to 0
        status: 'upcoming',
        loan: loan.id,
        is_weekend: isWeekend
      })
    } else {
      schedule.push({
        period: day,
        due_date: dueDate.toISOString().split('T')[0],
        amount_due: dailyPayment,
        amount_paid: 0, // Initialize to 0
        status: 'upcoming',
        loan: loan.id,
        is_weekend: false
      })
    }
  }

  console.log('Generated daily schedule:', schedule)

  return schedule
}

// Select and load specific loan
const selectLoan = async (loanId: string) => {
  selectedLoanId.value = loanId
  await loadLoanDetails()
}

// Load active loans
const loadActiveLoans = async () => {
  loadingLoans.value = true
  try {
    currentUser.value = await getCurrentUser()

    console.log('Loading loans for user:', currentUser.value.id)

    const loans = await client.request(
      readItems('loan', {
        filter: {
          client: { _eq: currentUser.value.id },
          status: { _in: ['active', 'approved'] }
        },
        fields: ['*']
      })
    )

    console.log('Loaded loans:', loans)

    activeLoans.value = loans.map((loan: any) => ({
      ...loan,
      display_name: `Business Loan #${String(loan.id).substring(0, 8)} - ${loan.purpose || 'General'}`
    }))

    console.log('Active loans:', activeLoans.value)

    if (activeLoans.value.length > 0) {
      // Automatically select and load the first loan
      selectedLoanId.value = activeLoans.value[0].id
      await loadLoanDetails()
    } else {
      console.warn('No active or approved loans found for user')
    }
  } catch (error) {
    console.error('Error loading loans:', error)
  } finally {
    loadingLoans.value = false
  }
}

// Load loan details with schedule and payments
const loadLoanDetails = async () => {
  if (!selectedLoanId.value) return
  
  loadingSchedule.value = true
  loadingPayments.value = true
  
  try {
    // Load loan
    selectedLoan.value = activeLoans.value.find(l => l.id === selectedLoanId.value)
    
    // Load or generate amortization schedule
    let schedule = await client.request(
      readItems('amortization_schedule', {
        filter: {
          loan: { _eq: selectedLoanId.value }
        },
        sort: ['due_date']
      })
    )
    
    console.log('Loaded schedule from database:', schedule)
    
    // If no schedule exists, generate it
    if (schedule.length === 0 && selectedLoan.value) {
      console.log('No schedule found, generating new one...')
      const generatedSchedule = generateAmortizationSchedule(selectedLoan.value)
      
      console.log('About to save schedule to database:', generatedSchedule)
      
      // Save to database
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
      
      console.log('Reloaded schedule after saving:', schedule)
    }
    
    // If schedule exists but has null amount_due, recalculate and update
    const hasNullAmounts = schedule.some((item: any) => item.amount_due === null || item.amount_due === undefined)
    if (hasNullAmounts && selectedLoan.value) {
      console.log('⚠️ Schedule has null amounts, recalculating...')
      const generatedSchedule = generateAmortizationSchedule(selectedLoan.value)
      
      // Update each schedule item with calculated amount
      for (let i = 0; i < schedule.length && i < generatedSchedule.length; i++) {
        const scheduleItem = schedule[i]
        const calculatedAmount = generatedSchedule[i].amount_due
        
        console.log(`Updating schedule ${scheduleItem.id} with amount: ${calculatedAmount}`)
        
        await client.request(
          updateItem('amortization_schedule', scheduleItem.id, {
            amount_due: calculatedAmount,
            amount_paid: 0 // Initialize to 0
          })
        )
      }
      
      // Reload schedule after updates
      schedule = await client.request(
        readItems('amortization_schedule', {
          filter: {
            loan: { _eq: selectedLoanId.value }
          },
          sort: ['due_date']
        })
      )
      
      console.log('✅ Schedule updated with amounts:', schedule)
    }
    
    console.log('Final schedule before setting:', schedule)
    
    // Ensure amount_paid is initialized
    schedule = schedule.map((item: any) => {
      console.log('Schedule item before init:', { id: item.id, amount_paid: item.amount_paid, type: typeof item.amount_paid })
      return {
        ...item,
        amount_paid: item.amount_paid || 0
      }
    })
    
    console.log('Schedule after amount_paid init:', schedule)
    
    // Check if schedules are overdue
    const today = new Date()
    schedule = schedule.map((item: any) => {
      const dueDate = new Date(item.due_date)
      console.log('Schedule item:', item, 'amount_due:', item.amount_due)
      if (item.status === 'upcoming' && dueDate < today) {
        return { ...item, status: 'overdue' }
      }
      return item
    })
    
    console.log('Schedule after overdue check:', schedule)
    
    amortizationSchedule.value = schedule
    console.log('amortizationSchedule.value set to:', amortizationSchedule.value)
    
    // Load payment history
    const payments = await client.request(
      readItems('payments', {
        filter: {
          loan: { _eq: selectedLoanId.value }
        },
        sort: ['-payment_date']
      })
    )
    
    paymentHistory.value = payments
  } catch (error) {
    console.error('Error loading loan details:', error)
  } finally {
    loadingSchedule.value = false
    loadingPayments.value = false
  }
}

// Open payment dialog
const openPaymentDialog = (schedule: any) => {
  selectedSchedule.value = schedule
  paymentData.value = {
    amount_paid: schedule.amount_due,
    payment_method: 'cash',
    receipt_number: ''
  }
  showPaymentDialog.value = true
}

// Close payment dialog
const closePaymentDialog = () => {
  showPaymentDialog.value = false
  selectedSchedule.value = null
  paymentData.value = {
    amount_paid: null,
    payment_method: 'cash',
    receipt_number: ''
  }
}

// Submit payment
const submitPayment = async () => {
  const form = paymentForm.value
  if (!form) return
  
  const { valid } = await form.validate()
  if (!valid) return
  
  submittingPayment.value = true
  
  try {
    const amountPaid = paymentData.value.amount_paid || 0
    const amountDue = selectedSchedule.value.amount_due || 0
    
    console.log(`Processing payment: Paid=${amountPaid}, Due=${amountDue}`)
    
    // Calculate remaining balance
    const newBalance = remainingBalance.value - amountPaid
    
    // Create payment record
    const payment = await client.request(
      createItem('payments', {
        loan: selectedLoanId.value,
        payment_date: new Date().toISOString().split('T')[0],
        amount_paid: amountPaid,
        remaining_balance: newBalance,
        payment_method: paymentData.value.payment_method,
        receipt_number: paymentData.value.receipt_number || `RCP-${Date.now()}`
      })
    )
    
    // Handle payment application to schedule
    if (amountPaid >= amountDue) {
      // Full payment or overpayment
      console.log('✅ Full payment or overpayment')
      
      // Mark current schedule as paid
      await client.request(
        updateItem('amortization_schedule', selectedSchedule.value.id, {
          status: 'paid',
          amount_paid: amountDue
        })
      )
      
      // Handle overpayment - apply to next unpaid schedules
      let remainingPayment = amountPaid - amountDue
      console.log(`Overpayment: ₱${remainingPayment}`)
      
      if (remainingPayment > 0) {
        // Get all unpaid schedules sorted by due date
        const unpaidSchedules = amortizationSchedule.value
          .filter((s: any) => s.status === 'upcoming' || s.status === 'overdue')
          .filter((s: any) => s.id !== selectedSchedule.value.id)
          .sort((a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        
        console.log(`Applying overpayment to ${unpaidSchedules.length} unpaid schedules`)
        
        for (const schedule of unpaidSchedules) {
          if (remainingPayment <= 0) break
          
          const scheduleDue = schedule.amount_due || 0
          
          if (remainingPayment >= scheduleDue) {
            // Can pay this schedule in full
            console.log(`✅ Paying schedule ${schedule.id} in full: ₱${scheduleDue}`)
            await client.request(
              updateItem('amortization_schedule', schedule.id, {
                status: 'paid',
                amount_paid: scheduleDue
              })
            )
            remainingPayment -= scheduleDue
          } else {
            // Partial payment on this schedule
            console.log(`⚠️ Partial payment on schedule ${schedule.id}: ₱${remainingPayment} of ₱${scheduleDue}`)
            const newAmountDue = scheduleDue - remainingPayment
            await client.request(
              updateItem('amortization_schedule', schedule.id, {
                amount_due: newAmountDue,
                amount_paid: remainingPayment
              })
            )
            remainingPayment = 0
          }
        }
        
        if (remainingPayment > 0) {
          console.log(`ℹ️ Excess payment: ₱${remainingPayment} (all schedules paid)`)
          alert(`Payment successful! You have an excess of ₱${remainingPayment.toLocaleString()} which can be applied to future payments or refunded.`)
        } else {
          alert('Payment submitted successfully!')
        }
      } else {
        alert('Payment submitted successfully!')
      }
    } else {
      // Partial payment (less than amount due)
      console.log('⚠️ Partial payment')
      
      const newAmountDue = amountDue - amountPaid
      console.log(`Updating schedule ${selectedSchedule.value.id}: New amount due = ₱${newAmountDue}`)
      
      await client.request(
        updateItem('amortization_schedule', selectedSchedule.value.id, {
          amount_due: newAmountDue,
          amount_paid: amountPaid
        })
      )
      
      alert(`Partial payment of ₱${amountPaid.toLocaleString()} recorded. Remaining for this period: ₱${newAmountDue.toLocaleString()}`)
    }
    
    closePaymentDialog()
    await loadLoanDetails()
  } catch (error) {
    console.error('Error submitting payment:', error)
    alert('Error submitting payment. Please try again.')
  } finally {
    submittingPayment.value = false
  }
}

// Helper functions
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

const getRowClass = (item: any) => {
  return item.is_weekend ? 'bg-orange-lighten-5' : ''
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'success',
    approved: 'info',
    pending: 'warning',
    closed: 'grey',
    rejected: 'error'
  }
  return colors[status] || 'grey'
}

const getScheduleStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    paid: 'success',
    upcoming: 'info',
    overdue: 'error'
  }
  return colors[status] || 'grey'
}

const getPaymentMethodIcon = (method: string) => {
  const icons: Record<string, string> = {
    cash: 'mdi-cash',
    bank_transfer: 'mdi-bank',
    gcash: 'mdi-cellphone'
  }
  return icons[method] || 'mdi-credit-card'
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}

onMounted(() => {
  loadActiveLoans()
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

:deep(.v-list-item--nav .v-list-item__prepend > .v-icon) {
  opacity: 0.8;
}

:deep(.v-list-item--active) {
  background-color: rgba(220, 38, 38, 0.2);
  border-radius: 8px;
}
</style>
