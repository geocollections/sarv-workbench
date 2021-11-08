const toastMixin = {
  methods: {
    toastSuccess(data) {
      this.$toast.success(data?.text ?? "OK", "OK", {
        position: "topCenter",
        timeout: data?.timeout ?? 5000,
        pauseOnHover: false,
      });
    },

    toastError(data) {
      this.$toast.error(data?.text || "Error", "Error", {
        position: "topCenter",
        timeout: data?.timeout ?? 5000,
        closeOnEscape: true,
        pauseOnHover: false,
        displayMode: "replace",
      });
    },

    toastInfo(data) {
      this.$toast.info(data?.text ?? "Info", "Info", {
        position: "topCenter",
        timeout: data?.timeout ?? 5000,
        pauseOnHover: false,
      });
    },
  },
};

export default toastMixin;
