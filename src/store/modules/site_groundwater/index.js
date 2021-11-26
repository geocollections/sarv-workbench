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
        aquifer: {
          lookUpType: "icontains",
          title: "site_groundwater.aquifer",
          value: null,
        },
        aquifer_system: {
          lookUpType: "icontains",
          title: "site_groundwater.aquifer_system",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "site_groundwater.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "site_groundwater.date_changed",
          value: null,
        },
        filter_bottom: {
          lookUpType: "icontains",
          title: "site_groundwater.filter_bottom",
          value: null,
        },
        filter_bottom_z: {
          lookUpType: "icontains",
          title: "site_groundwater.filter_bottom_z",
          value: null,
        },
        filter_midpoint: {
          lookUpType: "icontains",
          title: "site_groundwater.filter_midpoint",
          value: null,
        },
        filter_midpoint_z: {
          lookUpType: "icontains",
          title: "site_groundwater.filter_midpoint_z",
          value: null,
        },
        filter_top: {
          lookUpType: "icontains",
          title: "site_groundwater.filter_top",
          value: null,
        },
        filter_top_z: {
          lookUpType: "icontains",
          title: "site_groundwater.filter_top_z",
          value: null,
        },
        filter_type: {
          lookUpType: "icontains",
          title: "site_groundwater.filter_type",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "site_groundwater.id",
          value: null,
        },
        kataster_id: {
          lookUpType: "icontains",
          title: "site_groundwater.kataster_id",
          value: null,
        },
        keskkonnaregister_id: {
          lookUpType: "icontains",
          title: "site_groundwater.keskkonnaregister_id",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "site_groundwater.remarks",
          value: null,
        },
        site: {
          lookUpType: "icontains",
          title: "site_groundwater.site",
          value: null,
          fields: ["site__name", "site__name_en"],
          type: "multi",
        },
        type_txt: {
          lookUpType: "icontains",
          title: "site_groundwater.type_txt",
          value: null,
        },
        url_veka: {
          lookUpType: "icontains",
          title: "site_groundwater.url_veka_short",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "site_groundwater.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "site_groundwater.user_changed",
          value: null,
        },
        well_depth: {
          lookUpType: "icontains",
          title: "site_groundwater.well_depth",
          value: null,
        },
      },
      mainIds: [
        "site",
        "type_txt",
        "aquifer_system",
        "aquifer",
        "well_depth",
        "filter_type",
        "filter_top",
        "filter_top_z",
        "filter_bottom",
        "filter_bottom_z",
        "url_veka",
        "remarks",
      ],
      extraIds: [
        "date_added",
        "date_changed",
        "filter_midpoint",
        "filter_midpoint_z",
        "id",
        "kataster_id",
        "keskkonnaregister_id",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "site_groundwater.id",
        show: true,
      },
      {
        value: "type_txt",
        text: "site_groundwater.type_txt",
        show: true,
      },
      {
        value: "aquifer_system",
        text: "site_groundwater.aquifer_system",
        show: true,
      },
      {
        value: "aquifer",
        text: "site_groundwater.aquifer",
        show: true,
      },
      {
        value: "well_depth",
        text: "site_groundwater.well_depth",
        show: true,
      },
      {
        value: "filter_type",
        text: "site_groundwater.filter_type",
        show: true,
      },
      {
        value: "filter_top",
        text: "site_groundwater.filter_top",
        show: true,
      },
      {
        value: "filter_bottom",
        text: "site_groundwater.filter_bottom",
        show: true,
      },
      {
        value: "filter_top_z",
        text: "site_groundwater.filter_top_z",
        show: true,
      },
      {
        value: "filter_bottom_z",
        text: "site_groundwater.filter_bottom_z",
        show: true,
      },
      {
        value: "url_veka",
        text: "site_groundwater.url_veka",
        show: true,
      },
      {
        value: "remarks",
        text: "site_groundwater.remarks",
        show: true,
      },
      {
        value: "site",
        text: "site_groundwater.site",
        show: false,
      },
      {
        value: "filter_midpoint_z",
        text: "site_groundwater.filter_midpoint_z",
        show: false,
      },
      {
        value: "filter_midpoint",
        text: "site_groundwater.filter_midpoint",
        show: false,
      },
      {
        value: "kataster_id",
        text: "site_groundwater.kataster_id",
        show: false,
      },
      {
        value: "keskkonnaregister_id",
        text: "site_groundwater.keskkonnaregister_id",
        show: false,
      },
      {
        value: "user_added",
        text: "site_groundwater.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "site_groundwater.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "site_groundwater.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "site_groundwater.date_changed",
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
