const state = {
  photoArchive: null,
  photoArchiveKeywords: null,
  specimenImage: null,
  specimenImageKeywords: null,
  otherFiles: null,
  otherFilesArchiveKeywords: null,
  digitisedReference: null,
  digitisedReferenceKeywords: null,
  imagesetDetail: null,
  referenceDetail: null,
  taxonDetail: null,
  specimenDetail: null,
  collectionDetail: null
};

const getters = {};

const actions = {
  saveFields({ commit }, payload) {
    commit("SAVE_FIELDS", payload);
  },

  resetFields({ commit }, key) {
    commit("RESET_FIELDS", key);
  }
};

const mutations = {
  SAVE_FIELDS(state, payload) {
    state[payload.key] = payload.value;
  },

  RESET_FIELDS(state, payload) {
    state[payload] = null;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
