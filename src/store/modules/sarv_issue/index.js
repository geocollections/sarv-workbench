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
        date_added: {
          lookUpType: "icontains",
          title: "sarv_issue.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "sarv_issue.date_changed",
          value: null,
        },
        description: {
          lookUpType: "icontains",
          title: "sarv_issue.description",
          value: null,
        },
        from_user: {
          lookUpType: "icontains",
          title: "sarv_issue.from_user",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "sarv_issue.id",
          value: null,
        },
        response: {
          lookUpType: "icontains",
          title: "sarv_issue.response",
          value: null,
        },
        title: {
          lookUpType: "icontains",
          title: "sarv_issue.title",
          value: null,
        },
        to_user: {
          lookUpType: "icontains",
          title: "sarv_issue.to_user__id",
          value: null,
        },
        url: {
          lookUpType: "icontains",
          title: "sarv_issue.url",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "sarv_issue.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "sarv_issue.user_changed",
          value: null,
        },
      },
      mainIds: ["title", "description", "from_user"],
      extraIds: [
        "date_added",
        "date_changed",
        "id",
        "response",
        "to_user",
        "url",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "replied",
        text: "sarv_issue.replied",
        sortable: false,
        show: true,
      },
      {
        value: "date_added",
        text: "sarv_issue.date_added",
        show: true,
      },
      {
        value: "to_user__username",
        text: "sarv_issue.to_user__username",
        show: true,
      },
      {
        value: "title",
        text: "sarv_issue.title",
        show: true,
      },
      {
        value: "description",
        text: "sarv_issue.description",
        show: true,
      },
      {
        value: "url",
        text: "sarv_issue.url",
        show: true,
      },
      {
        value: "response",
        text: "sarv_issue.response",
        show: true,
      },
      {
        value: "from_user__id",
        text: "sarv_issue.from_user__id",
        show: false,
      },
      {
        value: "to_user__id",
        text: "sarv_issue.to_user__id",
        show: false,
      },
      {
        value: "user_added",
        text: "sarv_issue.user_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "sarv_issue.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "sarv_issue.date_changed",
        show: false,
      },
      {
        value: "idfrom_user__username",
        text: "sarv_issue.idfrom_user__username",
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
