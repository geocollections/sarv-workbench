import { cloneDeep } from "lodash";

const actions = {
  updateDrawerState({ commit }, boolVal) {
    commit("UPDATE_DRAWER_STATE", boolVal);
  },

  updateDrawerRightState({ commit }, boolVal) {
    commit("UPDATE_DRAWER_RIGHT_STATE", boolVal);
  },

  updateBodyColor({ commit }, color) {
    commit("UPDATE_BODY_COLOR", color);
  },

  updateBodyDark({ commit }, boolVal) {
    commit("UPDATE_BODY_DARK", boolVal);
  },

  updateBodyActiveColor({ commit }, color) {
    commit("UPDATE_BODY_ACTIVE_COLOR", color);
  },

  updateBodyActiveColorDark({ commit }, boolVal) {
    commit("UPDATE_BODY_ACTIVE_COLOR_DARK", boolVal);
  },

  updateNavbarColor({ commit }, color) {
    commit("UPDATE_NAVBAR_COLOR", color);
  },

  updateNavbarDark({ commit }, boolVal) {
    commit("UPDATE_NAVBAR_DARK", boolVal);
  },

  updateDrawerLeftColor({ commit }, color) {
    commit("UPDATE_DRAWER_LEFT_COLOR", color);
  },

  updateDrawerLeftDark({ commit }, boolVal) {
    commit("UPDATE_DRAWER_LEFT_DARK", boolVal);
  },

  updateDrawerLeftActiveColor({ commit }, color) {
    commit("UPDATE_DRAWER_LEFT_ACTIVE_COLOR", color);
  },

  updateDrawerRightColor({ commit }, color) {
    commit("UPDATE_DRAWER_RIGHT_COLOR", color);
  },

  updateDrawerRightDark({ commit }, boolVal) {
    commit("UPDATE_DRAWER_RIGHT_DARK", boolVal);
  },

  updateDrawerLeftRightColor({ commit }, color) {
    commit("UPDATE_DRAWER_RIGHT_ACTIVE_COLOR", color);
  },

  updateRecentUrls: ({ commit }, recentUrls) => {
    commit("UPDATE_RECENT_URLS", recentUrls);
  },

  updateRecentUrlsState({ commit }, boolVal) {
    commit("UPDATE_RECENT_URLS_STATE", boolVal);
  },

  setShortcuts({ commit }, shortcuts) {
    commit("SET_SHORTCUTS", shortcuts);
  },

  addShortcut({ commit }) {
    commit("ADD_DEFAULT_SHORTCUT");
  },

  removeShortcut({ commit }, index) {
    commit("REMOVE_SHORTCUT", index);
  },

  shortcutUpdateTitle({ state, commit }, payload) {
    let shortcuts = cloneDeep(state.shortcuts);
    shortcuts[payload.index].title = payload.event;
    commit("SET_SHORTCUTS", shortcuts);
  },

  shortcutUpdatePath({ state, commit }, payload) {
    let shortcuts = cloneDeep(state.shortcuts);
    shortcuts[payload.index].path = payload.event;
    commit("SET_SHORTCUTS", shortcuts);
  },

  shortcutUpdateIsAlwaysVisible({ state, commit }, payload) {
    let shortcuts = cloneDeep(state.shortcuts);
    shortcuts[payload.index].isAlwaysVisible = payload.event;
    commit("SET_SHORTCUTS", shortcuts);
  },

  updateLang({ commit }, lang) {
    commit("UPDATE_LANG", lang);
  },

  updateFormSections({ state, commit }, payload) {
    let clonedPayload = cloneDeep(payload);
    commit("UPDATE_FORM_SECTIONS", clonedPayload);
  },

  resetColors({ commit }) {
    commit("UPDATE_BODY_COLOR", "grey lighten-5");
    commit("UPDATE_BODY_DARK", false);
    commit("UPDATE_BODY_ACTIVE_COLOR", "deep-orange");
    commit("UPDATE_BODY_ACTIVE_COLOR_DARK", true);
    commit("UPDATE_NAVBAR_COLOR", "blue-grey");
    commit("UPDATE_NAVBAR_DARK", true);
    commit("UPDATE_DRAWER_LEFT_COLOR", "white");
    commit("UPDATE_DRAWER_LEFT_DARK", false);
    commit("UPDATE_DRAWER_LEFT_ACTIVE_COLOR", "black");
    commit("UPDATE_DRAWER_RIGHT_COLOR", "white");
    commit("UPDATE_DRAWER_RIGHT_DARK", false);
    commit("UPDATE_DRAWER_RIGHT_ACTIVE_COLOR", "deep-orange");
  }
};

export default actions;
