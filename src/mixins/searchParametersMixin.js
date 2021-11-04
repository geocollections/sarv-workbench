import { mapActions, mapState } from "vuex";

const searchParametersMixin = {
  computed: {
    ...mapState("search", ["activeSearchParametersFilters"]),
    ...mapState("search", {
      params: function (state) {
        return state[`${this.$route.meta.object}SearchParameters`];
      },
    }),
    searchParameters() {
      return this.params;
    },
  },

  methods: {
    ...mapActions("search", [
      "updateSearchParametersByField",
      "resetSearchParameters",
      "setActiveSearchParametersFilters",
    ]),

    updateSearchParamsByField(value, field, isDate = false) {
      this.updateSearchParametersByField({
        module: this.$route.meta.object,
        field: field,
        value: value,
        isDate: isDate,
      });
    },

    resetSearchParams() {
      this.resetSearchParameters(this.$route.meta.object);
    },
  },
};

export default searchParametersMixin;
