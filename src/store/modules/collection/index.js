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
        agent: {
          lookUpType: "icontains",
          title: "collection.agent",
          value: null,
          fields: ["agent__agent", "agent__forename", "agent__surename"],
          type: "multi",
        },
        classification: {
          lookUpType: "icontains",
          title: "collection.classification",
          value: null,
          fields: [
            "classification__class_field",
            "classification__class_en",
            "classification__class_lat",
            "classification__class_synonym",
            "classification__class_en_synonym",
          ],
          type: "multi",
        },
        collection_id: {
          lookUpType: "icontains",
          title: "collection.collection_id",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "collection.database",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "collection.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "collection.date_changed",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "collection.id",
          value: null,
        },
        locality: {
          lookUpType: "icontains",
          title: "collection.locality",
          value: null,
          fields: ["locality__locality", "locality__locality_en"],
          type: "multi",
        },
        name: {
          lookUpType: "icontains",
          title: "collection.name",
          value: null,
          fields: ["name", "name_en", "name_long", "name_long_en"],
          type: "multi",
        },
        name_en: {
          lookUpType: "icontains",
          title: "collection.name_en",
          value: null,
        },
        name_long: {
          lookUpType: "icontains",
          title: "collection.name_long",
          value: null,
        },
        name_long_en: {
          lookUpType: "icontains",
          title: "collection.name_long_en",
          value: null,
        },
        number: {
          lookUpType: "icontains",
          title: "collection.number",
          value: null,
        },
        number_objects: {
          lookUpType: "icontains",
          title: "collection.number_objects",
          value: null,
        },
        number_types: {
          lookUpType: "icontains",
          title: "collection.number_types",
          value: null,
        },
        reference: {
          lookUpType: "icontains",
          title: "collection.reference",
          value: null,
          fields: ["reference__reference"],
        },
        remarks: {
          lookUpType: "icontains",
          title: "collection.remarks",
          value: null,
        },
        stratigraphy: {
          lookUpType: "icontains",
          title: "collection.stratigraphy",
          value: null,
        },
        type: {
          lookUpType: "icontains",
          title: "collection.type__id",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "collection.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "collection.user_changed",
          value: null,
        },
      },
      mainIds: [
        "id",
        "number",
        "name",
        "agent",
        "locality",
        "reference",
        "classification",
      ],
      extraIds: [
        "collection_id",
        "database",
        "date_added",
        "date_changed",
        "name_en",
        "name_long",
        "name_long_en",
        "number_objects",
        "number_types",
        "remarks",
        "stratigraphy",
        "type",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "collection_id",
        text: "collection.collection_id",
        show: true,
      },
      {
        value: "name",
        text: "collection.name",
        show: true,
      },
      {
        value: "name_long",
        text: "collection.name_long",
        show: true,
      },
      {
        value: "database__acronym",
        text: "collection.database__acronym",
        show: true,
      },
      {
        value: "link",
        text: "collection.link",
        sortable: false,
        show: true,
      },
      {
        value: "id",
        text: "collection.id",
        show: false,
      },
      {
        value: "number",
        text: "collection.number",
        show: false,
      },
      {
        value: "name_en",
        text: "collection.name_en",
        show: false,
      },
      {
        value: "name_long_en",
        text: "collection.name_long_en",
        show: false,
      },
      {
        value: "type__id",
        text: "collection.type__id",
        show: false,
      },
      {
        value: "type__value",
        text: "collection.type__value",
        show: false,
      },
      {
        value: "type__value_en",
        text: "collection.type__value_en",
        show: false,
      },
      {
        value: "classification__id",
        text: "collection.classification__id",
        show: false,
      },
      {
        value: "classification__class_field",
        text: "collection.classification__class_field",
        show: false,
      },
      {
        value: "agent__id",
        text: "collection.agent__id",
        show: false,
      },
      {
        value: "agent__agent",
        text: "collection.agent__agent",
        show: false,
      },
      {
        value: "locality__id",
        text: "collection.locality__id",
        show: false,
      },
      {
        value: "locality__locality",
        text: "collection.locality__locality",
        show: false,
      },
      {
        value: "locality__locality_en",
        text: "collection.locality__locality_en",
        show: false,
      },
      {
        value: "stratigraphy__id",
        text: "collection.stratigraphy__id",
        show: false,
      },
      {
        value: "stratigraphy__stratigraphy",
        text: "collection.stratigraphy__stratigraphy",
        show: false,
      },
      {
        value: "stratigraphy__stratigraphy_en",
        text: "collection.stratigraphy__stratigraphy_en",
        show: false,
      },
      {
        value: "number_objects",
        text: "collection.number_objects",
        show: false,
      },
      {
        value: "number_types",
        text: "collection.number_types",
        show: false,
      },
      {
        value: "reference__id",
        text: "collection.reference__id",
        show: false,
      },
      {
        value: "reference__reference",
        text: "collection.reference__reference",
        show: false,
      },
      {
        value: "remarks",
        text: "collection.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "collection.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "collection.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "collection.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "collection.date_changed",
        show: false,
      },
      {
        value: "database__id",
        text: "collection.database__id",
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
