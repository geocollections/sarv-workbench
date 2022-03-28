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
          title: "web_news.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "web_news.date_changed",
          value: null,
        },
        date_expires: {
          lookUpType: "icontains",
          title: "web_news.date_expires",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "web_news.id",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "web_news.is_private",
          value: null,
        },
        text_en: {
          lookUpType: "icontains",
          title: "web_news.text_en",
          value: null,
        },
        text_et: {
          lookUpType: "icontains",
          title: "web_news.text_et",
          value: null,
        },
        timestamp: {
          lookUpType: "icontains",
          title: "web_news.timestamp",
          value: null,
        },
        title_en: {
          lookUpType: "icontains",
          title: "web_news.title_en",
          value: null,
        },
        title_et: {
          lookUpType: "icontains",
          title: "web_news.title_et",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "web_news.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "web_news.user_changed",
          value: null,
        },
      },
      mainIds: ["id", "title_et"],
      extraIds: [
        "date_added",
        "date_changed",
        "date_expires",
        "is_private",
        "text_en",
        "text_et",
        "timestamp",
        "title_en",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "web_news.id",
        show: true,
      },
      {
        value: "is_private",
        text: "web_news.is_private",
        show: true,
      },
      {
        value: "title_et",
        text: "web_news.title_et",
        show: false,
      },
      {
        value: "title_en",
        text: "web_news.title_en",
        show: false,
      },
      {
        value: "text_en",
        text: "web_news.text_en",
        show: false,
      },
      {
        value: "text_et",
        text: "web_news.text_et",
        show: false,
      },
      {
        value: "user_added",
        text: "web_news.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "web_news.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "web_news.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "web_news.date_changed",
        show: false,
      },
      {
        value: "date_expires",
        text: "web_news.date_expires",
        show: false,
      },
      {
        value: "timestamp",
        text: "web_news.timestamp",
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
