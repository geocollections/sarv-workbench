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
        locality: {
          title: "locality.locality",
          value: null,
          lookUpType: "icontains",
          fields: ["locality", "locality_en"],
          type: "multi",
        },
        locality_en: {
          title: "locality.locality_en",
          value: null,
          lookUpType: "icontains",
        },
        number: {
          title: "locality.number",
          value: null,
          lookUpType: "icontains",
        },
        code: {
          title: "locality.code",
          value: null,
          lookUpType: "icontains",
        },
        type: {
          title: "locality.type__id",
          value: null,
          lookUpType: "icontains",
        },
        parent: {
          title: "locality.parent__id",
          value: null,
          lookUpType: "icontains",
        },
        latitude: {
          title: "locality.latitude",
          value: null,
          lookUpType: "icontains",
        },
        longitude: {
          title: "locality.longitude",
          value: null,
          lookUpType: "icontains",
        },
        elevation: {
          title: "locality.elevation",
          value: null,
          lookUpType: "icontains",
        },
        coord_det_precision: {
          title: "locality.coord_det_precision__id",
          value: null,
          lookUpType: "icontains",
        },
        coord_det_method: {
          title: "locality.coord_det_method__id",
          value: null,
          lookUpType: "icontains",
        },
        coord_det_agent: {
          title: "locality.coord_det_agent__id",
          value: null,
          lookUpType: "icontains",
        },
        coord_system: {
          title: "locality.coord_system",
          value: null,
          lookUpType: "icontains",
        },
        epsg: {
          title: "locality.epsg",
          value: null,
          lookUpType: "icontains",
        },
        coordx: {
          title: "locality.coordx",
          value: null,
          lookUpType: "icontains",
        },
        coordy: {
          title: "locality.coordy",
          value: null,
          lookUpType: "icontains",
        },
        extent: {
          title: "locality.extent__id",
          value: null,
          lookUpType: "icontains",
        },
        country: {
          title: "locality.country__id",
          value: null,
          lookUpType: "icontains",
          fields: ["country__value", "country__value_en"],
        },
        maakond: {
          title: "locality.maakond__id",
          value: null,
          lookUpType: "icontains",
        },
        vald: {
          title: "locality.vald__id",
          value: null,
          lookUpType: "icontains",
        },
        asustusyksus: {
          title: "locality.asustusyksus__id",
          value: null,
          lookUpType: "icontains",
        },
        remarks_location: {
          title: "locality.remarks_location",
          value: null,
          lookUpType: "icontains",
        },
        depth: {
          title: "locality.depth",
          value: null,
          lookUpType: "icontains",
        },
        stratigraphy_base: {
          title: "locality.stratigraphy_base__id",
          value: null,
          lookUpType: "icontains",
        },
        stratigraphy_top: {
          title: "locality.stratigraphy_top__id",
          value: null,
          lookUpType: "icontains",
        },
        stratigraphy_base_free: {
          title: "locality.stratigraphy_base_free",
          value: null,
          lookUpType: "icontains",
        },
        stratigraphy_top_free: {
          title: "locality.stratigraphy_top_free",
          value: null,
          lookUpType: "icontains",
        },
        eelis: {
          title: "locality.eelis",
          value: null,
          lookUpType: "icontains",
        },
        maaamet_pa_id: {
          title: "locality.maaamet_pa_id",
          value: null,
          lookUpType: "icontains",
        },
        egt_id: {
          title: "locality.egt_id",
          value: null,
          lookUpType: "icontains",
        },
        mindat_id: {
          title: "locality.mindat_id",
          value: null,
          lookUpType: "icontains",
        },
        is_private: {
          title: "locality.is_private",
          value: null,
          lookUpType: "icontains",
        },
        remarks: {
          title: "locality.remarks",
          value: null,
          lookUpType: "icontains",
        },
        user_added: {
          title: "locality.user_added",
          value: null,
          lookUpType: "icontains",
        },
        date_added: {
          title: "locality.date_added",
          value: null,
          lookUpType: "icontains",
        },
        user_changed: {
          title: "locality.user_changed",
          value: null,
          lookUpType: "icontains",
        },
        date_changed: {
          title: "locality.date_changed",
          value: null,
          lookUpType: "icontains",
        },
        id: {
          title: "locality.id",
          value: null,
          lookUpType: "icontains",
        },
        selection_id: {
          title: "locality.id",
          value: null,
          lookUpType: "icontains",
          fields: ["selection__selection"],
        },
        selection: {
          title: "locality.id",
          value: null,
          lookUpType: "icontains",
          fields: ["selection__selection__name"],
        },
      },
      mainIds: [
        "id",
        "locality",
        "number",
        "country",
        "user_added",
        "selection_id",
        "selection",
      ],
      extraIds: [
        "locality_en",
        "code",
        "type",
        "parent",
        "latitude",
        "longitude",
        "elevation",
        "coord_det_precision",
        "coord_det_method",
        "coord_det_agent",
        "coord_system",
        "epsg",
        "coordx",
        "coordy",
        "extent",
        "maakond",
        "vald",
        "asustusyksus",
        "remarks_location",
        "depth",
        "stratigraphy_base",
        "stratigraphy_top",
        "stratigraphy_base_free",
        "stratigraphy_top_free",
        "eelis",
        "maaamet_pa_id",
        "egt_id",
        "mindat_id",
        "is_private",
        "remarks",
        "date_added",
        "user_changed",
        "date_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "locality.id",
        show: true,
      },
      {
        value: "locality",
        text: "locality.locality",
        show: true,
      },
      {
        value: "number",
        text: "locality.number",
        show: true,
      },
      {
        value: "country__value",
        text: "locality.country__value",
        show: true,
      },
      {
        value: "user_added",
        text: "locality.user_added",
        show: true,
      },
      {
        value: "link",
        text: "locality.link",
        sortable: false,
        show: true,
      },
      {
        value: "locality_en",
        text: "locality.locality_en",
        show: false,
      },
      {
        value: "code",
        text: "locality.code",
        show: false,
      },
      {
        value: "type__id",
        text: "locality.type__id",
        show: false,
      },
      {
        value: "type__value",
        text: "locality.type__value",
        show: false,
      },
      {
        value: "type__value_en",
        text: "locality.type__value_en",
        show: false,
      },
      {
        value: "parent__id",
        text: "locality.parent__id",
        show: false,
      },
      {
        value: "parent__locality",
        text: "locality.parent__locality",
        show: false,
      },
      {
        value: "parent__locality_en",
        text: "locality.parent__locality_en",
        show: false,
      },
      {
        value: "latitude",
        text: "locality.latitude",
        show: false,
      },
      {
        value: "longitude",
        text: "locality.longitude",
        show: false,
      },
      {
        value: "elevation",
        text: "locality.elevation",
        show: false,
      },
      {
        value: "coord_det_precision__id",
        text: "locality.coord_det_precision__id",
        show: false,
      },
      {
        value: "coord_det_precision__value",
        text: "locality.coord_det_precision__value",
        show: false,
      },
      {
        value: "coord_det_precision__value_en",
        text: "locality.coord_det_precision__value_en",
        show: false,
      },
      {
        value: "coord_det_method__id",
        text: "locality.coord_det_method__id",
        show: false,
      },
      {
        value: "coord_det_method__value",
        text: "locality.coord_det_method__value",
        show: false,
      },
      {
        value: "coord_det_method__value_en",
        text: "locality.coord_det_method__value_en",
        show: false,
      },
      {
        value: "coord_det_agent__id",
        text: "locality.coord_det_agent__id",
        show: false,
      },
      {
        value: "coord_det_agent__agent",
        text: "locality.coord_det_agent__agent",
        show: false,
      },
      {
        value: "coord_system",
        text: "locality.coord_system",
        show: false,
      },
      {
        value: "epsg",
        text: "locality.epsg",
        show: false,
      },
      {
        value: "coordx",
        text: "locality.coordx",
        show: false,
      },
      {
        value: "coordy",
        text: "locality.coordy",
        show: false,
      },
      {
        value: "extent__id",
        text: "locality.extent__id",
        show: false,
      },
      {
        value: "extent__value",
        text: "locality.extent__value",
        show: false,
      },
      {
        value: "extent__value_en",
        text: "locality.extent__value_en",
        show: false,
      },
      {
        value: "country__id",
        text: "locality.country__id",
        show: false,
      },
      {
        value: "country__value_en",
        text: "locality.country__value_en",
        show: false,
      },
      {
        value: "maakond__id",
        text: "locality.maakond__id",
        show: false,
      },
      {
        value: "maakond__maakond",
        text: "locality.maakond__maakond",
        show: false,
      },
      {
        value: "maakond__maakond_en",
        text: "locality.maakond__maakond_en",
        show: false,
      },
      {
        value: "vald__id",
        text: "locality.vald__id",
        show: false,
      },
      {
        value: "vald__vald",
        text: "locality.vald__vald",
        show: false,
      },
      {
        value: "vald__vald_en",
        text: "locality.vald__vald_en",
        show: false,
      },
      {
        value: "asustusyksus__id",
        text: "locality.asustusyksus__id",
        show: false,
      },
      {
        value: "asustusyksus__asustusyksus",
        text: "locality.asustusyksus__asustusyksus",
        show: false,
      },
      {
        value: "asustusyksus__asustusyksus_en",
        text: "locality.asustusyksus__asustusyksus_en",
        show: false,
      },
      {
        value: "remarks_location",
        text: "locality.remarks_location",
        show: false,
      },
      {
        value: "depth",
        text: "locality.depth",
        show: false,
      },
      {
        value: "stratigraphy_base__id",
        text: "locality.stratigraphy_base__id",
        show: false,
      },
      {
        value: "stratigraphy_base__stratigraphy",
        text: "locality.stratigraphy_base__stratigraphy",
        show: false,
      },
      {
        value: "stratigraphy_base__stratigraphy_en",
        text: "locality.stratigraphy_base__stratigraphy_en",
        show: false,
      },
      {
        value: "stratigraphy_top__id",
        text: "locality.stratigraphy_top__id",
        show: false,
      },
      {
        value: "stratigraphy_top__stratigraphy",
        text: "locality.stratigraphy_top__stratigraphy",
        show: false,
      },
      {
        value: "stratigraphy_top__stratigraphy_en",
        text: "locality.stratigraphy_top__stratigraphy_en",
        show: false,
      },
      {
        value: "stratigraphy_base_free",
        text: "locality.stratigraphy_base_free",
        show: false,
      },
      {
        value: "stratigraphy_top_free",
        text: "locality.stratigraphy_top_free",
        show: false,
      },
      {
        value: "eelis",
        text: "locality.eelis",
        show: false,
      },
      {
        value: "maaamet_pa_id",
        text: "locality.maaamet_pa_id",
        show: false,
      },
      {
        value: "is_private",
        text: "locality.is_private",
        show: false,
      },
      {
        value: "remarks",
        text: "locality.remarks",
        show: false,
      },
      {
        value: "date_added",
        text: "locality.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "locality.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "locality.date_changed",
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
