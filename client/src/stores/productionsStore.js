import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useEquipmentsStore } from './equipmentsStore';

export const useProductionsStore = defineStore('productions', {
  state: () => ({
    data: [],
  }),
  actions: {
    async fetchProductions() {
      this.data = [];
      const equipmentsStore = useEquipmentsStore();

      const end = new Date(); // hoje

      const start = new Date();
      start.setFullYear(end.getFullYear());
      start.setMonth(0); // janeiro
      start.setDate(1);  // dia 1
      start.setHours(0, 0, 0, 0); // 00:00:00.000

      try {
        const fetches = equipmentsStore.equipments.map((eq) =>
          fetchWithAuth(`http://localhost:3000/energy-equipments/${eq.id_equipment}/energy-productions?start=${start.toISOString()}&end=${end.toISOString()}`)
            .then(async (res) => {
              if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Network response was not ok');
              }
              const data = await res.json();
              return data.data.productions;
            })
        );

        // Espera todos os fetchs ao mesmo tempo
        const results = await Promise.all(fetches);

        // Junta todos os dados num único array
        this.data = results.flat();

      } catch (error) {
        throw error;
      }
    },
    async fetch2Year() {
      this.data = {};
      const equipmentsStore = useEquipmentsStore();

      const now = new Date();
      const lastYear = now.getFullYear() - 1;

      const start = new Date(lastYear, 0, 1, 0, 0, 0, 0);  // 1 Jan
      const end = new Date(lastYear, 11, 31, 23, 59, 59, 999); // 31 Dec
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ['data'],
  },
});
