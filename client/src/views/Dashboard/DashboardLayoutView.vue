<template>
  <AppShell :items="items" :showSettings="true">
    <div v-if="isReady == true">
      <router-view />
    </div>
    <div v-else class="loading-container">
      <div style="width: 100%" class="d-flex justify-center w-100 gap-4">
        <v-skeleton-loader width="33%" type="card"></v-skeleton-loader>
        <v-skeleton-loader width="33%" type="card"></v-skeleton-loader>
        <v-skeleton-loader width="33%" type="card"></v-skeleton-loader>
      </div>
      <div style="width: 100%" class="d-flex justify-center w-100 gap-4">
        <v-skeleton-loader width="33%" type="card"></v-skeleton-loader>
        <v-skeleton-loader width="33%" type="card"></v-skeleton-loader>
      </div>
      <v-skeleton-loader type="card"></v-skeleton-loader>
    </div>
  </AppShell>
</template>

<script>
import AppShell from "@/components/AppShell.vue";
import { useWidgetsStore } from "@/stores/widgetsStore";
import { useConsumptionStore } from "@/stores/consumptionStore";
import { useHousingsStore } from "@/stores/housings.js";
import { useEquipmentsStore } from "@/stores/equipmentsStore.js";
import { useProductionsStore } from "@/stores/productionsStore.js";

export default {
  name: "DashboardLayoutView",
  components: {
    AppShell,
  },
  data() {
    return {
      isReady: false,
      equipmentsStore: useEquipmentsStore(),
      productionsStore: useProductionsStore(),
      widgetsStore: useWidgetsStore(),
      housingsStore: useHousingsStore(),
      consumptionStore: useConsumptionStore(),
      items: [
        {
          title: "My Dashboard",
          prependIcon: "mdi-view-dashboard-outline",
          to: { name: "Dashboard" }, // Corrigido para objeto de rota
          exact: true,
        },
        {
          title: "Monitoring",
          prependIcon: "mdi-monitor-dashboard",
          to: { name: "Monitoring" }, // Corrigido para objeto de rota
        },
        {
          title: "Forecasts",
          prependIcon: "mdi-chart-line",
          to: { name: "Forecasts" }, // Corrigido para objeto de rota
        },
        {
          title: "Reports",
          prependIcon: "mdi-file-document-outline",
          to: { name: "Reports" }, // Corrigido para objeto de rota
        },
        {
          title: "Resource Allocation",
          prependIcon: "mdi-account-cog-outline",
          to: { name: "Resource Allocation" }, // Corrigido para objeto de rota
        },
        {
          title: "Alerts & Notifications",
          prependIcon: "mdi-bell-outline",
          to: { name: "Alerts & Notifications" }, // Corrigido para objeto de rota
        },
      ],
    };
  },
  methods: {
    async loadWidgets() {

      try {
        await this.widgetsStore.fetchUserWidgets();
        await this.housingsStore.fetchHousings();

        await this.equipmentsStore.fetchEquipments(); 
        await this.productionsStore.fetchProductions();
        await this.consumptionStore.fetchConsumption(); 

        this.isReady = true;
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },
  },
  created() {
    this.loadWidgets();

    console.log(
      "-----------------------created---------------------------------"
    );
    console.log(this.widgetsStore.userWidgets);
  },
};
</script>

<style>
.v-overlay-container {
  z-index: 9999 !important;
}
</style>
