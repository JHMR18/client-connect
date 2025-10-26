<template>
  <AdminLayout>
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
            color="error"
            prepend-icon="mdi-plus"
            @click="openProductDialog()"
          >
            Add Product
          </v-btn>
        </div>

        <!-- Loading State -->
        <v-progress-linear
          v-if="loading"
          color="error"
          indeterminate
          class="mb-4"
        />

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
                  color="error"
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
                <v-icon size="64" color="error" class="mb-4">mdi-plus-circle</v-icon>
                <h3 class="text-h6 text-error">Add New Product</h3>
                <p class="text-body-2 text-medium-emphasis text-center">
                  Create a new loan product with custom terms and rates
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

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
                  v-model="productFormData.name"
                  label="Product Name"
                  variant="outlined"
                  :rules="[v => !!v || 'Product name is required']"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="productFormData.description"
                  label="Description"
                  variant="outlined"
                  rows="3"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="productFormData.interest_rate"
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
                  v-model.number="productFormData.penalty_rate"
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
                  v-model.number="productFormData.max_term"
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
                  v-model.number="productFormData.min_amount"
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
                  v-model.number="productFormData.max_amount"
                  label="Maximum Amount (₱)"
                  type="number"
                  variant="outlined"
                  :rules="[
                    v => !!v || 'Maximum amount is required',
                    v => v > 0 || 'Amount must be positive',
                    v => v >= productFormData.min_amount || 'Must be greater than minimum amount'
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
              color="error"
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
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { client } from '@/utils/useDirectus'
import { readItems, createItem, updateItem, deleteItem } from '@directus/sdk'

interface LoanProduct {
  id?: string
  name: string
  description: string
  interest_rate: number
  penalty_rate: number
  max_term: number
  min_amount: number
  max_amount: number
}

const showProductDialog = ref(false)
const showDeleteDialog = ref(false)
const editingProduct = ref<LoanProduct | null>(null)
const productToDelete = ref<LoanProduct | null>(null)
const saving = ref(false)
const deleting = ref(false)
const loading = ref(false)
const productForm = ref()

const products = ref<LoanProduct[]>([])

const productFormData = ref<LoanProduct>({
  name: '',
  description: '',
  interest_rate: 0,
  penalty_rate: 0,
  max_term: 0,
  min_amount: 0,
  max_amount: 0
})

// Load products from Directus
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await client.request<LoanProduct[]>(
      readItems('loan_products', {
        fields: ['*']
      })
    )
    products.value = response
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

const openProductDialog = (product: LoanProduct | null = null) => {
  editingProduct.value = product
  if (product) {
    productFormData.value = { ...product }
  } else {
    productFormData.value = {
      name: '',
      description: '',
      interest_rate: 0,
      penalty_rate: 0,
      max_term: 0,
      min_amount: 0,
      max_amount: 0
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
    interest_rate: 0,
    penalty_rate: 0,
    max_term: 0,
    min_amount: 0,
    max_amount: 0
  }
}

const saveProduct = async () => {
  const form = productForm.value
  if (!form) return

  const { valid } = await form.validate()
  if (!valid) return

  saving.value = true

  try {
    if (editingProduct.value && editingProduct.value.id) {
      // Update existing product
      await client.request(
        updateItem('loan_products', editingProduct.value.id, productFormData.value)
      )
    } else {
      // Create new product
      await client.request(
        createItem('loan_products', productFormData.value)
      )
    }

    await loadProducts()
    closeProductDialog()
  } catch (error) {
    console.error('Error saving product:', error)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (product: LoanProduct) => {
  productToDelete.value = product
  showDeleteDialog.value = true
}

const deleteProduct = async () => {
  if (!productToDelete.value || !productToDelete.value.id) return

  deleting.value = true

  try {
    await client.request(
      deleteItem('loan_products', productToDelete.value.id)
    )

    await loadProducts()
    showDeleteDialog.value = false
    productToDelete.value = null
  } catch (error) {
    console.error('Error deleting product:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.product-card {
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.add-card {
  border: 2px dashed rgba(220, 38, 38, 0.3);
  cursor: pointer;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.1) 100%);
}

.add-card:hover {
  border-color: rgba(220, 38, 38, 0.5);
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%);
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
</style>