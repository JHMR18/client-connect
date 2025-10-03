import { client } from "./useDirectus";
import { readItems, createItem, updateItem, deleteItem, readItem } from "@directus/sdk";

// Types for SMART LOAN entities
export interface LoanApplication {
  id?: string;
  client: string; // User ID reference
  loan_product: string;
  principal_amount: number;
  interest_rate?: number;
  term_months: number;
  status: "pending" | "approved" | "rejected" | "active" | "closed" | "restructured";
  application_date: string;
  approval_date?: string;
  officer_in_charge?: string;
  remarks?: string;

  // Business Information (stored in loan table)
  business_name?: string;
  business_type?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  years_in_business?: number;
  number_of_employees?: number;

  // Financial Information (stored in loan table)
  monthly_income: number;
  monthly_expenses: number;
  purpose: string;
}

export interface UserProfile {
  id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  nickname?: string;
  dob: string;
  age?: number;
  gender: string;
  civil_status: string;
  citizenship: string;
  spouse_name?: string;
  present_address: string;
  employment_address?: string;
  previous_address?: string;
  mobile_number: string;
}

export interface LoanProduct {
  id: string;
  name: string;
  description?: string;
  interest_rate: number;
  penalty_rate: number;
  max_term: number;
  min_amount: number;
  max_amount: number;
}

export interface Payment {
  id?: string;
  loan_id: string;
  payment_date: string;
  amount_paid: number;
  remaining_balance: number;
  payment_method: "cash" | "bank_transfer" | "gcash";
  receipt_number: string;
}

export interface RiskAssessment {
  id?: string;
  loan_id: string;
  capacity_score: number;
  character_score: number;
  collateral_score: number;
  capital_score: number;
  overall_risk_level: "low" | "medium" | "high";
  notes?: string;
}

// Helper function to get access token
const getAccessToken = (): string | null => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "accessToken") {
      return decodeURIComponent(value);
    }
  }
  return sessionStorage.getItem("access_token");
};

// User Profile API
export const useUserProfile = () => {
  const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
    try {
      // Use direct API call for user updates since updateItem doesn't work with core collections
      const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";
      const response = await fetch(`${baseUrl}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const getUserProfile = async (userId: string) => {
    try {
      // Use direct API call for user fetching since readItem doesn't work with core collections
      const baseUrl = import.meta.env.VITE_DIRECTUS_URL || "http://localhost:8055";
      const response = await fetch(`${baseUrl}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  };

  return {
    updateUserProfile,
    getUserProfile,
  };
};

// Loan Application API
export const useLoanApplications = () => {
  const getApplications = async (filters?: any) => {
    try {
      const query: any = {
        fields: [
          "*",
          "client.id",
          "client.first_name",
          "client.middle_name",
          "client.last_name",
          "client.mobile_number",
          "client.civil_status",
          "client.present_address",
          // For Many-to-Many relationship through junction table
          "loan_product.loan_products_id.id",
          "loan_product.loan_products_id.name",
          "loan_product.loan_products_id.description",
          "officer_in_charge.id",
          "officer_in_charge.first_name",
          "officer_in_charge.last_name",
        ],
        sort: ["-application_date"],
      };

      // Only add filter if it's provided and not empty
      if (filters) {
        query.filter = filters;
      }

      return await client.request(readItems("loan", query));
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  };

  const getApplication = async (id: string) => {
    try {
      return await client.request(
        readItem("loan", id, {
          fields: [
            "*",
            "client.*",
            "loan_product.*",
            "officer_in_charge.*",
            "payments.*",
            "risk_assessments.*",
          ],
        }),
      );
    } catch (error) {
      console.error("Error fetching application:", error);
      throw error;
    }
  };

  const createApplication = async (data: Partial<LoanApplication>) => {
    try {
      console.log("Creating loan application with data:", data);
      console.log("JSON payload:", JSON.stringify(data, null, 2));
      return await client.request(createItem("loan", data));
    } catch (error) {
      console.error("Error creating application:", error);
      console.error("Payload that caused error:", data);
      console.error("JSON payload that failed:", JSON.stringify(data, null, 2));
      if (error.errors) {
        console.error("Detailed errors:", error.errors);
        error.errors.forEach((err, index) => {
          console.error(`Error ${index + 1}:`, err.message);
          console.error("Extensions:", err.extensions);
        });
      }
      throw error;
    }
  };

  const updateApplication = async (id: string, data: Partial<LoanApplication>) => {
    try {
      return await client.request(updateItem("loan", id, data));
    } catch (error) {
      console.error("Error updating application:", error);
      throw error;
    }
  };

  const approveApplication = async (id: string, officerId: string, remarks?: string) => {
    try {
      return await client.request(
        updateItem("loan", id, {
          status: "approved",
          approval_date: new Date().toISOString(),
          officer_in_charge: officerId,
          remarks,
        }),
      );
    } catch (error) {
      console.error("Error approving application:", error);
      throw error;
    }
  };

  const rejectApplication = async (id: string, officerId: string, remarks: string) => {
    try {
      return await client.request(
        updateItem("loan", id, {
          status: "rejected",
          officer_in_charge: officerId,
          remarks,
        }),
      );
    } catch (error) {
      console.error("Error rejecting application:", error);
      throw error;
    }
  };

  return {
    getApplications,
    getApplication,
    createApplication,
    updateApplication,
    approveApplication,
    rejectApplication,
  };
};

// Loan Products API
export const useLoanProducts = () => {
  const getProducts = async () => {
    try {
      return await client.request(
        readItems("loan_products", {
          sort: ["name"],
        }),
      );
    } catch (error) {
      console.error("Error fetching loan products:", error);
      throw error;
    }
  };

  const getProduct = async (id: string) => {
    try {
      return await client.request(readItem("loan_products", id));
    } catch (error) {
      console.error("Error fetching loan product:", error);
      throw error;
    }
  };

  const createProduct = async (data: Partial<LoanProduct>) => {
    try {
      return await client.request(createItem("loan_products", data));
    } catch (error) {
      console.error("Error creating loan product:", error);
      throw error;
    }
  };

  const updateProduct = async (id: string, data: Partial<LoanProduct>) => {
    try {
      return await client.request(updateItem("loan_products", id, data));
    } catch (error) {
      console.error("Error updating loan product:", error);
      throw error;
    }
  };

  return {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
  };
};

// Payments API
export const usePayments = () => {
  const getPayments = async (loanId?: string) => {
    try {
      const filters = loanId ? { loan_id: { _eq: loanId } } : undefined;
      return await client.request(
        readItems("payments", {
          fields: ["*", "loan.*"],
          filter: filters,
          sort: ["-payment_date"],
        }),
      );
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  };

  const recordPayment = async (data: Partial<Payment>) => {
    try {
      return await client.request(createItem("payments", data));
    } catch (error) {
      console.error("Error recording payment:", error);
      throw error;
    }
  };

  return {
    getPayments,
    recordPayment,
  };
};

// Risk Assessment API
export const useRiskAssessment = () => {
  const getRiskAssessment = async (loanId: string) => {
    try {
      return await client.request(
        readItems("risk_assessments", {
          filter: { loan_id: { _eq: loanId } },
        }),
      );
    } catch (error) {
      console.error("Error fetching risk assessment:", error);
      throw error;
    }
  };

  const createRiskAssessment = async (data: Partial<RiskAssessment>) => {
    try {
      return await client.request(createItem("risk_assessments", data));
    } catch (error) {
      console.error("Error creating risk assessment:", error);
      throw error;
    }
  };

  const updateRiskAssessment = async (id: string, data: Partial<RiskAssessment>) => {
    try {
      return await client.request(updateItem("risk_assessments", id, data));
    } catch (error) {
      console.error("Error updating risk assessment:", error);
      throw error;
    }
  };

  return {
    getRiskAssessment,
    createRiskAssessment,
    updateRiskAssessment,
  };
};

// Children API
export const useChildren = () => {
  const getChildren = async (clientId: string) => {
    try {
      return await client.request(
        readItems("children", {
          filter: { client: { _eq: clientId } },
        }),
      );
    } catch (error) {
      console.error("Error fetching children:", error);
      throw error;
    }
  };

  const createChild = async (data: any) => {
    try {
      return await client.request(createItem("children", data));
    } catch (error) {
      console.error("Error creating child record:", error);
      throw error;
    }
  };

  return {
    getChildren,
    createChild,
  };
};

// Audit Logs API
export const useAuditLogs = () => {
  const createAuditLog = async (data: {
    action: "create" | "update" | "delete" | "login";
    performed_by: string;
    collection: string;
    record_id: string;
    details?: any;
  }) => {
    try {
      return await client.request(
        createItem("audit_logs", {
          ...data,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (error) {
      console.error("Error creating audit log:", error);
      throw error;
    }
  };

  const getAuditLogs = async (filters?: any) => {
    try {
      return await client.request(
        readItems("audit_logs", {
          fields: ["*", "performed_by.*"],
          filter: filters,
          sort: ["-timestamp"],
          limit: 100,
        }),
      );
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      throw error;
    }
  };

  return {
    createAuditLog,
    getAuditLogs,
  };
};

// Amortization Schedule API
export const useAmortizationSchedule = () => {
  const generateSchedule = (principal: number, interestRate: number, termMonths: number) => {
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);

    const schedule = [];
    let remainingBalance = principal;

    for (let month = 1; month <= termMonths; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + month);

      schedule.push({
        month,
        due_date: dueDate.toISOString().split("T")[0],
        amount_due: Math.round(monthlyPayment * 100) / 100,
        principal_payment: Math.round(principalPayment * 100) / 100,
        interest_payment: Math.round(interestPayment * 100) / 100,
        remaining_balance: Math.round(remainingBalance * 100) / 100,
        status: "upcoming",
      });
    }

    return schedule;
  };

  const createSchedule = async (loanId: string, schedule: any[]) => {
    try {
      const scheduleItems = schedule.map((item) => ({
        ...item,
        loan_id: loanId,
      }));

      // Create multiple items
      const promises = scheduleItems.map((item) =>
        client.request(createItem("amortization_schedule", item)),
      );

      return await Promise.all(promises);
    } catch (error) {
      console.error("Error creating amortization schedule:", error);
      throw error;
    }
  };

  const getSchedule = async (loanId: string) => {
    try {
      return await client.request(
        readItems("amortization_schedule", {
          filter: { loan_id: { _eq: loanId } },
          sort: ["due_date"],
        }),
      );
    } catch (error) {
      console.error("Error fetching amortization schedule:", error);
      throw error;
    }
  };

  return {
    generateSchedule,
    createSchedule,
    getSchedule,
  };
};

// Dashboard Statistics
export const useDashboardStats = () => {
  const getClientStats = async (clientId: string) => {
    try {
      const [loans, payments] = await Promise.all([
        client.request(
          readItems("loan", {
            filter: { client_id: { _eq: clientId } },
            aggregate: {
              count: "*",
              sum: "principal_amount",
            },
          }),
        ),
        client.request(
          readItems("payments", {
            fields: ["*", "loan.client_id"],
            filter: { "loan.client_id": { _eq: clientId } },
          }),
        ),
      ]);

      const totalLoans = loans.length;
      const totalBorrowed = loans.reduce(
        (sum: number, loan: any) => sum + loan.principal_amount,
        0,
      );
      const totalPaid = payments.reduce(
        (sum: number, payment: any) => sum + payment.amount_paid,
        0,
      );
      const outstandingBalance = totalBorrowed - totalPaid;

      return {
        totalLoans,
        totalBorrowed,
        totalPaid,
        outstandingBalance,
        pendingApplications: loans.filter((loan: any) => loan.status === "pending").length,
      };
    } catch (error) {
      console.error("Error fetching client stats:", error);
      throw error;
    }
  };

  const getAdminStats = async () => {
    try {
      const [loans, applications, payments] = await Promise.all([
        client.request(readItems("loan")),
        client.request(
          readItems("loan", {
            filter: { status: { _eq: "pending" } },
          }),
        ),
        client.request(readItems("payments")),
      ]);

      const activeLoans = loans.filter((loan: any) => loan.status === "active").length;
      const totalPortfolio = loans.reduce(
        (sum: number, loan: any) => sum + loan.principal_amount,
        0,
      );
      const totalCollections = payments.reduce(
        (sum: number, payment: any) => sum + payment.amount_paid,
        0,
      );
      const overdueLoans = 0; // This would require more complex query

      return {
        activeLoans,
        pendingApplications: applications.length,
        totalPortfolio,
        totalCollections,
        overdueLoans,
      };
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      throw error;
    }
  };

  return {
    getClientStats,
    getAdminStats,
  };
};
