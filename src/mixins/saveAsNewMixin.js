const saveAsNewMixin = {
  methods: {
    saveAsNew(currentObject, newObjectAsString) {
      console.log(currentObject);
      console.log(newObjectAsString);

      this.add(false, this.$route.meta.object, false, false, newObjectAsString);
    }
  }
};

export default saveAsNewMixin;
