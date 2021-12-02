import { getField, updateField } from "vuex-map-fields";

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: {
      page: 1,
      itemsPerPage: 50,
      sortBy: ["id"],
      sortDesc: [true],
    },
    viewType: "table",
    searchFields: {
      byIds: {
        date_added: {
          lookUpType: "icontains",
          title: "analysis_parameter.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "analysis_parameter.date_changed",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "analysis_parameter.id",
          value: null,
        },
        parameter: {
          lookUpType: "icontains",
          title: "analysis_parameter.parameter",
          value: null,
        },
        parameter_html: {
          lookUpType: "icontains",
          title: "analysis_parameter.parameter_html",
          value: null,
        },
        parameter_name: {
          lookUpType: "icontains",
          title: "analysis_parameter.parameter_name",
          value: null,
        },
        parameter_name_en: {
          lookUpType: "icontains",
          title: "analysis_parameter.parameter_name_en",
          value: null,
        },
        parent_parameter: {
          lookUpType: "icontains",
          title: "analysis_parameter.parent_parameter__id",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "analysis_parameter.remarks",
          value: null,
        },
        synonyms: {
          lookUpType: "icontains",
          title: "analysis_parameter.synonyms",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "analysis_parameter.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "analysis_parameter.user_changed",
          value: null,
        },
      },
      mainIds: ["id", "parameter_name", "parameter_name_en", "remarks"],
      extraIds: [
        "date_added",
        "date_changed",
        "parameter",
        "parameter_html",
        "parent_parameter",
        "synonyms",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "analysis_parameter.id",
        show: true,
      },
      {
        value: "parameter",
        text: "analysis_parameter.parameter",
        show: true,
      },
      {
        value: "parameter_html",
        text: "analysis_parameter.parameter_html",
        show: true,
      },
      {
        value: "parameter_name",
        text: "analysis_parameter.parameter_name",
        show: true,
      },
      {
        value: "synonyms",
        text: "analysis_parameter.synonyms",
        show: true,
      },
      {
        value: "parameter_name_en",
        text: "analysis_parameter.parameter_name_en",
        show: false,
      },
      {
        value: "parent_parameter__id",
        text: "analysis_parameter.parent_parameter__id",
        show: false,
      },
      {
        value: "parent_parameter__parameter",
        text: "analysis_parameter.parent_parameter__parameter",
        show: false,
      },
      {
        value: "remarks",
        text: "analysis_parameter.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "analysis_parameter.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "analysis_parameter.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "analysis_parameter.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "analysis_parameter.date_changed",
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
