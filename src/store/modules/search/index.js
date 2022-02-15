import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  loadingState: false,
  sidebarList: [],
  activeObject: null,
  sidebarUserAction: null,
  activeLibrary: null,
  activeProject: null,
  activeSample: null,
  activeSite: null,
  activeSelectionSeries: null,
  activeRelatedDataTab: {},
  activeSearchParams: null,
  activeSearchParametersFilters: [],
  lookUpTypes: [
    { text: "main.iexact", value: "iexact", symbol: "=" },
    { text: "main.icontains", value: "icontains", symbol: "*" },
    { text: "main.istartswith", value: "istartswith", symbol: "*=" },
    { text: "main.iendswith", value: "iendswith", symbol: "*=" },
    { text: "main.gte", value: "gte", symbol: ">=" },
    { text: "main.gt", value: "gt", symbol: ">" },
    { text: "main.lte", value: "lte", symbol: "<=" },
    { text: "main.lt", value: "lt", symbol: "<" },
    { text: "main.between", value: "range", symbol: "<>" },
    { text: "main.doesnotequal", value: "iexact!", symbol: "!=" },
    { text: "main.doesnotcontain", value: "icontains!", symbol: "!*" },
    { text: "main.hierarchy", value: "hierarchy", symbol: "-·=" },
  ],
  paginateByOptions: [
    { text: "main.pagination", value: 10 },
    { text: "main.pagination", value: 25 },
    { text: "main.pagination", value: 50 },
    { text: "main.pagination", value: 100 },
    { text: "main.pagination", value: 250 },
    { text: "main.pagination", value: 500 },
    { text: "main.pagination", value: 1000 },
  ],
  activeSelectionSeriesList: null,
  activeLibraryList: null,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
