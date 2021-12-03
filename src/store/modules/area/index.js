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
        area_ha: {
          lookUpType: "icontains",
          title: "area.area_ha",
          value: null,
        },
        area_type: {
          lookUpType: "icontains",
          title: "area.area_type__id",
          value: null,
          fields: ["area_type__name", "area_type__name_en"],
          type: "multi",
        },
        date_added: {
          lookUpType: "icontains",
          title: "area.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "area.date_changed",
          value: null,
        },
        deposit_area_ha: {
          lookUpType: "icontains",
          title: "area.deposit_area_ha",
          value: null,
        },
        description: {
          lookUpType: "icontains",
          title: "area.description",
          value: null,
        },
        description_en: {
          lookUpType: "icontains",
          title: "area.description_en",
          value: null,
        },
        eelis: {
          lookUpType: "icontains",
          title: "area.eelis",
          value: null,
        },
        egf: {
          lookUpType: "icontains",
          title: "area.egf",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "area.id",
          value: null,
        },
        maakond: {
          lookUpType: "icontains",
          title: "area.maakond__id",
          value: null,
          fields: ["maakond__maakond", "maakond__maakond_en"],
          type: "multi",
        },
        maardla: {
          lookUpType: "icontains",
          title: "area.maardla",
          value: null,
        },
        name: {
          lookUpType: "icontains",
          title: "area.name",
          value: null,
          fields: ["name", "name_en"],
          type: "multi",
        },
        name_en: {
          lookUpType: "icontains",
          title: "area.name_en",
          value: null,
        },
        polygon: {
          lookUpType: "icontains",
          title: "area.polygon",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "area.remarks",
          value: null,
        },
        text1: {
          lookUpType: "icontains",
          title: "area.text1",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "area.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "area.user_changed",
          value: null,
        },
      },
      mainIds: ["name", "area_type", "area_ha", "maakond"],
      extraIds: [
        "date_added",
        "date_changed",
        "deposit_area_ha",
        "description",
        "description_en",
        "eelis",
        "egf",
        "id",
        "maardla",
        "name_en",
        "polygon",
        "remarks",
        "text1",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "name",
        text: "area.name",
        show: true,
      },
      {
        value: "maardla",
        text: "area.maardla",
        show: true,
      },
      {
        value: "eelis",
        text: "area.eelis",
        show: true,
      },
      {
        value: "area_ha",
        text: "area.area_ha",
        show: true,
      },
      {
        value: "deposit_area_ha",
        text: "area.deposit_area_ha",
        show: true,
      },
      {
        value: "name_en",
        text: "area.name_en",
        show: false,
      },
      {
        value: "area_type__id",
        text: "area.area_type__id",
        show: false,
      },
      {
        value: "area_type__name",
        text: "area.area_type__name",
        show: false,
      },
      {
        value: "area_type__name_en",
        text: "area.area_type__name_en",
        show: false,
      },
      {
        value: "egf",
        text: "area.egf",
        show: false,
      },
      {
        value: "maakond__id",
        text: "area.maakond__id",
        show: false,
      },
      {
        value: "maakond__maakond",
        text: "area.maakond__maakond",
        show: false,
      },
      {
        value: "maakond__maakond_en",
        text: "area.maakond__maakond_en",
        show: false,
      },
      {
        value: "description",
        text: "area.description",
        show: false,
      },
      {
        value: "description_en",
        text: "area.description_en",
        show: false,
      },
      {
        value: "remarks",
        text: "area.remarks",
        show: false,
      },
      {
        value: "text1",
        text: "area.text1",
        show: false,
      },
      {
        value: "polygon",
        text: "area.polygon",
        show: false,
      },
      {
        value: "user_added",
        text: "area.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "area.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "area.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "area.date_changed",
        show: false,
      },
      {
        value: "id",
        text: "area.id",
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
