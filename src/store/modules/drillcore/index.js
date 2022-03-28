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
          title: "drillcore.agent__id",
          value: null,
        },
        box_numbers: {
          lookUpType: "icontains",
          title: "drillcore.box_numbers",
          value: null,
        },
        boxes: {
          lookUpType: "icontains",
          title: "drillcore.boxes",
          value: null,
        },
        database: {
          lookUpType: "icontains",
          title: "drillcore.database__id",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "drillcore.date_added",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "drillcore.date_changed",
          value: null,
        },
        depository: {
          lookUpType: "icontains",
          title: "drillcore.depository__id",
          value: null,
        },
        depth: {
          lookUpType: "icontains",
          title: "drillcore.depth",
          value: null,
          fields: ["depth", "locality__depth"],
          type: "multi",
        },
        direction_lr: {
          lookUpType: "icontains",
          title: "drillcore.direction_lr",
          value: null,
        },
        drillcore: {
          lookUpType: "icontains",
          title: "drillcore.drillcoreAndLocality",
          value: null,
          fields: [
            "drillcore",
            "drillcore_en",
            "locality__locality",
            "locality__locality_en",
          ],
          type: "multi",
        },
        drillcore_en: {
          lookUpType: "icontains",
          title: "drillcore.drillcore_en",
          value: null,
        },
        gid: {
          lookUpType: "icontains",
          title: "drillcore.gid",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "drillcore.drillcoreId",
          value: null,
        },
        igsn: {
          lookUpType: "icontains",
          title: "drillcore.igsn",
          value: null,
        },
        is_private: {
          lookUpType: "icontains",
          title: "drillcore.is_private",
          value: null,
        },
        locality: {
          lookUpType: "icontains",
          title: "drillcore.locality__id",
          value: null,
        },
        location: {
          lookUpType: "icontains",
          title: "drillcore.location",
          value: null,
        },
        number_meters: {
          lookUpType: "icontains",
          title: "drillcore.number_meters",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "drillcore.remarks",
          value: null,
        },
        storage: {
          lookUpType: "icontains",
          title: "drillcore.storage",
          value: null,
          fields: ["storage__location", "depository__value"],
          type: "multi",
        },
        uid: {
          lookUpType: "icontains",
          title: "drillcore.uid",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "drillcore.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "drillcore.user_changed",
          value: null,
        },
        year: {
          lookUpType: "icontains",
          title: "drillcore.year",
          value: null,
        },
      },
      mainIds: ["drillcore", "id", "boxes", "depth", "storage"],
      extraIds: [
        "agent",
        "box_numbers",
        "boxes",
        "database",
        "date_added",
        "date_changed",
        "depository",
        "depth",
        "direction_lr",
        "drillcore",
        "drillcore_en",
        "gid",
        "id",
        "igsn",
        "is_private",
        "locality",
        "location",
        "number_meters",
        "remarks",
        "storage",
        "uid",
        "user_added",
        "user_changed",
        "year",
      ],
    },
    headers: [
      {
        value: "id",
        text: "drillcore.id",
        show: true,
      },
      {
        value: "drillcore",
        text: "drillcore.drillcore",
        show: true,
      },
      {
        value: "depth",
        text: "drillcore.depth",
        show: true,
      },
      {
        value: "boxes",
        text: "drillcore.boxes",
        show: true,
      },
      {
        value: "box_numbers",
        text: "drillcore.box_numbers",
        show: true,
      },
      {
        value: "location",
        text: "drillcore.location",
        show: true,
      },
      {
        value: "year",
        text: "drillcore.year",
        show: true,
      },
      {
        value: "agent__agent",
        text: "drillcore.agent__agent",
        show: true,
      },
      {
        value: "remarks",
        text: "drillcore.remarks",
        show: true,
      },
      {
        value: "link",
        text: "drillcore.link",
        sortable: false,
        show: true,
      },
      {
        value: "drillcore_en",
        text: "drillcore.drillcore_en",
        show: false,
      },
      {
        value: "locality__id",
        text: "drillcore.locality__id",
        show: false,
      },
      {
        value: "locality__locality",
        text: "drillcore.locality__locality",
        show: false,
      },
      {
        value: "locality__locality_en",
        text: "drillcore.locality__locality_en",
        show: false,
      },
      {
        value: "agent__id",
        text: "drillcore.agent__id",
        show: false,
      },
      {
        value: "depository__id",
        text: "drillcore.depository__id",
        show: false,
      },
      {
        value: "depository__value",
        text: "drillcore.depository__value",
        show: false,
      },
      {
        value: "depository__value_en",
        text: "drillcore.depository__value_en",
        show: false,
      },
      {
        value: "storage__id",
        text: "drillcore.storage__id",
        show: false,
      },
      {
        value: "storage__location",
        text: "drillcore.storage__location",
        show: false,
      },
      {
        value: "number_meters",
        text: "drillcore.number_meters",
        show: false,
      },
      {
        value: "direction_lr",
        text: "drillcore.direction_lr",
        show: false,
      },
      {
        value: "igsn",
        text: "drillcore.igsn",
        show: false,
      },
      {
        value: "database__id",
        text: "drillcore.database__id",
        show: false,
      },
      {
        value: "database__acronym",
        text: "drillcore.database__acronym",
        show: false,
      },
      {
        value: "uid",
        text: "drillcore.uid",
        show: false,
      },
      {
        value: "gid",
        text: "drillcore.gid",
        show: false,
      },
      {
        value: "is_private",
        text: "drillcore.is_private",
        show: false,
      },
      {
        value: "user_added",
        text: "drillcore.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "drillcore.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "drillcore.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "drillcore.date_changed",
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
