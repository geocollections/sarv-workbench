import Vue from "vue";

const mutations = {
  UPDATE_DRAWER_STATE(state, payload) {
    state.drawerState = payload;
  },

  UPDATE_DRAWER_RIGHT_STATE(state, payload) {
    state.drawerRightState = payload;
  },

  UPDATE_BODY_COLOR(state, payload) {
    state.bodyColor = payload;
  },

  UPDATE_BODY_DARK(state, payload) {
    state.bodyDark = payload;
  },

  UPDATE_BODY_ACTIVE_COLOR(state, payload) {
    state.bodyActiveColor = payload;
  },

  UPDATE_BODY_ACTIVE_COLOR_DARK(state, payload) {
    state.bodyActiveColorDark = payload;
  },

  UPDATE_NAVBAR_COLOR(state, payload) {
    state.navbarColor = payload;
  },

  UPDATE_NAVBAR_DARK(state, payload) {
    state.navbarDark = payload;
  },

  UPDATE_DRAWER_LEFT_COLOR(state, payload) {
    state.drawerLeftColor = payload;
  },

  UPDATE_DRAWER_LEFT_DARK(state, payload) {
    state.drawerLeftDark = payload;
  },

  UPDATE_DRAWER_LEFT_ACTIVE_COLOR(state, payload) {
    state.drawerLeftActiveColor = payload;
  },

  UPDATE_DRAWER_RIGHT_COLOR(state, payload) {
    state.drawerRightColor = payload;
  },

  UPDATE_DRAWER_RIGHT_DARK(state, payload) {
    state.drawerRightDark = payload;
  },

  UPDATE_DRAWER_RIGHT_ACTIVE_COLOR(state, payload) {
    state.drawerRightActiveColor = payload;
  },

  UPDATE_RECENT_URLS: (state, payload) => {
    let recentUrls = [...state.recentUrls, payload];

    if (recentUrls.length > 10) recentUrls.shift();

    // If after removing is still over 10 then empty that list;
    if (recentUrls.length > 10) recentUrls = [];

    Vue.set(state, "recentUrls", [...recentUrls]);
  },

  UPDATE_RECENT_URLS_STATE(state, payload) {
    state.recentUrlsState = payload;
  },

  SET_SHORTCUTS(state, payload) {
    Vue.set(state, "shortcuts", [...payload]);
  },

  ADD_DEFAULT_SHORTCUT(state) {
    state.shortcuts.push({ title: "", path: "", isAlwaysVisible: false });
  },

  REMOVE_SHORTCUT(state, payload) {
    state.shortcuts.splice(payload, 1);
  }
};

export default mutations;
