import { mapActions, mapState } from "vuex";

const tableHeaderMixin = {
  computed: {
    $_tableHeaderMixin_tableName() {
      let table = this.$route.meta.object;

      if (this.$options.name.endsWith("Table")) {
        let splitName = this.$options.name.split(/(?=[A-Z])/);
        splitName.pop();
        table = splitName.join("_").toLowerCase();
      }
      return table;
    },
    ...mapState("tableHeaders", {
      tableHeaders: function (state) {
        return state[this.$_tableHeaderMixin_tableName];
      },
      $_tableHeaderMixin_searchFields: function (state) {
        return state.searchFields[this.$_tableHeaderMixin_tableName];
      },
    }),

    $_tableHeaderMixin_allHeaders() {
      return this.tableHeaders.map((item) => {
        return {
          ...item,
          text: this.$t(item.text),
        };
      });
    },

    $_tableHeaderMixin_shownHeaders() {
      return this.$_tableHeaderMixin_allHeaders.filter((item) => item.show);
    },
  },

  methods: {
    ...mapActions("tableHeaders", [
      "updateTableHeaders",
      "getDynamicFields",
      "setDefaultTableHeaders",
      "updateDynamicSearchField",
      "resetDynamicSearchField",
    ]),

    async $_tableHeaderMixin_getDynamicFields(table = this.$route.meta.object) {
      await this.getDynamicFields(table);
    },

    $_tableHeaderMixin_updateTableHeaders(payload) {
      this.updateTableHeaders(payload);
    },

    $_tableHeaderMixin_setDefaultTableHeaders(table = this.$route.meta.object) {
      this.setDefaultTableHeaders(table);
    },

    $_tableHeaderMixin_updateDynamicSearchField(payload) {
      this.updateDynamicSearchField(payload);
    },

    $_tableHeaderMixin_resetDynamicSearchFields(
      table = this.$route.meta.object
    ) {
      this.resetDynamicSearchField(table);
    },
  },
};

export default tableHeaderMixin;
