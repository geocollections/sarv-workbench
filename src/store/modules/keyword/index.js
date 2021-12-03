import { getField, updateField } from "vuex-map-fields";

const getDefaultState = () => {
  return {
    items: [],
    count: 0,
    options: {
      page: 1,
      paginateBy: 10,
      sortBy: ["id"],
      sortDesc: [true],
    },
    viewType: "table",
    searchFields: {
      byIds: {
        keyword: {
          title: "keyword.keyword",
          value: null,
          lookUpType: "icontains",
        },
        language: {
          title: "keyword.language__id",
          value: null,
          lookUpType: "icontains",
        },
        keyword_category: {
          title: "keyword.keyword_category__id",
          value: null,
          lookUpType: "icontains",
        },
        related_keyword: {
          title: "keyword.related_keyword__id",
          value: null,
          lookUpType: "icontains",
        },
        is_primary: {
          title: "keyword.is_primary",
          value: null,
          lookUpType: "icontains",
        },
        is_preferred: {
          title: "keyword.is_preferred",
          value: null,
          lookUpType: "icontains",
        },
        is_private: {
          title: "keyword.is_private",
          value: null,
          lookUpType: "icontains",
        },
        description: {
          title: "keyword.description",
          value: null,
          lookUpType: "icontains",
        },
        remarks: {
          title: "keyword.remarks",
          value: null,
          lookUpType: "icontains",
        },
        user_added: {
          title: "keyword.user_added",
          value: null,
          lookUpType: "icontains",
        },
        date_added: {
          title: "keyword.date_added",
          value: null,
          lookUpType: "icontains",
        },
        user_changed: {
          title: "keyword.user_changed",
          value: null,
          lookUpType: "icontains",
        },
        date_changed: {
          title: "keyword.date_changed",
          value: null,
          lookUpType: "icontains",
        },
        id: {
          id: "id",
          title: "keyword.id",
          value: null,
          lookUpType: "icontains",
        },
      },
      mainIds: ["id", "keyword", "language", "keyword_category"],
      extraIds: [
        "related_keyword",
        "is_primary",
        "is_preferred",
        "is_private",
        "description",
        "remarks",
        "user_added",
        "date_added",
        "user_changed",
        "date_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "keyword.id",
        show: true,
      },
      {
        value: "keyword",
        text: "keyword.keyword",
        show: true,
      },
      {
        value: "language.value",
        text: "keyword.language__value",
        show: true,
      },
      {
        value: "keyword_category.name",
        text: "keyword.keyword_category__name",
        show: true,
      },
      {
        value: "is_primary",
        text: "keyword.is_primary",
        show: true,
      },
      {
        value: "is_preferred",
        text: "keyword.is_preferred",
        show: true,
      },
      {
        value: "language.value_en",
        text: "keyword.language__value_en",
        show: false,
      },
      {
        value: "keyword_category.name_en",
        text: "keyword.keyword_category__name_en",
        show: false,
      },
      {
        value: "related_keyword.keyword",
        text: "keyword.related_keyword__keyword",
        show: false,
      },
      {
        value: "is_private",
        text: "keyword.is_private",
        show: false,
      },
      {
        value: "description",
        text: "keyword.description",
        show: false,
      },
      {
        value: "remarks",
        text: "keyword.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "keyword.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "keyword.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "keyword.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "keyword.date_changed",
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
