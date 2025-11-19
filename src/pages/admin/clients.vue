<template>
  <AdminLayout>
    <v-container fluid class="pa-6">
      <!-- Header -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">Client Management</h1>
              <p class="text-body-1 text-medium-emphasis">Manage all client accounts and information</p>
            </div>
            <v-btn color="error" prepend-icon="mdi-account-plus" @click="openCreateDialog">
              Add New Client
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card class="stat-card stat-card-total" elevation="2">
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar color="error" size="48" class="me-3">
                  <v-icon size="24">mdi-account-group</v-icon>
                </v-avatar>
                <div>
                  <p class="text-body-2 text-medium-emphasis mb-1">Total Clients</p>
                  <h3 class="text-h5 font-weight-bold">{{ clients.length }}</h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="stat-card stat-card-active" elevation="2">
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar color="error" size="48" class="me-3" style="background: rgba(220, 38, 38, 0.8) !important;">
                  <v-icon size="24">mdi-account-check</v-icon>
                </v-avatar>
                <div>
                  <p class="text-body-2 text-medium-emphasis mb-1">Active Clients</p>
                  <h3 class="text-h5 font-weight-bold">{{ activeClients }}</h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="stat-card stat-card-pending" elevation="2">
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar size="48" class="me-3" style="background: #424242 !important;">
                  <v-icon size="24" color="white">mdi-account-clock</v-icon>
                </v-avatar>
                <div>
                  <p class="text-body-2 text-medium-emphasis mb-1">Pending</p>
                  <h3 class="text-h5 font-weight-bold">{{ pendingClients }}</h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="stat-card stat-card-inactive" elevation="2">
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar size="48" class="me-3" style="background: #1a1a1a !important;">
                  <v-icon size="24" color="white">mdi-account-off</v-icon>
                </v-avatar>
                <div>
                  <p class="text-body-2 text-medium-emphasis mb-1">Inactive</p>
                  <h3 class="text-h5 font-weight-bold">{{ inactiveClients }}</h3>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filters and Search -->
      <v-card class="mb-6" elevation="2">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Search clients"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="statusFilter"
                :items="['All', 'Active', 'Inactive', 'Draft', 'Suspended']"
                label="Status"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="genderFilter"
                :items="['All', 'Male', 'Female', 'Other']"
                label="Gender"
                variant="outlined"
                density="comfortable"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-btn color="error" block @click="fetchClients" :loading="loading">
                <v-icon start>mdi-refresh</v-icon>
                Refresh
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Clients Table -->
      <v-card elevation="2">
        <v-data-table
          :headers="headers"
          :items="filteredClients"
          :loading="loading"
          :search="search"
          class="elevation-0"
          :items-per-page="10"
        >
          <template #item.name="{ item }">
            <div class="d-flex align-center py-2">
              <v-avatar color="error" size="36" class="me-3">
                <span class="text-white">{{ getInitials(item) }}</span>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ getFullName(item) }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
              </div>
            </div>
          </template>

          <template #item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              variant="flat"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template #item.mobile_number="{ item }">
            {{ item.mobile_number || 'N/A' }}
          </template>

          <template #item.civil_status="{ item }">
            {{ item.civil_status || 'N/A' }}
          </template>

          <template #item.actions="{ item }">
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              color="grey-darken-2"
              @click="viewClient(item)"
            />
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              color="grey-darken-1"
              @click="editClient(item)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="deleteClient(item)"
            />
          </template>

          <template #loading>
            <v-skeleton-loader type="table-row@5" />
          </template>

          <template #no-data>
            <div class="text-center py-8">
              <v-icon size="64" color="grey-lighten-2">mdi-account-group-outline</v-icon>
              <p class="text-h6 text-medium-emphasis mt-4">No clients found</p>
              <v-btn color="error" class="mt-4" @click="openCreateDialog">
                Add First Client
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <!-- View/Edit Dialog -->
      <v-dialog v-model="dialog" max-width="900" scrollable>
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between bg-error pa-4">
            <span class="text-h5 text-white">
              {{ dialogMode === 'view' ? 'Client Details' : dialogMode === 'edit' ? 'Edit Client' : 'Add New Client' }}
            </span>
            <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog" />
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form ref="clientForm" v-if="selectedClient">
              <v-row>
                <!-- Personal Information -->
                <v-col cols="12">
                  <h3 class="text-h6 mb-3 text-error">Personal Information</h3>
                  <v-divider class="mb-4" />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="selectedClient.first_name"
                    label="First Name"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    :rules="[rules.required]"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="selectedClient.middle_name"
                    label="Middle Name"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="selectedClient.last_name"
                    label="Last Name"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    :rules="[rules.required]"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="selectedClient.nickname"
                    label="Nickname"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="selectedClient.dob"
                    label="Date of Birth"
                    type="date"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedClient.gender"
                    label="Gender"
                    :items="['Male', 'Female', 'Other']"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedClient.civil_status"
                    label="Civil Status"
                    :items="['Single', 'Married', 'Widowed', 'Separated', 'Divorced']"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="selectedClient.citizenship"
                    label="Citizenship"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="12" v-if="selectedClient.civil_status === 'Married'">
                  <v-text-field
                    v-model="selectedClient.spouse_name"
                    label="Spouse Name"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    density="comfortable"
                  />
                </v-col>

                <!-- Contact Information -->
                <v-col cols="12">
                  <h3 class="text-h6 mb-3 mt-4 text-error">Contact Information</h3>
                  <v-divider class="mb-4" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="selectedClient.email"
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    :rules="[rules.required, rules.email]"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="selectedClient.mobile_number"
                    label="Mobile Number"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="selectedClient.present_address"
                    label="Present Address"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    rows="2"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="selectedClient.employment_address"
                    label="Employment Address"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    rows="2"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="selectedClient.previous_address"
                    label="Previous Address"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    rows="2"
                    density="comfortable"
                  />
                </v-col>

                <!-- Account Status -->
                <v-col cols="12">
                  <h3 class="text-h6 mb-3 mt-4 text-error">Account Status</h3>
                  <v-divider class="mb-4" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="selectedClient.status"
                    label="Status"
                    :items="['active', 'inactive', 'draft', 'suspended']"
                    variant="outlined"
                    :readonly="dialogMode === 'view'"
                    density="comfortable"
                  />
                </v-col>

                <v-col cols="12" md="6" v-if="dialogMode !== 'create'">
                  <v-text-field
                    :model-value="formatDate(selectedClient.date_created)"
                    label="Date Created"
                    variant="outlined"
                    readonly
                    density="comfortable"
                  />
                </v-col>

                <!-- Password (only for create/edit) -->
                <v-col cols="12" v-if="dialogMode === 'create'">
                  <h3 class="text-h6 mb-3 mt-4 text-error">Account Security</h3>
                  <v-divider class="mb-4" />
                </v-col>

                <v-col cols="12" md="6" v-if="dialogMode === 'create'">
                  <v-text-field
                    v-model="selectedClient.password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    :rules="[rules.required, rules.minLength]"
                    density="comfortable"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn variant="text" @click="closeDialog">
              {{ dialogMode === 'view' ? 'Close' : 'Cancel' }}
            </v-btn>
            <v-btn
              v-if="dialogMode === 'view'"
              color="grey-darken-2"
              variant="flat"
              @click="dialogMode = 'edit'"
            >
              <v-icon start>mdi-pencil</v-icon>
              Edit
            </v-btn>
            <v-btn
              v-if="dialogMode !== 'view'"
              color="error"
              variant="flat"
              :loading="saving"
              @click="saveClient"
            >
              <v-icon start>mdi-content-save</v-icon>
              {{ dialogMode === 'create' ? 'Create' : 'Save Changes' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="500">
        <v-card>
          <v-card-title class="bg-error text-white pa-4">
            <v-icon start color="white">mdi-alert</v-icon>
            Confirm Delete
          </v-card-title>
          <v-card-text class="pa-6">
            <p class="text-body-1">
              Are you sure you want to delete this client account?
            </p>
            <p class="text-body-2 text-medium-emphasis mt-2">
              <strong>{{ clientToDelete ? getFullName(clientToDelete) : '' }}</strong>
            </p>
            <v-alert type="warning" variant="tonal" class="mt-4">
              This action cannot be undone. All associated data will be permanently removed.
            </v-alert>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
            <v-btn
              color="error"
              variant="flat"
              :loading="deleting"
              @click="confirmDelete"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar for notifications -->
      <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
        {{ snackbarMessage }}
        <template #actions>
          <v-btn variant="text" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { client } from "@/utils/useDirectus";
import { readUsers, createUser, updateUser, deleteUser, readRoles } from "@directus/sdk";

interface Client {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  nickname?: string;
  dob?: string;
  age?: number;
  gender?: string;
  civil_status?: string;
  citizenship?: string;
  spouse_name?: string;
  present_address?: string;
  employment_address?: string;
  previous_address?: string;
  mobile_number?: string;
  email: string;
  status: string;
  date_created?: string;
  password?: string;
  role?: any;
}

const clients = ref<Client[]>([]);
const loading = ref(false);
const search = ref("");
const statusFilter = ref("All");
const genderFilter = ref("All");
const clientRoleId = ref<string | null>(null);

const dialog = ref(false);
const dialogMode = ref<"view" | "edit" | "create">("view");
const selectedClient = ref<Client | null>(null);
const clientForm = ref();
const saving = ref(false);

const deleteDialog = ref(false);
const clientToDelete = ref<Client | null>(null);
const deleting = ref(false);

const snackbar = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref("success");

const headers = [
  { title: "Client", key: "name", sortable: true },
  { title: "Mobile", key: "mobile_number", sortable: true },
  { title: "Gender", key: "gender", sortable: true },
  { title: "Civil Status", key: "civil_status", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Actions", key: "actions", sortable: false, align: "center" }
];

const rules = {
  required: (v: string) => !!v || "This field is required",
  email: (v: string) => /.+@.+\..+/.test(v) || "Email must be valid",
  minLength: (v: string) => v.length >= 8 || "Password must be at least 8 characters"
};

const filteredClients = computed(() => {
  let filtered = clients.value;

  if (statusFilter.value !== "All") {
    filtered = filtered.filter(
      (client) => client.status.toLowerCase() === statusFilter.value.toLowerCase()
    );
  }

  if (genderFilter.value !== "All") {
    filtered = filtered.filter(
      (client) => client.gender === genderFilter.value
    );
  }

  return filtered;
});

const activeClients = computed(() =>
  clients.value.filter((c) => c.status === "active").length
);

const pendingClients = computed(() =>
  clients.value.filter((c) => c.status === "draft").length
);

const inactiveClients = computed(() =>
  clients.value.filter((c) => c.status === "inactive" || c.status === "suspended").length
);

const fetchClients = async () => {
  loading.value = true;
  try {
    // First, fetch the client role ID if not already fetched
    if (!clientRoleId.value) {
      const roles: any = await client.request(
        readRoles({
          filter: {
            name: {
              _eq: "client"
            }
          },
          fields: ["id", "name"]
        })
      );
      
      if (roles && roles.length > 0) {
        clientRoleId.value = roles[0].id;
      }
    }

    // Fetch all users
    const response: any = await client.request(
      readUsers({
        fields: [
          "id",
          "first_name",
          "middle_name",
          "last_name",
          "nickname",
          "dob",
          "gender",
          "civil_status",
          "citizenship",
          "spouse_name",
          "present_address",
          "employment_address",
          "previous_address",
          "mobile_number",
          "email",
          "status",
          "date_created",
          "role"
        ] as any,
        limit: -1
      })
    );
    
    // Filter to only show users with 'client' role
    const allUsers = response as Client[];
    if (clientRoleId.value) {
      clients.value = allUsers.filter((user: Client) => user.role === clientRoleId.value);
    } else {
      // Fallback: if no client role found, show no users
      clients.value = [];
      console.warn("Client role not found in the system");
    }
  } catch (error) {
    console.error("Error fetching clients:", error);
    showSnackbar("Failed to fetch clients", "error");
  } finally {
    loading.value = false;
  }
};

const getFullName = (client: Client) => {
  const parts = [client.first_name, client.middle_name, client.last_name].filter(Boolean);
  return parts.join(" ");
};

const getInitials = (client: Client) => {
  return `${client.first_name?.[0] || ""}${client.last_name?.[0] || ""}`.toUpperCase();
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: "error",
    inactive: "grey-darken-2",
    draft: "grey-darken-1",
    suspended: "black"
  };
  return colors[status.toLowerCase()] || "grey";
};

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const openCreateDialog = () => {
  dialogMode.value = "create";
  selectedClient.value = {
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    status: "active",
    password: ""
  };
  dialog.value = true;
};

const viewClient = (client: Client) => {
  dialogMode.value = "view";
  selectedClient.value = { ...client };
  dialog.value = true;
};

const editClient = (client: Client) => {
  dialogMode.value = "edit";
  selectedClient.value = { ...client };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  selectedClient.value = null;
  dialogMode.value = "view";
};

const saveClient = async () => {
  if (!selectedClient.value) return;

  const form = clientForm.value;
  if (form) {
    const { valid } = await form.validate();
    if (!valid) return;
  }

  saving.value = true;
  try {
    if (dialogMode.value === "create") {
      // Ensure client role is assigned when creating from admin
      const userData = { 
        ...selectedClient.value,
        role: clientRoleId.value
      };
      await client.request(createUser(userData as any));
      showSnackbar("Client created successfully");
    } else {
      const { id, password, ...updateData } = selectedClient.value;
      await client.request(updateUser(id, updateData as any));
      showSnackbar("Client updated successfully");
    }
    await fetchClients();
    closeDialog();
  } catch (error: any) {
    console.error("Error saving client:", error);
    showSnackbar(error?.errors?.[0]?.message || "Failed to save client", "error");
  } finally {
    saving.value = false;
  }
};

const deleteClient = (client: Client) => {
  clientToDelete.value = client;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!clientToDelete.value) return;

  deleting.value = true;
  try {
    await client.request(deleteUser(clientToDelete.value.id));
    showSnackbar("Client deleted successfully");
    await fetchClients();
    deleteDialog.value = false;
    clientToDelete.value = null;
  } catch (error) {
    console.error("Error deleting client:", error);
    showSnackbar("Failed to delete client", "error");
  } finally {
    deleting.value = false;
  }
};

const showSnackbar = (message: string, color: string = "error") => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(() => {
  fetchClients();
});
</script>

<style scoped>
.stat-card {
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.stat-card-total {
  border-left-color: #dc2626;
}

.stat-card-active {
  border-left-color: #b91c1c;
}

.stat-card-pending {
  border-left-color: #424242;
}

.stat-card-inactive {
  border-left-color: #1a1a1a;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

:deep(.v-data-table) {
  border-radius: 8px;
}

:deep(.v-data-table-header) {
  background-color: #1a1a1a;
}

:deep(.v-data-table-header th) {
  color: white !important;
}

:deep(.v-data-table__td) {
  border-bottom: 1px solid #e0e0e0 !important;
}

:deep(.v-data-table__tr:hover) {
  background-color: rgba(220, 38, 38, 0.05);
}
</style>
