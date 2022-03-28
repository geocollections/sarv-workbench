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
        content_en: {
          lookUpType: "icontains",
          title: "web_pages.content_en",
          value: null,
        },
        content_et: {
          lookUpType: "icontains",
          title: "web_pages.content_et",
          value: null,
        },
        date_expires: {
          lookUpType: "icontains",
          title: "web_pages.date_expires",
          value: null,
        },
        date_inserted: {
          lookUpType: "icontains",
          title: "web_pages.date_inserted",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "web_pages.id",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "web_pages.is_private",
          value: null,
        },
        link_en: {
          lookUpType: "icontains",
          title: "web_pages.link_en",
          value: null,
        },
        link_et: {
          lookUpType: "icontains",
          title: "web_pages.link_et",
          value: null,
        },
        menu: {
          lookUpType: "icontains",
          title: "web_pages.menu",
          value: null,
        },
        menu_bold: {
          lookUpType: "icontains",
          title: "web_pages.menu_bold",
          value: null,
        },
        menu_color: {
          lookUpType: "icontains",
          title: "web_pages.menu_color",
          value: null,
        },
        menu_fold: {
          lookUpType: "icontains",
          title: "web_pages.menu_fold",
          value: null,
        },
        menu_title_en: {
          lookUpType: "icontains",
          title: "web_pages.menu_title_en",
          value: null,
        },
        menu_title_et: {
          lookUpType: "icontains",
          title: "web_pages.menu_title_et",
          value: null,
        },
        parent: {
          lookUpType: "icontains",
          title: "web_pages.parent",
          value: null,
        },
        public: {
          lookUpType: "icontains",
          title: "web_pages.public",
          value: null,
        },
        site: {
          lookUpType: "icontains",
          title: "web_pages.site",
          value: null,
        },
        sort: {
          lookUpType: "icontains",
          title: "web_pages.sort",
          value: null,
        },
        timestamp: {
          lookUpType: "icontains",
          title: "web_pages.timestamp",
          value: null,
        },
        title_en: {
          lookUpType: "icontains",
          title: "web_pages.title_en",
          value: null,
        },
        title_et: {
          lookUpType: "icontains",
          title: "web_pages.title_et",
          value: null,
        },
        user: {
          lookUpType: "icontains",
          title: "web_pages.user",
          value: null,
        },
      },
      mainIds: ["id", "title_et"],
      extraIds: [
        "content_en",
        "content_et",
        "date_expires",
        "date_inserted",
        "is_private",
        "link_en",
        "link_et",
        "menu",
        "menu_bold",
        "menu_color",
        "menu_fold",
        "menu_title_en",
        "menu_title_et",
        "parent",
        "public",
        "site",
        "sort",
        "timestamp",
        "title_en",
        "user",
      ],
    },
    headers: [
      {
        value: "id",
        text: "web_pages.id",
        show: true,
      },
      {
        value: "site",
        text: "web_pages.site",
        show: true,
      },
      {
        value: "public",
        text: "web_pages.public",
        show: true,
      },
      {
        value: "title_et",
        text: "web_pages.title_et",
        show: false,
      },
      {
        value: "menu_title_et",
        text: "web_pages.menu_title_et",
        show: false,
      },
      {
        value: "content_et",
        text: "web_pages.content_et",
        show: false,
      },
      {
        value: "link_et",
        text: "web_pages.link_et",
        show: false,
      },
      {
        value: "title_en",
        text: "web_pages.title_en",
        show: false,
      },
      {
        value: "menu_title_en",
        text: "web_pages.menu_title_en",
        show: false,
      },
      {
        value: "content_en",
        text: "web_pages.content_en",
        show: false,
      },
      {
        value: "link_en",
        text: "web_pages.link_en",
        show: false,
      },
      {
        value: "menu",
        text: "web_pages.menu",
        show: false,
      },
      {
        value: "menu_bold",
        text: "web_pages.menu_bold",
        show: false,
      },
      {
        value: "menu_color",
        text: "web_pages.menu_color",
        show: false,
      },
      {
        value: "menu_fold",
        text: "web_pages.menu_fold",
        show: false,
      },
      {
        value: "sort",
        text: "web_pages.sort",
        show: false,
      },
      {
        value: "parent",
        text: "web_pages.parent",
        show: false,
      },
      {
        value: "is_private",
        text: "web_pages.is_private",
        show: false,
      },
      {
        value: "user",
        text: "web_pages.user",
        show: false,
      },
      {
        value: "date_inserted",
        text: "web_pages.date_inserted",
        show: false,
      },
      {
        value: "date_expires",
        text: "web_pages.date_expires",
        show: false,
      },
      {
        value: "timestamp",
        text: "web_pages.timestamp",
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
