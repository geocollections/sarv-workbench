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
        area: {
          lookUpType: "icontains",
          title: "site.area__id",
          value: null,
        },
        coord_det_agent: {
          lookUpType: "icontains",
          title: "site.coord_det_agent__id",
          value: null,
        },
        coord_det_method: {
          lookUpType: "icontains",
          title: "site.coord_det_method__id",
          value: null,
        },
        coord_det_precision: {
          lookUpType: "icontains",
          title: "site.coord_det_precision__id",
          value: null,
        },
        coordx: {
          lookUpType: "icontains",
          title: "site.coordx",
          value: null,
        },
        coordy: {
          lookUpType: "icontains",
          title: "site.coordy",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "site.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "site.date_changed",
          value: null,
        },
        date_end: {
          lookUpType: "lt",
          title: "common.date_end",
          value: null,
          isDate: true,
          type: "datetime",
        },
        date_free: {
          lookUpType: "icontains",
          title: "site.date_free",
          value: null,
        },
        date_start: {
          lookUpType: "gt",
          title: "common.date_start",
          value: null,
          isDate: true,
          type: "datetime",
        },
        depth: {
          lookUpType: "icontains",
          title: "site.depth",
          value: null,
        },
        description: {
          lookUpType: "icontains",
          title: "site.description",
          value: null,
        },
        elevation: {
          lookUpType: "icontains",
          title: "site.elevation",
          value: null,
        },
        elevation_accuracy: {
          lookUpType: "icontains",
          title: "site.elevation_accuracy",
          value: null,
        },
        epsg: {
          lookUpType: "icontains",
          title: "site.epsg",
          value: null,
        },
        extent: {
          lookUpType: "icontains",
          title: "site.extent",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "site.id",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "site.is_private",
          value: null,
        },
        latitude: {
          lookUpType: "icontains",
          title: "site.latitude",
          value: null,
        },
        locality: {
          lookUpType: "icontains",
          title: "site.locality__id",
          value: null,
        },
        location_accuracy: {
          lookUpType: "icontains",
          title: "site.location_accuracy",
          value: null,
        },
        longitude: {
          lookUpType: "icontains",
          title: "site.longitude",
          value: null,
        },
        name: {
          lookUpType: "icontains",
          title: "site.name",
          value: null,
          fields: ["name", "name_en"],
          type: "multi",
        },
        name_en: {
          lookUpType: "icontains",
          title: "site.name_en",
          value: null,
        },
        number: {
          lookUpType: "icontains",
          title: "site.number",
          value: null,
        },
        project: {
          lookUpType: "icontains",
          title: "site.relatedProject",
          value: null,
          fields: ["project__name", "project__name_en"],
          type: "multi",
        },
        remarks: {
          lookUpType: "icontains",
          title: "site.remarks",
          value: null,
        },
        remarks_location: {
          lookUpType: "icontains",
          title: "site.remarks_location",
          value: null,
        },
        site_type: {
          lookUpType: "icontains",
          title: "site.site_type__id",
          value: null,
        },
        sitegroundwater: {
          lookUpType: "icontains",
          title: "site.sitegroundwater__id",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "site.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "site.user_changed",
          value: null,
        },
      },
      mainIds: ["id", "name", "number", "project", "date_start", "date_end"],
      extraIds: [
        "area",
        "coord_det_agent",
        "coord_det_method",
        "coord_det_precision",
        "coordx",
        "coordy",
        "date_added",
        "date_changed",
        "date_free",
        "depth",
        "description",
        "elevation",
        "elevation_accuracy",
        "epsg",
        "extent",
        "is_private",
        "latitude",
        "locality",
        "location_accuracy",
        "longitude",
        "name_en",
        "remarks",
        "remarks_location",
        "site_type",
        "sitegroundwater",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "site.id",
        show: true,
      },
      {
        value: "name",
        text: "site.name",
        show: true,
      },
      {
        value: "number",
        text: "site.number",
        show: true,
      },
      {
        value: "date_start",
        text: "site.date_start",
        show: true,
      },
      {
        value: "date_end",
        text: "site.date_end",
        show: true,
      },
      {
        value: "project__id",
        text: "site.project__id",
        show: false,
      },
      {
        value: "project__name",
        text: "site.project__name",
        show: false,
      },
      {
        value: "project__name_en",
        text: "site.project__name_en",
        show: false,
      },
      {
        value: "locality__id",
        text: "site.locality__id",
        show: false,
      },
      {
        value: "locality__locality",
        text: "site.locality__locality",
        show: false,
      },
      {
        value: "locality__locality",
        text: "site.locality__locality",
        show: false,
      },
      {
        value: "area__id",
        text: "site.area__id",
        show: false,
      },
      {
        value: "area__name",
        text: "site.area__name",
        show: false,
      },
      {
        value: "area__name_en",
        text: "site.area__name_en",
        show: false,
      },
      {
        value: "site_type__id",
        text: "site.site_type__id",
        show: false,
      },
      {
        value: "site_type__value",
        text: "site.site_type__value",
        show: false,
      },
      {
        value: "site_type__value",
        text: "site.site_type__value",
        show: false,
      },
      {
        value: "name_en",
        text: "site.name_en",
        show: false,
      },
      {
        value: "latitude",
        text: "site.latitude",
        show: false,
      },
      {
        value: "longitude",
        text: "site.longitude",
        show: false,
      },
      {
        value: "location_accuracy",
        text: "site.location_accuracy",
        show: false,
      },
      {
        value: "elevation",
        text: "site.elevation",
        show: false,
      },
      {
        value: "elevation_accuracy",
        text: "site.elevation_accuracy",
        show: false,
      },
      {
        value: "coord_det_precision__id",
        text: "site.coord_det_precision__id",
        show: false,
      },
      {
        value: "coord_det_precision__value",
        text: "site.coord_det_precision__value",
        show: false,
      },
      {
        value: "coord_det_precision__value_en",
        text: "site.coord_det_precision__value_en",
        show: false,
      },
      {
        value: "coord_det_method__id",
        text: "site.coord_det_method__id",
        show: false,
      },
      {
        value: "coord_det_method__value",
        text: "site.coord_det_method__value",
        show: false,
      },
      {
        value: "coord_det_method__value_en",
        text: "site.coord_det_method__value_en",
        show: false,
      },
      {
        value: "coord_det_agent__id",
        text: "site.coord_det_agent__id",
        show: false,
      },
      {
        value: "coord_det_agent__agent",
        text: "site.coord_det_agent__agent",
        show: false,
      },
      {
        value: "epsg",
        text: "site.epsg",
        show: false,
      },
      {
        value: "coordx",
        text: "site.coordx",
        show: false,
      },
      {
        value: "coordy",
        text: "site.coordy",
        show: false,
      },
      {
        value: "extent",
        text: "site.extent",
        show: false,
      },
      {
        value: "depth",
        text: "site.depth",
        show: false,
      },
      {
        value: "date_free",
        text: "site.date_free",
        show: false,
      },
      {
        value: "remarks_location",
        text: "site.remarks_location",
        show: false,
      },
      {
        value: "description",
        text: "site.description",
        show: false,
      },
      {
        value: "remarks",
        text: "site.remarks",
        show: false,
      },
      {
        value: "user_added",
        text: "site.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "site.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "site.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "site.date_changed",
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
