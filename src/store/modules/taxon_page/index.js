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
        author: {
          lookUpType: "icontains",
          title: "taxon_page.author__id",
          value: null,
        },
        author_txt: {
          lookUpType: "icontains",
          title: "taxon_page.author_txt",
          value: null,
        },
        content: {
          lookUpType: "icontains",
          title: "taxon_page.content",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "taxon_page.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "taxon_page.date_changed",
          value: null,
        },
        date_txt: {
          lookUpType: "icontains",
          title: "taxon_page.date_txt",
          value: null,
        },
        frontpage: {
          lookUpType: "icontains",
          title: "taxon_page.frontpage",
          value: null,
        },
        frontpage_order: {
          lookUpType: "icontains",
          title: "taxon_page.frontpage_order",
          value: null,
        },
        frontpage_title: {
          lookUpType: "icontains",
          title: "taxon_page.frontpage_title",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "taxon_page.id",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "taxon_page.is_private",
          value: null,
        },
        language: {
          lookUpType: "icontains",
          title: "taxon_page.language",
          value: null,
        },
        link_wikipedia: {
          lookUpType: "icontains",
          title: "taxon_page.link_wikipedia",
          value: null,
        },
        on_frontpage: {
          lookUpType: "icontains",
          title: "taxon_page.on_frontpage",
          value: null,
        },
        taxon: {
          lookUpType: "icontains",
          title: "taxon_page.taxon",
          value: null,
        },
        title: {
          lookUpType: "icontains",
          title: "taxon_page.title",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "taxon_page.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "taxon_page.user_changed",
          value: null,
        },
      },
      mainIds: ["taxon", "language", "title"],
      extraIds: [
        "author",
        "author_txt",
        "content",
        "date_added",
        "date_changed",
        "date_txt",
        "frontpage",
        "frontpage_order",
        "frontpage_title",
        "id",
        "is_private",
        "language",
        "link_wikipedia",
        "on_frontpage",
        "taxon",
        "title",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "taxon_page.id",
        show: true,
      },
      {
        value: "language",
        text: "taxon_page.language",
        show: true,
      },
      {
        value: "title",
        text: "taxon_page.title",
        show: true,
      },
      {
        value: "taxon__id",
        text: "taxon_page.taxon__id",
        show: false,
      },
      {
        value: "taxon__taxon",
        text: "taxon_page.taxon__taxon",
        show: false,
      },
      {
        value: "on_frontpage",
        text: "taxon_page.on_frontpage",
        show: false,
      },
      {
        value: "frontpage",
        text: "taxon_page.frontpage",
        show: false,
      },
      {
        value: "frontpage_order",
        text: "taxon_page.frontpage_order",
        show: false,
      },
      {
        value: "frontpage_title",
        text: "taxon_page.frontpage_title",
        show: false,
      },
      {
        value: "content",
        text: "taxon_page.content",
        show: false,
      },
      {
        value: "author__id",
        text: "taxon_page.author__id",
        show: false,
      },
      {
        value: "author__agent",
        text: "taxon_page.author__agent",
        show: false,
      },
      {
        value: "author_txt",
        text: "taxon_page.author_txt",
        show: false,
      },
      {
        value: "date_txt",
        text: "taxon_page.date_txt",
        show: false,
      },
      {
        value: "is_private",
        text: "taxon_page.is_private",
        show: false,
      },
      {
        value: "link_wikipedia",
        text: "taxon_page.link_wikipedia",
        show: false,
      },
      {
        value: "user_added",
        text: "taxon_page.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "taxon_page.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "taxon_page.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "taxon_page.date_changed",
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
