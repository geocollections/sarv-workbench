import { mapActions, mapState } from "vuex";

const tableViewMixin = {
  computed: {
    $_tableViewMixin_tableName() {
      let table = this.$route.meta.object;

      // Component name must follow strict naming convention eg. SpecimenTable, LocalityDescriptionTable
      if (this.$options.name.endsWith("Table")) {
        let splitName = this.$options.name.split(/(?=[A-Z])/);
        splitName.pop();
        table = splitName.join("_").toLowerCase();
      }
      return table;
    },
    ...mapState({
      $_tableViewMixin_searchFields(state) {
        return state[this.$_tableViewMixin_tableName].searchFields;
      },
      $_tableViewMixin_options(state) {
        return state[this.$_tableViewMixin_tableName].options;
      },
      $_tableViewMixin_headers(state) {
        return state[this.$_tableViewMixin_tableName].headers;
      },
      $_tableViewMixin_viewType(state) {
        return state[this.$_tableViewMixin_tableName].viewType;
      },
    }),

    $_tableHeaderMixin_translatedHeaders() {
      return this.$_tableViewMixin_headers.map((item) => {
        return {
          ...item,
          text: this.$t(item.text),
        };
      });
    },

    $_tableHeaderMixin_shownHeaders() {
      return this.$_tableHeaderMixin_translatedHeaders.filter(
        (item) => item.show
      );
    },
  },

  methods: {
    ...mapActions({
      $_tableViewMixin_updateSearchFields(dispatch, payload) {
        return dispatch(`updateSearchFields`, {
          ...payload,
          module: this.$_tableViewMixin_tableName,
        });
      },
      $_tableViewMixin_resetState(dispatch) {
        return dispatch("resetState", {
          module: this.$_tableViewMixin_tableName,
        });
      },
      $_tableViewMixin_updateViewType(dispatch, payload) {
        return dispatch("updateViewType", {
          ...payload,
          module: this.$_tableViewMixin_tableName,
        });
      },
      $_tableViewMixin_updateOptions(dispatch, payload) {
        return dispatch("updateOptions", {
          ...payload,
          module: this.$_tableViewMixin_tableName,
        });
      },
      $_tableViewMixin_updateHeaders(dispatch, payload) {
        return dispatch("updateHeaders", {
          ...payload,
          module: this.$_tableViewMixin_tableName,
        });
      },
      $_tableViewMixin_resetHeaders(dispatch) {
        return dispatch("resetHeaders", {
          module: this.$_tableViewMixin_tableName,
        });
      },
    }),
  },
};

export default tableViewMixin;
