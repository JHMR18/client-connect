<template>
  <AdminLayout>
    <v-container fluid class="pa-6">
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-8">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Loan Applications</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Review and manage loan applications</p>
        </div>

        <v-btn
          color="error"
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
              <!-- Loan Product Filter Removed -->
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
          <template #item.loanAmount="{ item }"> ₱{{ item.loanAmount.toLocaleString() }} </template>

          <!-- Date formatting -->
          <template #item.applicationDate="{ item }">
            {{ formatDate(item.applicationDate) }}
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-2">
              <v-btn color="error" size="small" variant="tonal" @click="viewApplication(item)">
                <v-icon>mdi-eye</v-icon>
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
                    <v-row v-if="selectedApplication.documents && selectedApplication.documents.length > 0">
                      <v-col
                        cols="6"
                        md="3"
                        v-for="doc in selectedApplication.documents"
                        :key="doc.type"
                      >
                        <v-card class="document-card" variant="tonal" color="error">
                          <v-card-text class="text-center">
                            <v-icon size="32" class="mb-2">{{ getDocumentIcon(doc.type) }}</v-icon>
                            <p class="text-caption font-weight-medium">{{ doc.type }}</p>
                            <p class="text-caption text-medium-emphasis mb-2">{{ doc.fileName }}</p>
                            <v-btn size="small" variant="outlined" color="error" @click="viewDocument(doc)">
                              <v-icon start size="16">mdi-eye</v-icon>
                              View
                            </v-btn>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                    <div v-else class="text-center py-6">
                      <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-file-document-outline</v-icon>
                      <p class="text-body-2 text-medium-emphasis">No documents uploaded</p>
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
            <v-btn
              :color="confirmAction === 'approve' ? 'success' : 'error'"
              @click="executeAction"
            >
              {{ confirmAction === "approve" ? "Approve" : "Reject" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Image Preview Dialog -->
      <v-dialog v-model="showImagePreview" max-width="900">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ previewDocument?.type }}</span>
            <v-btn icon variant="text" @click="showImagePreview = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-0 text-center" style="background: #f5f5f5;">
            <v-img
              v-if="previewDocument?.fileUrl"
              :src="previewDocument.fileUrl"
              max-height="600"
              contain
              class="mx-auto"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="error" />
                </div>
              </template>
              <template #error>
                <div class="d-flex flex-column align-center justify-center fill-height pa-8">
                  <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
                  <p class="text-body-1 mt-4">Unable to preview this file</p>
                  <v-btn
                    color="error"
                    variant="outlined"
                    class="mt-2"
                    @click="openInNewTab(previewDocument?.fileUrl)"
                  >
                    <v-icon start>mdi-open-in-new</v-icon>
                    Open in New Tab
                  </v-btn>
                </div>
              </template>
            </v-img>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-chip size="small" color="grey" variant="tonal">
              {{ previewDocument?.fileName }}
            </v-chip>
            <v-spacer />
            <v-btn
              color="error"
              variant="outlined"
              @click="openInNewTab(previewDocument?.fileUrl)"
            >
              <v-icon start>mdi-open-in-new</v-icon>
              Open in New Tab
            </v-btn>
            <v-btn color="error" @click="showImagePreview = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useLoanApplications, useLoanProducts, useApprovedLoanNotifications } from "@/utils/useSmartLoanApi";
import { getCurrentUser, client } from "@/utils/useDirectus";
import { readItems } from "@directus/sdk";
import AdminLayout from "@/layouts/AdminLayout.vue";

const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";

const router = useRouter();
const loading = ref(false);
const showDetails = ref(false);
const showConfirm = ref(false);
const showImagePreview = ref(false);
const previewDocument = ref<any>(null);

const selectedApplication = ref(null);
const confirmTitle = ref("");
const confirmMessage = ref("");
const confirmAction = ref("");
const itemsPerPage = ref(10);
const currentUser = ref(null);

// API composables
const {
  getApplications,
  approveApplication: approveApplicationApi,
  rejectApplication: rejectApplicationApi,
} = useLoanApplications();
const { getProducts } = useLoanProducts();
const { createApprovedLoanNotification } = useApprovedLoanNotifications();


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

// Methods
const formatCurrency = (amount: number) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "orange-darken-2";
    case "approved":
      return "green-darken-2";
    case "rejected":
      return "error";
    case "under_review":
      return "red-darken-1";
    default:
      return "error";
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
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const viewApplication = async (application: any) => {
  selectedApplication.value = { ...application, documents: [] };
  showDetails.value = true;

  // Fetch documents for this loan
  try {
    const requirements = await client.request(
      readItems("loan_requirments", {
        fields: ["*", "file.*"],
        filter: { loan: { _eq: application.id } },
      })
    );

    // Map requirements to documents format
    const documents = requirements.map((req: any) => ({
      type: formatRequirementType(req.requirement_type),
      requirementType: req.requirement_type,
      fileId: req.file?.id || req.file,
      fileName: req.file?.filename_download || "Document",
      fileUrl: `${baseUrl}/assets/${req.file?.id || req.file}`,
    }));

    selectedApplication.value = { ...selectedApplication.value, documents };
    console.log("📄 Loaded documents:", documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

const formatRequirementType = (type: string) => {
  const typeMap: Record<string, string> = {
    valid_id: "Valid ID",
    permit: "Business Permit",
    photo: "Photo",
    "co-maker_id": "Co-maker ID",
  };
  return typeMap[type] || type;
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
        await approveApplicationApi(selectedApplication.value.id, currentUser.value.id, remarks);

        // Create notification for the client
        try {
          await createApprovedLoanNotification({
            client_id: selectedApplication.value.clientId,
            message: `Your loan application for ${formatCurrency(selectedApplication.value.loanAmount)} has been approved!`,
            read: false,
          });
          console.log("Approved loan notification created successfully");
        } catch (notifError) {
          console.error("Error creating approved loan notification:", notifError);
        }
      } else {
        await rejectApplicationApi(selectedApplication.value.id, currentUser.value.id, remarks);
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
  if (doc.fileUrl) {
    previewDocument.value = doc;
    showImagePreview.value = true;
  } else {
    console.log("No file URL available for document:", doc);
  }
};

const openInNewTab = (url: string) => {
  if (url) {
    window.open(url, "_blank");
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
      clientId: app.client?.id || null,
      clientName: `${app.client?.first_name || "Unknown"} ${app.client?.last_name || ""}`.trim(),
      loanProduct: app.loan_product?.[0]?.loan_products_id?.name || "Unknown",
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
</style>
