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
          title: "analysis.agentAndLab",
          value: null,
          fields: ["agent__agent", "lab_txt"],
          type: "multi",
        },
        agent_txt: {
          lookUpType: "icontains",
          title: "analysis.agent_txt",
          value: null,
        },
        analysis_method: {
          lookUpType: "icontains",
          title: "analysis.analysis_method",
          value: null,
          fields: [
            "analysis_method__analysis_method",
            "analysis_method__method_en",
          ],
          type: "multi",
        },
        database: {
          lookUpType: "icontains",
          title: "analysis.database__id",
          value: null,
        },
        dataset: {
          lookUpType: "icontains",
          title: "analysis.dataset__id",
          value: null,
        },
        date: {
          lookUpType: "icontains",
          title: "analysis.date",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "analysis.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "analysis.date_changed",
          value: null,
        },
        date_end: {
          lookUpType: "icontains",
          title: "analysis.date_end",
          value: null,
        },
        date_free: {
          lookUpType: "icontains",
          title: "analysis.date_free",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "analysis.id",
          value: null,
        },
        instrument: {
          lookUpType: "icontains",
          title: "analysis.instrument__id",
          value: null,
        },
        instrument_txt: {
          lookUpType: "icontains",
          title: "analysis.instrument_txt",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "analysis.is_private",
          value: null,
        },
        lab: {
          lookUpType: "icontains",
          title: "analysis.lab__id",
          value: null,
        },
        lab_analysis_number: {
          lookUpType: "icontains",
          title: "analysis.lab_analysis_number",
          value: null,
        },
        lab_sample_number: {
          lookUpType: "icontains",
          title: "analysis.lab_sample_number",
          value: null,
        },
        lab_txt: {
          lookUpType: "icontains",
          title: "analysis.lab_txt",
          value: null,
        },
        location: {
          lookUpType: "icontains",
          title: "analysis.location",
          value: null,
        },
        mass: {
          lookUpType: "icontains",
          title: "analysis.mass",
          value: null,
        },
        material: {
          lookUpType: "icontains",
          title: "analysis.material",
          value: null,
        },
        method_details: {
          lookUpType: "icontains",
          title: "analysis.method_details",
          value: null,
        },
        method_details_en: {
          lookUpType: "icontains",
          title: "analysis.method_details_en",
          value: null,
        },
        owner: {
          lookUpType: "icontains",
          title: "analysis.owner__id",
          value: null,
        },
        reference: {
          lookUpType: "icontains",
          title: "analysis.reference__id",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "analysis.remarks",
          value: null,
        },
        sample: {
          lookUpType: "icontains",
          title: "analysis.sampleIdAndNumber",
          value: null,
          fields: ["sample__number", "sample__number_additional"],
          type: "multi",
        },
        specimen: {
          lookUpType: "icontains",
          title: "analysis.specimen__id",
          value: null,
        },
        storage: {
          lookUpType: "icontains",
          title: "analysis.storage__id",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "analysis.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "analysis.user_changed",
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
        "analysis_method",
        "agent",
        "sample",
        "dataset",
        "selection_id",
        "selection",
      ],
      extraIds: [
        "agent_txt",
        "database",
        "date",
        "date_added",
        "date_changed",
        "date_end",
        "date_free",
        "instrument",
        "instrument_txt",
        "is_private",
        "lab",
        "lab_analysis_number",
        "lab_sample_number",
        "lab_txt",
        "location",
        "mass",
        "material",
        "method_details",
        "method_details_en",
        "owner",
        "reference",
        "remarks",
        "specimen",
        "storage",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "analysis.id",
        show: true,
      },
      {
        value: "sample.number",
        text: "analysis.sample__number",
        show: true,
      },
      {
        value: "sample.depth",
        text: "analysis.sample__depth",
        show: true,
      },
      {
        value: "analysis_method.analysis_method",
        text: "analysis.analysis_method__analysis_method",
        show: true,
      },
      {
        value: "date",
        text: "analysis.date",
        show: true,
      },
      {
        value: "lab_txt",
        text: "analysis.lab_txt",
        show: true,
      },
      {
        value: "link",
        text: "analysis.link",
        sortable: false,
        show: true,
      },
      {
        value: "material",
        text: "analysis.material",
        show: false,
      },
      {
        value: "sample.id",
        text: "analysis.sample__id",
        show: false,
      },
      {
        value: "sample.locality.locality",
        text: "analysis.sample__locality__locality",
        show: false,
      },
      {
        value: "sample.locality.locality_en",
        text: "analysis.sample__locality__locality_en",
        show: false,
      },
      {
        value: "specimen.specimen_id",
        text: "analysis.specimen__specimen_id",
        show: false,
      },
      {
        value: "dataset.name",
        text: "analysis.dataset__name",
        show: false,
      },
      {
        value: "dataset.name_en",
        text: "analysis.dataset__name_en",
        show: false,
      },
      {
        value: "reference.reference",
        text: "analysis.reference__reference",
        show: false,
      },
      {
        value: "analysis_method.method_en",
        text: "analysis.analysis_method__method_en",
        show: false,
      },
      {
        value: "method_details",
        text: "analysis.method_details",
        show: false,
      },
      {
        value: "method_details_en",
        text: "analysis.method_details_en",
        show: false,
      },
      {
        value: "mass",
        text: "analysis.mass",
        show: false,
      },
      {
        value: "date_end",
        text: "analysis.date_end",
        show: false,
      },
      {
        value: "date_free",
        text: "analysis.date_free",
        show: false,
      },
      {
        value: "lab.lab",
        text: "analysis.lab__lab",
        show: false,
      },
      {
        value: "lab.lab_en",
        text: "analysis.lab__lab_en",
        show: false,
      },
      {
        value: "lab_sample_number",
        text: "analysis.lab_sample_number",
        show: false,
      },
      {
        value: "lab_analysis_number",
        text: "analysis.lab_analysis_number",
        show: false,
      },
      {
        value: "instrument.instrument",
        text: "analysis.instrument__instrument",
        show: false,
      },
      {
        value: "instrument.instrument_en",
        text: "analysis.instrument__instrument_en",
        show: false,
      },
      {
        value: "instrument_txt",
        text: "analysis.instrument_txt",
        show: false,
      },
      {
        value: "agent.agent",
        text: "analysis.agent__agent",
        show: false,
      },
      {
        value: "agent_txt",
        text: "analysis.agent_txt",
        show: false,
      },
      {
        value: "owner.agent",
        text: "analysis.owner__agent",
        show: false,
      },
      {
        value: "is_private",
        text: "analysis.is_private",
        show: false,
      },
      {
        value: "location",
        text: "analysis.location",
        show: false,
      },
      {
        value: "storage.location",
        text: "analysis.storage__location",
        show: false,
      },
      {
        value: "remarks",
        text: "analysis.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "analysis.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "analysis.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "analysis.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "analysis.date_changed",
        show: false,
      },
      {
        value: "database.acronym",
        text: "analysis.database__acronym",
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
