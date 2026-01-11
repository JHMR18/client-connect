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
        <!-- Notifications -->
        <v-menu offset-y :close-on-content-click="false" max-width="400">
          <template #activator="{ props }">
            <v-btn icon variant="text" class="me-2" v-bind="props">
              <v-badge
                :content="unreadCount"
                :model-value="unreadCount > 0"
                color="error"
                overlap
              >
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-card min-width="350" max-height="400" class="overflow-hidden">
            <v-card-title class="d-flex align-center justify-space-between py-3 px-4 bg-grey-lighten-4">
              <span class="text-subtitle-1 font-weight-bold">Notifications</span>
              <v-btn
                v-if="unreadCount > 0"
                variant="text"
                size="small"
                color="primary"
                @click="handleMarkAllRead"
              >
                Mark all read
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-list v-if="notifications.length > 0" class="pa-0" style="max-height: 320px; overflow-y: auto;">
              <v-list-item
                v-for="notif in notifications"
                :key="notif.id"
                :class="{ 'bg-blue-lighten-5': !notif.read }"
                class="py-3"
                @click="handleNotificationClick(notif)"
              >
                <template #prepend>
                  <v-avatar color="success" size="40">
                    <v-icon color="white">mdi-check-circle</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">
                  Loan Approved
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ notif.message }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="text-caption text-medium-emphasis mt-1">
                  {{ formatDate(notif.date_created) }}
                </v-list-item-subtitle>
                <template #append>
                  <v-icon v-if="!notif.read" color="primary" size="10">mdi-circle</v-icon>
                </template>
              </v-list-item>
            </v-list>
            <v-card-text v-else class="text-center py-8 text-medium-emphasis">
              <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-bell-off</v-icon>
              <div>No notifications</div>
            </v-card-text>
          </v-card>
        </v-menu>

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
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/utils/useAuth";
import { useApprovedLoanNotifications } from "@/utils/useSmartLoanApi";
import { getCurrentUser } from "@/utils/useDirectus";

const router = useRouter();
const { logout } = useAuth();
const {
  getApprovedLoanNotifications,
  markApprovedLoanNotificationAsRead,
  markAllApprovedLoanNotificationsAsRead,
} = useApprovedLoanNotifications();
const drawer = ref(true);

// User and notifications state
const currentUser = ref<any>(null);
const notifications = ref<any[]>([]);

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
};

const fetchNotifications = async () => {
  if (!currentUser.value?.id) {
    console.log("❌ No current user ID available");
    return;
  }
  try {
    console.log("🔵 Fetching notifications for user ID:", currentUser.value.id);
    const result = await getApprovedLoanNotifications(currentUser.value.id);
    console.log("✅ Notifications fetched:", result);
    notifications.value = result;
  } catch (error: any) {
    console.error("❌ Error fetching notifications:", error);
    console.error("❌ Error message:", error?.message);
    console.error("❌ Error response:", error?.response);
    console.error("❌ Full error:", JSON.stringify(error, null, 2));
    // Don't throw, just set empty notifications
    notifications.value = [];
  }
};

const handleNotificationClick = async (notif: any) => {
  if (!notif.read) {
    try {
      await markApprovedLoanNotificationAsRead(notif.id);
      notif.read = true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }
  // Navigate to loans page
  router.push("/client/loans");
};

const handleMarkAllRead = async () => {
  if (!currentUser.value?.id) return;
  try {
    await markAllApprovedLoanNotificationsAsRead(currentUser.value.id);
    notifications.value.forEach((n) => (n.read = true));
  } catch (error) {
    console.error("Error marking all as read:", error);
  }
};

const handleLogout = async () => {
  await logout();
  router.push("/");
};

onMounted(async () => {
  try {
    currentUser.value = await getCurrentUser();
    await fetchNotifications();
    // Refresh notifications every 30 seconds
    setInterval(fetchNotifications, 30000);
  } catch (error) {
    console.error("Error loading user:", error);
  }
});
</script>

<style scoped>
.app-icon {
  display: inline-block;
  padding: 8px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%);
  border-radius: 50%;
  border: 2px solid rgba(220, 38, 38, 0.2);
}

:deep(.v-list-item--nav .v-list-item__prepend > .v-icon) {
  opacity: 0.8;
}

:deep(.v-list-item--active) {
  background-color: rgba(220, 38, 38, 0.2);
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
