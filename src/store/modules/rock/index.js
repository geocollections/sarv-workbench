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
          title: "rock.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "rock.date_changed",
          value: null,
        },
        description: {
          lookUpType: "icontains",
          title: "rock.description",
          value: null,
        },
        description_author: {
          lookUpType: "icontains",
          title: "rock.description_author",
          value: null,
        },
        description_en: {
          lookUpType: "icontains",
          title: "rock.description_en",
          value: null,
        },
        description_in_estonia: {
          lookUpType: "icontains",
          title: "rock.description_in_estonia",
          value: null,
        },
        description_in_estonia_en: {
          lookUpType: "icontains",
          title: "rock.description_in_estonia_en",
          value: null,
        },
        description_in_estonia_ru: {
          lookUpType: "icontains",
          title: "rock.description_in_estonia_ru",
          value: null,
        },
        description_ru: {
          lookUpType: "icontains",
          title: "rock.description_ru",
          value: null,
        },
        description_usage: {
          lookUpType: "icontains",
          title: "rock.description_usage",
          value: null,
        },
        description_usage_en: {
          lookUpType: "icontains",
          title: "rock.description_usage_en",
          value: null,
        },
        description_usage_ru: {
          lookUpType: "icontains",
          title: "rock.description_usage_ru",
          value: null,
        },
        formula: {
          lookUpType: "icontains",
          title: "rock.formula",
          value: null,
        },
        formula_html: {
          lookUpType: "icontains",
          title: "rock.formula_html",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "rock.id",
          value: null,
        },
        ima_status: {
          lookUpType: "icontains",
          title: "rock.ima_status",
          value: null,
        },
        in_estonia: {
          lookUpType: "icontains",
          title: "rock.in_estonia",
          value: null,
          isCheckbox: true,
        },
        in_portal: {
          lookUpType: "icontains",
          title: "rock.in_portal",
          value: null,
          isCheckbox: true,
        },
        is_private: {
          lookUpType: "icontains",
          title: "rock.is_private",
          value: null,
        },
        is_resource: {
          lookUpType: "icontains",
          title: "rock.is_resource",
          value: null,
        },
        link_wikipedia: {
          lookUpType: "icontains",
          title: "rock.link_wikipedia",
          value: null,
        },
        link_wikipedia_en: {
          lookUpType: "icontains",
          title: "rock.link_wikipedia_en",
          value: null,
        },
        link_wikipedia_ru: {
          lookUpType: "icontains",
          title: "rock.link_wikipedia_ru",
          value: null,
        },
        lithostratigraphy: {
          lookUpType: "icontains",
          title: "rock.lithostratigraphy__id",
          value: null,
        },
        mindat_id: {
          lookUpType: "icontains",
          title: "rock.mindat_id",
          value: null,
        },
        name: {
          lookUpType: "icontains",
          title: "rock.name",
          value: null,
        },
        name_en: {
          lookUpType: "icontains",
          title: "rock.name_en",
          value: null,
        },
        name_ru: {
          lookUpType: "icontains",
          title: "rock.name_ru",
          value: null,
        },
        parent: {
          lookUpType: "icontains",
          title: "rock.parent__id",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "rock.remarks",
          value: null,
        },
        rock_rank: {
          lookUpType: "icontains",
          title: "rock.rock_rank",
          value: null,
          fields: ["rock_rank__name", "rock_rank__name_en"],
          type: "multi",
        },
        rock_type: {
          lookUpType: "icontains",
          title: "rock.rock_type",
          value: null,
          fields: ["rock_type__name", "rock_type__name_en"],
          type: "multi",
        },
        sort: {
          lookUpType: "icontains",
          title: "rock.sort",
          value: null,
        },
        stratigraphy: {
          lookUpType: "icontains",
          title: "rock.stratigraphy__id",
          value: null,
        },
        synonym_of: {
          lookUpType: "icontains",
          title: "rock.synonym_of__id",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "rock.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "rock.user_changed",
          value: null,
        },
      },
      mainIds: [
        "name",
        "name_en",
        "formula",
        "rock_type",
        "rock_rank",
        "user_changed",
        "id",
        "in_portal",
        "in_estonia",
      ],
      extraIds: [
        "date_added",
        "date_changed",
        "description",
        "description_author",
        "description_en",
        "description_in_estonia",
        "description_in_estonia_en",
        "description_in_estonia_ru",
        "description_ru",
        "description_usage",
        "description_usage_en",
        "description_usage_ru",
        "formula_html",
        "id",
        "ima_status",
        "is_private",
        "is_resource",
        "link_wikipedia",
        "link_wikipedia_en",
        "link_wikipedia_ru",
        "lithostratigraphy",
        "mindat_id",
        "name_ru",
        "parent",
        "remarks",
        "rock_rank",
        "rock_type",
        "sort",
        "stratigraphy",
        "synonym_of",
        "user_added",
      ],
    },
    headers: [
      {
        value: "id",
        text: "rock.id",
        show: true,
      },
      {
        value: "name",
        text: "rock.name",
        show: true,
      },
      {
        value: "name_en",
        text: "rock.name_en",
        show: true,
      },
      {
        value: "formula_html",
        text: "rock.formula_html",
        show: true,
      },
      {
        value: "in_estonia",
        text: "rock.in_estonia",
        show: true,
      },
      {
        value: "in_portal",
        text: "rock.in_portal",
        show: true,
      },
      {
        value: "link",
        text: "rock.link",
        sortable: false,
        show: true,
      },
      {
        value: "mindat_id",
        text: "rock.mindat_id",
        show: true,
      },
      {
        value: "name_ru",
        text: "rock.name_ru",
        show: false,
      },
      {
        value: "rock_type__id",
        text: "rock.rock_type__id",
        show: false,
      },
      {
        value: "rock_type__name",
        text: "rock.rock_type__name",
        show: false,
      },
      {
        value: "rock_type__name_en",
        text: "rock.rock_type__name_en",
        show: false,
      },
      {
        value: "rock_rank__id",
        text: "rock.rock_rank__id",
        show: false,
      },
      {
        value: "rock_rank__name",
        text: "rock.rock_rank__name",
        show: false,
      },
      {
        value: "rock_rank__name_en",
        text: "rock.rock_rank__name_en",
        show: false,
      },
      {
        value: "parent__id",
        text: "rock.parent__id",
        show: false,
      },
      {
        value: "parent__name",
        text: "rock.parent__name",
        show: false,
      },
      {
        value: "parent__name_en",
        text: "rock.parent__name_en",
        show: false,
      },
      {
        value: "synonym_of__id",
        text: "rock.synonym_of__id",
        show: false,
      },
      {
        value: "synonym_of__name",
        text: "rock.synonym_of__name",
        show: false,
      },
      {
        value: "synonym_of__name_en",
        text: "rock.synonym_of__name_en",
        show: false,
      },
      {
        value: "sort",
        text: "rock.sort",
        show: false,
      },
      {
        value: "description",
        text: "rock.description",
        show: false,
      },
      {
        value: "description_en",
        text: "rock.description_en",
        show: false,
      },
      {
        value: "description_ru",
        text: "rock.description_ru",
        show: false,
      },
      {
        value: "description_in_estonia",
        text: "rock.description_in_estonia",
        show: false,
      },
      {
        value: "description_in_estonia_en",
        text: "rock.description_in_estonia_en",
        show: false,
      },
      {
        value: "description_in_estonia_ru",
        text: "rock.description_in_estonia_ru",
        show: false,
      },
      {
        value: "description_usage",
        text: "rock.description_usage",
        show: false,
      },
      {
        value: "description_usage_en",
        text: "rock.description_usage_en",
        show: false,
      },
      {
        value: "description_usage_ru",
        text: "rock.description_usage_ru",
        show: false,
      },
      {
        value: "description_author",
        text: "rock.description_author",
        show: false,
      },
      {
        value: "is_resource",
        text: "rock.is_resource",
        show: false,
      },
      {
        value: "stratigraphy__id",
        text: "rock.stratigraphy__id",
        show: false,
      },
      {
        value: "stratigraphy__stratigraphy",
        text: "rock.stratigraphy__stratigraphy",
        show: false,
      },
      {
        value: "stratigraphy__stratigraphy_en",
        text: "rock.stratigraphy__stratigraphy_en",
        show: false,
      },
      {
        value: "lithostratigraphy__id",
        text: "rock.lithostratigraphy__id",
        show: false,
      },
      {
        value: "lithostratigraphy__stratigraphy",
        text: "rock.lithostratigraphy__stratigraphy",
        show: false,
      },
      {
        value: "lithostratigraphy__stratigraphy_en",
        text: "rock.lithostratigraphy__stratigraphy_en",
        show: false,
      },
      {
        value: "link_wikipedia",
        text: "rock.link_wikipedia",
        show: false,
      },
      {
        value: "link_wikipedia_en",
        text: "rock.link_wikipedia_en",
        show: false,
      },
      {
        value: "link_wikipedia_ru",
        text: "rock.link_wikipedia_ru",
        show: false,
      },
      {
        value: "ima_status",
        text: "rock.ima_status",
        show: false,
      },
      {
        value: "formula",
        text: "rock.formula",
        show: false,
      },
      {
        value: "remarks",
        text: "rock.remarks",
        show: false,
      },
      {
        value: "is_private",
        text: "rock.is_private",
        show: false,
      },
      {
        value: "user_added",
        text: "rock.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "rock.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "rock.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "rock.date_changed",
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
