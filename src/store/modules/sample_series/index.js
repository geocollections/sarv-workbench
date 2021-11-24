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
        agent_collected: {
          lookUpType: "icontains",
          title: "sample_series.agent_collected__id",
          value: null,
          fields: [
            "agent_collected__agent",
            "agent_collected__forename",
            "agent_collected__surename",
          ],
          type: "multi",
        },
        database: {
          lookUpType: "icontains",
          title: "sample_series.database__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "sample_series.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "sample_series.date_changed",
          value: null,
        },
        date_collected: {
          lookUpType: "icontains",
          title: "sample_series.date_collected",
          value: null,
        },
        date_collected_free: {
          lookUpType: "icontains",
          title: "sample_series.date_collected_free",
          value: null,
        },
        depth_base: {
          lookUpType: "icontains",
          title: "sample_series.depth_base",
          value: null,
        },
        depth_top: {
          lookUpType: "icontains",
          title: "sample_series.depth_top",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "sample_series.id",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "sample_series.is_private",
          value: null,
        },
        locality: {
          lookUpType: "icontains",
          title: "sample_series.locality__id",
          value: null,
          fields: [
            "locality_free",
            "locality__locality",
            "locality__locality_en",
          ],
          type: "multi",
        },
        locality_free: {
          lookUpType: "icontains",
          title: "sample_series.locality_free",
          value: null,
        },
        location: {
          lookUpType: "icontains",
          title: "sample_series.location",
          value: null,
        },
        name: {
          lookUpType: "icontains",
          title: "sample_series.name",
          value: null,
        },
        number_prefix: {
          lookUpType: "icontains",
          title: "sample_series.number_prefix",
          value: null,
        },
        number_start: {
          lookUpType: "icontains",
          title: "sample_series.number_start",
          value: null,
        },
        owner: {
          lookUpType: "icontains",
          title: "sample_series.owner__id",
          value: null,
        },
        public: {
          lookUpType: "icontains",
          title: "sample_series.public",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "sample_series.remarks",
          value: null,
        },
        sample_count: {
          lookUpType: "icontains",
          title: "sample_series.sample_count",
          value: null,
        },
        sample_numbers: {
          lookUpType: "icontains",
          title: "sample_series.sample_numbers",
          value: null,
        },
        sampling_purpose: {
          lookUpType: "icontains",
          title: "sample_series.sampling_purpose",
          value: null,
        },
        stratigraphy_base: {
          lookUpType: "icontains",
          title: "sample_series.stratigraphy_base__id",
          value: null,
        },
        stratigraphy_base_free: {
          lookUpType: "icontains",
          title: "sample_series.stratigraphy_base_free",
          value: null,
        },
        stratigraphy_top: {
          lookUpType: "icontains",
          title: "sample_series.stratigraphy_top__id",
          value: null,
        },
        stratigraphy_top_free: {
          lookUpType: "icontains",
          title: "sample_series.stratigraphy_top_free",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "sample_series.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "sample_series.user_changed",
          value: null,
        },
        zero_level: {
          lookUpType: "icontains",
          title: "sample_series.zero_level",
          value: null,
        },
      },
      mainIds: ["name", "locality", "agent_collected"],
      extraIds: [
        "database",
        "date_added",
        "date_changed",
        "date_collected",
        "date_collected_free",
        "depth_base",
        "depth_top",
        "id",
        "is_private",
        "locality_free",
        "location",
        "number_prefix",
        "number_start",
        "owner",
        "public",
        "remarks",
        "sample_count",
        "sample_numbers",
        "sampling_purpose",
        "stratigraphy_base",
        "stratigraphy_base_free",
        "stratigraphy_top",
        "stratigraphy_top_free",
        "user_added",
        "user_changed",
        "zero_level",
      ],
    },
    headers: [
      {
        value: "id",
        text: "sample_series.id",
        show: true,
      },
      {
        value: "name",
        text: "sample_series.name",
        show: true,
      },
      {
        value: "sampling_purpose",
        text: "sample_series.sampling_purpose",
        show: false,
      },
      {
        value: "sample_count",
        text: "sample_series.sample_count",
        show: false,
      },
      {
        value: "sample_numbers",
        text: "sample_series.sample_numbers",
        show: false,
      },
      {
        value: "number_prefix",
        text: "sample_series.number_prefix",
        show: false,
      },
      {
        value: "number_start",
        text: "sample_series.number_start",
        show: false,
      },
      {
        value: "locality__id",
        text: "sample_series.locality__id",
        show: false,
      },
      {
        value: "locality__locality",
        text: "sample_series.locality__locality",
        show: false,
      },
      {
        value: "locality__locality_en",
        text: "sample_series.locality__locality_en",
        show: false,
      },
      {
        value: "locality_free",
        text: "sample_series.locality_free",
        show: false,
      },
      {
        value: "zero_level",
        text: "sample_series.zero_level",
        show: false,
      },
      {
        value: "depth_top",
        text: "sample_series.depth_top",
        show: false,
      },
      {
        value: "depth_base",
        text: "sample_series.depth_base",
        show: false,
      },
      {
        value: "stratigraphy_base__id",
        text: "sample_series.stratigraphy_base__id",
        show: false,
      },
      {
        value: "stratigraphy_base__stratigraphy",
        text: "sample_series.stratigraphy_base__stratigraphy",
        show: false,
      },
      {
        value: "stratigraphy_base__stratigraphy_en",
        text: "sample_series.stratigraphy_base__stratigraphy_en",
        show: false,
      },
      {
        value: "stratigraphy_top__id",
        text: "sample_series.stratigraphy_top__id",
        show: false,
      },
      {
        value: "stratigraphy_top__stratigraphy",
        text: "sample_series.stratigraphy_top__stratigraphy",
        show: false,
      },
      {
        value: "stratigraphy_top__stratigraphy_en",
        text: "sample_series.stratigraphy_top__stratigraphy_en",
        show: false,
      },
      {
        value: "stratigraphy_base_free",
        text: "sample_series.stratigraphy_base_free",
        show: false,
      },
      {
        value: "stratigraphy_top_free",
        text: "sample_series.stratigraphy_top_free",
        show: false,
      },
      {
        value: "agent_collected__id",
        text: "sample_series.agent_collected__id",
        show: false,
      },
      {
        value: "agent_collected__agent",
        text: "sample_series.agent_collected__agent",
        show: false,
      },
      {
        value: "date_collected",
        text: "sample_series.date_collected",
        show: false,
      },
      {
        value: "date_collected_free",
        text: "sample_series.date_collected_free",
        show: false,
      },
      {
        value: "location",
        text: "sample_series.location",
        show: false,
      },
      {
        value: "remarks",
        text: "sample_series.remarks",
        show: false,
      },
      {
        value: "owner__id",
        text: "sample_series.owner__id",
        show: false,
      },
      {
        value: "owner__agent",
        text: "sample_series.owner__agent",
        show: false,
      },
      {
        value: "public",
        text: "sample_series.public",
        show: false,
      },
      {
        value: "is_private",
        text: "sample_series.is_private",
        show: false,
      },
      {
        value: "user_added",
        text: "sample_series.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "sample_series.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "sample_series.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "sample_series.date_changed",
        show: false,
      },
      {
        value: "database__id",
        text: "sample_series.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "sample_series.database__acronym",
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
