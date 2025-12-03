<template>
  <AdminLayout>
    <v-container fluid class="pa-6">
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-8">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Risk Assessment</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Assess risk for fully paid loans</p>
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
            <v-chip color="success" size="small" variant="flat">
              Fully Paid
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
              </v-btn>
              <v-btn
                color="error"
                size="small"
                variant="tonal"
                @click="openRiskAssessment(item)"
              >
                <v-icon>mdi-scale-balance</v-icon>
                Assess Risk
              </v-btn>
            </div>
          </template>

          <!-- No data -->
          <template #no-data>
            <div class="text-center pa-8">
              <v-icon size="64" class="text-disabled mb-4">mdi-file-document-outline</v-icon>
              <p class="text-h6 text-disabled">No fully paid loans found</p>
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
            <v-chip color="error" variant="flat">
              Fully Paid
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
            </v-row>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn @click="showDetails = false">Close</v-btn>
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
                      <v-icon class="me-2" color="error">mdi-cash-multiple</v-icon>
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
                      color="error"
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
                      <v-icon class="me-2" color="error">mdi-account-heart</v-icon>
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
                      color="error"
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
                      <v-icon class="me-2" color="error">mdi-home</v-icon>
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
                      color="error"
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
                      <v-icon class="me-2" color="error">mdi-bank</v-icon>
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
                      color="error"
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
            <v-btn color="error" @click="saveRiskAssessment"> Save Assessment </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useLoanApplications, useRiskAssessment } from "@/utils/useSmartLoanApi";
import AdminLayout from "@/layouts/AdminLayout.vue";

const loading = ref(false);
const showDetails = ref(false);
const showRiskAssessment = ref(false);
const selectedApplication = ref<any>(null);
const itemsPerPage = ref(10);
const searchQuery = ref("");

// API composables
const { getApplications } = useLoanApplications();
const { createRiskAssessment, getRiskAssessment } = useRiskAssessment();

// Applications data
const applications = ref<any[]>([]);

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

  // Filter for fully paid loans only
  filtered = filtered.filter((app) => app.fully_paid === true);

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((app) => 
      app.clientName.toLowerCase().includes(query) ||
      app.id.toString().includes(query)
    );
  }

  return filtered;
});

// Table configuration
const headers = [
  { title: "Loan ID", key: "id", sortable: true },
  { title: "Client Name", key: "clientName", sortable: true },
  { title: "Amount", key: "loanAmount", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Date", key: "applicationDate", sortable: true },
  { title: "Actions", key: "actions", sortable: false, width: "200px" },
];

// Methods
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
      loan: selectedApplication.value.id,
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

const loadApplications = async () => {
  loading.value = true;
  try {
    const apps = await getApplications();

    // Transform applications data for table display
    applications.value = apps.map((app) => ({
      id: app.id,
      clientName: `${app.client?.first_name || "Unknown"} ${app.client?.last_name || ""}`.trim(),
      loanProduct: app.loan_product?.[0]?.loan_products_id?.name || "Unknown",
      loanAmount: app.principal_amount,
      status: app.status,
      fully_paid: app.fully_paid,
      applicationDate: app.application_date,
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
</style>
