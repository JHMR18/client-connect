<template>
  <AdminLayout>
    <v-container fluid class="pa-6">
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-8">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Active Loans</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Manage and monitor active loans</p>
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
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                label="Search Client"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filters.amountFrom"
                label="Amount From (₱)"
                type="number"
                variant="outlined"
                @update:model-value="filterApplications"
              />
            </v-col>
            <v-col cols="12" md="4">
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
          <template #item.loanAmount="{ item }"> ₱{{ item.loanAmount.toLocaleString() }} </template>

          <!-- Date formatting -->
          <template #item.applicationDate="{ item }">
            {{ formatDate(item.applicationDate) }}
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn color="primary" size="small" variant="tonal" @click="viewApplication(item)">
                <v-icon>mdi-eye</v-icon>
                View
              </v-btn>
            </div>
          </template>

          <!-- No data -->
          <template #no-data>
            <div class="text-center pa-8">
              <v-icon size="64" class="text-disabled mb-4">mdi-file-document-outline</v-icon>
              <p class="text-h6 text-disabled">No active loans found</p>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <!-- Application Details Dialog -->
      <v-dialog v-model="showDetails" max-width="1200" scrollable>
        <v-card v-if="selectedApplication">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <h3>Loan Details</h3>
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
                              selectedApplication.monthlyIncome -
                              selectedApplication.monthlyExpenses
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
            <v-btn @click="showDetails = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useLoanApplications, useLoanProducts } from "@/utils/useSmartLoanApi";
import AdminLayout from "@/layouts/AdminLayout.vue";

const loading = ref(false);
const showDetails = ref(false);
const selectedApplication = ref(null);
const itemsPerPage = ref(10);
const searchQuery = ref("");

// API composables
const { getApplications } = useLoanApplications();
const { getProducts } = useLoanProducts();

// Filters
const filters = ref({
  amountFrom: null,
  amountTo: null,
});

// Applications data
const applications = ref([]);

const filteredApplications = computed(() => {
  let filtered = applications.value;

  // Filter for active/approved loans only
  filtered = filtered.filter((app) => ["approved", "active"].includes(app.status));

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((app) => 
      app.clientName.toLowerCase().includes(query) ||
      app.id.toString().includes(query)
    );
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
  { title: "Loan ID", key: "id", sortable: true },
  { title: "Client Name", key: "clientName", sortable: true },
  { title: "Amount", key: "loanAmount", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Approval Date", key: "applicationDate", sortable: true },
  { title: "Actions", key: "actions", sortable: false, width: "100px" },
];

// Methods
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "approved":
      return "blue";
    default:
      return "grey";
  }
};

const getNetIncomeClass = (application: any) => {
  const netIncome = application.monthlyIncome - application.monthlyExpenses;
  if (netIncome > 10000) return "text-green-darken-2";
  if (netIncome > 0) return "text-orange-darken-2";
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
  if (!dateStr) return "N/A";
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

const viewDocument = (doc: any) => {
  console.log("View document:", doc);
};

const loadApplications = async () => {
  loading.value = true;
  try {
    const [apps, products] = await Promise.all([getApplications(), getProducts()]);

    // Transform applications data for table display
    applications.value = apps.map((app) => ({
      id: app.id,
      clientName: `${app.client?.first_name || "Unknown"} ${app.client?.last_name || ""}`.trim(),
      loanProduct: app.loan_product?.[0]?.loan_products_id?.name || "Unknown",
      loanAmount: app.principal_amount,
      status: app.status,
      applicationDate: app.approval_date || app.application_date, // Use approval date for active loans if available
      termMonths: app.term_months,
      purpose: app.purpose,
      monthlyIncome: app.monthly_income,
      monthlyExpenses: app.monthly_expenses,
      businessName: app.business_name,
      businessType: app.business_type,
      yearsInBusiness: app.years_in_business,
      mobileNumber: app.client?.mobile_number || "N/A",
      civilStatus: app.client?.civil_status || "N/A",
      address: app.client?.present_address || "N/A",
      documents: app.loan_requirements?.map((req) => ({
        type: req.requirement_type,
        file: req.file,
      })) || [],
    }));
  } catch (error) {
    console.error("Error loading applications:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadApplications();
});
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
}

.value {
  font-weight: 500;
  font-size: 1rem;
}

.document-card {
  transition: transform 0.2s;
}

.document-card:hover {
  transform: translateY(-2px);
}
</style>
