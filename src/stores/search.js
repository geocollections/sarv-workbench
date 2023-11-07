import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const view = ref("table");
  const filters = ref([]);
  const tableOptions = ref({ itemsPerPage: 25 });
  const headers = ref(null);
  return { view, filters, tableOptions, headers };
});
