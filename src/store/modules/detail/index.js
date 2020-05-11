import { cloneDeep } from "lodash";

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
  specimenDetail: null,
  collectionDetail: null,
  initialEditViewDataHasChangedState: false
};

const getters = {};

const actions = {
  saveFields({ commit }, payload) {
    commit("SAVE_FIELDS", payload);
  },

  resetFields({ commit }, key) {
    commit("RESET_FIELDS", key);
  },

  updateInitialEditViewDataHasChangedState({ commit }, payload) {
    let initData = cloneDeep(payload.initialData);
    let currentData = cloneDeep(payload.currentData);
    // Removing abstract from diff check because of newline (\n) issue at the end giving false positives
    if (initData?.abstract) delete initData.abstract;
    if (currentData?.abstract) delete currentData.abstract;

    let boolVal = JSON.stringify(initData) !== JSON.stringify(currentData);
    commit("UPDATE_INITIAL_EDIT_VIEW_DATA_HAS_CHANGED_STATE", boolVal);
  },

  setInitialEditViewDataHasChangedState({ commit }, bool) {
    commit("UPDATE_INITIAL_EDIT_VIEW_DATA_HAS_CHANGED_STATE", bool);
  }
};

const mutations = {
  SAVE_FIELDS(state, payload) {
    state[payload.key] = payload.value;
  },

  RESET_FIELDS(state, payload) {
    state[payload] = null;
  },

  UPDATE_INITIAL_EDIT_VIEW_DATA_HAS_CHANGED_STATE(state, payload) {
    state.initialEditViewDataHasChangedState = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
