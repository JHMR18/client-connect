<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app permanent color="primary" theme="dark" width="280">
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
              <v-list-item v-bind="props" prepend-icon="mdi-chart-box" title="Reports" />
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
            <p class="text-subtitle-1 text-medium-emphasis">Review and manage loan applications</p>
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
              <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
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
                <v-btn color="primary" size="small" variant="tonal" @click="viewApplication(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.status === 'pending'"
                  color="info"
                  size="small"
                  variant="tonal"
                  @click="openRiskAssessment(item)"
                >
                  <v-icon>mdi-scale-balance</v-icon>
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
          <v-chip :color="getStatusColor(selectedApplication.status)" variant="flat">
            {{ selectedApplication.status }}
          </v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text style="max-height: 600px">
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
                      <span class="value"
                        >₱{{ selectedApplication.loanAmount.toLocaleString() }}</span
                      >
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
                      <span class="value"
                        >₱{{ selectedApplication.monthlyIncome.toLocaleString() }}</span
                      >
                    </div>
                    <div class="info-item">
                      <span class="label">Monthly Expenses:</span>
                      <span class="value"
                        >₱{{ selectedApplication.monthlyExpenses.toLocaleString() }}</span
                      >
                    </div>
                    <div class="info-item">
                      <span class="label">Net Income:</span>
                      <span class="value" :class="getNetIncomeClass(selectedApplication)">
                        ₱{{
                          (
                            selectedApplication.monthlyIncome - selectedApplication.monthlyExpenses
                          ).toLocaleString()
                        }}
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
                    <v-col
                      cols="6"
                      md="3"
                      v-for="doc in selectedApplication.documents"
                      :key="doc.type"
                    >
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
          <v-btn :color="confirmAction === 'approve' ? 'success' : 'error'" @click="executeAction">
            {{ confirmAction === "approve" ? "Approve" : "Reject" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Risk Assessment Dialog -->
    <v-dialog v-model="showRiskAssessment" max-width="800" scrollable>
      <v-card v-if="selectedApplication">
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <h3>Risk Assessment</h3>
            <p class="text-subtitle-2 text-medium-emphasis mb-0">
              {{ selectedApplication.clientName }} - {{ selectedApplication.loanProduct }}
            </p>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text style="max-height: 500px">
          <v-form ref="riskForm">
            <v-row>
              <v-col cols="12">
                <h4 class="text-h6 mb-4">4Cs Assessment</h4>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Rate each factor from 1 (Poor) to 10 (Excellent)
                </p>
              </v-col>

              <!-- Capacity -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <h5 class="text-subtitle-1 mb-2">
                    <v-icon class="me-2" color="primary">mdi-cash-multiple</v-icon>
                    Capacity
                  </h5>
                  <p class="text-caption mb-3">Ability to repay the loan</p>
                  <v-slider
                    v-model="riskAssessment.capacity_score"
                    :min="1"
                    :max="10"
                    :step="1"
                    show-ticks="always"
                    tick-size="4"
                    thumb-label
                    color="primary"
                  />
                  <div class="d-flex justify-space-between text-caption">
                    <span>Poor (1)</span>
                    <span>Excellent (10)</span>
                  </div>
                </v-card>
              </v-col>

              <!-- Character -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <h5 class="text-subtitle-1 mb-2">
                    <v-icon class="me-2" color="primary">mdi-account-heart</v-icon>
                    Character
                  </h5>
                  <p class="text-caption mb-3">Credit history and willingness to pay</p>
                  <v-slider
                    v-model="riskAssessment.character_score"
                    :min="1"
                    :max="10"
                    :step="1"
                    show-ticks="always"
                    tick-size="4"
                    thumb-label
                    color="primary"
                  />
                  <div class="d-flex justify-space-between text-caption">
                    <span>Poor (1)</span>
                    <span>Excellent (10)</span>
                  </div>
                </v-card>
              </v-col>

              <!-- Collateral -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <h5 class="text-subtitle-1 mb-2">
                    <v-icon class="me-2" color="primary">mdi-home</v-icon>
                    Collateral
                  </h5>
                  <p class="text-caption mb-3">Assets that secure the loan</p>
                  <v-slider
                    v-model="riskAssessment.collateral_score"
                    :min="1"
                    :max="10"
                    :step="1"
                    show-ticks="always"
                    tick-size="4"
                    thumb-label
                    color="primary"
                  />
                  <div class="d-flex justify-space-between text-caption">
                    <span>Poor (1)</span>
                    <span>Excellent (10)</span>
                  </div>
                </v-card>
              </v-col>

              <!-- Capital -->
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <h5 class="text-subtitle-1 mb-2">
                    <v-icon class="me-2" color="primary">mdi-bank</v-icon>
                    Capital
                  </h5>
                  <p class="text-caption mb-3">Financial resources and investment</p>
                  <v-slider
                    v-model="riskAssessment.capital_score"
                    :min="1"
                    :max="10"
                    :step="1"
                    show-ticks="always"
                    tick-size="4"
                    thumb-label
                    color="primary"
                  />
                  <div class="d-flex justify-space-between text-caption">
                    <span>Poor (1)</span>
                    <span>Excellent (10)</span>
                  </div>
                </v-card>
              </v-col>

              <!-- Overall Risk Level -->
              <v-col cols="12">
                <v-card variant="outlined" class="pa-4">
                  <h5 class="text-subtitle-1 mb-3">Overall Risk Level</h5>
                  <v-select
                    v-model="riskAssessment.overall_risk_level"
                    :items="[
                      { title: 'Low Risk', value: 'low' },
                      { title: 'Medium Risk', value: 'medium' },
                      { title: 'High Risk', value: 'high' },
                    ]"
                    variant="outlined"
                    :color="getRiskColor(riskAssessment.overall_risk_level)"
                  />
                </v-card>
              </v-col>

              <!-- Notes -->
              <v-col cols="12">
                <v-textarea
                  v-model="riskAssessment.notes"
                  label="Assessment Notes"
                  variant="outlined"
                  rows="4"
                  placeholder="Additional comments about the risk assessment..."
                />
              </v-col>

              <!-- Assessment Summary -->
              <v-col cols="12">
                <v-card variant="tonal" :color="getRiskColor(calculatedRiskLevel)">
                  <v-card-text>
                    <h5 class="text-subtitle-1 mb-2">Assessment Summary</h5>
                    <p><strong>Average Score:</strong> {{ averageScore.toFixed(1) }}/10</p>
                    <p>
                      <strong>Recommended Risk Level:</strong>
                      {{ calculatedRiskLevel.toUpperCase() }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn @click="showRiskAssessment = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveRiskAssessment"> Save Assessment </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/utils/useAuth";
import { useLoanApplications, useLoanProducts, useRiskAssessment } from "@/utils/useSmartLoanApi";
import { getCurrentUser } from "@/utils/useDirectus";

const router = useRouter();
const { logout } = useAuth();

const drawer = ref(true);
const loading = ref(false);
const showDetails = ref(false);
const showConfirm = ref(false);
const showRiskAssessment = ref(false);
const selectedApplication = ref(null);
const confirmTitle = ref("");
const confirmMessage = ref("");
const confirmAction = ref("");
const itemsPerPage = ref(10);
const currentUser = ref(null);

// API composables
const { getApplications, approveApplication, rejectApplication } = useLoanApplications();
const { getProducts } = useLoanProducts();
const { createRiskAssessment, getRiskAssessment } = useRiskAssessment();

// Filters
const filters = ref({
  status: null,
  loanProduct: null,
  amountFrom: null,
  amountTo: null,
});

// Applications data
const applications = ref([]);
const loanProductOptions = ref([]);

// Risk assessment data
const riskAssessment = ref({
  capacity_score: 5,
  character_score: 5,
  collateral_score: 5,
  capital_score: 5,
  overall_risk_level: "medium",
  notes: "",
});

const filteredApplications = computed(() => {
  let filtered = applications.value;

  if (filters.value.status) {
    filtered = filtered.filter((app) => app.status === filters.value.status);
  }

  if (filters.value.loanProduct) {
    filtered = filtered.filter((app) => app.loanProduct === filters.value.loanProduct);
  }

  if (filters.value.amountFrom) {
    filtered = filtered.filter((app) => app.loanAmount >= filters.value.amountFrom);
  }

  if (filters.value.amountTo) {
    filtered = filtered.filter((app) => app.loanAmount <= filters.value.amountTo);
  }

  return filtered;
});

// Table configuration
const headers = [
  { title: "Application ID", key: "id", sortable: true },
  { title: "Client Name", key: "clientName", sortable: true },
  { title: "Product", key: "loanProduct", sortable: true },
  { title: "Amount", key: "loanAmount", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Date", key: "applicationDate", sortable: true },
  { title: "Actions", key: "actions", sortable: false, width: "120px" },
];

const statusOptions = [
  { title: "Pending", value: "pending" },
  { title: "Under Review", value: "under_review" },
  { title: "Approved", value: "approved" },
  { title: "Rejected", value: "rejected" },
];

const loanProductOptions = [
  { title: "Business Loan", value: "Business Loan" },
  { title: "Personal Loan", value: "Personal Loan" },
  { title: "Equipment Loan", value: "Equipment Loan" },
  { title: "Emergency Loan", value: "Emergency Loan" },
];

// Methods
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "under_review":
      return "info";
    default:
      return "primary";
  }
};

const getNetIncomeClass = (application: any) => {
  const netIncome = application.monthlyIncome - application.monthlyExpenses;
  if (netIncome > 10000) return "text-success";
  if (netIncome > 0) return "text-warning";
  return "text-error";
};

const getDocumentIcon = (type: string) => {
  switch (type) {
    case "Valid ID":
      return "mdi-card-account-details";
    case "Business Permit":
      return "mdi-file-document";
    case "Photo":
      return "mdi-camera";
    case "Co-maker ID":
      return "mdi-account-supervisor";
    default:
      return "mdi-file-document";
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const viewApplication = (application: any) => {
  selectedApplication.value = application;
  showDetails.value = true;
};

const approveApplication = (application: any) => {
  selectedApplication.value = application;
  confirmTitle.value = "Approve Application";
  confirmMessage.value = `Are you sure you want to approve the loan application for ${application.clientName}?`;
  confirmAction.value = "approve";
  showConfirm.value = true;
};

const rejectApplication = (application: any) => {
  selectedApplication.value = application;
  confirmTitle.value = "Reject Application";
  confirmMessage.value = `Are you sure you want to reject the loan application for ${application.clientName}?`;
  confirmAction.value = "reject";
  showConfirm.value = true;
};

const executeAction = async () => {
  try {
    if (selectedApplication.value && currentUser.value) {
      const remarks = `${confirmAction.value === "approve" ? "Approved" : "Rejected"} by ${currentUser.value.first_name} ${currentUser.value.last_name}`;

      if (confirmAction.value === "approve") {
        await approveApplication(selectedApplication.value.id, currentUser.value.id, remarks);
      } else {
        await rejectApplication(selectedApplication.value.id, currentUser.value.id, remarks);
      }

      // Refresh applications list
      await loadApplications();

      alert(
        `Application ${confirmAction.value === "approve" ? "approved" : "rejected"} successfully!`,
      );
    }
  } catch (error) {
    console.error("Error updating application:", error);
    alert("Error updating application. Please try again.");
  }

  showConfirm.value = false;
  showDetails.value = false;
};

const viewDocument = (doc: any) => {
  // Here you would open/download the document
  console.log("View document:", doc);
};

const averageScore = computed(() => {
  const { capacity_score, character_score, collateral_score, capital_score } = riskAssessment.value;
  return (capacity_score + character_score + collateral_score + capital_score) / 4;
});

const calculatedRiskLevel = computed(() => {
  const avg = averageScore.value;
  if (avg >= 8) return "low";
  if (avg >= 5) return "medium";
  return "high";
});

const getRiskColor = (level: string) => {
  switch (level) {
    case "low":
      return "success";
    case "medium":
      return "warning";
    case "high":
      return "error";
    default:
      return "primary";
  }
};

const openRiskAssessment = async (application: any) => {
  selectedApplication.value = application;

  // Reset risk assessment form
  riskAssessment.value = {
    capacity_score: 5,
    character_score: 5,
    collateral_score: 5,
    capital_score: 5,
    overall_risk_level: "medium",
    notes: "",
  };

  // Try to load existing assessment
  try {
    const existingAssessment = await getRiskAssessment(application.id);
    if (existingAssessment.length > 0) {
      const assessment = existingAssessment[0];
      riskAssessment.value = {
        capacity_score: assessment.capacity_score,
        character_score: assessment.character_score,
        collateral_score: assessment.collateral_score,
        capital_score: assessment.capital_score,
        overall_risk_level: assessment.overall_risk_level,
        notes: assessment.notes || "",
      };
    }
  } catch (error) {
    console.error("Error loading risk assessment:", error);
  }

  showRiskAssessment.value = true;
};

const saveRiskAssessment = async () => {
  try {
    if (!selectedApplication.value) return;

    const assessmentData = {
      loan_id: selectedApplication.value.id,
      capacity_score: riskAssessment.value.capacity_score,
      character_score: riskAssessment.value.character_score,
      collateral_score: riskAssessment.value.collateral_score,
      capital_score: riskAssessment.value.capital_score,
      overall_risk_level: riskAssessment.value.overall_risk_level,
      notes: riskAssessment.value.notes,
    };

    await createRiskAssessment(assessmentData);

    alert("Risk assessment saved successfully!");
    showRiskAssessment.value = false;
  } catch (error) {
    console.error("Error saving risk assessment:", error);
    alert("Error saving risk assessment. Please try again.");
  }
};

const filterApplications = () => {
  // Trigger reactivity for computed property
};

const loadApplications = async () => {
  loading.value = true;
  try {
    const [apps, products] = await Promise.all([getApplications(), getProducts()]);

    // Transform applications data for table display
    applications.value = apps.map((app) => ({
      id: app.id,
      clientName: `${app.client?.first_name || "Unknown"} ${app.client?.last_name || ""}`.trim(),
      loanProduct: app.loan_product?.name || "Unknown",
      loanAmount: app.principal_amount,
      termMonths: app.term_months,
      purpose: app.purpose,
      status: app.status,
      applicationDate: app.application_date,
      mobileNumber: app.client?.mobile_number || "N/A",
      civilStatus: app.client?.civil_status || "N/A",
      address: app.client?.present_address || "N/A",
      businessName: app.business_name || "N/A",
      businessType: app.business_type || "N/A",
      yearsInBusiness: app.years_in_business || 0,
      monthlyIncome: app.monthly_income || 0,
      monthlyExpenses: app.monthly_expenses || 0,
      documents: [], // Documents would be handled separately
    }));

    // Transform products for filter options
    loanProductOptions.value = products.map((product) => ({
      title: product.name,
      value: product.name,
    }));
  } catch (error) {
    console.error("Error loading applications:", error);
    alert("Error loading applications. Please try again.");
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  await logout();
  router.push("/");
};

onMounted(async () => {
  try {
    // Get current user
    currentUser.value = await getCurrentUser();

    // Load applications
    await loadApplications();
  } catch (error) {
    console.error("Error loading initial data:", error);
  }
});
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
