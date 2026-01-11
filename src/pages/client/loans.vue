<template>
  <ClientLayout>
    <v-container fluid class="pa-6">
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-8">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">My Loans</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Track your loan applications and active loans
          </p>
        </div>

        <v-btn color="red" prepend-icon="mdi-refresh" @click="loadLoans" :loading="loading">
          Refresh
        </v-btn>
      </div>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="#1a1a1a" theme="dark">
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" class="me-4" color="error">mdi-file-document-multiple</v-icon>
                <div>
                  <p class="text-subtitle-2 mb-0 opacity-80">Total Loans</p>
                  <h3 class="text-h4 font-weight-bold text-error">{{ totalLoans }}</h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card color="#1a1a1a" theme="dark">
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" class="me-4" color="error">mdi-check-circle</v-icon>
                <div>
                  <p class="text-subtitle-2 mb-0 opacity-80">Active Loans</p>
                  <h3 class="text-h4 font-weight-bold text-error">{{ activeLoans }}</h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card color="#1a1a1a" theme="dark">
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" class="me-4" color="error">mdi-cash</v-icon>
                <div>
                  <p class="text-subtitle-2 mb-0 opacity-80">Outstanding</p>
                  <h3 class="text-h6 font-weight-bold text-error">
                    ₱{{ outstandingAmount.toLocaleString() }}
                  </h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card color="error" theme="dark">
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" class="me-4">mdi-clock-alert</v-icon>
                <div>
                  <p class="text-subtitle-2 mb-0 opacity-80">Pending</p>
                  <h3 class="text-h4 font-weight-bold">{{ pendingLoans }}</h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters -->
      <v-card class="mb-6">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedStatus"
                :items="statusOptions"
                label="Filter by Status"
                variant="outlined"
                clearable
                @update:model-value="filterLoans"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchQuery"
                label="Search loans..."
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                clearable
                @update:model-value="filterLoans"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Loans Grid -->
      <div v-if="filteredLoans.length > 0">
        <v-row>
          <v-col v-for="loan in filteredLoans" :key="loan.id" cols="12" md="6" lg="4">
            <v-card
              class="loan-card"
              :class="getCardClass(loan.status)"
              @click="viewLoanDetails(loan)"
              style="cursor: pointer"
              hover
            >
              <v-card-title class="d-flex justify-space-between align-center">
                <div>
                  <h4 class="text-h6">Business Loan</h4>
                  <p class="text-caption mb-0 opacity-70">
                    Applied: {{ formatDate(loan.applicationDate) }}
                  </p>
                </div>
                <v-chip :color="getStatusColor(loan.status)" size="small" variant="flat">
                  {{ loan.status.replace("_", " ").toUpperCase() }}
                </v-chip>
              </v-card-title>

              <v-card-text>
                <div class="loan-details">
                  <div class="detail-row">
                    <span class="label">Amount:</span>
                    <span class="value">₱{{ loan.principalAmount.toLocaleString() }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Term:</span>
                    <span class="value">{{ loan.termDays }} days</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Purpose:</span>
                    <span class="value">{{ loan.purpose }}</span>
                  </div>
                  <div v-if="loan.status === 'active'" class="detail-row">
                    <span class="label">Outstanding:</span>
                    <span class="value text-primary font-weight-bold">
                      ₱{{ (loan.principalAmount - (loan.totalPaid || 0)).toLocaleString() }}
                    </span>
                  </div>
                </div>
              </v-card-text>

              <v-card-actions v-if="loan.status !== 'pending'">
                <v-btn
                  v-if="loan.status === 'active'"
                  color="success"
                  variant="tonal"
                  size="small"
                  prepend-icon="mdi-credit-card"
                  @click.stop="viewPayments(loan)"
                >
                  View Payments
                </v-btn>
                <v-btn
                  color="primary"
                  variant="tonal"
                  size="small"
                  prepend-icon="mdi-eye"
                  @click.stop="viewLoanDetails(loan)"
                >
                  Details
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="text-center pa-12">
        <v-icon size="120" class="text-disabled mb-4">mdi-file-document-outline</v-icon>
        <h3 class="text-h5 text-disabled mb-2">No loans found</h3>
        <p class="text-body-1 text-disabled mb-6">
          {{
            selectedStatus || searchQuery
              ? "No loans match your current filters"
              : "You haven't applied for any loans yet"
          }}
        </p>
        <v-btn
          v-if="!selectedStatus && !searchQuery"
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          @click="$router.push('/client/apply')"
        >
          Apply for Business Loan
        </v-btn>
        <v-btn v-else color="primary" variant="outlined" @click="clearFilters">
          Clear Filters
        </v-btn>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center pa-12">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="text-h6 mt-4">Loading your loans...</p>
      </div>
    </v-container>

    <!-- Loan Details Dialog -->
    <v-dialog v-model="showDetails" max-width="800" scrollable>
      <v-card v-if="selectedLoan">
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <h3>Loan Details</h3>
            <p class="text-subtitle-2 text-medium-emphasis mb-0">
              Business Loan - {{ selectedLoan.id }}
            </p>
          </div>
          <v-chip :color="getStatusColor(selectedLoan.status)" variant="flat">
            {{ selectedLoan.status.replace("_", " ").toUpperCase() }}
          </v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text style="max-height: 500px">
          <v-row>
            <!-- Loan Information -->
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Loan Information</v-card-title>
                <v-card-text>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <span class="label">Product:</span>
                      <span class="value">Business Loan</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Amount:</span>
                      <span class="value"
                        >₱{{ selectedLoan.principalAmount.toLocaleString() }}</span
                      >
                    </div>
                    <div class="detail-item">
                      <span class="label">Term:</span>
                      <span class="value">{{ selectedLoan.termDays }} days</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Purpose:</span>
                      <span class="value">{{ selectedLoan.purpose }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Application Date:</span>
                      <span class="value">{{ formatDate(selectedLoan.applicationDate) }}</span>
                    </div>
                    <div v-if="selectedLoan.approvalDate" class="detail-item">
                      <span class="label">Approval Date:</span>
                      <span class="value">{{ formatDate(selectedLoan.approvalDate) }}</span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Financial Summary -->
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Financial Summary</v-card-title>
                <v-card-text>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <span class="label">Monthly Income:</span>
                      <span class="value">₱{{ selectedLoan.monthlyIncome.toLocaleString() }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Monthly Expenses:</span>
                      <span class="value"
                        >₱{{ selectedLoan.monthlyExpenses.toLocaleString() }}</span
                      >
                    </div>
                    <div class="detail-item">
                      <span class="label">Net Income:</span>
                      <span class="value" :class="getNetIncomeClass(selectedLoan)">
                        ₱{{
                          (
                            selectedLoan.monthlyIncome - selectedLoan.monthlyExpenses
                          ).toLocaleString()
                        }}
                      </span>
                    </div>
                    <div v-if="selectedLoan.status === 'active'" class="detail-item">
                      <span class="label">Total Paid:</span>
                      <span class="value text-success"
                        >₱{{ (selectedLoan.totalPaid || 0).toLocaleString() }}</span
                      >
                    </div>
                    <div v-if="selectedLoan.status === 'active'" class="detail-item">
                      <span class="label">Outstanding:</span>
                      <span class="value text-primary font-weight-bold">
                        ₱{{
                          (
                            selectedLoan.principalAmount - (selectedLoan.totalPaid || 0)
                          ).toLocaleString()
                        }}
                      </span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Business Information -->
            <v-col cols="12" v-if="selectedLoan.businessName">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Business Information</v-card-title>
                <v-card-text>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <span class="label">Business Name:</span>
                      <span class="value">{{ selectedLoan.businessName }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Business Type:</span>
                      <span class="value">{{ selectedLoan.businessType }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Years in Business:</span>
                      <span class="value">{{ selectedLoan.yearsInBusiness }} years</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">Employees:</span>
                      <span class="value">{{ selectedLoan.numberOfEmployees }}</span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="selectedLoan.status === 'active'"
            color="success"
            prepend-icon="mdi-credit-card"
            @click="viewPayments(selectedLoan)"
          >
            View Payments
          </v-btn>
          <v-btn @click="showDetails = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </ClientLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLoanApplications, useDashboardStats } from "@/utils/useSmartLoanApi";
import { getCurrentUser } from "@/utils/useDirectus";
import ClientLayout from "@/layouts/ClientLayout.vue";

const router = useRouter();

const loading = ref(false);
const showDetails = ref(false);
const selectedLoan = ref<any>(null);
const currentUser = ref<any>(null);

// API composables
const { getApplications } = useLoanApplications();
const { getClientStats } = useDashboardStats();

// Data
const loans = ref<any[]>([]);
const selectedStatus = ref<string | null>(null);
const searchQuery = ref("");

// Statistics
const totalLoans = ref(0);
const activeLoans = ref(0);
const pendingLoans = ref(0);
const outstandingAmount = ref(0);

// Options
const statusOptions = [
  { title: "Pending", value: "pending" },
  { title: "Approved", value: "approved" },
  { title: "Active", value: "active" },
  { title: "Closed", value: "closed" },
  { title: "Rejected", value: "rejected" },
  { title: "Restructured", value: "restructured" },
];

// Computed
const filteredLoans = computed(() => {
  let filtered = loans.value;

  if (selectedStatus.value) {
    filtered = filtered.filter((loan) => loan.status === selectedStatus.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (loan) =>
        loan.purpose.toLowerCase().includes(query) ||
        loan.id.toString().includes(query) ||
        'business loan'.includes(query),
    );
  }

  return filtered;
});

// Methods
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "info";
    case "approved":
      return "primary";
    case "active":
      return "error";
    case "closed":
      return "grey";
    case "rejected":
      return "error";
    case "restructured":
      return "purple";
    default:
      return "primary";
  }
};

const getCardClass = (status: string) => {
  return {
    "border-info": status === "pending",
    "border-primary": status === "approved",
    "border-error": status === "active" || status === "rejected",
    "border-grey": status === "closed",
    "border-purple": status === "restructured",
  };
};

const getNetIncomeClass = (loan: any) => {
  const netIncome = loan.monthlyIncome - loan.monthlyExpenses;
  if (netIncome > 10000) return "text-primary";
  if (netIncome > 0) return "text-info";
  return "text-error";
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const viewLoanDetails = (loan: any) => {
  selectedLoan.value = loan;
  showDetails.value = true;
};

const viewPayments = (loan: any) => {
  // Navigate to payments page with loan filter
  router.push(`/client/payments?loan=${loan.id}`);
};

const clearFilters = () => {
  selectedStatus.value = null;
  searchQuery.value = "";
};

const filterLoans = () => {
  // Trigger reactivity for computed property
};

const loadLoans = async () => {
  loading.value = true;
  try {
    if (!currentUser.value) return;

    // Get user's loans
    const userLoans = await getApplications({
      client: { _eq: currentUser.value.id },
    });

    console.log("Raw loan data:", userLoans);
    if (userLoans.length > 0) {
      console.log("First loan loan_product structure:", userLoans[0].loan_product);
    }

    // Transform loans data
    loans.value = userLoans.map((loan) => {
      return {
        id: loan.id,
        loanProduct: "Business Loan", // Fixed product name
        principalAmount: loan.principal_amount,
        termDays: loan.term_days, // Updated to use term_days instead of term_months
        purpose: loan.purpose,
        status: loan.status,
        applicationDate: loan.application_date,
        approvalDate: loan.approval_date,
        monthlyIncome: loan.monthly_income,
        monthlyExpenses: loan.monthly_expenses,
        businessName: loan.business_name,
        businessType: loan.business_type,
        yearsInBusiness: loan.years_in_business,
        numberOfEmployees: loan.number_of_employees,
        totalPaid: 0, // This would come from payments calculation
      };
    });

    // Calculate statistics
    totalLoans.value = loans.value.length;
    activeLoans.value = loans.value.filter((l) => l.status === "active").length;
    pendingLoans.value = loans.value.filter((l) => l.status === "pending").length;
    outstandingAmount.value = loans.value
      .filter((l) => l.status === "active")
      .reduce((sum, l) => sum + (l.principalAmount - l.totalPaid), 0);
  } catch (error) {
    console.error("Error loading loans:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    // Get current user
    currentUser.value = await getCurrentUser();

    // Load loans
    await loadLoans();
  } catch (error) {
    console.error("Error loading initial data:", error);
  }
});
</script>

<style scoped>
.loan-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.loan-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.border-info {
  border-color: rgb(var(--v-theme-info)) !important;
}

.border-primary {
  border-color: rgb(var(--v-theme-primary)) !important;
}

.border-error {
  border-color: rgb(var(--v-theme-error)) !important;
}

.border-grey {
  border-color: #6c757d !important;
}

.border-purple {
  border-color: #9c27b0 !important;
}

.loan-details {
  display: grid;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.7);
  font-size: 0.875rem;
}

.detail-row .value {
  font-weight: 600;
  text-align: right;
}

.detail-grid {
  display: grid;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.7);
  min-width: 120px;
  font-size: 0.875rem;
}

.detail-item .value {
  font-weight: 500;
  text-align: right;
  flex: 1;
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
