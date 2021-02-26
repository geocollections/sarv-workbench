import { mapActions, mapState } from "vuex";

const tableHeaderMixin = {
  computed: {
    ...mapState("tableHeaders", {
      tableHeaders: function(state) {
        return state[this.$route.meta.object];
      },
      $_tableHeaderMixin_searchFields: function(state) {
        return state.searchFields[this.$route.meta.object];
      }
    }),

    $_tableHeaderMixin_allHeaders() {
      return this.tableHeaders.map(item => {
        return {
          ...item,
          text: this.$t(item.text)
        };
      });
    },

    $_tableHeaderMixin_shownHeaders() {
      return this.$_tableHeaderMixin_allHeaders.filter(item => item.show);
    }
  },

  methods: {
    ...mapActions("tableHeaders", [
      "updateTableHeaders",
      "getDynamicFields",
      "setDefaultTableHeaders",
      "updateDynamicSearchField",
      "resetDynamicSearchField"
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
    }
  }
};

export default tableHeaderMixin;
