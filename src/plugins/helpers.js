import helpers from "@/helpers/helpers";

const plugin = {
  install(Vue, options) {
    Vue.helpers = helpers;
    Vue.prototype.$helpers = helpers;
  },
};

export default plugin;
