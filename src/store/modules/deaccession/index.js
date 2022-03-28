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
        agent_kandis: {
          lookUpType: "icontains",
          title: "deaccession.agent_kandis__id",
          value: null,
        },
        agent_kinnitas: {
          lookUpType: "icontains",
          title: "deaccession.agent_kinnitas__id",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "deaccession.database__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "deaccession.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "deaccession.date_changed",
          value: null,
        },
        date_confirmed: {
          lookUpType: "icontains",
          title: "deaccession.date_confirmed",
          value: null,
        },
        date_signed: {
          lookUpType: "icontains",
          title: "deaccession.date_signed",
          value: null,
        },
        description: {
          lookUpType: "icontains",
          title: "deaccession.description",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "deaccession.id",
          value: null,
        },
        number: {
          lookUpType: "icontains",
          title: "deaccession.number",
          value: null,
        },
        number_items: {
          lookUpType: "icontains",
          title: "deaccession.number_items",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "deaccession.remarks",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "deaccession.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "deaccession.user_changed",
          value: null,
        },
      },
      mainIds: ["number", "description"],
      extraIds: [
        "agent_kandis",
        "agent_kinnitas",
        "database",
        "date_added",
        "date_changed",
        "date_confirmed",
        "date_signed",
        "id",
        "number_items",
        "remarks",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "number",
        text: "deaccession.number",
        show: true,
      },
      {
        value: "date_signed",
        text: "deaccession.date_signed",
        show: true,
      },
      {
        value: "number_items",
        text: "deaccession.number_items",
        show: true,
      },
      {
        value: "description",
        text: "deaccession.description",
        show: true,
      },
      {
        value: "id",
        text: "deaccession.id",
        show: true,
      },
      {
        value: "date_confirmed",
        text: "deaccession.date_confirmed",
        show: false,
      },
      {
        value: "agent_kandis__agent",
        text: "deaccession.agent_kandis__agent",
        show: false,
      },
      {
        value: "agent_kandis__id",
        text: "deaccession.agent_kandis__id",
        show: false,
      },
      {
        value: "agent_kinnitas__id",
        text: "deaccession.agent_kinnitas__id",
        show: false,
      },
      {
        value: "agent_kinnitas__agent",
        text: "deaccession.agent_kinnitas__agent",
        show: false,
      },
      {
        value: "remarks",
        text: "deaccession.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "deaccession.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "deaccession.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "deaccession.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "deaccession.date_changed",
        show: false,
      },
      {
        value: "database__id",
        text: "deaccession.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "deaccession.database__acronym",
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
