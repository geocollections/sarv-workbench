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
        journal: {
          title: "journal.journal",
          value: null,
          lookUpType: "icontains",
          fields: ["journal_name", "journal_short", "journal_original"],
          type: "multi",
        },
        publisher: {
          title: "journal.publisher",
          value: null,
          lookUpType: "icontains",
          fields: ["publisher", "publisher_place"],
          type: "multi",
        },
        remarks: {
          title: "journal.remarks",
          value: null,
          lookUpType: "icontains",
          fields: ["remarks"],
          type: "text",
        },
        journal_name: {
          title: "journal.journal_name",
          value: null,
          lookUpType: "icontains",
        },
        journal_short: {
          title: "journal.journal_short",
          value: null,
          lookUpType: "icontains",
        },
        journal_long: {
          title: "journal.journal_long",
          value: null,
          lookUpType: "icontains",
        },
        journal_abbr: {
          title: "journal.journal_abbr",
          value: null,
          lookUpType: "icontains",
        },
        journal_original: {
          title: "journal.journal_original",
          value: null,
          lookUpType: "icontains",
        },
        issn: {
          title: "journal.issn",
          value: null,
          lookUpType: "icontains",
        },
        publisher_place: {
          title: "journal.publisher_place",
          value: null,
          lookUpType: "icontains",
        },
        http: {
          title: "journal.http",
          value: null,
          lookUpType: "icontains",
        },
        former_journal: {
          title: "journal.former_journal",
          value: null,
          lookUpType: "icontains",
        },
        following_journal: {
          title: "journal.following_journal",
          value: null,
          lookUpType: "icontains",
        },
        oldname: {
          title: "journal.oldname",
          value: null,
          lookUpType: "icontains",
        },
        newname: {
          title: "journal.newname",
          value: null,
          lookUpType: "icontains",
        },
        user_added: {
          title: "journal.user_added",
          value: null,
          lookUpType: "icontains",
        },
        date_added: {
          title: "journal.date_added",
          value: null,
          lookUpType: "icontains",
        },
        user_changed: {
          title: "journal.user_changed",
          value: null,
          lookUpType: "icontains",
        },
        date_changed: {
          title: "journal.date_changed",
          value: null,
          lookUpType: "icontains",
        },
        id: {
          title: "journal.id",
          value: null,
          lookUpType: "icontains",
        },
      },
      mainIds: ["journal", "publisher", "remarks"],
      extraIds: [
        "journal_name",
        "journal_short",
        "journal_long",
        "journal_abbr",
        "journal_original",
        "issn",
        "publisher_place",
        "http",
        "former_journal",
        "following_journal",
        "oldname",
        "newname",
        "user_added",
        "date_added",
        "user_changed",
        "date_changed",
        "id",
      ],
    },
    headers: [
      {
        value: "id",
        text: "journal.id",
        show: true,
      },
      {
        value: "journal_name",
        text: "journal.journal_name",
        show: true,
      },
      {
        value: "journal_short",
        text: "journal.journal_short",
        show: true,
      },
      {
        value: "journal_original",
        text: "journal.journal_original",
        show: true,
      },
      {
        value: "publisher",
        text: "journal.publisher",
        show: true,
      },
      {
        value: "remarks",
        text: "journal.remarks",
        show: true,
      },
      {
        value: "journal_long",
        text: "journal.journal_long",
        show: false,
      },
      {
        value: "journal_abbr",
        text: "journal.journal_abbr",
        show: false,
      },
      {
        value: "issn",
        text: "journal.issn",
        show: false,
      },
      {
        value: "publisher_place",
        text: "journal.publisher_place",
        show: false,
      },
      {
        value: "http",
        text: "journal.http",
        show: false,
      },
      {
        value: "former_journal.journal_name",
        text: "journal.former_journal__journal_name",
        show: false,
      },
      {
        value: "following_journal.journal_name",
        text: "journal.following_journal__journal_name",
        show: false,
      },
      {
        value: "oldname",
        text: "journal.oldname",
        show: false,
      },
      {
        value: "newname",
        text: "journal.newname",
        show: false,
      },
      {
        value: "user_added",
        text: "journal.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "journal.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "journal.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "journal.date_changed",
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
