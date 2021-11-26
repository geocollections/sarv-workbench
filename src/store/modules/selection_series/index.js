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
        database: {
          lookUpType: "icontains",
          title: "selection_series.database",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "selection_series.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "selection_series.date_changed",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "selection_series.id",
          value: null,
        },
        name: {
          lookUpType: "icontains",
          title: "selection_series.name",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "selection_series.remarks",
          value: null,
        },
        tablename: {
          lookUpType: "icontains",
          title: "selection_series.tablename",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "selection_series.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "selection_series.user_changed",
          value: null,
        },
      },
      mainIds: ["id", "name", "remarks", "user_added"],
      extraIds: [
        "database",
        "date_added",
        "date_changed",
        "tablename",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "selection_series.id",
        show: true,
      },
      {
        value: "name",
        text: "selection_series.name",
        show: true,
      },
      {
        value: "remarks",
        text: "selection_series.remarks",
        show: true,
      },
      {
        value: "user_added",
        text: "selection_series.user_added",
        show: true,
      },
      {
        value: "tablename",
        text: "selection_series.tablename",
        show: false,
      },
      {
        value: "date_added",
        text: "selection_series.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "selection_series.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "selection_series.date_changed",
        show: false,
      },
      {
        value: "database__id",
        text: "selection_series.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "selection_series.database__acronym",
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
