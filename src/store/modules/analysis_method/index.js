import { getField, updateField } from "vuex-map-fields";

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: {
      page: 1,
      paginateBy: 50,
      sortBy: ["id"],
      sortDesc: [true],
    },
    viewType: "table",
    searchFields: {
      byIds: {
        analysis_method: {
          lookUpType: "icontains",
          title: "analysis_method.analysis_method",
          value: null,
          fields: ["analysis_method", "method_en"],
          type: "multi",
        },
        date_added: {
          lookUpType: "icontains",
          title: "analysis_method.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "analysis_method.date_changed",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "analysis_method.id",
          value: null,
        },
        method_en: {
          lookUpType: "icontains",
          title: "analysis_method.method_en",
          value: null,
        },
        parent_method: {
          lookUpType: "icontains",
          title: "analysis_method.parent_method",
          value: null,
          fields: ["parent_method__analysis_method"],
        },
        remarks: {
          lookUpType: "icontains",
          title: "analysis_method.remarks",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "analysis_method.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "analysis_method.user_changed",
          value: null,
        },
      },
      mainIds: ["id", "analysis_method", "parent_method", "remarks"],
      extraIds: [
        "date_added",
        "date_changed",
        "method_en",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "analysis_method.id",
        show: true,
      },
      {
        value: "analysis_method",
        text: "analysis_method.analysis_method",
        show: true,
      },
      {
        value: "parent_method__analysis_method",
        text: "analysis_method.parent_method__analysis_method",
        show: true,
      },
      {
        value: "method_en",
        text: "analysis_method.method_en",
        show: false,
      },
      {
        value: "parent_method__id",
        text: "analysis_method.parent_method__id",
        show: false,
      },
      {
        value: "parent_method__method_en",
        text: "analysis_method.parent_method__method_en",
        show: false,
      },
      {
        value: "remarks",
        text: "analysis_method.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "analysis_method.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "analysis_method.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "analysis_method.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "analysis_method.date_changed",
        show: false,
      },
    ],
  };
};

const state = getDefaultState();

const getters = {
  getField,
};

const actions = {};

const mutations = {
  updateField,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
