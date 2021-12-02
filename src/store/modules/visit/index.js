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
        collections_studied: {
          lookUpType: "icontains",
          title: "visit.collections_studied",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "visit.database__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "visit.date_added",
          value: null,
        },
        date_arrived: {
          lookUpType: "gt",
          title: "visit.date_arrived",
          value: null,
          isDate: true,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "visit.date_changed",
          value: null,
        },
        date_left: {
          lookUpType: "lt",
          title: "visit.date_left",
          value: null,
          isDate: true,
        },
        host: {
          lookUpType: "icontains",
          title: "visit.host__id",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "visit.id",
          value: null,
        },
        items_studied: {
          lookUpType: "icontains",
          title: "visit.items_studied",
          value: null,
        },
        purpose: {
          lookUpType: "icontains",
          title: "visit.purpose",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "visit.remarks",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "visit.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "visit.user_changed",
          value: null,
        },
        visitor: {
          lookUpType: "icontains",
          title: "visit.visitor__id",
          value: null,
          fields: ["visitor__agent", "visitor__forename", "visitor__surename"],
          type: "multi",
        },
        visitor_country: {
          lookUpType: "icontains",
          title: "visit.visitor_country__id",
          value: null,
        },
        visitor_free: {
          lookUpType: "icontains",
          title: "visit.visitor_free",
          value: null,
        },
        visitor_institution: {
          lookUpType: "icontains",
          title: "visit.visitor_institution__id",
          value: null,
        },
      },
      mainIds: ["visitor", "date_arrived", "date_left"],
      extraIds: [
        "collections_studied",
        "database",
        "date_added",
        "date_changed",
        "host",
        "id",
        "items_studied",
        "purpose",
        "remarks",
        "user_added",
        "user_changed",
        "visitor_country",
        "visitor_free",
        "visitor_institution",
      ],
    },
    headers: [
      {
        value: "id",
        text: "visit.id",
        show: true,
      },
      {
        value: "date_arrived",
        text: "visit.date_arrived",
        show: true,
      },
      {
        value: "date_left",
        text: "visit.date_left",
        show: true,
      },
      {
        value: "visitor__id",
        text: "visit.visitor__id",
        show: false,
      },
      {
        value: "visitor__agent",
        text: "visit.visitor__agent",
        show: false,
      },
      {
        value: "visitor_free",
        text: "visit.visitor_free",
        show: false,
      },
      {
        value: "visitor_institution__id",
        text: "visit.visitor_institution__id",
        show: false,
      },
      {
        value: "visitor_institution__agent",
        text: "visit.visitor_institution__agent",
        show: false,
      },
      {
        value: "visitor_country__id",
        text: "visit.visitor_country__id",
        show: false,
      },
      {
        value: "visitor_country__value",
        text: "visit.visitor_country__value",
        show: false,
      },
      {
        value: "visitor_country__value_en",
        text: "visit.visitor_country__value_en",
        show: false,
      },
      {
        value: "host__id",
        text: "visit.host__id",
        show: false,
      },
      {
        value: "host__agent",
        text: "visit.host__agent",
        show: false,
      },
      {
        value: "purpose",
        text: "visit.purpose",
        show: false,
      },
      {
        value: "collections_studied",
        text: "visit.collections_studied",
        show: false,
      },
      {
        value: "items_studied",
        text: "visit.items_studied",
        show: false,
      },
      {
        value: "remarks",
        text: "visit.remarks",
        show: false,
      },
      {
        value: "database__id",
        text: "visit.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "visit.database__acronym",
        show: false,
      },
      {
        value: "user_added",
        text: "visit.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "visit.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "visit.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "visit.date_changed",
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
