const formatDate = {
  install: function (Vue, opt) {
    Vue.prototype.$formatDate = (isoDate) => {
      return isoDate ? new Date(isoDate).toISOString().split("T")[0] : isoDate;
    };
  },
};

export default formatDate;
