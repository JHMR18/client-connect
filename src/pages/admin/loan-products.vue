<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      color="primary"
      theme="dark"
      width="280"
    >
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
          
          <v-list-group value="loans">
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

          <v-list-group value="products" :model-value="true">
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
        </v-list>
      </div>

      <template #append>
        <div class="pa-4">
          <v-divider class="mb-4" />
          <v-btn
            color="error"
            variant="text"
            prepend-icon="mdi-logout"
            block
            @click="handleLogout"
          >
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
            <h1 class="text-h4 font-weight-bold mb-2">Loan Products</h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              Manage loan products, interest rates, and terms
            </p>
          </div>

          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="openProductDialog()"
          >
            Add Product
          </v-btn>
        </div>

        <!-- Products Grid -->
        <v-row>
          <v-col
            v-for="product in products"
            :key="product.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card class="product-card" height="280">
              <v-card-title class="d-flex justify-space-between align-start">
                <div>
                  <h3 class="text-h6">{{ product.name }}</h3>
                  <p class="text-caption text-medium-emphasis mb-0">
                    ID: {{ product.id }}
                  </p>
                </div>
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      variant="text"
                      size="small"
                      v-bind="props"
                    />
                  </template>
                  <v-list>
                    <v-list-item
                      prepend-icon="mdi-pencil"
                      title="Edit"
                      @click="openProductDialog(product)"
                    />
                    <v-list-item
                      prepend-icon="mdi-delete"
                      title="Delete"
                      @click="confirmDelete(product)"
                    />
                  </v-list>
                </v-menu>
              </v-card-title>

              <v-card-text>
                <div class="product-details">
                  <div class="detail-row">
                    <span class="label">Interest Rate:</span>
                    <span class="value">{{ product.interest_rate }}% p.a.</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Penalty Rate:</span>
                    <span class="value">{{ product.penalty_rate }}% p.m.</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Max Term:</span>
                    <span class="value">{{ product.max_term }} months</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Amount Range:</span>
                    <span class="value">
                      ₱{{ product.min_amount.toLocaleString() }} - 
                      ₱{{ product.max_amount.toLocaleString() }}
                    </span>
                  </div>
                </div>

                <v-divider class="my-3" />

                <p class="text-body-2 text-medium-emphasis">
                  {{ product.description }}
                </p>
              </v-card-text>

              <v-card-actions>
                <v-chip
                  color="success"
                  size="small"
                  variant="flat"
                >
                  Active
                </v-chip>
                <v-spacer />
                <v-btn
                  color="primary"
                  size="small"
                  variant="outlined"
                  @click="openProductDialog(product)"
                >
                  Edit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Add New Card -->
          <v-col cols="12" md="6" lg="4">
            <v-card
              class="product-card add-card"
              height="280"
              @click="openProductDialog()"
            >
              <v-card-text class="d-flex flex-column align-center justify-center fill-height">
                <v-icon size="64" class="text-primary mb-4">mdi-plus-circle</v-icon>
                <h3 class="text-h6 text-primary">Add New Product</h3>
                <p class="text-body-2 text-medium-emphasis text-center">
                  Create a new loan product with custom terms and rates
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Product Form Dialog -->
    <v-dialog v-model="showProductDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>
          {{ editingProduct ? 'Edit Loan Product' : 'Add New Loan Product' }}
        </v-card-title>

        <v-form ref="productForm" @submit.prevent="saveProduct">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="productForm.name"
                  label="Product Name"
                  variant="outlined"
                  :rules="[v => !!v || 'Product name is required']"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="productForm.description"
                  label="Description"
                  variant="outlined"
                  rows="3"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="productForm.interest_rate"
                  label="Interest Rate (%)"
                  type="number"
                  step="0.01"
                  variant="outlined"
                  :rules="[
                    v => !!v || 'Interest rate is required',
                    v => v > 0 || 'Interest rate must be positive',
                    v => v <= 100 || 'Interest rate must be realistic'
                  ]"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="productForm.penalty_rate"
                  label="Penalty Rate (% per month)"
                  type="number"
                  step="0.01"
                  variant="outlined"
                  :rules="[
                    v => !!v || 'Penalty rate is required',
                    v => v > 0 || 'Penalty rate must be positive'
                  ]"
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="productForm.max_term"
                  label="Maximum Term (months)"
                  type="number"
                  variant="outlined"
                  :rules="[
                    v => !!v || 'Maximum term is required',
                    v => v > 0 || 'Term must be positive',
                    v => v <= 360 || 'Maximum term is 360 months'
                  ]"
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="productForm.min_amount"
                  label="Minimum Amount (₱)"
                  type="number"
                  variant="outlined"
                  :rules="[
                    v => !!v || 'Minimum amount is required',
                    v => v > 0 || 'Amount must be positive'
                  ]"
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="productForm.max_amount"
                  label="Maximum Amount (₱)"
                  type="number"
                  variant="outlined"
                  :rules="[
                    v => !!v || 'Maximum amount is required',
                    v => v > 0 || 'Amount must be positive',
                    v => v >= productForm.min_amount || 'Must be greater than minimum amount'
                  ]"
                  required
                />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn @click="closeProductDialog">Cancel</v-btn>
            <v-btn
              type="submit"
              color="primary"
              :loading="saving"
            >
              {{ editingProduct ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Delete Loan Product</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ productToDelete?.name }}"? 
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            @click="deleteProduct"
            :loading="deleting"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/utils/useAuth'

const router = useRouter()
const { logout } = useAuth()

const drawer = ref(true)
const showProductDialog = ref(false)
const showDeleteDialog = ref(false)
const editingProduct = ref(null)
const productToDelete = ref(null)
const saving = ref(false)
const deleting = ref(false)
const productForm = ref()

// Mock data - replace with API calls
const products = ref([
  {
    id: 'PROD-001',
    name: 'Business Loan',
    description: 'Loan for business operations, expansion, and equipment purchase',
    interest_rate: 24.0,
    penalty_rate: 3.0,
    max_term: 36,
    min_amount: 10000,
    max_amount: 1000000,
    status: 'active'
  },
  {
    id: 'PROD-002',
    name: 'Personal Loan',
    description: 'Personal loan for emergency expenses and personal needs',
    interest_rate: 30.0,
    penalty_rate: 5.0,
    max_term: 24,
    min_amount: 5000,
    max_amount: 200000,
    status: 'active'
  },
  {
    id: 'PROD-003',
    name: 'Emergency Loan',
    description: 'Quick approval loan for urgent financial needs',
    interest_rate: 36.0,
    penalty_rate: 5.0,
    max_term: 12,
    min_amount: 1000,
    max_amount: 50000,
    status: 'active'
  },
  {
    id: 'PROD-004',
    name: 'Equipment Loan',
    description: 'Specialized loan for purchasing business equipment and machinery',
    interest_rate: 18.0,
    penalty_rate: 2.5,
    max_term: 60,
    min_amount: 25000,
    max_amount: 500000,
    status: 'active'
  }
])

const productFormData = ref({
  name: '',
  description: '',
  interest_rate: null,
  penalty_rate: null,
  max_term: null,
  min_amount: null,
  max_amount: null
})

const openProductDialog = (product = null) => {
  editingProduct.value = product
  if (product) {
    productFormData.value = { ...product }
  } else {
    productFormData.value = {
      name: '',
      description: '',
      interest_rate: null,
      penalty_rate: null,
      max_term: null,
      min_amount: null,
      max_amount: null
    }
  }
  showProductDialog.value = true
}

const closeProductDialog = () => {
  showProductDialog.value = false
  editingProduct.value = null
  productFormData.value = {
    name: '',
    description: '',
    interest_rate: null,
    penalty_rate: null,
    max_term: null,
    min_amount: null,
    max_amount: null
  }
}

const saveProduct = async () => {
  const form = productForm.value
  if (!form) return

  const { valid } = await form.validate()
  if (!valid) return

  saving.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingProduct.value) {
      // Update existing product
      const index = products.value.findIndex(p => p.id === editingProduct.value.id)
      if (index !== -1) {
        products.value[index] = { ...editingProduct.value, ...productFormData.value }
      }
    } else {
      // Create new product
      const newProduct = {
        ...productFormData.value,
        id: `PROD-${String(products.value.length + 1).padStart(3, '0')}`,
        status: 'active'
      }
      products.value.push(newProduct)
    }

    closeProductDialog()
  } catch (error) {
    console.error('Error saving product:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteDialog.value = true
}

const deleteProduct = async () => {
  if (!productToDelete.value) return

  deleting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const index = products.value.findIndex(p => p.id === productToDelete.value.id)
    if (index !== -1) {
      products.value.splice(index, 1)
    }

    showDeleteDialog.value = false
    productToDelete.value = null
  } catch (error) {
    console.error('Error deleting product:', error)
  } finally {
    deleting.value = false
  }
}

const handleLogout = async () => {
  await logout()
  router.push('/')
}

onMounted(() => {
  // Load products from API
})
</script>

<style scoped>
.nav-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.product-card {
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.add-card {
  border: 2px dashed rgba(var(--v-theme-primary), 0.3);
  cursor: pointer;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.1) 100%);
}

.add-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-primary), 0.15) 100%);
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-row .label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
}

.detail-row .value {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
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