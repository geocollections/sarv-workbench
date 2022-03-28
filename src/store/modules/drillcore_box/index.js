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
        database: {
          lookUpType: "icontains",
          title: "drillcore_box.database__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "drillcore_box.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "drillcore_box.date_changed",
          value: null,
        },
        depth_end: {
          lookUpType: "icontains",
          title: "drillcore_box.depth_end",
          value: null,
        },
        depth_other: {
          lookUpType: "icontains",
          title: "drillcore_box.depth_other",
          value: null,
        },
        depth_start: {
          lookUpType: "icontains",
          title: "drillcore_box.depth_start",
          value: null,
        },
        diameter: {
          lookUpType: "icontains",
          title: "drillcore_box.diameter",
          value: null,
        },
        drillcore: {
          lookUpType: "icontains",
          title: "drillcore_box.drillcore",
          value: null,
          fields: ["drillcore__drillcore", "drillcore__drillcore_en"],
          type: "multi",
        },
        id: {
          lookUpType: "icontains",
          title: "drillcore_box.id",
          value: null,
        },
        location: {
          lookUpType: "icontains",
          title: "drillcore_box.location",
          value: null,
          fields: ["storage__location"],
          type: "text",
        },
        number: {
          lookUpType: "icontains",
          title: "drillcore_box.number",
          value: null,
        },
        number_meters: {
          lookUpType: "icontains",
          title: "drillcore_box.number_meters",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "drillcore_box.remarks",
          value: null,
        },
        storage: {
          lookUpType: "icontains",
          title: "drillcore_box.storage__id",
          value: null,
        },
        stratigraphy_base: {
          lookUpType: "icontains",
          title: "drillcore_box.stratigraphy_base__id",
          value: null,
        },
        stratigraphy_base_free: {
          lookUpType: "icontains",
          title: "drillcore_box.stratigraphy_base_free",
          value: null,
        },
        stratigraphy_free: {
          lookUpType: "icontains",
          title: "drillcore_box.stratigraphy_free",
          value: null,
        },
        stratigraphy_top: {
          lookUpType: "icontains",
          title: "drillcore_box.stratigraphy_top__id",
          value: null,
        },
        stratigraphy_top_free: {
          lookUpType: "icontains",
          title: "drillcore_box.stratigraphy_top_free",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "drillcore_box.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "drillcore_box.user_changed",
          value: null,
        },
      },
      mainIds: ["location", "drillcore"],
      extraIds: [
        "database",
        "date_added",
        "date_changed",
        "depth_end",
        "depth_other",
        "depth_start",
        "diameter",
        "id",
        "number",
        "number_meters",
        "remarks",
        "storage",
        "stratigraphy_base",
        "stratigraphy_base_free",
        "stratigraphy_free",
        "stratigraphy_top",
        "stratigraphy_top_free",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "drillcore",
        text: "drillcore_box.drillcore__drillcore",
        show: true,
      },
      {
        value: "number",
        text: "drillcore_box.number",
        show: true,
      },
      {
        value: "number_meters",
        text: "drillcore_box.number_meters",
        show: true,
      },
      {
        value: "depth_start",
        text: "drillcore_box.depth_start",
        show: true,
      },
      {
        value: "depth_end",
        text: "drillcore_box.depth_end",
        show: true,
      },
      {
        value: "depth_other",
        text: "drillcore_box.depth_other",
        show: true,
      },
      {
        value: "stratigraphy_free",
        text: "drillcore_box.stratigraphy_free",
        show: true,
      },
      {
        value: "remarks",
        text: "drillcore_box.remarks",
        show: true,
      },
      {
        value: "link",
        text: "drillcore_box.link",
        sortable: false,
        show: true,
      },
      {
        value: "diameter",
        text: "drillcore_box.diameter",
        show: false,
      },
      {
        value: "stratigraphy_base__id",
        text: "drillcore_box.stratigraphy_base__id",
        show: false,
      },
      {
        value: "stratigraphy_base__stratigraphy",
        text: "drillcore_box.stratigraphy_base__stratigraphy",
        show: false,
      },
      {
        value: "stratigraphy_base__stratigraphy_en",
        text: "drillcore_box.stratigraphy_base__stratigraphy_en",
        show: false,
      },
      {
        value: "stratigraphy_top__id",
        text: "drillcore_box.stratigraphy_top__id",
        show: false,
      },
      {
        value: "stratigraphy_top__stratigraphy",
        text: "drillcore_box.stratigraphy_top__stratigraphy",
        show: false,
      },
      {
        value: "stratigraphy_top__stratigraphy_en",
        text: "drillcore_box.stratigraphy_top__stratigraphy_en",
        show: false,
      },
      {
        value: "stratigraphy_base_free",
        text: "drillcore_box.stratigraphy_base_free",
        show: false,
      },
      {
        value: "stratigraphy_top_free",
        text: "drillcore_box.stratigraphy_top_free",
        show: false,
      },
      {
        value: "location",
        text: "drillcore_box.location",
        show: false,
      },
      {
        value: "storage__id",
        text: "drillcore_box.storage__id",
        show: false,
      },
      {
        value: "storage__location",
        text: "drillcore_box.storage__location",
        show: false,
      },
      {
        value: "user_added",
        text: "drillcore_box.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "drillcore_box.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "drillcore_box.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "drillcore_box.date_changed",
        show: false,
      },
      {
        value: "database__id",
        text: "drillcore_box.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "drillcore_box.database__acronym",
        show: false,
      },
      {
        value: "id",
        text: "drillcore_box.id",
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
