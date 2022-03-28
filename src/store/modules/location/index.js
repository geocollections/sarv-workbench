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
        agent: {
          lookUpType: "icontains",
          title: "location.agent",
          value: null,
          fields: ["agent__agent", "agent__forename", "agent__surename"],
          type: "multi",
        },
        contents: {
          lookUpType: "icontains",
          title: "location.contents",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "location.database__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "location.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "location.date_changed",
          value: null,
        },
        date_collected_free: {
          lookUpType: "icontains",
          title: "location.date_collected_free",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "location.id",
          value: null,
        },
        location: {
          lookUpType: "icontains",
          title: "location.location",
          value: null,
        },
        location_location: {
          lookUpType: "icontains",
          title: "location.location_location",
          value: null,
        },
        number_items: {
          lookUpType: "icontains",
          title: "location.number_items",
          value: null,
        },
        number_items_registered: {
          lookUpType: "icontains",
          title: "location.number_items_registered",
          value: null,
        },
        parent_location: {
          lookUpType: "icontains",
          title: "location.parent_location__id",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "location.remarks",
          value: null,
        },
        stratigraphy_free: {
          lookUpType: "icontains",
          title: "stratigraphy.stratigraphy",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "location.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "location.user_changed",
          value: null,
        },
      },
      mainIds: [
        "id",
        "location",
        "location_location",
        "stratigraphy_free",
        "agent",
        "contents",
      ],
      extraIds: [
        "database",
        "date_added",
        "date_changed",
        "date_collected_free",
        "number_items",
        "number_items_registered",
        "parent_location",
        "remarks",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "location.id",
        show: true,
      },
      {
        value: "location",
        text: "location.location",
        show: true,
      },
      {
        value: "parent_location__location",
        text: "location.parent_location__location",
        show: true,
      },
      {
        value: "contents",
        text: "location.contents",
        show: true,
      },
      {
        value: "parent_location__id",
        text: "location.parent_location__id",
        show: false,
      },
      {
        value: "location_location",
        text: "location.location_location",
        show: false,
      },
      {
        value: "agent__id",
        text: "location.agent__id",
        show: false,
      },
      {
        value: "agent__agent",
        text: "location.agent__agent",
        show: false,
      },
      {
        value: "date_collected_free",
        text: "location.date_collected_free",
        show: false,
      },
      {
        value: "stratigraphy_free",
        text: "location.stratigraphy_free",
        show: false,
      },
      {
        value: "number_items",
        text: "location.number_items",
        show: false,
      },
      {
        value: "number_items_registered",
        text: "location.number_items_registered",
        show: false,
      },
      {
        value: "remarks",
        text: "location.remarks",
        show: false,
      },
      {
        value: "database__id",
        text: "location.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "location.database__acronym",
        show: false,
      },
      {
        value: "user_added",
        text: "location.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "location.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "location.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "location.date_changed",
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
  getDefaultState,
};
