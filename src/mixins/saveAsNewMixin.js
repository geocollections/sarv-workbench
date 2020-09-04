const saveAsNewMixin = {
  methods: {
    saveAsNew(currentObjectAsString, newObjectAsString) {
      this.add(false, this.$route.meta.object, false, true, newObjectAsString);
    }
  }
};

export default saveAsNewMixin;
