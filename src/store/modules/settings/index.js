import Vue from "vue";
import isEmpty from "lodash/isEmpty";

const state = {
  recentUrls: [],
  recentUrlsState: false,
  // Todo: get rid of object
  appSettings: {
    bodyColor: "grey lighten-5",
    bodyDark: false,
    bodyActiveColor: "deep-orange",
    bodyActiveColorDark: true,
    navbarColor: "blue-grey",
    navbarDark: true,
    drawerLeftColor: "white",
    drawerLeftDark: false,
    drawerLeftActiveColor: "black",
    drawerRightColor: "white",
    drawerRightDark: false,
    drawerRightActiveColor: "deep-orange"
  },
  drawerState: null,
  drawerRightState: null,
  shortcuts: []
};

const getters = {};

const actions = {
  updateSettings({ commit }, settings) {
    commit("UPDATE_SETTINGS", settings);
  },

  updateDrawerState({ commit }, boolVal) {
    commit("UPDATE_DRAWER_STATE", boolVal);
  },

  updateDrawerRightState({ commit }, boolVal) {
    commit("UPDATE_DRAWER_RIGHT_STATE", boolVal);
  },

  updateShortcuts({ commit }, shortcuts) {
    commit("UPDATE_SHORTCUTS", shortcuts);
  }
};

const mutations = {
  UPDATE_SETTINGS(state, settings) {
    state.appSettings = settings;
  },

  UPDATE_DRAWER_STATE(state, payload) {
    state.drawerState = payload;
  },

  UPDATE_DRAWER_RIGHT_STATE(state, payload) {
    state.drawerRightState = payload;
  },

  UPDATE_SHORTCUTS(state, payload) {
    state.shortcuts = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
