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
        accession: {
          lookUpType: "icontains",
          title: "specimen.accession__id",
          value: null,
        },
        agent_collected: {
          lookUpType: "icontains",
          title: "specimen.agent_collected",
          value: null,
          fields: [
            "agent_collected__agent",
            "agent_collected__forename",
            "agent_collected__surename",
            "agent_collected_free",
          ],
          type: "multi",
        },
        agent_collected_free: {
          lookUpType: "icontains",
          title: "specimen.agent_collected_free",
          value: null,
        },
        classification: {
          lookUpType: "icontains",
          title: "specimen.classification",
          value: null,
          fields: [
            "classification__class_field",
            "classification__class_en",
            "classification__class_lat",
            "classification__class_en_synonym",
            "classification__class_synonym",
          ],
          type: "multi",
        },
        coll: {
          lookUpType: "icontains",
          title: "specimen.coll__number",
          value: null,
          fields: ["coll__number"],
        },
        collection: {
          lookUpType: "icontains",
          title: "specimen.collection",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "specimen.database__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "specimen.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "specimen.date_changed",
          value: null,
        },
        date_collected: {
          lookUpType: "icontains",
          title: "specimen.date_collected",
          value: null,
        },
        date_collected_free: {
          lookUpType: "icontains",
          title: "specimen.date_collected_free",
          value: null,
        },
        deaccession: {
          lookUpType: "icontains",
          title: "specimen.deaccession__id",
          value: null,
        },
        depth: {
          lookUpType: "icontains",
          title: "specimen.depth",
          value: null,
        },
        depth_interval: {
          lookUpType: "icontains",
          title: "specimen.depth_interval",
          value: null,
        },
        fossil: {
          lookUpType: "icontains",
          title: "specimen.fossilSearch",
          value: null,
          fields: [
            "specimen_identification__name",
            "specimen_identification__taxon__taxon",
          ],
          type: "multi",
        },
        id: {
          lookUpType: "icontains",
          title: "specimen.id",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "specimen.is_private",
          value: "1",
        },
        kind: {
          lookUpType: "icontains",
          title: "specimen.kind__id",
          value: null,
        },
        lithostratigraphy: {
          lookUpType: "icontains",
          title: "specimen.lithostratigraphy__id",
          value: null,
        },
        locality: {
          lookUpType: "icontains",
          title: "specimen.locality",
          value: null,
          fields: [
            "locality__locality",
            "locality__locality_en",
            "locality_free",
          ],
          type: "multi",
        },
        locality_free: {
          lookUpType: "icontains",
          title: "specimen.locality_free",
          value: null,
        },
        locality_free_en: {
          lookUpType: "icontains",
          title: "specimen.locality_free_en",
          value: null,
        },
        locality_is_private: {
          lookUpType: "icontains",
          title: "specimen.locality_is_private",
          value: null,
        },
        location: {
          lookUpType: "icontains",
          title: "specimen.location",
          value: null,
        },
        number_field: {
          lookUpType: "icontains",
          title: "specimen.number_field",
          value: null,
        },
        number_pieces: {
          lookUpType: "icontains",
          title: "specimen.number_pieces",
          value: null,
        },
        original_status: {
          lookUpType: "icontains",
          title: "specimen.original_status__id",
          value: null,
        },
        parent: {
          lookUpType: "icontains",
          title: "specimen.parent__id",
          value: null,
        },
        part: {
          lookUpType: "icontains",
          title: "specimen.part",
          value: null,
        },
        presence: {
          lookUpType: "icontains",
          title: "specimen.presence__id",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "specimen.remarks",
          value: null,
        },
        remarks_collecting: {
          lookUpType: "icontains",
          title: "specimen.remarks_collecting",
          value: null,
        },
        remarks_internal: {
          lookUpType: "icontains",
          title: "specimen.remarks_internal",
          value: null,
        },
        sample: {
          lookUpType: "icontains",
          title: "specimen.sample__id",
          value: null,
        },
        sample_number: {
          lookUpType: "icontains",
          title: "specimen.sample_number",
          value: null,
        },
        specimen_id: {
          lookUpType: "icontains",
          title: "specimen.specimen_id",
          value: null,
          fields: ["specimen_id", "specimen_nr"],
          type: "multi",
        },
        specimen_nr: {
          lookUpType: "icontains",
          title: "specimen.specimen_nr",
          value: null,
        },
        status: {
          lookUpType: "icontains",
          title: "specimen.status__id",
          value: null,
        },
        storage: {
          lookUpType: "icontains",
          title: "specimen.storage",
          value: null,
          fields: ["storage__location"],
        },
        stratigraphy: {
          lookUpType: "icontains",
          title: "specimen.stratigraphy__stratigraphy",
          value: null,
          fields: [
            "stratigraphy__stratigraphy",
            "stratigraphy__stratigraphy_en",
            "stratigraphy_free",
            "lithostratigraphy__stratigraphy",
            "lithostratigraphy__stratigraphy_en",
          ],
          type: "multi",
        },
        stratigraphy_free: {
          lookUpType: "icontains",
          title: "specimen.stratigraphy_free",
          value: null,
        },
        subtype_id: {
          lookUpType: "icontains",
          title: "specimen.subtype_id__id",
          value: null,
        },
        tags: {
          lookUpType: "icontains",
          title: "specimen.tags",
          value: null,
        },
        type: {
          lookUpType: "icontains",
          title: "specimen.type__id",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "specimen.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "specimen.user_changed",
          value: null,
        },
        rock: {
          lookUpType: "icontains",
          title: "specimen.mineralRock",
          value: null,
          fields: [
            "specimen_identification_geology__name",
            "specimen_identification_geology__name_en",
            "specimen_identification_geology__rock__name",
            "specimen_identification_geology__rock__name_en",
          ],
          type: "multi",
        },
        selection_id: {
          lookUpType: "exact",
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
        loan: {
          lookUpType: "icontains",
          title: "specimen.loan",
          value: null,
          fields: ["loan_specimen__loan__loan_number"],
        },
        reference: {
          lookUpType: "icontains",
          title: "collection.reference",
          value: null,
          fields: ["specimen_reference__reference__reference"],
        },
      },
      mainIds: [
        "id",
        "specimen_id",
        "coll",
        "fossil",
        "rock",
        "locality",
        "stratigraphy",
        "agent_collected",
        "storage",
        "selection_id",
        "selection",
        "loan",
        "reference",
        "classification",
      ],
      extraIds: [
        "accession",
        "agent_collected_free",
        "collection",
        "database",
        "date_added",
        "date_changed",
        "date_collected",
        "date_collected_free",
        "deaccession",
        "depth",
        "depth_interval",
        "is_private",
        "kind",
        "lithostratigraphy",
        "locality_free",
        "locality_free_en",
        "locality_is_private",
        "location",
        "number_field",
        "number_pieces",
        "original_status",
        "parent",
        "part",
        "presence",
        "remarks",
        "remarks_collecting",
        "remarks_internal",
        "sample",
        "sample_number",
        "specimen_nr",
        "status",
        "stratigraphy_free",
        "subtype_id",
        "tags",
        "type",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "specimen.id",
        show: true,
      },
      {
        value: "specimen_full_name",
        text: "specimen.specimen_full_name",
        show: true,
      },
      {
        value: "identification",
        text: "specimen.identification",
        show: true,
      },
      {
        value: "specimen_id",
        text: "specimen.specimen_id",
        show: true,
      },
      {
        value: "locality__locality",
        text: "specimen.locality__locality",
        show: true,
      },
      {
        value: "depth",
        text: "specimen.depth",
        show: true,
      },
      {
        value: "stratigraphy__stratigraphy",
        text: "specimen.stratigraphy__stratigraphy",
        show: true,
      },
      {
        value: "agent_collected__agent",
        text: "specimen.agent_collected__agent",
        show: true,
      },
      {
        value: "storage__location",
        text: "specimen.storage__location",
        show: true,
      },
      {
        value: "link",
        text: "specimen.link",
        sortable: false,
        show: true,
      },
      {
        value: "collection",
        text: "specimen.collection",
        show: false,
      },
      {
        value: "coll__id",
        text: "specimen.coll__id",
        show: false,
      },
      {
        value: "coll__number",
        text: "specimen.coll__number",
        show: false,
      },
      {
        value: "specimen_nr",
        text: "specimen.specimen_nr",
        show: false,
      },
      {
        value: "number_field",
        text: "specimen.number_field",
        show: false,
      },
      {
        value: "type__id",
        text: "specimen.type__id",
        show: false,
      },
      {
        value: "type__value",
        text: "specimen.type__value",
        show: false,
      },
      {
        value: "type__value_en",
        text: "specimen.type__value_en",
        show: false,
      },
      {
        value: "subtype_id__id",
        text: "specimen.subtype_id__id",
        show: false,
      },
      {
        value: "subtype_id__value",
        text: "specimen.subtype_id__value",
        show: false,
      },
      {
        value: "subtype_id__value_en",
        text: "specimen.subtype_id__value_en",
        show: false,
      },
      {
        value: "fossil__id",
        text: "specimen.fossil__id",
        show: false,
      },
      {
        value: "fossil__value",
        text: "specimen.fossil__value",
        show: false,
      },
      {
        value: "fossil__value_en",
        text: "specimen.fossil__value_en",
        show: false,
      },
      {
        value: "kind",
        text: "specimen.kind",
        show: false,
      },
      {
        value: "kind",
        text: "specimen.kind",
        show: false,
      },
      {
        value: "kind",
        text: "specimen.kind",
        show: false,
      },
      {
        value: "classification__id",
        text: "specimen.classification__id",
        show: false,
      },
      {
        value: "classification__class_field",
        text: "specimen.classification__class_field",
        show: false,
      },
      {
        value: "part",
        text: "specimen.part",
        show: false,
      },
      {
        value: "number_pieces",
        text: "specimen.number_pieces",
        show: false,
      },
      {
        value: "locality__id",
        text: "specimen.locality__id",
        show: false,
      },
      {
        value: "locality__locality_en",
        text: "specimen.locality__locality_en",
        show: false,
      },
      {
        value: "locality_free",
        text: "specimen.locality_free",
        show: false,
      },
      {
        value: "locality_free_en",
        text: "specimen.locality_free_en",
        show: false,
      },
      {
        value: "locality_is_private",
        text: "specimen.locality_is_private",
        show: false,
      },
      {
        value: "depth_interval",
        text: "specimen.depth_interval",
        show: false,
      },
      {
        value: "sample_number",
        text: "specimen.sample_number",
        show: false,
      },
      {
        value: "sample__id",
        text: "specimen.sample__id",
        show: false,
      },
      {
        value: "sample__number",
        text: "specimen.sample__number",
        show: false,
      },
      {
        value: "parent__id",
        text: "specimen.parent__id",
        show: false,
      },
      {
        value: "parent__specimen_id",
        text: "specimen.parent__specimen_id",
        show: false,
      },
      {
        value: "remarks_collecting",
        text: "specimen.remarks_collecting",
        show: false,
      },
      {
        value: "stratigraphy__id",
        text: "specimen.stratigraphy__id",
        show: false,
      },
      {
        value: "stratigraphy__stratigraphy_en",
        text: "specimen.stratigraphy__stratigraphy_en",
        show: false,
      },
      {
        value: "lithostratigraphy__id",
        text: "specimen.lithostratigraphy__id",
        show: false,
      },
      {
        value: "lithostratigraphy__stratigraphy",
        text: "specimen.lithostratigraphy__stratigraphy",
        show: false,
      },
      {
        value: "lithostratigraphy__stratigraphy_en",
        text: "specimen.lithostratigraphy__stratigraphy_en",
        show: false,
      },
      {
        value: "stratigraphy_free",
        text: "specimen.stratigraphy_free",
        show: false,
      },
      {
        value: "agent_collected__id",
        text: "specimen.agent_collected__id",
        show: false,
      },
      {
        value: "agent_collected_free",
        text: "specimen.agent_collected_free",
        show: false,
      },
      {
        value: "date_collected",
        text: "specimen.date_collected",
        show: false,
      },
      {
        value: "date_collected_free",
        text: "specimen.date_collected_free",
        show: false,
      },
      {
        value: "remarks",
        text: "specimen.remarks",
        show: false,
      },
      {
        value: "remarks_internal",
        text: "specimen.remarks_internal",
        show: false,
      },
      {
        value: "tags",
        text: "specimen.tags",
        show: false,
      },
      {
        value: "presence__id",
        text: "specimen.presence__id",
        show: false,
      },
      {
        value: "presence__value",
        text: "specimen.presence__value",
        show: false,
      },
      {
        value: "presence__value_en",
        text: "specimen.presence__value_en",
        show: false,
      },
      {
        value: "storage__id",
        text: "specimen.storage__id",
        show: false,
      },
      {
        value: "location",
        text: "specimen.location",
        show: false,
      },
      {
        value: "status__id",
        text: "specimen.status__id",
        show: false,
      },
      {
        value: "status__value",
        text: "specimen.status__value",
        show: false,
      },
      {
        value: "status__value_en",
        text: "specimen.status__value_en",
        show: false,
      },
      {
        value: "original_status__id",
        text: "specimen.original_status__id",
        show: false,
      },
      {
        value: "original_status__value",
        text: "specimen.original_status__value",
        show: false,
      },
      {
        value: "original_status__value_en",
        text: "specimen.original_status__value_en",
        show: false,
      },
      {
        value: "is_private",
        text: "specimen.is_private",
        show: false,
      },
      {
        value: "accession__id",
        text: "specimen.accession__id",
        show: false,
      },
      {
        value: "accession__number",
        text: "specimen.accession__number",
        show: false,
      },
      {
        value: "deaccession__id",
        text: "specimen.deaccession__id",
        show: false,
      },
      {
        value: "deaccession__number",
        text: "specimen.deaccession__number",
        show: false,
      },
      {
        value: "user_added",
        text: "specimen.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "specimen.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "specimen.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "specimen.date_changed",
        show: false,
      },
      {
        value: "database__id",
        text: "specimen.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "specimen.database__acronym",
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
