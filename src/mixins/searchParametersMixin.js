import { mapActions, mapState } from "vuex";

const searchParametersMixin = {
  computed: {
    ...mapState("search", {
      params: function(state) {
        return state[`${this.$route.meta.object}SearchParameters`];
      }
    }),
    searchParameters() {
      return this.params;
    }
  },

  methods: {
    ...mapActions("search", [
      "updateSearchParametersByField",
      "resetSearchParameters"
    ]),

    updateSearchParamsByField(value, field) {
      this.updateSearchParametersByField({
        module: this.$route.meta.object,
        field: field,
        value: value
      });
    },

    resetSearchParams() {
      this.resetSearchParameters(this.$route.meta.object);
    }
  }
};

export default searchParametersMixin;
