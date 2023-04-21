import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  drawerState: true,
  drawerRightState: null,
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
  drawerRightActiveColor: "deep-orange",
  recentUrls: [],
  recentUrlsState: true,
  shortcuts: [],
  lang: "ee",
  formSections: {},
  globalNotificationState: true,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
