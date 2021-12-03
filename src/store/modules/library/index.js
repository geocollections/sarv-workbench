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
        abstract: {
          lookUpType: "icontains",
          title: "library.abstract",
          value: null,
        },
        abstract_en: {
          lookUpType: "icontains",
          title: "library.abstract_en",
          value: null,
        },
        author: {
          lookUpType: "icontains",
          title: "library.author__id",
          value: null,
        },
        author_txt: {
          lookUpType: "icontains",
          title: "library.author_txt",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "library.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "library.date_changed",
          value: null,
        },
        doi: {
          lookUpType: "icontains",
          title: "library.doi",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "library.id",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "library.is_private",
          value: null,
        },
        keywords: {
          lookUpType: "icontains",
          title: "library.keywords",
          value: null,
        },
        publisher: {
          lookUpType: "icontains",
          title: "library.publisher",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "library.remarks",
          value: null,
        },
        title: {
          lookUpType: "icontains",
          title: "library.title",
          value: null,
          fields: ["title", "title_en"],
          type: "multi",
        },
        title_en: {
          lookUpType: "icontains",
          title: "library.title_en",
          value: null,
        },
        title_short: {
          lookUpType: "icontains",
          title: "library.title_short",
          value: null,
        },
        title_short_en: {
          lookUpType: "icontains",
          title: "library.title_short_en",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "library.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "library.user_changed",
          value: null,
        },
        year: {
          lookUpType: "icontains",
          title: "library.year",
          value: null,
        },
        reference: {
          lookUpType: "icontains",
          title: "common.reference",
          value: null,
        },
      },
      mainIds: ["author_txt", "year", "title", "reference"],
      extraIds: [
        "abstract",
        "abstract_en",
        "author",
        "author_txt",
        "date_added",
        "date_changed",
        "doi",
        "id",
        "is_private",
        "keywords",
        "publisher",
        "remarks",
        "title",
        "title_en",
        "title_short",
        "title_short_en",
        "user_added",
        "user_changed",
        "year",
        "reference",
      ],
    },
    headers: [
      {
        value: "id",
        text: "library.id",
        show: true,
      },
      {
        value: "title",
        text: "library.title",
        show: true,
      },
      {
        value: "author_txt",
        text: "library.author_txt",
        show: true,
      },
      {
        value: "is_private",
        text: "library.is_private",
        show: true,
      },
      {
        value: "link",
        text: "library.link",
        sortable: false,
        show: true,
      },
      {
        value: "title_en",
        text: "library.title_en",
        show: false,
      },
      {
        value: "title_short",
        text: "library.title_short",
        show: false,
      },
      {
        value: "title_short_en",
        text: "library.title_short_en",
        show: false,
      },
      {
        value: "abstract",
        text: "library.abstract",
        show: false,
      },
      {
        value: "abstract_en",
        text: "library.abstract_en",
        show: false,
      },
      {
        value: "author__id",
        text: "library.author__id",
        show: false,
      },
      {
        value: "author__agent",
        text: "library.author__agent",
        show: false,
      },
      {
        value: "year",
        text: "library.year",
        show: false,
      },
      {
        value: "publisher",
        text: "library.publisher",
        show: false,
      },
      {
        value: "doi",
        text: "library.doi",
        show: false,
      },
      {
        value: "keywords",
        text: "library.keywords",
        show: false,
      },
      {
        value: "remarks",
        text: "library.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "library.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "library.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "library.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "library.date_changed",
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
