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
        author_year: {
          lookUpType: "icontains",
          title: "taxon.author_year",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "taxon.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "taxon.date_changed",
          value: null,
        },
        fossil_group: {
          lookUpType: "icontains",
          title: "taxon.fossil_group__id",
          value: null,
        },
        hierarchy_string: {
          lookUpType: "icontains",
          title: "taxon.hierarchy_string",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "taxon.id",
          value: null,
        },
        in_baltoscandia: {
          lookUpType: "icontains",
          title: "taxon.in_baltoscandia",
          value: null,
        },
        in_estonia: {
          lookUpType: "icontains",
          title: "taxon.in_estonia",
          value: null,
        },
        is_authorized: {
          lookUpType: "icontains",
          title: "taxon.is_authorized",
          value: null,
        },
        is_fossil: {
          lookUpType: "icontains",
          title: "taxon.is_fossil",
          value: null,
        },
        is_fossil_group: {
          lookUpType: "icontains",
          title: "taxon.is_fossil_group",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "taxon.is_private",
          value: null,
        },
        is_valid: {
          lookUpType: "icontains",
          title: "taxon.is_valid",
          value: null,
        },
        owner: {
          lookUpType: "icontains",
          title: "taxon.owner",
          value: null,
        },
        parent: {
          lookUpType: "icontains",
          title: "taxon.parent__taxon",
          value: null,
          fields: ["parent__taxon"],
        },
        rank: {
          lookUpType: "icontains",
          title: "taxon.rank__id",
          value: null,
        },
        rank_original: {
          lookUpType: "icontains",
          title: "taxon.rank_original__id",
          value: null,
        },
        reference: {
          lookUpType: "icontains",
          title: "taxon.reference__id",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "taxon.remarks",
          value: null,
        },
        sort: {
          lookUpType: "icontains",
          title: "taxon.sort",
          value: null,
        },
        stratigraphy_base: {
          lookUpType: "icontains",
          title: "taxon.stratigraphy_base__id",
          value: null,
        },
        stratigraphy_top: {
          lookUpType: "icontains",
          title: "taxon.stratigraphy_top__id",
          value: null,
        },
        synonym_of: {
          lookUpType: "icontains",
          title: "taxon.synonym_of",
          value: null,
        },
        synonym_of_reference_id: {
          lookUpType: "icontains",
          title: "taxon.synonym_of_reference_id",
          value: null,
        },
        taxon: {
          lookUpType: "icontains",
          title: "taxon.taxon",
          value: null,
        },
        taxon_epithet: {
          lookUpType: "icontains",
          title: "taxon.taxon_epithet",
          value: null,
        },
        taxon_full_name: {
          lookUpType: "icontains",
          title: "taxon.taxon_full_name",
          value: null,
        },
        taxon_id_eol: {
          lookUpType: "icontains",
          title: "taxon.taxon_id_eol",
          value: null,
        },
        taxon_id_nrm: {
          lookUpType: "icontains",
          title: "taxon.taxon_id_nrm",
          value: null,
        },
        taxon_id_pbdb: {
          lookUpType: "icontains",
          title: "taxon.taxon_id_pbdb",
          value: null,
        },
        taxon_id_plutof: {
          lookUpType: "icontains",
          title: "taxon.taxon_id_plutof",
          value: null,
        },
        taxon_id_tol: {
          lookUpType: "icontains",
          title: "taxon.taxon_id_tol",
          value: null,
        },
        taxon_original_name: {
          lookUpType: "icontains",
          title: "taxon.taxon_original_name",
          value: null,
        },
        type_taxon: {
          lookUpType: "icontains",
          title: "taxon.type_taxon__id",
          value: null,
        },
        type_taxon_txt: {
          lookUpType: "icontains",
          title: "taxon.type_taxon_txt",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "taxon.user_added",
          value: null,
        },
        user_authorized: {
          lookUpType: "icontains",
          title: "taxon.user_authorized",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "taxon.user_changed",
          value: null,
        },
        selection_id: {
          lookUpType: "icontains",
          title: "specimen.selectionId",
          value: null,
          fields: ["selection__selection"],
        },
        selection: {
          lookUpType: "icontains",
          title: "specimen.selection",
          value: null,
          fields: ["selection__selection__name"],
        },
      },
      mainIds: [
        "id",
        "taxon",
        "author_year",
        "parent",
        "taxon_epithet",
        "user_added",
        "selection_id",
        "selection",
      ],
      extraIds: [
        "date_added",
        "date_changed",
        "fossil_group",
        "hierarchy_string",
        "in_baltoscandia",
        "in_estonia",
        "is_authorized",
        "is_fossil",
        "is_fossil_group",
        "is_private",
        "is_valid",
        "owner",
        "rank",
        "rank_original",
        "reference",
        "remarks",
        "sort",
        "stratigraphy_base",
        "stratigraphy_top",
        "synonym_of",
        "synonym_of_reference_id",
        "taxon_full_name",
        "taxon_id_eol",
        "taxon_id_nrm",
        "taxon_id_pbdb",
        "taxon_id_plutof",
        "taxon_id_tol",
        "taxon_original_name",
        "type_taxon",
        "type_taxon_txt",
        "user_authorized",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "taxon.id",
        show: true,
      },
      {
        value: "taxon",
        text: "taxon.taxon",
        show: true,
      },
      {
        value: "author_year",
        text: "taxon.author_year",
        show: true,
      },
      {
        value: "taxon_epithet",
        text: "taxon.taxon_epithet",
        show: true,
      },
      {
        value: "parent__taxon",
        text: "taxon.parent__taxon",
        show: true,
      },
      {
        value: "fossil_group__taxon",
        text: "taxon.fossil_group__taxon",
        show: true,
      },
      {
        value: "link",
        text: "taxon.link",
        sortable: false,
        show: true,
      },
      {
        value: "taxon_full_name",
        text: "taxon.taxon_full_name",
        show: false,
      },
      {
        value: "taxon_original_name",
        text: "taxon.taxon_original_name",
        show: false,
      },
      {
        value: "reference__id",
        text: "taxon.reference__id",
        show: false,
      },
      {
        value: "reference__reference",
        text: "taxon.reference__reference",
        show: false,
      },
      {
        value: "parent__id",
        text: "taxon.parent__id",
        show: false,
      },
      {
        value: "fossil_group__id",
        text: "taxon.fossil_group__id",
        show: false,
      },
      {
        value: "synonym_of",
        text: "taxon.synonym_of",
        show: false,
      },
      {
        value: "synonym_of_reference_id",
        text: "taxon.synonym_of_reference_id",
        show: false,
      },
      {
        value: "hierarchy_string",
        text: "taxon.hierarchy_string",
        show: false,
      },
      {
        value: "rank__id",
        text: "taxon.rank__id",
        show: false,
      },
      {
        value: "rank__rank",
        text: "taxon.rank__rank",
        show: false,
      },
      {
        value: "rank_original__id",
        text: "taxon.rank_original__id",
        show: false,
      },
      {
        value: "rank_original__rank",
        text: "taxon.rank_original__rank",
        show: false,
      },
      {
        value: "type_taxon__id",
        text: "taxon.type_taxon__id",
        show: false,
      },
      {
        value: "type_taxon__taxon",
        text: "taxon.type_taxon__taxon",
        show: false,
      },
      {
        value: "type_taxon_txt",
        text: "taxon.type_taxon_txt",
        show: false,
      },
      {
        value: "stratigraphy_base__id",
        text: "taxon.stratigraphy_base__id",
        show: false,
      },
      {
        value: "stratigraphy_base__stratigraphy",
        text: "taxon.stratigraphy_base__stratigraphy",
        show: false,
      },
      {
        value: "stratigraphy_base__stratigraphy_en",
        text: "taxon.stratigraphy_base__stratigraphy_en",
        show: false,
      },
      {
        value: "stratigraphy_top__id",
        text: "taxon.stratigraphy_top__id",
        show: false,
      },
      {
        value: "stratigraphy_top__stratigraphy",
        text: "taxon.stratigraphy_top__stratigraphy",
        show: false,
      },
      {
        value: "stratigraphy_top__stratigraphy_en",
        text: "taxon.stratigraphy_top__stratigraphy_en",
        show: false,
      },
      {
        value: "in_estonia",
        text: "taxon.in_estonia",
        show: false,
      },
      {
        value: "in_baltoscandia",
        text: "taxon.in_baltoscandia",
        show: false,
      },
      {
        value: "is_fossil",
        text: "taxon.is_fossil",
        show: false,
      },
      {
        value: "is_private",
        text: "taxon.is_private",
        show: false,
      },
      {
        value: "is_valid",
        text: "taxon.is_valid",
        show: false,
      },
      {
        value: "is_fossil_group",
        text: "taxon.is_fossil_group",
        show: false,
      },
      {
        value: "sort",
        text: "taxon.sort",
        show: false,
      },
      {
        value: "taxon_id_pbdb",
        text: "taxon.taxon_id_pbdb",
        show: false,
      },
      {
        value: "taxon_id_plutof",
        text: "taxon.taxon_id_plutof",
        show: false,
      },
      {
        value: "taxon_id_tol",
        text: "taxon.taxon_id_tol",
        show: false,
      },
      {
        value: "taxon_id_eol",
        text: "taxon.taxon_id_eol",
        show: false,
      },
      {
        value: "taxon_id_nrm",
        text: "taxon.taxon_id_nrm",
        show: false,
      },
      {
        value: "remarks",
        text: "taxon.remarks",
        show: false,
      },
      {
        value: "owner",
        text: "taxon.owner",
        show: false,
      },
      {
        value: "is_authorized",
        text: "taxon.is_authorized",
        show: false,
      },
      {
        value: "user_authorized",
        text: "taxon.user_authorized",
        show: false,
      },
      {
        value: "user_added",
        text: "taxon.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "taxon.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "taxon.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "taxon.date_changed",
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
