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
        name: {
          title: "project.name",
          value: null,
          lookUpType: "icontains",
          fields: ["name", "name_en"],
          type: "multi",
        },
        name_en: {
          title: "project.name_en",
          value: null,
          lookUpType: "icontains",
        },
        number: {
          title: "project.number",
          value: null,
          lookUpType: "icontains",
        },
        project_type: {
          title: "project.project_type__id",
          value: null,
          lookUpType: "icontains",
        },
        parent_project: {
          title: "project.parent_project__id",
          value: null,
          lookUpType: "icontains",
        },
        date_start: {
          title: "project.date_start",
          value: null,
          lookUpType: "icontains",
        },
        date_end: {
          title: "project.date_end",
          value: null,
          lookUpType: "icontains",
        },
        date_free: {
          title: "project.date_free",
          value: null,
          lookUpType: "icontains",
        },
        description: {
          title: "project.description",
          value: null,
          lookUpType: "icontains",
        },
        remarks: {
          title: "project.remarks",
          value: null,
          lookUpType: "icontains",
        },
        owner: {
          title: "project.owner__id",
          value: null,
          lookUpType: "icontains",
        },
        is_private: {
          title: "project.is_private",
          value: null,
          lookUpType: "icontains",
        },
        user_added: {
          title: "project.user_added",
          value: null,
          lookUpType: "icontains",
        },
        date_added: {
          title: "project.date_added",
          value: null,
          lookUpType: "icontains",
        },
        user_changed: {
          title: "project.user_changed",
          value: null,
          lookUpType: "icontains",
        },
        date_changed: {
          title: "project.date_changed",
          value: null,
          lookUpType: "icontains",
        },
        id: {
          title: "project.id",
          value: null,
          lookUpType: "icontains",
        },
        timestamp: {
          title: "project.timestamp",
          value: null,
          lookUpType: "icontains",
        },
      },
      mainIds: ["name", "id"],
      extraIds: [
        "name_en",
        "number",
        "project_type",
        "parent_project",
        "date_start",
        "date_end",
        "date_free",
        "description",
        "remarks",
        "owner",
        "is_private",
        "user_added",
        "date_added",
        "user_changed",
        "date_changed",
        "timestamp",
      ],
    },
    headers: [
      {
        value: "id",
        text: "project.id",
        show: true,
      },
      {
        value: "name",
        text: "project.name",
        show: true,
      },
      {
        value: "project_type.name",
        text: "project.project_type__name",
        show: true,
      },
      {
        value: "date_start",
        text: "project.date_start",
        show: true,
      },
      {
        value: "date_end",
        text: "project.date_end",
        show: true,
      },
      {
        value: "date_free",
        text: "project.date_free",
        show: true,
      },
      {
        value: "owner.agent",
        text: "project.owner__agent",
        show: true,
      },
      {
        value: "name_en",
        text: "project.name_en",
        show: false,
      },
      {
        value: "number",
        text: "project.number",
        show: false,
      },
      {
        value: "project_type.name_en",
        text: "project.project_type__name_en",
        show: false,
      },
      {
        value: "parent_project.name",
        text: "project.parent_project__name",
        show: false,
      },
      {
        value: "parent_project.name_en",
        text: "project.parent_project__name_en",
        show: false,
      },
      {
        value: "description",
        text: "project.description",
        show: false,
      },
      {
        value: "remarks",
        text: "project.remarks",
        show: false,
      },
      {
        value: "is_private",
        text: "project.is_private",
        show: false,
      },
      {
        value: "user_added",
        text: "project.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "project.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "project.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "project.date_changed",
        show: false,
      },
      {
        value: "timestamp",
        text: "project.timestamp",
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
