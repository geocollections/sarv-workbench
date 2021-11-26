const saveAsNewMixin = {
  methods: {
    saveAsNew(currentObjectAsString, newObjectAsString) {
      this.save(this.$route.meta.object, false, true);
    },
  },
};

export default saveAsNewMixin;
