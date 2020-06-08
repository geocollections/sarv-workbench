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
    // Removing ckeditor fields from some components because of newline (\n) issue at the end giving false positives
    if (initData?.abstract) delete initData.abstract;
    if (currentData?.abstract) delete currentData.abstract;
    if (initData?.abstract_en) delete initData.abstract_en;
    if (currentData?.abstract_en) delete currentData.abstract_en;
    if (initData?.description) delete initData.description;
    if (currentData?.description) delete currentData.description;
    if (initData?.description_en) delete initData.description_en;
    if (currentData?.description_en) delete currentData.description_en;
    if (initData?.definition) delete initData.definition;
    if (currentData?.definition) delete currentData.definition;
    if (initData?.definition_en) delete initData.definition_en;
    if (currentData?.definition_en) delete currentData.definition_en;
    if (initData?.remarks) delete initData.remarks;
    if (currentData?.remarks) delete currentData.remarks;
    if (initData?.text_et) delete initData.text_et;
    if (currentData?.text_et) delete currentData.text_et;
    if (initData?.text_en) delete initData.text_en;
    if (currentData?.text_en) delete currentData.text_en;
    if (initData?.content_et) delete initData.content_et;
    if (currentData?.content_et) delete currentData.content_et;
    if (initData?.content_en) delete initData.content_en;
    if (currentData?.content_en) delete currentData.content_en;

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
