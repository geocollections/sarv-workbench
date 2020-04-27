import { mapActions, mapState } from "vuex";
import { cloneDeep } from "lodash";

const formSectionsMixin = {
  data: () => ({
    routeJustUpdated: false
  }),

  computed: {
    ...mapState("settings", ["formSections"]),

    routeObject() {
      let object = this.$route.meta.object;
      if (object === "attachment" && !this.$route.meta.isEdit)
        object = this.$route.meta.child;
      return object;
    }
  },

  beforeRouteUpdate(to, from, next) {
    if (this.block) {
      this.routeJustUpdated = true;
    }
    next();
  },

  beforeRouteLeave(to, from, next) {
    if (this.block) {
      this.routeJustUpdated = true;
    }
    next();
  },

  created() {
    if (this?.formSections?.[this.routeObject]) {
      this.block = cloneDeep(this.formSections[this.routeObject]);
    } else if (this.block) {
      this.updateFormSections({ key: this.routeObject, value: this.block });
    }
  },

  watch: {
    block: {
      handler(newVal) {
        if (this.routeJustUpdated) {
          this.block = cloneDeep(this.formSections[this.routeObject]);
          this.routeJustUpdated = false;
        } else if (newVal) {
          this.updateFormSections({
            key: this.routeObject,
            value: newVal
          });
        }
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("settings", ["updateFormSections"])
  }
};

export default formSectionsMixin;
