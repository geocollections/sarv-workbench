import { defineStore } from "pinia";
import { ref } from "vue";
// import { useSearchStore } from "./search";

const useSearchStoreModule = () => {
  const view = ref("table");
  const filters = ref([]);
  const tableOptions = ref({ itemsPerPage: 25 });
  const headers = ref(null);
  return { view, filters, tableOptions, headers };
};

export const useReferenceStore = defineStore(
  "reference",
  () => {
    const citationStyle = ref("apa");
    return { ...useSearchStoreModule(), citationStyle };
  },
  {
    persist: {
      paths: ["view", "filters", "tableOptions", "citationStyle"],
    },
  }
);
