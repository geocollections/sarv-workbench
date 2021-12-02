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
          title: "dataset.abstract",
          value: null,
        },
        copyright_agent: {
          lookUpType: "icontains",
          title: "dataset.copyright_agent__id",
          value: null,
        },
        creators: {
          lookUpType: "icontains",
          title: "dataset.creators",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "dataset.database__id",
          value: null,
        },
        dataset_html: {
          lookUpType: "icontains",
          title: "dataset.dataset_html",
          value: null,
        },
        date: {
          lookUpType: "icontains",
          title: "dataset.date",
          value: null,
          fields: ["date_txt", "date"],
          type: "multi",
        },
        date_added: {
          lookUpType: "icontains",
          title: "dataset.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "dataset.date_changed",
          value: null,
        },
        date_txt: {
          lookUpType: "icontains",
          title: "dataset.date_txt",
          value: null,
        },
        description: {
          lookUpType: "icontains",
          title: "dataset.description",
          value: null,
        },
        description_en: {
          lookUpType: "icontains",
          title: "dataset.description_en",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "dataset.id",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "dataset.is_private",
          value: null,
        },
        language: {
          lookUpType: "icontains",
          title: "dataset.language__id",
          value: null,
        },
        licence: {
          lookUpType: "icontains",
          title: "dataset.licence__id",
          value: null,
        },
        locality: {
          lookUpType: "icontains",
          title: "dataset.locality__id",
          value: null,
        },
        methods: {
          lookUpType: "icontains",
          title: "dataset.methods",
          value: null,
        },
        name: {
          lookUpType: "icontains",
          title: "dataset.name",
          value: null,
          fields: ["title", "title_translated", "title_alternative"],
          type: "multi",
        },
        name_en: {
          lookUpType: "icontains",
          title: "dataset.name_en",
          value: null,
        },
        owner: {
          lookUpType: "icontains",
          title: "dataset.owner__id",
          value: null,
          fields: [
            "owner__agent",
            "owner__forename",
            "owner__surename",
            "owner_txt",
          ],
          type: "multi",
        },
        owner_txt: {
          lookUpType: "icontains",
          title: "dataset.owner_txt",
          value: null,
        },
        publication_year: {
          lookUpType: "icontains",
          title: "dataset.publication_year",
          value: null,
        },
        publisher: {
          lookUpType: "icontains",
          title: "dataset.publisher",
          value: null,
        },
        reference: {
          lookUpType: "icontains",
          title: "dataset.reference__id",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "dataset.remarks",
          value: null,
        },
        resource: {
          lookUpType: "icontains",
          title: "dataset.resource",
          value: null,
        },
        resource_type: {
          lookUpType: "icontains",
          title: "dataset.resource_type__id",
          value: null,
        },
        subjects: {
          lookUpType: "icontains",
          title: "dataset.subjects",
          value: null,
        },
        title: {
          lookUpType: "icontains",
          title: "dataset.title",
          value: null,
        },
        title_alternative: {
          lookUpType: "icontains",
          title: "dataset.title_alternative",
          value: null,
        },
        title_translated: {
          lookUpType: "icontains",
          title: "dataset.title_translated",
          value: null,
        },
        title_translated_language: {
          lookUpType: "icontains",
          title: "dataset.title_translated_language__id",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "dataset.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "dataset.user_changed",
          value: null,
        },
        version: {
          lookUpType: "icontains",
          title: "dataset.version",
          value: null,
        },
      },
      mainIds: ["name", "owner", "date", "remarks"],
      extraIds: [
        "abstract",
        "copyright_agent",
        "creators",
        "database",
        "dataset_html",
        "date_added",
        "date_changed",
        "date_txt",
        "description",
        "description_en",
        "id",
        "is_private",
        "language",
        "licence",
        "locality",
        "methods",
        "name_en",
        "owner_txt",
        "publication_year",
        "publisher",
        "reference",
        "resource",
        "resource_type",
        "subjects",
        "title",
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
        text: "dataset.id",
        show: true,
      },
      {
        value: "creators",
        text: "dataset.creators",
        show: true,
      },
      {
        value: "publication_year",
        text: "dataset.publication_year",
        show: true,
      },
      {
        value: "title",
        text: "dataset.title",
        show: true,
      },
      {
        value: "resource",
        text: "dataset.resource",
        show: true,
      },
      {
        value: "database__acronym",
        text: "dataset.database__acronym",
        show: true,
      },
      {
        value: "link",
        text: "dataset.link",
        sortable: false,
        show: true,
      },
      {
        value: "title_alternative",
        text: "dataset.title_alternative",
        show: false,
      },
      {
        value: "title_translated",
        text: "dataset.title_translated",
        show: false,
      },
      {
        value: "title_translated_language__id",
        text: "dataset.title_translated_language__id",
        show: false,
      },
      {
        value: "title_translated_language__value",
        text: "dataset.title_translated_language__value",
        show: false,
      },
      {
        value: "title_translated_language__value_en",
        text: "dataset.title_translated_language__value_en",
        show: false,
      },
      {
        value: "publisher",
        text: "dataset.publisher",
        show: false,
      },
      {
        value: "subjects",
        text: "dataset.subjects",
        show: false,
      },
      {
        value: "reference__id",
        text: "dataset.reference__id",
        show: false,
      },
      {
        value: "reference__reference",
        text: "dataset.reference__reference",
        show: false,
      },
      {
        value: "locality__id",
        text: "dataset.locality__id",
        show: false,
      },
      {
        value: "locality__locality",
        text: "dataset.locality__locality",
        show: false,
      },
      {
        value: "locality__locality_en",
        text: "dataset.locality__locality_en",
        show: false,
      },
      {
        value: "language__id",
        text: "dataset.language__id",
        show: false,
      },
      {
        value: "language__value",
        text: "dataset.language__value",
        show: false,
      },
      {
        value: "language__value_en",
        text: "dataset.language__value_en",
        show: false,
      },
      {
        value: "resource_type__id",
        text: "dataset.resource_type__id",
        show: false,
      },
      {
        value: "resource_type__value",
        text: "dataset.resource_type__value",
        show: false,
      },
      {
        value: "version",
        text: "dataset.version",
        show: false,
      },
      {
        value: "abstract",
        text: "dataset.abstract",
        show: false,
      },
      {
        value: "methods",
        text: "dataset.methods",
        show: false,
      },
      {
        value: "date",
        text: "dataset.date",
        show: false,
      },
      {
        value: "date_txt",
        text: "dataset.date_txt",
        show: false,
      },
      {
        value: "is_private",
        text: "dataset.is_private",
        show: false,
      },
      {
        value: "owner__id",
        text: "dataset.owner__id",
        show: false,
      },
      {
        value: "owner__agent",
        text: "dataset.owner__agent",
        show: false,
      },
      {
        value: "owner_txt",
        text: "dataset.owner_txt",
        show: false,
      },
      {
        value: "copyright_agent__id",
        text: "dataset.copyright_agent__id",
        show: false,
      },
      {
        value: "copyright_agent__agent",
        text: "dataset.copyright_agent__agent",
        show: false,
      },
      {
        value: "licence__id",
        text: "dataset.licence__id",
        show: false,
      },
      {
        value: "licence__licence",
        text: "dataset.licence__licence",
        show: false,
      },
      {
        value: "licence__licence_en",
        text: "dataset.licence__licence_en",
        show: false,
      },
      {
        value: "remarks",
        text: "dataset.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "dataset.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "dataset.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "dataset.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "dataset.date_changed",
        show: false,
      },
      {
        value: "database__id",
        text: "dataset.database__id",
        show: false,
      },
      {
        value: "name",
        text: "dataset.name",
        show: false,
      },
      {
        value: "name_en",
        text: "dataset.name_en",
        show: false,
      },
      {
        value: "description",
        text: "dataset.description",
        show: false,
      },
      {
        value: "description_en",
        text: "dataset.description_en",
        show: false,
      },
      {
        value: "dataset_html",
        text: "dataset.dataset_html",
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
