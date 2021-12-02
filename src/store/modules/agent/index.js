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
        address: {
          lookUpType: "icontains",
          title: "agent.address",
          value: null,
        },
        address1: {
          lookUpType: "icontains",
          title: "agent.address1",
          value: null,
        },
        address2: {
          lookUpType: "icontains",
          title: "agent.address2",
          value: null,
        },
        agent: {
          lookUpType: "icontains",
          title: "agent.agent",
          value: null,
        },
        country: {
          lookUpType: "icontains",
          title: "agent.country__id",
          value: null,
        },
        country_txt: {
          lookUpType: "icontains",
          title: "agent.country_txt",
          value: null,
        },
        date_added: {
          lookUpType: "icontains",
          title: "agent.date_added",
          value: null,
        },
        date_born: {
          lookUpType: "icontains",
          title: "agent.date_born",
          value: null,
        },
        date_changed: {
          lookUpType: "icontains",
          title: "agent.date_changed",
          value: null,
        },
        date_deceased: {
          lookUpType: "icontains",
          title: "agent.date_deceased",
          value: null,
        },
        email: {
          lookUpType: "icontains",
          title: "agent.email",
          value: null,
        },
        forename: {
          lookUpType: "icontains",
          title: "agent.forename",
          value: null,
        },
        http: {
          lookUpType: "icontains",
          title: "agent.http",
          value: null,
        },
        id: {
          lookUpType: "icontains",
          title: "agent.id",
          value: null,
        },
        institution: {
          lookUpType: "icontains",
          title: "agent.institution__id",
          value: null,
        },
        institution_name: {
          lookUpType: "icontains",
          title: "agent.institution_name",
          value: null,
        },
        institution_name_en: {
          lookUpType: "icontains",
          title: "agent.institution_name_en",
          value: null,
        },
        middlename: {
          lookUpType: "icontains",
          title: "agent.middlename",
          value: null,
        },
        new_name: {
          lookUpType: "icontains",
          title: "agent.new_name",
          value: null,
        },
        old_name: {
          lookUpType: "icontains",
          title: "agent.old_name",
          value: null,
        },
        orcid: {
          lookUpType: "icontains",
          title: "agent.orcid",
          value: null,
        },
        phone: {
          lookUpType: "icontains",
          title: "agent.phone",
          value: null,
        },
        profession: {
          lookUpType: "icontains",
          title: "agent.profession",
          value: null,
        },
        profession_en: {
          lookUpType: "icontains",
          title: "agent.profession_en",
          value: null,
        },
        remarks: {
          lookUpType: "icontains",
          title: "agent.remarks",
          value: null,
        },
        surename: {
          lookUpType: "icontains",
          title: "agent.surename",
          value: null,
        },
        title: {
          lookUpType: "icontains",
          title: "agent.title",
          value: null,
        },
        type: {
          lookUpType: "icontains",
          title: "agent.type__id",
          value: null,
        },
        user_added: {
          lookUpType: "icontains",
          title: "agent.user_added",
          value: null,
        },
        user_changed: {
          lookUpType: "icontains",
          title: "agent.user_changed",
          value: null,
        },
      },
      mainIds: ["id", "agent", "forename", "surename"],
      extraIds: [
        "address",
        "address1",
        "address2",
        "country",
        "country_txt",
        "date_added",
        "date_born",
        "date_changed",
        "date_deceased",
        "email",
        "http",
        "institution",
        "institution_name",
        "institution_name_en",
        "middlename",
        "new_name",
        "old_name",
        "orcid",
        "phone",
        "profession",
        "profession_en",
        "remarks",
        "title",
        "type",
        "user_added",
        "user_changed",
      ],
    },
    headers: [
      {
        value: "id",
        text: "agent.id",
        show: true,
      },
      {
        value: "agent",
        text: "agent.agent",
        show: true,
      },
      {
        value: "forename",
        text: "agent.forename",
        show: true,
      },
      {
        value: "surename",
        text: "agent.surename",
        show: true,
      },
      {
        value: "institution_name",
        text: "agent.institution_name",
        show: true,
      },
      {
        value: "remarks",
        text: "agent.remarks",
        show: true,
      },
      {
        value: "type.value",
        text: "agent.type__value",
        show: false,
      },
      {
        value: "type.value_en",
        text: "agent.type__value_en",
        show: false,
      },
      {
        value: "middlename",
        text: "agent.middlename",
        show: false,
      },
      {
        value: "title",
        text: "agent.title",
        show: false,
      },
      {
        value: "profession",
        text: "agent.profession",
        show: false,
      },
      {
        value: "profession_en",
        text: "agent.profession_en",
        show: false,
      },
      {
        value: "institution.agent",
        text: "agent.institution__agent",
        show: false,
      },
      {
        value: "institution_name_en",
        text: "agent.institution_name_en",
        show: false,
      },
      {
        value: "address",
        text: "agent.address",
        show: false,
      },
      {
        value: "address1",
        text: "agent.address1",
        show: false,
      },
      {
        value: "address2",
        text: "agent.address2",
        show: false,
      },
      {
        value: "country.value",
        text: "agent.country__value",
        show: false,
      },
      {
        value: "country.value_en",
        text: "agent.country__value_en",
        show: false,
      },
      {
        value: "country_txt",
        text: "agent.country_txt",
        show: false,
      },
      {
        value: "phone",
        text: "agent.phone",
        show: false,
      },
      {
        value: "email",
        text: "agent.email",
        show: false,
      },
      {
        value: "http",
        text: "agent.http",
        show: false,
      },
      {
        value: "old_name",
        text: "agent.old_name",
        show: false,
      },
      {
        value: "new_name",
        text: "agent.new_name",
        show: false,
      },
      {
        value: "date_born",
        text: "agent.date_born",
        show: false,
      },
      {
        value: "date_deceased",
        text: "agent.date_deceased",
        show: false,
      },
      {
        value: "orcid",
        text: "agent.orcid",
        show: false,
      },
      {
        value: "user_added",
        text: "agent.user_added",
        show: false,
      },
      {
        value: "date_added",
        text: "agent.date_added",
        show: false,
      },
      {
        value: "user_changed",
        text: "agent.user_changed",
        show: false,
      },
      {
        value: "date_changed",
        text: "agent.date_changed",
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
