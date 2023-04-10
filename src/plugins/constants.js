const defaultOptions = {
  IMAGE_URL: "https://edit4.geocollections.info/files/",
  // location.hostname === "localhost"
  //   ? "https://edit2.geocollections.info/y4fkz2fr/"
  //   : "/y4fkz2fr/",
};

const constants = {
  install(Vue, options) {
    Vue.prototype.$constants = { ...defaultOptions, ...options };
  },
};

export default constants;
