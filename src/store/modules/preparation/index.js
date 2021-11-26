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
        agent: {
          lookUpType: "icontains",
          title: "preparation.agent__id",
          value: null,
        },
        agent_txt: {
          lookUpType: "icontains",
          title: "preparation.agent_txt",
          value: null,
        },
        analysis: {
          lookUpType: "icontains",
          title: "preparation.analysis__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "preparation.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "preparation.date_changed",
          value: null,
        },
        date_prepared: {
          lookUpType: "icontains",
          title: "preparation.date_prepared",
          value: null,
        },
        date_prepared_txt: {
          lookUpType: "icontains",
          title: "preparation.date_prepared_txt",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "preparation.id",
          value: null,
        },
        identification_agent: {
          lookUpType: "icontains",
          title: "preparation.identification_agent__id",
          value: null,
        },
        identification_date: {
          lookUpType: "icontains",
          title: "preparation.identification_date",
          value: null,
        },
        identification_remarks: {
          lookUpType: "icontains",
          title: "preparation.identification_remarks",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "preparation.is_private",
          value: null,
        },
        location: {
          lookUpType: "icontains",
          title: "preparation.location",
          value: null,
        },
        owner: {
          lookUpType: "icontains",
          title: "preparation.owner__id",
          value: null,
        },
        preparation_number: {
          lookUpType: "icontains",
          title: "preparation.preparation_number",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "preparation.remarks",
          value: null,
        },
        sample: {
          lookUpType: "icontains",
          title: "preparation.sample__id",
          value: null,
        },
        sample_number: {
          lookUpType: "icontains",
          title: "preparation.sample_number",
          value: null,
        },
        storage: {
          lookUpType: "icontains",
          title: "preparation.storage__id",
          value: null,
        },
        taxon: {
          lookUpType: "icontains",
          title: "preparation.taxon__id",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "preparation.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "preparation.user_changed",
          value: null,
        },
      },
      mainIds: ["preparation_number"],
      extraIds: [
        "agent",
        "agent_txt",
        "analysis",
        "date_added",
        "date_changed",
        "date_prepared",
        "date_prepared_txt",
        "id",
        "identification_agent",
        "identification_date",
        "identification_remarks",
        "is_private",
        "location",
        "owner",
        "remarks",
        "sample",
        "sample_number",
        "storage",
        "taxon",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "preparation.id",
        show: true,
      },
      {
        value: "preparation_number",
        text: "preparation.preparation_number",
        show: true,
      },
      {
        value: "link",
        text: "preparation.link",
        sortable: false,
        show: true,
      },
      {
        value: "sample__id",
        text: "preparation.sample__id",
        show: false,
      },
      {
        value: "sample__number",
        text: "preparation.sample__number",
        show: false,
      },
      {
        value: "analysis",
        text: "preparation.analysis",
        show: false,
      },
      {
        value: "sample_number",
        text: "preparation.sample_number",
        show: false,
      },
      {
        value: "taxon__id",
        text: "preparation.taxon__id",
        show: false,
      },
      {
        value: "taxon__taxon",
        text: "preparation.taxon__taxon",
        show: false,
      },
      {
        value: "agent__id",
        text: "preparation.agent__id",
        show: false,
      },
      {
        value: "agent__agent",
        text: "preparation.agent__agent",
        show: false,
      },
      {
        value: "agent_txt",
        text: "preparation.agent_txt",
        show: false,
      },
      {
        value: "date_prepared",
        text: "preparation.date_prepared",
        show: false,
      },
      {
        value: "date_prepared_txt",
        text: "preparation.date_prepared_txt",
        show: false,
      },
      {
        value: "identification_agent__id",
        text: "preparation.identification_agent__id",
        show: false,
      },
      {
        value: "identification_agent__agent",
        text: "preparation.identification_agent__agent",
        show: false,
      },
      {
        value: "identification_date",
        text: "preparation.identification_date",
        show: false,
      },
      {
        value: "identification_remarks",
        text: "preparation.identification_remarks",
        show: false,
      },
      {
        value: "location",
        text: "preparation.location",
        show: false,
      },
      {
        value: "storage__id",
        text: "preparation.storage__id",
        show: false,
      },
      {
        value: "storage__location",
        text: "preparation.storage__location",
        show: false,
      },
      {
        value: "owner__id",
        text: "preparation.owner__id",
        show: false,
      },
      {
        value: "owner__agent",
        text: "preparation.owner__agent",
        show: false,
      },
      {
        value: "is_private",
        text: "preparation.is_private",
        show: false,
      },
      {
        value: "remarks",
        text: "preparation.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "preparation.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "preparation.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "preparation.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "preparation.date_changed",
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
