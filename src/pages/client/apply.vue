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
          <h1 class="text-h4 font-weight-bold mb-2">Loan Application</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Complete the form below to apply for a loan
          </p>
        </div>

        <v-card>
          <v-card-text>
            <!-- Progress Stepper -->
            <v-stepper v-model="currentStep" alt-labels class="elevation-0">
              <v-stepper-header>
                <v-stepper-item
                  :complete="currentStep > 1"
                  :value="1"
                  title="Personal Information"
                  icon="mdi-account"
                />
                <v-divider />
                <v-stepper-item
                  :complete="currentStep > 2"
                  :value="2"
                  title="Family Information"
                  icon="mdi-account-group"
                />
                <v-divider />
                <v-stepper-item
                  :complete="currentStep > 3"
                  :value="3"
                  title="Business Information"
                  icon="mdi-briefcase"
                />
                <v-divider />
                <v-stepper-item
                  :complete="currentStep > 4"
                  :value="4"
                  title="Financial Information"
                  icon="mdi-cash"
                />
                <v-divider />
                <v-stepper-item
                  :complete="currentStep > 5"
                  :value="5"
                  title="Requirements"
                  icon="mdi-file-document"
                />
                <v-divider />
                <v-stepper-item
                  :complete="currentStep > 6"
                  :value="6"
                  title="Review"
                  icon="mdi-check-circle"
                />
              </v-stepper-header>

              <v-stepper-window>
                <!-- Step 1: Personal Information -->
                <v-stepper-window-item :value="1">
                  <v-form ref="personalForm">
                    <v-row>
                      <v-col cols="12">
                        <h3 class="text-h6 mb-4">Personal Information</h3>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="application.firstName"
                          label="First Name"
                          variant="outlined"
                          :rules="[(v) => !!v || 'First name is required']"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="application.middleName"
                          label="Middle Name"
                          variant="outlined"
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="application.lastName"
                          label="Last Name"
                          variant="outlined"
                          :rules="[(v) => !!v || 'Last name is required']"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="application.nickname"
                          label="Nickname"
                          variant="outlined"
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="application.dob"
                          label="Date of Birth"
                          type="date"
                          variant="outlined"
                          :rules="[(v) => !!v || 'Date of birth is required']"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-select
                          v-model="application.gender"
                          :items="['Male', 'Female', 'Other']"
                          label="Gender"
                          variant="outlined"
                          :rules="[(v) => !!v || 'Gender is required']"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-select
                          v-model="application.civilStatus"
                          :items="['Single', 'Married', 'Divorced', 'Widowed', 'Separated']"
                          label="Civil Status"
                          variant="outlined"
                          :rules="[(v) => !!v || 'Civil status is required']"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="application.citizenship"
                          label="Citizenship"
                          variant="outlined"
                          :rules="[(v) => !!v || 'Citizenship is required']"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="6" v-if="application.civilStatus === 'Married'">
                        <v-text-field
                          v-model="application.spouseName"
                          label="Spouse Name"
                          variant="outlined"
                          :rules="
                            application.civilStatus === 'Married'
                              ? [(v) => !!v || 'Spouse name is required']
                              : []
                          "
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="application.mobileNumber"
                          label="Mobile Number"
                          variant="outlined"
                          :rules="[
                            (v) => !!v || 'Mobile number is required',
                            (v) =>
                              /^[0-9+\-\s()]+$/.test(v) || 'Please enter a valid mobile number',
                          ]"
                          required
                        />
                      </v-col>

                      <v-col cols="12">
                        <v-textarea
                          v-model="application.presentAddress"
                          label="Present Address"
                          variant="outlined"
                          rows="3"
                          :rules="[(v) => !!v || 'Present address is required']"
                          required
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-stepper-window-item>

                <!-- Step 2: Family Information -->
                <v-stepper-window-item :value="2">
                  <v-row>
                    <v-col cols="12">
                      <h3 class="text-h6 mb-4">Family Information</h3>
                    </v-col>

                    <v-col cols="12">
                      <div class="d-flex justify-space-between align-center mb-4">
                        <h4 class="text-subtitle-1">Children</h4>
                        <v-btn color="red" prepend-icon="mdi-plus" @click="addChild">
                          Add Child
                        </v-btn>
                      </div>

                      <div v-if="application.children.length === 0" class="text-center pa-8">
                        <v-icon size="64" class="text-disabled mb-4">mdi-account-child</v-icon>
                        <p class="text-h6 text-disabled">No children added</p>
                        <p class="text-caption text-disabled">
                          Click "Add Child" to add family members
                        </p>
                      </div>

                      <v-card
                        v-for="(child, index) in application.children"
                        :key="index"
                        class="mb-4"
                        variant="outlined"
                      >
                        <v-card-title class="d-flex justify-space-between align-center">
                          <span>Child {{ index + 1 }}</span>
                          <v-btn
                            color="error"
                            icon
                            variant="text"
                            size="small"
                            @click="removeChild(index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="child.name"
                                label="Name"
                                variant="outlined"
                                :rules="[(v) => !!v || 'Name is required']"
                                required
                              />
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field
                                v-model="child.school"
                                label="School"
                                variant="outlined"
                              />
                            </v-col>
                            <v-col cols="12" md="2">
                              <v-select
                                v-model="child.grade"
                                :items="gradeLevels"
                                label="Grade Level"
                                variant="outlined"
                              />
                            </v-col>
                            <v-col cols="12" md="2">
                              <v-text-field
                                v-model.number="child.age"
                                label="Age"
                                type="number"
                                variant="outlined"
                                :rules="[
                                  (v) => v >= 0 || 'Age must be positive',
                                  (v) => v <= 30 || 'Please verify age',
                                ]"
                              />
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-stepper-window-item>

                <!-- Step 3: Business Information -->
                <v-stepper-window-item :value="3">
                  <v-form ref="businessForm">
                    <v-row>
                      <v-col cols="12">
                        <h3 class="text-h6 mb-4">Business Information</h3>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="application.businessName"
                          label="Business Name"
                          variant="outlined"
                          :rules="[(v) => !!v || 'Business name is required']"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="application.businessType"
                          label="Business Type"
                          variant="outlined"
                          :rules="[(v) => !!v || 'Business type is required']"
                          required
                        />
                      </v-col>

                      <v-col cols="12">
                        <v-textarea
                          v-model="application.businessAddress"
                          label="Business Address"
                          variant="outlined"
                          rows="3"
                          :rules="[(v) => !!v || 'Business address is required']"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="application.businessPhone"
                          label="Business Phone"
                          variant="outlined"
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="application.businessEmail"
                          label="Business Email"
                          type="email"
                          variant="outlined"
                          :rules="[
                            (v) => !v || /.+@.+\..+/.test(v) || 'Please enter a valid email',
                          ]"
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="application.yearsInBusiness"
                          label="Years in Business"
                          type="number"
                          variant="outlined"
                          :rules="[
                            (v) => !!v || 'Years in business is required',
                            (v) => v >= 0 || 'Years must be positive',
                          ]"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="application.numberOfEmployees"
                          label="Number of Employees"
                          type="number"
                          variant="outlined"
                          :rules="[(v) => v >= 0 || 'Number must be positive']"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-stepper-window-item>

                <!-- Step 4: Financial Information -->
                <v-stepper-window-item :value="4">
                  <v-form ref="financialForm">
                    <v-row>
                      <v-col cols="12">
                        <h3 class="text-h6 mb-4">Financial Information</h3>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-select
                          v-model="application.loanProduct"
                          :items="loanProducts"
                          item-title="name"
                          item-value="id"
                          label="Loan Product"
                          variant="outlined"
                          :rules="[(v) => !!v || 'Loan product is required']"
                          required
                          @update:model-value="onLoanProductChange"
                        />
                        <v-alert
                          v-if="selectedProduct"
                          type="info"
                          variant="tonal"
                          density="compact"
                          class="mt-2"
                        >
                          <strong>Interest Rate:</strong> {{ selectedProduct.interest_rate }}% p.a. | 
                          <strong>Max Term:</strong> {{ selectedProduct.max_term }} months
                        </v-alert>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="application.loanAmount"
                          label="Loan Amount (₱)"
                          type="number"
                          variant="outlined"
                          :hint="selectedProductHints.amount"
                          persistent-hint
                          :rules="[
                            (v) => !!v || 'Loan amount is required',
                            (v) => v > 0 || 'Loan amount must be positive',
                            (v) =>
                              !selectedProduct ||
                              v >= selectedProduct.min_amount ||
                              `Minimum loan amount is ₱${selectedProduct.min_amount.toLocaleString()}`,
                            (v) =>
                              !selectedProduct ||
                              v <= selectedProduct.max_amount ||
                              `Maximum loan amount is ₱${selectedProduct.max_amount.toLocaleString()}`,
                          ]"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="application.termMonths"
                          label="Loan Term (months)"
                          type="number"
                          variant="outlined"
                          :hint="selectedProductHints.term"
                          persistent-hint
                          :rules="[
                            (v) => !!v || 'Loan term is required',
                            (v) => v > 0 || 'Term must be positive',
                            (v) =>
                              !selectedProduct ||
                              v <= selectedProduct.max_term ||
                              `Maximum term is ${selectedProduct.max_term} months`,
                          ]"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="application.purpose"
                          label="Purpose of Loan"
                          variant="outlined"
                          :rules="[(v) => !!v || 'Purpose is required']"
                          required
                        />
                      </v-col>

                      <v-col cols="12">
                        <h4 class="text-subtitle-1 mb-3">Monthly Income & Expenses</h4>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model.number="application.monthlyIncome"
                          label="Monthly Income (₱)"
                          type="number"
                          variant="outlined"
                          :rules="[
                            (v) => !!v || 'Monthly income is required',
                            (v) => v > 0 || 'Income must be positive',
                          ]"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model.number="application.monthlyExpenses"
                          label="Monthly Expenses (₱)"
                          type="number"
                          variant="outlined"
                          :rules="[
                            (v) => !!v || 'Monthly expenses is required',
                            (v) => v >= 0 || 'Expenses cannot be negative',
                          ]"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          :value="netIncome"
                          label="Net Monthly Income (₱)"
                          variant="outlined"
                          readonly
                          :color="netIncomeColor"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-stepper-window-item>

                <!-- Step 5: Requirements -->
                <v-stepper-window-item :value="5">
                  <v-row>
                    <v-col cols="12">
                      <h3 class="text-h6 mb-4">Document Requirements</h3>
                      <p class="text-body-2 text-medium-emphasis mb-6">
                        Please upload the following required documents for your loan application.
                      </p>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="requirement-card">
                        <v-card-title class="d-flex align-center">
                          <v-icon class="me-2" color="error">mdi-card-account-details</v-icon>
                          Valid ID
                          <v-chip color="error" size="small" class="ml-2">Required</v-chip>
                        </v-card-title>
                        <v-card-text>
                          <v-file-input
                            v-model="application.validId"
                            label="Upload Valid ID"
                            accept="image/*,application/pdf"
                            variant="outlined"
                            prepend-icon=""
                            prepend-inner-icon="mdi-paperclip"
                            :rules="[(v) => !!v || 'Valid ID is required']"
                            required
                            @change="onFileChange($event, 'validId')"
                          />
                          <v-progress-linear
                            v-if="uploadProgress.validId > 0 && uploadProgress.validId < 100"
                            v-model="uploadProgress.validId"
                            color="error"
                            class="mt-2"
                          />
                          <v-alert
                            v-if="uploadedFiles.validId"
                            type="success"
                            variant="tonal"
                            density="compact"
                            class="mt-2"
                          >
                            File uploaded successfully
                          </v-alert>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="requirement-card">
                        <v-card-title class="d-flex align-center">
                          <v-icon class="me-2" color="error">mdi-file-document</v-icon>
                          Business Permit
                          <v-chip color="error" size="small" class="ml-2">Required</v-chip>
                        </v-card-title>
                        <v-card-text>
                          <v-file-input
                            v-model="application.businessPermit"
                            label="Upload Business Permit"
                            accept="image/*,application/pdf"
                            variant="outlined"
                            prepend-icon=""
                            prepend-inner-icon="mdi-paperclip"
                            :rules="[(v) => !!v || 'Business permit is required']"
                            required
                            @change="onFileChange($event, 'businessPermit')"
                          />
                          <v-progress-linear
                            v-if="uploadProgress.businessPermit > 0 && uploadProgress.businessPermit < 100"
                            v-model="uploadProgress.businessPermit"
                            color="error"
                            class="mt-2"
                          />
                          <v-alert
                            v-if="uploadedFiles.businessPermit"
                            type="success"
                            variant="tonal"
                            density="compact"
                            class="mt-2"
                          >
                            File uploaded successfully
                          </v-alert>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="requirement-card">
                        <v-card-title class="d-flex align-center">
                          <v-icon class="me-2" color="error">mdi-camera</v-icon>
                          Photo
                          <v-chip color="error" size="small" class="ml-2">Required</v-chip>
                        </v-card-title>
                        <v-card-text>
                          <v-file-input
                            v-model="application.photo"
                            label="Upload Photo"
                            accept="image/*"
                            variant="outlined"
                            prepend-icon=""
                            prepend-inner-icon="mdi-paperclip"
                            :rules="[(v) => !!v || 'Photo is required']"
                            required
                            @change="onFileChange($event, 'photo')"
                          />
                          <v-progress-linear
                            v-if="uploadProgress.photo > 0 && uploadProgress.photo < 100"
                            v-model="uploadProgress.photo"
                            color="error"
                            class="mt-2"
                          />
                          <v-alert
                            v-if="uploadedFiles.photo"
                            type="success"
                            variant="tonal"
                            density="compact"
                            class="mt-2"
                          >
                            File uploaded successfully
                          </v-alert>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="requirement-card">
                        <v-card-title class="d-flex align-center">
                          <v-icon class="me-2" color="grey">mdi-account-supervisor</v-icon>
                          Co-maker ID
                          <v-chip color="grey" size="small" class="ml-2">Optional</v-chip>
                        </v-card-title>
                        <v-card-text>
                          <v-file-input
                            v-model="application.coMakerId"
                            label="Upload Co-maker ID"
                            accept="image/*,application/pdf"
                            variant="outlined"
                            prepend-icon=""
                            prepend-inner-icon="mdi-paperclip"
                            @change="onFileChange($event, 'coMakerId')"
                          />
                          <v-progress-linear
                            v-if="uploadProgress.coMakerId > 0 && uploadProgress.coMakerId < 100"
                            v-model="uploadProgress.coMakerId"
                            color="error"
                            class="mt-2"
                          />
                          <v-alert
                            v-if="uploadedFiles.coMakerId"
                            type="success"
                            variant="tonal"
                            density="compact"
                            class="mt-2"
                          >
                            File uploaded successfully
                          </v-alert>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-stepper-window-item>

                <!-- Step 6: Review -->
                <v-stepper-window-item :value="6">
                  <v-row>
                    <v-col cols="12">
                      <h3 class="text-h6 mb-4">Review Application</h3>
                      <p class="text-body-2 text-medium-emphasis mb-6">
                        Please review your application details before submitting.
                      </p>
                    </v-col>

                    <v-col cols="12">
                      <v-card variant="outlined">
                        <v-card-title>Application Summary</v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" md="6">
                              <h4 class="text-subtitle-1 mb-2">Personal Information</h4>
                              <p><strong>Name:</strong> {{ fullName }}</p>
                              <p><strong>Mobile:</strong> {{ application.mobileNumber }}</p>
                              <p><strong>Civil Status:</strong> {{ application.civilStatus }}</p>
                            </v-col>
                            <v-col cols="12" md="6">
                              <h4 class="text-subtitle-1 mb-2">Loan Details</h4>
                              <p>
                                <strong>Amount:</strong> ₱{{
                                  application.loanAmount?.toLocaleString()
                                }}
                              </p>
                              <p><strong>Term:</strong> {{ application.termMonths }} months</p>
                              <p><strong>Purpose:</strong> {{ application.purpose }}</p>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12">
                      <v-checkbox
                        v-model="application.termsAccepted"
                        color="error"
                        :rules="[(v) => !!v || 'You must accept the terms and conditions']"
                        required
                      >
                        <template #label>
                          <div>
                            I agree to the
                            <a href="#" @click.prevent="showTerms = true">terms and conditions</a>
                            and confirm that all information provided is accurate.
                          </div>
                        </template>
                      </v-checkbox>
                    </v-col>
                  </v-row>
                </v-stepper-window-item>
              </v-stepper-window>

              <!-- Navigation Buttons -->
              <v-card-actions class="justify-space-between pa-6">
                <v-btn v-if="currentStep > 1" color="red" variant="outlined" @click="currentStep--">
                  Previous
                </v-btn>
                <v-spacer v-else />

                <v-btn v-if="currentStep < 6" color="red" @click="nextStep"> Next </v-btn>
                <v-btn 
                  v-else 
                  color="red" 
                  :loading="submitting" 
                  :disabled="!application.termsAccepted"
                  @click="submitApplication"
                >
                  Submit Application
                </v-btn>
              </v-card-actions>
            </v-stepper>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Terms Dialog -->
    <v-dialog v-model="showTerms" max-width="600">
      <v-card>
        <v-card-title>Terms and Conditions</v-card-title>
        <v-card-text>
          <div class="terms-content">
            <p>
              By submitting this loan application, you agree to the following terms and conditions:
            </p>
            <ul>
              <li>All information provided is accurate and complete</li>
              <li>You authorize credit checks and verification of information</li>
              <li>Interest rates are subject to credit evaluation</li>
              <li>Loan approval is not guaranteed</li>
              <li>Processing fees may apply</li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showTerms = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/utils/useAuth";
import {
  useLoanApplications,
  useLoanProducts,
  useChildren,
  useUserProfile,
} from "@/utils/useSmartLoanApi";
import { getCurrentUser, client } from "@/utils/useDirectus";
import { createItem } from '@directus/sdk';

const router = useRouter();
const { logout } = useAuth();

const drawer = ref(true);
const currentStep = ref(1);
const submitting = ref(false);
const showTerms = ref(false);
const currentUser = ref(null);

// Form refs
const personalForm = ref();
const businessForm = ref();
const financialForm = ref();

// API composables
const { createApplication } = useLoanApplications();
const { getProducts } = useLoanProducts();
const { createChild } = useChildren();
const { updateUserProfile, getUserProfile } = useUserProfile();

// Loan products
const loanProducts = ref([]);

// File upload tracking
const uploadedFiles = ref({
  validId: null,
  businessPermit: null,
  photo: null,
  coMakerId: null,
});

const uploadProgress = ref({
  validId: 0,
  businessPermit: 0,
  photo: 0,
  coMakerId: 0,
});

// Grade levels for children
const gradeLevels = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11 (Senior High)",
  "Grade 12 (Senior High)",
  "College 1st Year",
  "College 2nd Year",
  "College 3rd Year",
  "College 4th Year",
  "College 5th Year",
];

// Application data
const application = ref({
  // Personal Information
  firstName: "",
  middleName: "",
  lastName: "",
  nickname: "",
  dob: "",
  gender: "",
  civilStatus: "",
  citizenship: "Filipino",
  spouseName: "",
  mobileNumber: "",
  presentAddress: "",

  // Family Information
  children: [] as Array<{
    name: string;
    school: string;
    grade: string;
    age: number;
  }>,

  // Business Information
  businessName: "",
  businessType: "",
  businessAddress: "",
  businessPhone: "",
  businessEmail: "",
  yearsInBusiness: "",
  numberOfEmployees: "",

  // Financial Information
  loanProduct: null,
  loanAmount: null,
  termMonths: null,
  purpose: "",
  monthlyIncome: null,
  monthlyExpenses: null,

  // Requirements
  validId: null,
  businessPermit: null,
  photo: null,
  coMakerId: null,

  // Terms
  termsAccepted: false,
});

// Computed properties
const fullName = computed(() => {
  const names = [
    application.value.firstName,
    application.value.middleName,
    application.value.lastName,
  ];
  return names.filter((name) => name).join(" ");
});

const netIncome = computed(() => {
  const income = application.value.monthlyIncome || 0;
  const expenses = application.value.monthlyExpenses || 0;
  return income - expenses;
});

const netIncomeColor = computed(() => {
  if (netIncome.value > 10000) return "success";
  if (netIncome.value > 0) return "warning";
  return "error";
});

// Selected loan product
const selectedProduct = computed(() => {
  if (!application.value.loanProduct) return null;
  return loanProducts.value.find((p) => p.id === application.value.loanProduct);
});

// Product hints
const selectedProductHints = computed(() => {
  if (!selectedProduct.value) {
    return {
      amount: "Select a loan product first",
      term: "Select a loan product first",
    };
  }
  return {
    amount: `Min: ₱${selectedProduct.value.min_amount.toLocaleString()} - Max: ₱${selectedProduct.value.max_amount.toLocaleString()} | Interest Rate: ${selectedProduct.value.interest_rate}%`,
    term: `Maximum ${selectedProduct.value.max_term} months | Interest Rate: ${selectedProduct.value.interest_rate}%`,
  };
});

// Methods
// Upload file to Directus
const uploadFileToDirectus = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const baseUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
  
  // Get access token from cookies
  const getAccessToken = (): string | null => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'accessToken') {
        return decodeURIComponent(value);
      }
    }
    return null;
  };
  
  const accessToken = getAccessToken();
  
  const headers: HeadersInit = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetch(`${baseUrl}/files`, {
    method: 'POST',
    headers: headers,
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Upload error:', errorData);
    throw new Error(errorData.errors?.[0]?.message || 'File upload failed');
  }

  const data = await response.json();
  return data.data.id; // Return the file ID
};

// Handle file change event
const onFileChange = async (event: Event, fieldName: string) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;

  try {
    uploadProgress.value[fieldName] = 10;
    
    // Upload to Directus
    const fileId = await uploadFileToDirectus(file);
    
    uploadProgress.value[fieldName] = 100;
    uploadedFiles.value[fieldName] = fileId;
    
    console.log(`${fieldName} uploaded:`, fileId);
  } catch (error) {
    console.error(`Error uploading ${fieldName}:`, error);
    uploadProgress.value[fieldName] = 0;
    alert(`Failed to upload ${fieldName}. Please try again.`);
  }
};

const onLoanProductChange = () => {
  // Reset loan amount and term if they exceed the new product's limits
  if (selectedProduct.value) {
    if (application.value.loanAmount) {
      if (application.value.loanAmount < selectedProduct.value.min_amount) {
        application.value.loanAmount = selectedProduct.value.min_amount;
      }
      if (application.value.loanAmount > selectedProduct.value.max_amount) {
        application.value.loanAmount = selectedProduct.value.max_amount;
      }
    }
    if (
      application.value.termMonths &&
      application.value.termMonths > selectedProduct.value.max_term
    ) {
      application.value.termMonths = selectedProduct.value.max_term;
    }
  }
};

// Methods
const addChild = () => {
  application.value.children.push({
    name: "",
    school: "",
    grade: "",
    age: 0,
  });
};

const removeChild = (index: number) => {
  application.value.children.splice(index, 1);
};

const nextStep = async () => {
  // Validate current step
  let isValid = true;

  switch (currentStep.value) {
    case 1:
      if (personalForm.value) {
        const { valid } = await personalForm.value.validate();
        isValid = valid;
      }
      break;
    case 3:
      if (businessForm.value) {
        const { valid } = await businessForm.value.validate();
        isValid = valid;
      }
      break;
    case 4:
      if (financialForm.value) {
        const { valid } = await financialForm.value.validate();
        isValid = valid;
      }
      break;
  }

  if (isValid) {
    currentStep.value++;
  }
};

const submitApplication = async () => {
  submitting.value = true;

  try {
    if (!currentUser.value) {
      throw new Error("User not authenticated");
    }

    // Calculate age from date of birth
    const dob = new Date(application.value.dob);
    const today = new Date();
    const age =
      today.getFullYear() -
      dob.getFullYear() -
      (today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        ? 1
        : 0);

    // First, update user profile with personal information
    const userUpdateData = {
      first_name: application.value.firstName,
      middle_name: application.value.middleName || null,
      last_name: application.value.lastName,
      nickname: application.value.nickname || null,
      dob: application.value.dob,
      age: age,
      gender: application.value.gender,
      civil_status: application.value.civilStatus,
      citizenship: application.value.citizenship,
      spouse_name: application.value.spouseName || null,
      present_address: application.value.presentAddress,
      mobile_number: application.value.mobileNumber,
    };

    await updateUserProfile(currentUser.value.id, userUpdateData);

    // Prepare loan application data (only loan-specific fields)
    const loanData = {
      client: currentUser.value.id, // Reference to user ID (Many-to-One)
      // loan_product is a One-to-Many relation, so we need to use create/update/delete format
      loan_product: {
        create: [
          {
            loan_products_id: parseInt(application.value.loanProduct),
          }
        ],
        update: [],
        delete: [],
      },
      principal_amount: parseFloat(application.value.loanAmount),
      term_months: parseInt(application.value.termMonths),
      status: "pending",
      application_date: new Date().toISOString().split("T")[0], // Date only

      // Business Information
      business_name: application.value.businessName || null,
      business_type: application.value.businessType || null,
      business_address: application.value.businessAddress || null,
      business_phone: application.value.businessPhone || null,
      business_email: application.value.businessEmail || null,
      years_in_business: application.value.yearsInBusiness
        ? parseInt(application.value.yearsInBusiness)
        : null,
      number_of_employees: application.value.numberOfEmployees
        ? parseInt(application.value.numberOfEmployees)
        : null,

      // Financial Information
      monthly_income: parseFloat(application.value.monthlyIncome),
      monthly_expenses: parseFloat(application.value.monthlyExpenses),
      purpose: application.value.purpose,
    };

    console.log("Submitting loan data:", loanData);

    // Create the loan application
    const createdApplication = await createApplication(loanData);
    
    console.log("Loan created successfully:", createdApplication);
    console.log("Loan ID:", createdApplication?.id);

    // Create children records if any
    if (application.value.children.length > 0) {
      const childPromises = application.value.children.map((child) =>
        createChild({
          client: currentUser.value.id,
          name: child.name,
          school: child.school || null,
          grade: child.grade || null,
          age: child.age || null,
        }),
      );
      await Promise.all(childPromises);
    }

    // Handle file uploads for requirements
    // Create loan_requirments records for uploaded files (note: typo in collection name)
    // Note: This may fail if user doesn't have permission - that's okay
    if (uploadedFiles.value.validId || uploadedFiles.value.businessPermit || 
        uploadedFiles.value.photo || uploadedFiles.value.coMakerId) {
      
      // Ensure we have a valid loan ID
      if (!createdApplication || !createdApplication.id) {
        console.error('No loan ID returned from createApplication');
        throw new Error('Failed to create loan application');
      }

      const loanId = createdApplication.id;
      console.log('Creating loan requirements for loan ID:', loanId);
      
      try {
        const requirementPromises = [];
        
        if (uploadedFiles.value.validId) {
          const requirementData = {
            loan: loanId,
            requirement_type: 'valid_id',
            file: uploadedFiles.value.validId,
          };
          console.log('Creating valid_id requirement:', requirementData);
          requirementPromises.push(
            client.request(createItem('loan_requirments', requirementData))
          );
        }
        
        if (uploadedFiles.value.businessPermit) {
          const requirementData = {
            loan: loanId,
            requirement_type: 'permit',
            file: uploadedFiles.value.businessPermit,
          };
          console.log('Creating permit requirement:', requirementData);
          requirementPromises.push(
            client.request(createItem('loan_requirments', requirementData))
          );
        }
        
        if (uploadedFiles.value.photo) {
          const requirementData = {
            loan: loanId,
            requirement_type: 'photo',
            file: uploadedFiles.value.photo,
          };
          console.log('Creating photo requirement:', requirementData);
          requirementPromises.push(
            client.request(createItem('loan_requirments', requirementData))
          );
        }
        
        if (uploadedFiles.value.coMakerId) {
          const requirementData = {
            loan: loanId,
            requirement_type: 'co-maker_id',
            file: uploadedFiles.value.coMakerId,
          };
          console.log('Creating co-maker_id requirement:', requirementData);
          requirementPromises.push(
            client.request(createItem('loan_requirments', requirementData))
          );
        }
        
        await Promise.all(requirementPromises);
        console.log('✅ All loan requirements saved successfully');
      } catch (requirementError) {
        // Log detailed error
        console.error('❌ Error creating loan requirements:', requirementError);
        console.error('Error details:', JSON.stringify(requirementError, null, 2));
        console.log('Files were uploaded successfully. Admin will need to link them manually.');
        console.log('Uploaded file IDs:', uploadedFiles.value);
        console.log('Loan ID:', loanId);
      }
    }

    alert("Application submitted successfully! You will be notified once reviewed.");
    router.push("/client/dashboard");
  } catch (error) {
    console.error("Error submitting application:", error);
    alert("Error submitting application. Please try again.");
  } finally {
    submitting.value = false;
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

    // Load loan products
    const products = await getProducts();
    loanProducts.value = products;

    // Load existing user profile data to populate form
    if (currentUser.value?.id) {
      const userProfile = await getUserProfile(currentUser.value.id);

      // Populate form with existing data
      if (userProfile) {
        application.value.firstName = userProfile.first_name || "";
        application.value.middleName = userProfile.middle_name || "";
        application.value.lastName = userProfile.last_name || "";
        application.value.nickname = userProfile.nickname || "";
        // Format date of birth to yyyy-MM-dd format for date input
        application.value.dob = userProfile.dob ? userProfile.dob.split("T")[0] : "";
        application.value.gender = userProfile.gender || "";
        application.value.civilStatus = userProfile.civil_status || "";
        application.value.citizenship = userProfile.citizenship || "Filipino";
        application.value.spouseName = userProfile.spouse_name || "";
        application.value.presentAddress = userProfile.present_address || "";
        application.value.mobileNumber = userProfile.mobile_number || "";
      }
    }
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

.requirement-card {
  height: 100%;
}

.requirement-card .v-card-title {
  padding-bottom: 8px;
}

.terms-content {
  max-height: 400px;
  overflow-y: auto;
}

:deep(.v-stepper-header) {
  box-shadow: none;
}

:deep(.v-stepper-item__avatar) {
  margin-right: 8px;
}

:deep(.v-list-item--nav .v-list-item__prepend > .v-icon) {
  opacity: 0.8;
}

:deep(.v-list-item--active) {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
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
