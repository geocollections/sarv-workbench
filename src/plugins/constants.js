const defaultOptions = {
  IMAGE_URL: `${process.env.VUE_APP_FILES_URL}/`,
};

const constants = {
  install(Vue, options) {
    Vue.prototype.$constants = { ...defaultOptions, ...options };
  },
};

export default constants;
