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
        age_base: {
          lookUpType: "icontains",
          title: "stratigraphy.age_base",
          value: null,
        },
        age_chronostratigraphy: {
          lookUpType: "icontains",
          title: "stratigraphy.age_chronostratigraphy__id",
          value: null,
        },
        age_precision: {
          lookUpType: "icontains",
          title: "stratigraphy.age_precision",
          value: null,
        },
        age_reference: {
          lookUpType: "icontains",
          title: "stratigraphy.age_reference__id",
          value: null,
        },
        age_top: {
          lookUpType: "icontains",
          title: "stratigraphy.age_top",
          value: null,
        },
        approved_esk: {
          lookUpType: "icontains",
          title: "stratigraphy.approved_esk",
          value: null,
        },
        approved_ics: {
          lookUpType: "icontains",
          title: "stratigraphy.approved_ics",
          value: null,
        },
        author_free: {
          lookUpType: "icontains",
          title: "stratigraphy.author_free",
          value: null,
          fields: ["author_free", "user_added"],
          type: "multi",
        },
        color_code_additional: {
          lookUpType: "icontains",
          title: "stratigraphy.color_code_additional",
          value: null,
        },
        color_code_cgmw: {
          lookUpType: "icontains",
          title: "stratigraphy.color_code_cgmw",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "stratigraphy.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "stratigraphy.date_changed",
          value: null,
        },
        definition: {
          lookUpType: "icontains",
          title: "stratigraphy.definition",
          value: null,
        },
        definition_en: {
          lookUpType: "icontains",
          title: "stratigraphy.definition_en",
          value: null,
        },
        description: {
          lookUpType: "icontains",
          title: "stratigraphy.description",
          value: null,
        },
        description_en: {
          lookUpType: "icontains",
          title: "stratigraphy.description_en",
          value: null,
        },
        etymon: {
          lookUpType: "icontains",
          title: "stratigraphy.etymon",
          value: null,
        },
        etymon_en: {
          lookUpType: "icontains",
          title: "stratigraphy.etymon_en",
          value: null,
        },
        hierarchy_string: {
          lookUpType: "icontains",
          title: "stratigraphy.hierarchy_string",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "stratigraphy.id",
          value: null,
        },
        index_additional: {
          lookUpType: "icontains",
          title: "stratigraphy.index_additional",
          value: null,
        },
        index_additional_html: {
          lookUpType: "icontains",
          title: "stratigraphy.index_additional_html",
          value: null,
        },
        index_main: {
          lookUpType: "icontains",
          title: "stratigraphy.index",
          value: null,
          fields: ["index_main", "index_additional", "index_old"],
          type: "multi",
        },
        index_main_html: {
          lookUpType: "icontains",
          title: "stratigraphy.index_main_html",
          value: null,
        },
        index_old: {
          lookUpType: "icontains",
          title: "stratigraphy.index_old",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "stratigraphy.is_private",
          value: null,
        },
        lithology: {
          lookUpType: "icontains",
          title: "stratigraphy.lithology",
          value: null,
        },
        lithology_en: {
          lookUpType: "icontains",
          title: "stratigraphy.lithology_en",
          value: null,
        },
        maaamet_kood: {
          lookUpType: "icontains",
          title: "stratigraphy.maaamet_kood",
          value: null,
        },
        max_thickness: {
          lookUpType: "icontains",
          title: "stratigraphy.max_thickness",
          value: null,
        },
        original_locality: {
          lookUpType: "icontains",
          title: "stratigraphy.original_locality",
          value: null,
        },
        original_rank: {
          lookUpType: "icontains",
          title: "stratigraphy.original_rank",
          value: null,
        },
        parent: {
          lookUpType: "icontains",
          title: "stratigraphy.parent",
          value: null,
          fields: ["parent__stratigraphy", "parent__stratigraphy_en"],
          type: "multi",
        },
        rank: {
          lookUpType: "icontains",
          title: "stratigraphy.rank",
          value: null,
          fields: ["rank__value", "rank__value_en"],
          type: "multi",
        },
        region: {
          lookUpType: "icontains",
          title: "stratigraphy.region",
          value: null,
        },
        region_en: {
          lookUpType: "icontains",
          title: "stratigraphy.region_en",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "stratigraphy.remarks",
          value: null,
        },
        scope: {
          lookUpType: "icontains",
          title: "stratigraphy.scope",
          value: null,
          fields: ["scope__value", "scope__value_en"],
          type: "multi",
        },
        sort_within_parent: {
          lookUpType: "icontains",
          title: "stratigraphy.sort_within_parent",
          value: null,
        },
        status: {
          lookUpType: "icontains",
          title: "stratigraphy.status",
          value: null,
        },
        stratigraphy: {
          lookUpType: "icontains",
          title: "stratigraphy.stratigraphy",
          value: null,
          fields: ["stratigraphy", "stratigraphy_en"],
          type: "multi",
        },
        stratigraphy_en: {
          lookUpType: "icontains",
          title: "stratigraphy.stratigraphy_en",
          value: null,
        },
        stratigraphy_original: {
          lookUpType: "icontains",
          title: "stratigraphy.stratigraphy_original",
          value: null,
        },
        type: {
          lookUpType: "icontains",
          title: "stratigraphy.type",
          value: null,
          fields: ["type__value", "type__value_en"],
          type: "multi",
        },
        user_added: {
          lookUpType: "icontains",
          title: "stratigraphy.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "stratigraphy.user_changed",
          value: null,
        },
        year: {
          lookUpType: "icontains",
          title: "stratigraphy.year",
          value: null,
        },
      },
      mainIds: [
        "id",
        "stratigraphy",
        "type",
        "rank",
        "scope",
        "parent",
        "index_main",
        "author_free",
      ],
      extraIds: [
        "age_base",
        "age_chronostratigraphy",
        "age_precision",
        "age_reference",
        "age_top",
        "approved_esk",
        "approved_ics",
        "color_code_additional",
        "color_code_cgmw",
        "date_added",
        "date_changed",
        "definition",
        "definition_en",
        "description",
        "description_en",
        "etymon",
        "etymon_en",
        "hierarchy_string",
        "index_additional",
        "index_additional_html",
        "index_main_html",
        "index_old",
        "is_private",
        "lithology",
        "lithology_en",
        "maaamet_kood",
        "max_thickness",
        "original_locality",
        "original_rank",
        "region",
        "region_en",
        "remarks",
        "sort_within_parent",
        "status",
        "stratigraphy_en",
        "stratigraphy_original",
        "user_added",
        "user_changed",
        "year",
      ],
    },
    headers: [
      {
        value: "id",
        text: "stratigraphy.id",
        show: true,
      },
      {
        value: "stratigraphy",
        text: "stratigraphy.stratigraphy",
        show: true,
      },
      {
        value: "link",
        text: "stratigraphy.link",
        sortable: false,
        show: true,
      },
      {
        value: "stratigraphy_en",
        text: "stratigraphy.stratigraphy_en",
        show: false,
      },
      {
        value: "stratigraphy_original",
        text: "stratigraphy.stratigraphy_original",
        show: false,
      },
      {
        value: "author_free",
        text: "stratigraphy.author_free",
        show: false,
      },
      {
        value: "year",
        text: "stratigraphy.year",
        show: false,
      },
      {
        value: "etymon",
        text: "stratigraphy.etymon",
        show: false,
      },
      {
        value: "etymon_en",
        text: "stratigraphy.etymon_en",
        show: false,
      },
      {
        value: "original_locality",
        text: "stratigraphy.original_locality",
        show: false,
      },
      {
        value: "original_rank",
        text: "stratigraphy.original_rank",
        show: false,
      },
      {
        value: "index_main",
        text: "stratigraphy.index_main",
        show: false,
      },
      {
        value: "index_main_html",
        text: "stratigraphy.index_main_html",
        show: false,
      },
      {
        value: "index_additional",
        text: "stratigraphy.index_additional",
        show: false,
      },
      {
        value: "index_additional_html",
        text: "stratigraphy.index_additional_html",
        show: false,
      },
      {
        value: "index_old",
        text: "stratigraphy.index_old",
        show: false,
      },
      {
        value: "color_code_cgmw",
        text: "stratigraphy.color_code_cgmw",
        show: false,
      },
      {
        value: "color_code_additional",
        text: "stratigraphy.color_code_additional",
        show: false,
      },
      {
        value: "hierarchy_string",
        text: "stratigraphy.hierarchy_string",
        show: false,
      },
      {
        value: "parent__id",
        text: "stratigraphy.parent__id",
        show: false,
      },
      {
        value: "parent__stratigraphy",
        text: "stratigraphy.parent__stratigraphy",
        show: false,
      },
      {
        value: "parent__stratigraphy_en",
        text: "stratigraphy.parent__stratigraphy_en",
        show: false,
      },
      {
        value: "type__id",
        text: "stratigraphy.type__id",
        show: false,
      },
      {
        value: "type__value",
        text: "stratigraphy.type__value",
        show: false,
      },
      {
        value: "type__value_en",
        text: "stratigraphy.type__value_en",
        show: false,
      },
      {
        value: "rank__id",
        text: "stratigraphy.rank__id",
        show: false,
      },
      {
        value: "rank__value",
        text: "stratigraphy.rank__value",
        show: false,
      },
      {
        value: "rank__value_en",
        text: "stratigraphy.rank__value_en",
        show: false,
      },
      {
        value: "scope__id",
        text: "stratigraphy.scope__id",
        show: false,
      },
      {
        value: "scope__value",
        text: "stratigraphy.scope__value",
        show: false,
      },
      {
        value: "scope__value_en",
        text: "stratigraphy.scope__value_en",
        show: false,
      },
      {
        value: "status__id",
        text: "stratigraphy.status__id",
        show: false,
      },
      {
        value: "status__value",
        text: "stratigraphy.status__value",
        show: false,
      },
      {
        value: "status__value_en",
        text: "stratigraphy.status__value_en",
        show: false,
      },
      {
        value: "region",
        text: "stratigraphy.region",
        show: false,
      },
      {
        value: "region_en",
        text: "stratigraphy.region_en",
        show: false,
      },
      {
        value: "lithology",
        text: "stratigraphy.lithology",
        show: false,
      },
      {
        value: "lithology_en",
        text: "stratigraphy.lithology_en",
        show: false,
      },
      {
        value: "max_thickness",
        text: "stratigraphy.max_thickness",
        show: false,
      },
      {
        value: "description",
        text: "stratigraphy.description",
        show: false,
      },
      {
        value: "description_en",
        text: "stratigraphy.description_en",
        show: false,
      },
      {
        value: "definition",
        text: "stratigraphy.definition",
        show: false,
      },
      {
        value: "definition_en",
        text: "stratigraphy.definition_en",
        show: false,
      },
      {
        value: "age_base",
        text: "stratigraphy.age_base",
        show: false,
      },
      {
        value: "age_top",
        text: "stratigraphy.age_top",
        show: false,
      },
      {
        value: "age_precision",
        text: "stratigraphy.age_precision",
        show: false,
      },
      {
        value: "age_reference__id",
        text: "stratigraphy.age_reference__id",
        show: false,
      },
      {
        value: "age_reference__reference",
        text: "stratigraphy.age_reference__reference",
        show: false,
      },
      {
        value: "age_chronostratigraphy__id",
        text: "stratigraphy.age_chronostratigraphy__id",
        show: false,
      },
      {
        value: "age_chronostratigraphy__stratigraphy",
        text: "stratigraphy.age_chronostratigraphy__stratigraphy",
        show: false,
      },
      {
        value: "age_chronostratigraphy__stratigraphy_en",
        text: "stratigraphy.age_chronostratigraphy__stratigraphy_en",
        show: false,
      },
      {
        value: "sort_within_parent",
        text: "stratigraphy.sort_within_parent",
        show: false,
      },
      {
        value: "approved_ics",
        text: "stratigraphy.approved_ics",
        show: false,
      },
      {
        value: "approved_esk",
        text: "stratigraphy.approved_esk",
        show: false,
      },
      {
        value: "maaamet_kood",
        text: "stratigraphy.maaamet_kood",
        show: false,
      },
      {
        value: "is_private",
        text: "stratigraphy.is_private",
        show: false,
      },
      {
        value: "remarks",
        text: "stratigraphy.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "stratigraphy.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "stratigraphy.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "stratigraphy.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "stratigraphy.date_changed",
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
