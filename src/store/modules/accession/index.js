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
        agent_andis: {
          lookUpType: "icontains",
          title: "accession.agent_andis__id",
          value: null,
        },
        agent_kinnitas: {
          lookUpType: "icontains",
          title: "accession.agent_kinnitas__id",
          value: null,
        },
        agent_vottis: {
          lookUpType: "icontains",
          title: "accession.agent_vottis__id",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "accession.database__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "accession.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "accession.date_changed",
          value: null,
        },
        date_confirmed: {
          lookUpType: "icontains",
          title: "accession.date_confirmed",
          value: null,
        },
        date_signed: {
          lookUpType: "icontains",
          title: "accession.date_signed",
          value: null,
        },
        description: {
          lookUpType: "icontains",
          title: "accession.description",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "accession.id",
          value: null,
        },
        number: {
          lookUpType: "icontains",
          title: "accession.number",
          value: null,
        },
        number_items: {
          lookUpType: "icontains",
          title: "accession.number_items",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "accession.remarks",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "accession.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "accession.user_changed",
          value: null,
        },
      },
      mainIds: ["number", "description"],
      extraIds: [
        "agent_andis",
        "agent_kinnitas",
        "agent_vottis",
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
        text: "accession.number",
        show: true,
      },
      {
        value: "date_signed",
        text: "accession.date_signed",
        show: true,
      },
      {
        value: "agent_andis.agent",
        text: "accession.agent_andis__agent",
        show: true,
      },
      {
        value: "agent_vottis.agent",
        text: "accession.agent_vottis__agent",
        show: true,
      },
      {
        value: "number_items",
        text: "accession.number_items",
        show: true,
      },
      {
        value: "description",
        text: "accession.description",
        show: true,
      },
      {
        value: "id",
        text: "accession.id",
        show: true,
      },
      {
        value: "date_confirmed",
        text: "accession.date_confirmed",
        show: false,
      },
      {
        value: "agent_kinnitas.agent",
        text: "accession.agent_kinnitas__agent",
        show: false,
      },
      {
        value: "remarks",
        text: "accession.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "accession.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "accession.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "accession.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "accession.date_changed",
        show: false,
      },
      {
        value: "database.acronym",
        text: "accession.database__acronym",
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
