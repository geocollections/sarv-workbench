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
        agent_digitised: {
          lookUpType: "icontains",
          title: "imageset.agent_digitised__id",
          value: null
        },
        author: {
          lookUpType: "icontains",
          title: "imageset.author__id",
          value: null
        },
        author_free: {
          lookUpType: "icontains",
          title: "imageset.author_free",
          value: null
        },
        database: {
          lookUpType: "icontains",
          title: "imageset.database__id",
          value: null
        },
        date_added: {
          lookUpType: "icontains",
          title: "imageset.date_added",
          value: null
        },
        date_changed: {
          lookUpType: "icontains",
          title: "imageset.date_changed",
          value: null
        },
        date_digitised: {
          lookUpType: "icontains",
          title: "imageset.date_digitised",
          value: null
        },
        date_digitised_free: {
          lookUpType: "icontains",
          title: "imageset.date_digitised_free",
          value: null
        },
        date_end: {
          lookUpType: "icontains",
          title: "imageset.date_end",
          value: null
        },
        date_free: {
          lookUpType: "icontains",
          title: "imageset.date_free",
          value: null
        },
        date_start: {
          lookUpType: "icontains",
          title: "imageset.date_start",
          value: null
        },
        description: {
          lookUpType: "icontains",
          title: "imageset.description",
          value: null
        },
        device: {
          lookUpType: "icontains",
          title: "imageset.device__id",
          value: null
        },
        device_digitised: {
          lookUpType: "icontains",
          title: "imageset.device_digitised__id",
          value: null
        },
        id: {
          lookUpType: "icontains",
          title: "imageset.id",
          value: null
        },
        imageset_number: {
          lookUpType: "icontains",
          title: "imageset.imageset_number",
          value: null
        },
        imageset_series: {
          lookUpType: "icontains",
          title: "imageset.imageset_series",
          value: null
        },
        is_private: {
          lookUpType: "icontains",
          title: "imageset.is_private",
          value: null
        },
        keywords: {
          lookUpType: "icontains",
          title: "imageset.keywords",
          value: null
        },
        object: {
          lookUpType: "icontains",
          title: "imageset.object",
          value: null
        },
        place: {
          lookUpType: "icontains",
          title: "imageset.place",
          value: null
        },
        remarks: {
          lookUpType: "icontains",
          title: "imageset.remarks",
          value: null
        },
        user_added: {
          lookUpType: "icontains",
          title: "imageset.user_added",
          value: null
        },
        user_changed: {
          lookUpType: "icontains",
          title: "imageset.user_changed",
          value: null
        }
      },
      mainIds: ["imageset_number", "description"],
      extraIds: [
        "agent_digitised",
        "author",
        "author_free",
        "database",
        "date_added",
        "date_changed",
        "date_digitised",
        "date_digitised_free",
        "date_end",
        "date_free",
        "date_start",
        "description",
        "device",
        "device_digitised",
        "id",
        "imageset_number",
        "imageset_series",
        "is_private",
        "keywords",
        "object",
        "place",
        "remarks",
        "user_added",
        "user_changed"
      ],
    },
    headers: [
      {
        value: "id",
        text: "imageset.id",
        show: true,
      },
      {
        value: "imageset_number",
        text: "imageset.imageset_number",
        show: true,
      },
      {
        value: "description",
        text: "imageset.description",
        show: true,
      },
      {
        value: "date_added",
        text: "imageset.date_added",
        show: true,
      },
      {
        value: "imageset_series",
        text: "imageset.imageset_series",
        show: false,
      },
      {
        value: "author__id",
        text: "imageset.author__id",
        show: false,
      },
      {
        value: "author__agent",
        text: "imageset.author__agent",
        show: false,
      },
      {
        value: "author_free",
        text: "imageset.author_free",
        show: false,
      },
      {
        value: "date_start",
        text: "imageset.date_start",
        show: false,
      },
      {
        value: "date_end",
        text: "imageset.date_end",
        show: false,
      },
      {
        value: "date_free",
        text: "imageset.date_free",
        show: false,
      },
      {
        value: "device__id",
        text: "imageset.device__id",
        show: false,
      },
      {
        value: "device__name",
        text: "imageset.device__name",
        show: false,
      },
      {
        value: "object",
        text: "imageset.object",
        show: false,
      },
      {
        value: "place",
        text: "imageset.place",
        show: false,
      },
      {
        value: "keywords",
        text: "imageset.keywords",
        show: false,
      },
      {
        value: "date_digitised",
        text: "imageset.date_digitised",
        show: false,
      },
      {
        value: "date_digitised_free",
        text: "imageset.date_digitised_free",
        show: false,
      },
      {
        value: "device_digitised__id",
        text: "imageset.device_digitised__id",
        show: false,
      },
      {
        value: "device_digitised__name",
        text: "imageset.device_digitised__name",
        show: false,
      },
      {
        value: "agent_digitised__id",
        text: "imageset.agent_digitised__id",
        show: false,
      },
      {
        value: "agent_digitised__agent",
        text: "imageset.agent_digitised__agent",
        show: false,
      },
      {
        value: "is_private",
        text: "imageset.is_private",
        show: false,
      },
      {
        value: "remarks",
        text: "imageset.remarks",
        show: false,
      },
      {
        value: "database__id",
        text: "imageset.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "imageset.database__acronym",
        show: false,
      },
      {
        value: "user_added",
        text: "imageset.user_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "imageset.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "imageset.date_changed",
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
