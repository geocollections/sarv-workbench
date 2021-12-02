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
          title: "doi.abstract",
          value: null,
        },
        copyright_agent: {
          lookUpType: "icontains",
          title: "doi.copyright_agent__id",
          value: null,
        },
        creators: {
          lookUpType: "icontains",
          title: "doi.creators",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "doi.database__id",
          value: null,
        },
        datacite_created: {
          lookUpType: "icontains",
          title: "doi.datacite_created",
          value: null,
        },
        datacite_updated: {
          lookUpType: "icontains",
          title: "doi.datacite_updated",
          value: null,
        },
        dataset: {
          lookUpType: "icontains",
          title: "doi.dataset__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "doi.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "doi.date_changed",
          value: null,
        },
        date_txt: {
          lookUpType: "icontains",
          title: "doi.date_txt",
          value: null,
        },
        egf: {
          lookUpType: "icontains",
          title: "doi.egf",
          value: null,
        },
        formats: {
          lookUpType: "icontains",
          title: "doi.formats",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "doi.id",
          value: null,
        },
        identifier: {
          lookUpType: "icontains",
          title: "doi.identifier",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "doi.is_private",
          value: null,
        },
        language: {
          lookUpType: "icontains",
          title: "doi.language__id",
          value: null,
        },
        licence: {
          lookUpType: "icontains",
          title: "doi.licence__id",
          value: null,
        },
        methods: {
          lookUpType: "icontains",
          title: "doi.methods",
          value: null,
        },
        owner: {
          lookUpType: "icontains",
          title: "doi.owner__id",
          value: null,
        },
        publication_year: {
          lookUpType: "icontains",
          title: "doi.publication_year",
          value: null,
        },
        publisher: {
          lookUpType: "icontains",
          title: "doi.publisher",
          value: null,
        },
        reference: {
          lookUpType: "icontains",
          title: "doi.reference__id",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "doi.remarks",
          value: null,
        },
        resource: {
          lookUpType: "icontains",
          title: "doi.resource",
          value: null,
        },
        resource_type: {
          lookUpType: "icontains",
          title: "doi.resource_type__id",
          value: null,
        },
        sizes: {
          lookUpType: "icontains",
          title: "doi.sizes",
          value: null,
        },
        subjects: {
          lookUpType: "icontains",
          title: "doi.subjects",
          value: null,
        },
        title: {
          lookUpType: "icontains",
          title: "doi.title",
          value: null,
        },
        title_alternative: {
          lookUpType: "icontains",
          title: "doi.title_alternative",
          value: null,
        },
        title_translated: {
          lookUpType: "icontains",
          title: "doi.title_translated",
          value: null,
        },
        title_translated_language: {
          lookUpType: "icontains",
          title: "doi.title_translated_language__id",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "doi.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "doi.user_changed",
          value: null,
        },
        version: {
          lookUpType: "icontains",
          title: "doi.version",
          value: null,
        },
      },
      mainIds: ["identifier", "creators", "publication_year", "title"],
      extraIds: [
        "abstract",
        "copyright_agent",
        "database",
        "datacite_created",
        "datacite_updated",
        "dataset",
        "date_added",
        "date_changed",
        "date_txt",
        "egf",
        "formats",
        "id",
        "is_private",
        "language",
        "licence",
        "methods",
        "owner",
        "publisher",
        "reference",
        "remarks",
        "resource",
        "resource_type",
        "sizes",
        "subjects",
        "title_alternative",
        "title_translated",
        "title_translated_language",
        "user_added",
        "user_changed",
        "version",
      ],
    },
    headers: [
      {
        value: "id",
        text: "doi.id",
        show: true,
      },
      {
        value: "creators",
        text: "doi.creators",
        show: true,
      },
      {
        value: "publication_year",
        text: "doi.publication_year",
        show: true,
      },
      {
        value: "title",
        text: "doi.title",
        show: true,
      },
      {
        value: "resource_type__value",
        text: "doi.resource_type__value",
        show: true,
      },
      {
        value: "datacite_created",
        text: "doi.datacite_created",
        show: true,
      },
      {
        value: "link",
        text: "doi.link",
        sortable: false,
        show: true,
      },
      {
        value: "identifier",
        text: "doi.identifier",
        show: false,
      },
      {
        value: "title_alternative",
        text: "doi.title_alternative",
        show: false,
      },
      {
        value: "title_translated",
        text: "doi.title_translated",
        show: false,
      },
      {
        value: "title_translated_language__id",
        text: "doi.title_translated_language__id",
        show: false,
      },
      {
        value: "title_translated_language__value",
        text: "doi.title_translated_language__value",
        show: false,
      },
      {
        value: "title_translated_language__value_en",
        text: "doi.title_translated_language__value_en",
        show: false,
      },
      {
        value: "publisher",
        text: "doi.publisher",
        show: false,
      },
      {
        value: "subjects",
        text: "doi.subjects",
        show: false,
      },
      {
        value: "reference__id",
        text: "doi.reference__id",
        show: false,
      },
      {
        value: "reference__reference",
        text: "doi.reference__reference",
        show: false,
      },
      {
        value: "dataset__id",
        text: "doi.dataset__id",
        show: false,
      },
      {
        value: "dataset__name",
        text: "doi.dataset__name",
        show: false,
      },
      {
        value: "dataset__name_en",
        text: "doi.dataset__name_en",
        show: false,
      },
      {
        value: "language__id",
        text: "doi.language__id",
        show: false,
      },
      {
        value: "language__value",
        text: "doi.language__value",
        show: false,
      },
      {
        value: "language__value_en",
        text: "doi.language__value_en",
        show: false,
      },
      {
        value: "resource_type__id",
        text: "doi.resource_type__id",
        show: false,
      },
      {
        value: "resource",
        text: "doi.resource",
        show: false,
      },
      {
        value: "version",
        text: "doi.version",
        show: false,
      },
      {
        value: "sizes",
        text: "doi.sizes",
        show: false,
      },
      {
        value: "formats",
        text: "doi.formats",
        show: false,
      },
      {
        value: "abstract",
        text: "doi.abstract",
        show: false,
      },
      {
        value: "methods",
        text: "doi.methods",
        show: false,
      },
      {
        value: "date_txt",
        text: "doi.date_txt",
        show: false,
      },
      {
        value: "is_private",
        text: "doi.is_private",
        show: false,
      },
      {
        value: "owner__id",
        text: "doi.owner__id",
        show: false,
      },
      {
        value: "owner__agent",
        text: "doi.owner__agent",
        show: false,
      },
      {
        value: "copyright_agent__id",
        text: "doi.copyright_agent__id",
        show: false,
      },
      {
        value: "copyright_agent__agent",
        text: "doi.copyright_agent__agent",
        show: false,
      },
      {
        value: "licence__id",
        text: "doi.licence__id",
        show: false,
      },
      {
        value: "licence__licence",
        text: "doi.licence__licence",
        show: false,
      },
      {
        value: "licence__licence_en",
        text: "doi.licence__licence_en",
        show: false,
      },
      {
        value: "egf",
        text: "doi.egf",
        show: false,
      },
      {
        value: "remarks",
        text: "doi.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "doi.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "doi.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "doi.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "doi.date_changed",
        show: false,
      },
      {
        value: "database__id",
        text: "doi.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "doi.database__acronym",
        show: false,
      },
      {
        value: "datacite_updated",
        text: "doi.datacite_updated",
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
