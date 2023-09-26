import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

const plugin = {
  install(Vue, options) {
    dayjs.extend(advancedFormat);
    Vue.prototype.$dayjs = dayjs;
  },
};

export default plugin;
