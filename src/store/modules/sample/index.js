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
        agent_collected: {
          lookUpType: "icontains",
          title: "sample.agent_collected",
          value: null,
          fields: ["agent_collected__agent"],
        },
        agent_collected_free: {
          lookUpType: "icontains",
          title: "sample.agent_collected_free",
          value: null,
        },
        analysis: {
          lookUpType: "icontains",
          title: "sample.analysis",
          value: null,
        },
        classification_rock: {
          lookUpType: "icontains",
          title: "sample.classification_rock__id",
          value: null,
        },
        coordinate_accuracy: {
          lookUpType: "icontains",
          title: "sample.coordinate_accuracy",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "sample.database__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "sample.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "sample.date_changed",
          value: null,
        },
        date_collected: {
          lookUpType: "icontains",
          title: "sample.date_collected",
          value: null,
        },
        date_collected_free: {
          lookUpType: "icontains",
          title: "sample.date_collected_free",
          value: null,
        },
        depth: {
          lookUpType: "icontains",
          title: "sample.depth",
          value: null,
          fields: ["depth", "depth_interval"],
          type: "multi",
        },
        depth_interval: {
          lookUpType: "icontains",
          title: "sample.depth_interval",
          value: null,
        },
        epsg: {
          lookUpType: "icontains",
          title: "sample.epsg",
          value: null,
        },
        fossils: {
          lookUpType: "icontains",
          title: "sample.fossils",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "sample.id",
          value: null,
        },
        igsn: {
          lookUpType: "icontains",
          title: "sample.igsn",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "sample.is_private",
          value: null,
        },
        latitude1: {
          lookUpType: "icontains",
          title: "sample.latitude1",
          value: null,
        },
        lithostratigraphy: {
          lookUpType: "icontains",
          title: "sample.lithostratigraphy",
          value: null,
        },
        locality: {
          lookUpType: "icontains",
          title: "sample.locality",
          value: null,
          fields: [
            "locality__locality_en",
            "locality__locality",
            "locality_free",
            "site__name",
            "site__name_en",
          ],
          type: "multi",
        },
        locality_free: {
          lookUpType: "icontains",
          title: "sample.locality_free",
          value: null,
        },
        location: {
          lookUpType: "icontains",
          title: "sample.location",
          value: null,
        },
        location_additional: {
          lookUpType: "icontains",
          title: "sample.location_additional",
          value: null,
        },
        longitude1: {
          lookUpType: "icontains",
          title: "sample.longitude1",
          value: null,
        },
        mass: {
          lookUpType: "icontains",
          title: "sample.mass",
          value: null,
        },
        number: {
          lookUpType: "icontains",
          title: "sample.number",
          value: null,
          fields: ["number", "number_additional", "number_field"],
          type: "multi",
        },
        number_additional: {
          lookUpType: "icontains",
          title: "sample.number_additional",
          value: null,
        },
        number_field: {
          lookUpType: "icontains",
          title: "sample.number_field",
          value: null,
        },
        owner: {
          lookUpType: "icontains",
          title: "sample.owner",
          value: null,
        },
        palaeontology: {
          lookUpType: "icontains",
          title: "sample.palaeontology",
          value: null,
        },
        parent_sample: {
          lookUpType: "icontains",
          title: "sample.parent_sample",
          value: null,
        },
        parent_specimen: {
          lookUpType: "icontains",
          title: "sample.parent_specimen",
          value: null,
        },
        project: {
          lookUpType: "icontains",
          title: "sample.project",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "sample.remarks",
          value: null,
        },
        rock: {
          lookUpType: "icontains",
          title: "sample.rock",
          value: null,
        },
        rock_en: {
          lookUpType: "icontains",
          title: "sample.rock_en",
          value: null,
        },
        sample_purpose: {
          lookUpType: "icontains",
          title: "sample.sample_purpose",
          value: null,
        },
        sample_type: {
          lookUpType: "icontains",
          title: "sample.sample_type",
          value: null,
        },
        series: {
          lookUpType: "icontains",
          title: "sample.series_search",
          value: null,
          fields: ["series__name"],
        },
        site: {
          lookUpType: "icontains",
          title: "sample.site",
          value: null,
          fields: ["site__name", "site__project__name"],
        },
        soil_horizon: {
          lookUpType: "icontains",
          title: "sample.soil_horizon",
          value: null,
        },
        soil_site: {
          lookUpType: "icontains",
          title: "sample.soil_site__id",
          value: null,
        },
        storage: {
          lookUpType: "icontains",
          title: "sample.storage",
          value: null,
          fields: ["storage__location"],
        },
        storage_additional: {
          lookUpType: "icontains",
          title: "sample.storage_additional",
          value: null,
        },
        stratigraphy: {
          lookUpType: "icontains",
          title: "sample.stratigraphy",
          value: null,
          fields: [
            "stratigraphy__stratigraphy_en",
            "stratigraphy__stratigraphy",
            "lithostratigraphy__stratigraphy",
            "lithostratigraphy__stratigraphy_en",
          ],
          type: "multi",
        },
        stratigraphy_bed: {
          lookUpType: "icontains",
          title: "sample.stratigraphy_bed",
          value: null,
        },
        stratigraphy_free: {
          lookUpType: "icontains",
          title: "sample.stratigraphy_free",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "sample.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "sample.user_changed",
          value: null,
        },
        x1: {
          lookUpType: "icontains",
          title: "sample.x1",
          value: null,
        },
        y1: {
          lookUpType: "icontains",
          title: "sample.y1",
          value: null,
        },
        selection_id: {
          lookUpType: "icontains",
          title: "specimen.selectionId",
          value: null,
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
          fields: ["loan_sample__loan__loan_number"],
        },
      },
      mainIds: [
        "number",
        "id",
        "locality",
        "depth",
        "stratigraphy",
        "agent_collected",
        "storage",
        "site",
        "selection_id",
        "selection",
        "loan",
        "series",
      ],
      extraIds: [
        "agent_collected_free",
        "analysis",
        "classification_rock",
        "coordinate_accuracy",
        "database",
        "date_added",
        "date_changed",
        "date_collected",
        "date_collected_free",
        "depth_interval",
        "epsg",
        "fossils",
        "igsn",
        "is_private",
        "latitude1",
        "lithostratigraphy",
        "locality_free",
        "location",
        "location_additional",
        "longitude1",
        "mass",
        "number_additional",
        "number_field",
        "owner",
        "palaeontology",
        "parent_sample",
        "parent_specimen",
        "project",
        "remarks",
        "rock",
        "rock_en",
        "sample_purpose",
        "sample_type",
        "soil_horizon",
        "soil_site",
        "storage_additional",
        "stratigraphy",
        "stratigraphy_bed",
        "stratigraphy_free",
        "user_added",
        "user_changed",
        "x1",
        "y1",
      ],
    },
    headers: [
      {
        value: "id",
        text: "sample.id",
        show: true,
      },
      {
        value: "number",
        text: "sample.number",
        show: true,
      },
      {
        value: "locality__id",
        text: "sample.locality__id",
        show: true,
      },
      {
        value: "depth",
        text: "sample.depth",
        show: true,
      },
      {
        value: "stratigraphy__id",
        text: "sample.stratigraphy__id",
        show: true,
      },
      {
        value: "lithostratigraphy__id",
        text: "sample.lithostratigraphy__id",
        show: true,
      },
      {
        value: "agent_collected__agent",
        text: "sample.agent_collected__agent",
        show: true,
      },
      {
        value: "storage__location",
        text: "sample.storage__location",
        show: true,
      },
      {
        value: "link",
        text: "sample.link",
        sortable: false,
        show: true,
      },
      {
        value: "number_additional",
        text: "sample.number_additional",
        show: false,
      },
      {
        value: "number_field",
        text: "sample.number_field",
        show: false,
      },
      {
        value: "igsn",
        text: "sample.igsn",
        show: false,
      },
      {
        value: "series__id",
        text: "sample.series__id",
        show: false,
      },
      {
        value: "series__name",
        text: "sample.series__name",
        show: false,
      },
      {
        value: "parent_sample__id",
        text: "sample.parent_sample__id",
        show: false,
      },
      {
        value: "parent_sample__number",
        text: "sample.parent_sample__number",
        show: false,
      },
      {
        value: "parent_specimen__id",
        text: "sample.parent_specimen__id",
        show: false,
      },
      {
        value: "parent_specimen__specimen_id",
        text: "sample.parent_specimen__specimen_id",
        show: false,
      },
      {
        value: "sample_purpose__id",
        text: "sample.sample_purpose__id",
        show: false,
      },
      {
        value: "sample_purpose__value",
        text: "sample.sample_purpose__value",
        show: false,
      },
      {
        value: "sample_purpose__value_en",
        text: "sample.sample_purpose__value_en",
        show: false,
      },
      {
        value: "sample_type",
        text: "sample.sample_type",
        show: false,
      },
      {
        value: "locality__locality",
        text: "sample.locality__locality",
        show: false,
      },
      {
        value: "locality__locality_en",
        text: "sample.locality__locality_en",
        show: false,
      },
      {
        value: "site__id",
        text: "sample.site__id",
        show: false,
      },
      {
        value: "site__name",
        text: "sample.site__name",
        show: false,
      },
      {
        value: "site__name_en",
        text: "sample.site__name_en",
        show: false,
      },
      {
        value: "locality_free",
        text: "sample.locality_free",
        show: false,
      },
      {
        value: "soil_site__id",
        text: "sample.soil_site__id",
        show: false,
      },
      {
        value: "soil_site__site",
        text: "sample.soil_site__site",
        show: false,
      },
      {
        value: "soil_site__site_en",
        text: "sample.soil_site__site_en",
        show: false,
      },
      {
        value: "latitude1",
        text: "sample.latitude1",
        show: false,
      },
      {
        value: "longitude1",
        text: "sample.longitude1",
        show: false,
      },
      {
        value: "x1",
        text: "sample.x1",
        show: false,
      },
      {
        value: "y1",
        text: "sample.y1",
        show: false,
      },
      {
        value: "epsg",
        text: "sample.epsg",
        show: false,
      },
      {
        value: "coordinate_accuracy",
        text: "sample.coordinate_accuracy",
        show: false,
      },
      {
        value: "depth_interval",
        text: "sample.depth_interval",
        show: false,
      },
      {
        value: "stratigraphy__stratigraphy",
        text: "sample.stratigraphy__stratigraphy",
        show: false,
      },
      {
        value: "stratigraphy__stratigraphy_en",
        text: "sample.stratigraphy__stratigraphy_en",
        show: false,
      },
      {
        value: "lithostratigraphy__stratigraphy",
        text: "sample.lithostratigraphy__stratigraphy",
        show: false,
      },
      {
        value: "lithostratigraphy__stratigraphy_en",
        text: "sample.lithostratigraphy__stratigraphy_en",
        show: false,
      },
      {
        value: "stratigraphy_free",
        text: "sample.stratigraphy_free",
        show: false,
      },
      {
        value: "stratigraphy_bed",
        text: "sample.stratigraphy_bed",
        show: false,
      },
      {
        value: "soil_horizon",
        text: "sample.soil_horizon",
        show: false,
      },
      {
        value: "agent_collected__id",
        text: "sample.agent_collected__id",
        show: false,
      },
      {
        value: "agent_collected_free",
        text: "sample.agent_collected_free",
        show: false,
      },
      {
        value: "date_collected",
        text: "sample.date_collected",
        show: false,
      },
      {
        value: "date_collected_free",
        text: "sample.date_collected_free",
        show: false,
      },
      {
        value: "classification_rock__id",
        text: "sample.classification_rock__id",
        show: false,
      },
      {
        value: "classification_rock__name",
        text: "sample.classification_rock__name",
        show: false,
      },
      {
        value: "classification_rock__name_en",
        text: "sample.classification_rock__name_en",
        show: false,
      },
      {
        value: "rock",
        text: "sample.rock",
        show: false,
      },
      {
        value: "rock_en",
        text: "sample.rock_en",
        show: false,
      },
      {
        value: "fossils",
        text: "sample.fossils",
        show: false,
      },
      {
        value: "palaeontology",
        text: "sample.palaeontology",
        show: false,
      },
      {
        value: "analysis",
        text: "sample.analysis",
        show: false,
      },
      {
        value: "mass",
        text: "sample.mass",
        show: false,
      },
      {
        value: "location",
        text: "sample.location",
        show: false,
      },
      {
        value: "location_additional",
        text: "sample.location_additional",
        show: false,
      },
      {
        value: "storage__id",
        text: "sample.storage__id",
        show: false,
      },
      {
        value: "storage_additional__id",
        text: "sample.storage_additional__id",
        show: false,
      },
      {
        value: "storage_additional__location",
        text: "sample.storage_additional__location",
        show: false,
      },
      {
        value: "remarks",
        text: "sample.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "sample.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "sample.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "sample.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "sample.date_changed",
        show: false,
      },
      {
        value: "owner__id",
        text: "sample.owner__id",
        show: false,
      },
      {
        value: "owner__agent",
        text: "sample.owner__agent",
        show: false,
      },
      {
        value: "is_private",
        text: "sample.is_private",
        show: false,
      },
      {
        value: "database__id",
        text: "sample.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "sample.database__acronym",
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
