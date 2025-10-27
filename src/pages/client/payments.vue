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

        <!-- Loan Selector -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="selectedLoanId"
                  :items="activeLoans"
                  item-title="display_name"
                  item-value="id"
                  label="Select Loan"
                  variant="outlined"
                  prepend-inner-icon="mdi-file-document"
                  :loading="loadingLoans"
                  @update:model-value="loadLoanDetails"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon>mdi-file-document</v-icon>
                      </template>
                      <template #subtitle>
                        ₱{{ item.raw.principal_amount?.toLocaleString() }} - {{ item.raw.term_months }} months
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
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
            <v-card color="warning" variant="flat">
              <v-card-text>
                <div class="text-h4 font-weight-bold text-white">
                  ₱{{ totalAmountDue.toLocaleString() }}
                </div>
                <div class="text-subtitle-2 text-white opacity-80">Total Amount Due</div>
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

        <!-- Amortization Schedule -->
        <v-card v-if="selectedLoan" class="mb-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Amortization Schedule</span>
            <v-chip :color="getStatusColor(selectedLoan.status)" size="small">
              {{ selectedLoan.status }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="scheduleHeaders"
              :items="amortizationSchedule"
              :loading="loadingSchedule"
              item-value="id"
              class="elevation-0"
            >
              <!-- Due Date -->
              <template #item.due_date="{ item }">
                {{ formatDate(item.due_date) }}
              </template>

              <!-- Amount Due -->
              <template #item.amount_due="{ item }">
                <span v-if="item.amount_due != null">
                  ₱{{ item.amount_due.toLocaleString() }}
                </span>
                <span v-else class="text-medium-emphasis">—</span>
              </template>

              <!-- Amount Paid -->
              <template #item.amount_paid="{ item }">
                <span v-if="item.amount_paid != null && item.amount_paid > 0">
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
                  Pay Now
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
          <h3 class="text-h6 mb-2">No Active Loans</h3>
          <p class="text-medium-emphasis mb-4">
            You don't have any active loans to make payments on.
          </p>
          <v-btn color="error" prepend-icon="mdi-file-document-plus" @click="$router.push('/client/apply')">
            Apply for a Loan
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
  { title: '#', key: 'period', sortable: false },
  { title: 'Due Date', key: 'due_date' },
  { title: 'Amount Due', key: 'amount_due' },
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

// Computed
const totalAmountDue = computed(() => {
  if (!selectedLoan.value) return 0
  const principal = selectedLoan.value.principal_amount || 0
  
  // Get interest rate from loan or loan product
  let interestRate = selectedLoan.value.interest_rate
  if (!interestRate && selectedLoan.value.loan_product && selectedLoan.value.loan_product.length > 0) {
    interestRate = selectedLoan.value.loan_product[0].loan_products_id?.interest_rate
  }
  
  const totalInterest = (principal * (interestRate || 0) / 100)
  return principal + totalInterest
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
  
  // Get interest rate from loan or loan product
  let interestRate = loan.interest_rate
  if (!interestRate && loan.loan_product && loan.loan_product.length > 0) {
    interestRate = loan.loan_product[0].loan_products_id?.interest_rate
  }
  
  if (!interestRate) {
    console.warn('No interest rate found for loan, using 0%')
    interestRate = 0
  }
  
  const annualRate = (interestRate || 0) / 100
  const monthlyRate = annualRate / 12
  const termMonths = loan.term_months || 0
  
  console.log('Generating schedule with:', { principal, interestRate, termMonths, monthlyRate })
  
  if (termMonths === 0) {
    console.error('Cannot generate schedule: term_months is 0')
    return []
  }
  
  // Calculate monthly payment using amortization formula
  let monthlyPayment = 0
  
  if (monthlyRate === 0) {
    // No interest, simple division
    monthlyPayment = principal / termMonths
  } else {
    // With interest, use amortization formula
    monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1)
  }
  
  console.log('Calculated monthly payment:', monthlyPayment)
  
  const schedule = []
  const approvalDate = new Date(loan.approval_date || loan.application_date)
  
  for (let i = 1; i <= termMonths; i++) {
    const dueDate = new Date(approvalDate)
    dueDate.setMonth(dueDate.getMonth() + i)
    
    schedule.push({
      period: i,
      due_date: dueDate.toISOString().split('T')[0],
      amount_due: Math.round(monthlyPayment * 100) / 100,
      amount_paid: 0, // Initialize to 0
      status: 'upcoming',
      loan: loan.id
    })
  }
  
  console.log('Generated schedule:', schedule)
  
  return schedule
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
        fields: ['*', 'loan_product.loan_products_id.*']
      })
    )
    
    console.log('Loaded loans:', loans)
    
    activeLoans.value = loans.map((loan: any) => ({
      ...loan,
      display_name: `Loan #${String(loan.id).substring(0, 8)} - ${loan.purpose || 'General'}`
    }))
    
    console.log('Active loans:', activeLoans.value)
    
    if (activeLoans.value.length > 0) {
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
