const defaultOptions = {
  // IMAGE_URL:
  //   location.hostname === "localhost"
  //     ? "https://edit2.geocollections.info/y4fkz2fr/"
  //     : "/y4fkz2fr/",
  IMAGE_URL:
    location.hostname === "localhost"
      ? "http://localhost:6969/"
      : "http://files-new.geocollections.info/",
};

const constants = {
  install(Vue, options) {
    Vue.prototype.$constants = { ...defaultOptions, ...options };
  },
};

export default constants;
